// End-to-end multi-tenancy + RBAC tests against a real Postgres database.
//
//   TEST_DATABASE_URL=postgres://... npm test
//
// Skipped when TEST_DATABASE_URL is not set. The database's public schema is
// wiped and rebuilt from migrations, so never point this at real data.

const { test, describe, before, after } = require('node:test')
const assert = require('node:assert/strict')

const TEST_DB = process.env.TEST_DATABASE_URL
const skip = !TEST_DB && 'TEST_DATABASE_URL not set'

let request, app, pool, migrate

if (TEST_DB) {
  process.env.DATABASE_URL = TEST_DB
  process.env.DATABASE_SSL = process.env.DATABASE_SSL || 'false'
  process.env.JWT_SECRET = 'integration-secret'
  process.env.AUTH_RATE_LIMIT_PER_15MIN = '1000'
  process.env.APP_URL = 'https://app.example.test'
  request = require('supertest')
  pool = require('../db')
  migrate = require('../lib/migrate').migrate
  app = require('../app').createApp()
}

const quiet = { log() {}, warn() {}, error() {} }
const bearer = token => ({ Authorization: `Bearer ${token}` })
const tokenFromUrl = url => decodeURIComponent(new URL(url).searchParams.get('token'))

// Shared state built up by the setup below.
const s = {}

async function register(body) {
  const res = await request(app).post('/api/auth/register').send({ password: 'correct horse battery', ...body })
  assert.equal(res.status, 201, `register ${body.email}: ${JSON.stringify(res.body)}`)
  return { token: res.body.token, user: res.body.user }
}

describe('multi-tenancy and RBAC (real Postgres)', { skip }, () => {
  before(async () => {
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
    await migrate(pool, { log: quiet })

    // Platform owner: existing DevLaunch admin, made super admin.
    s.owner = await register({ name: 'Owner', email: 'owner@devlaunch.test' })
    await pool.query('UPDATE users SET is_super_admin = TRUE WHERE id = $1', [s.owner.user.id])
    await pool.query(`UPDATE memberships SET role = 'org_admin' WHERE user_id = $1`, [s.owner.user.id])

    // A client of DevLaunch itself, with a project.
    s.dlClient = await register({ name: 'Dee', email: 'dee@client.test' })
    const dlProject = await request(app).post('/api/wizard/start').set(bearer(s.dlClient.token)).send({ title: 'DevLaunch client app' })
    s.dlProjectId = dlProject.body.id

    // A second agency signs up.
    s.priya = await register({ name: 'Priya', email: 'priya@acme.test', account_type: 'agency', agency_name: 'Acme Studio' })
    s.acmeId = s.priya.user.org.id

    // Priya invites a developer and two clients.
    const invite = async (email, role) => {
      const res = await request(app).post('/api/orgs/current/invitations').set(bearer(s.priya.token)).send({ email, role })
      assert.equal(res.status, 201, JSON.stringify(res.body))
      return tokenFromUrl(res.body.invite_url)
    }
    s.devInvite = await invite('dev@acme.test', 'developer')
    s.dev = await register({ name: 'Dev', email: 'dev@acme.test', invite_token: s.devInvite })
    s.kiran = await register({ name: 'Kiran', email: 'kiran@k.test', invite_token: await invite('kiran@k.test', 'client') })
    s.lata = await register({ name: 'Lata', email: 'lata@l.test', invite_token: await invite('lata@l.test', 'client') })

    const kp = await request(app).post('/api/wizard/start').set(bearer(s.kiran.token)).send({ title: 'Kiran shop' })
    s.kiranProjectId = kp.body.id
    const lp = await request(app).post('/api/wizard/start').set(bearer(s.lata.token)).send({ title: 'Lata clinic' })
    s.lataProjectId = lp.body.id
  })

  after(async () => {
    if (pool) await pool.end()
  })

  describe('signup puts people in the right org with the right role', () => {
    test('public signup -> client of DevLaunch', () => {
      assert.equal(s.dlClient.user.org.slug, 'devlaunch')
      assert.equal(s.dlClient.user.org_role, 'client')
    })
    test('agency signup -> org_admin of a new org', () => {
      assert.equal(s.priya.user.org.name, 'Acme Studio')
      assert.equal(s.priya.user.org_role, 'org_admin')
      assert.equal(s.priya.user.orgs.length, 1, 'agency owners are not also DevLaunch clients')
    })
    test('invited people get the invited role in the inviting org', () => {
      assert.equal(s.dev.user.org.id, s.acmeId)
      assert.equal(s.dev.user.org_role, 'developer')
      assert.equal(s.kiran.user.org_role, 'client')
    })
    test('projects are created inside the creator’s org', async () => {
      const { rows } = await pool.query('SELECT org_id FROM projects WHERE id = $1', [s.kiranProjectId])
      assert.equal(rows[0].org_id, s.acmeId)
    })
  })

  describe('tenant isolation', () => {
    test('an agency cannot see another agency’s projects', async () => {
      const res = await request(app).get('/api/projects').set(bearer(s.priya.token))
      const ids = res.body.map(p => p.id)
      assert.ok(ids.includes(s.kiranProjectId) && ids.includes(s.lataProjectId))
      assert.ok(!ids.includes(s.dlProjectId))
    })
    test('reading another org’s project by id is a 404', async () => {
      for (const path of [`/api/projects/${s.dlProjectId}`, `/api/tasks/${s.dlProjectId}`, `/api/milestones/${s.dlProjectId}`]) {
        const res = await request(app).get(path).set(bearer(s.priya.token))
        assert.equal(res.status, 404, path)
      }
    })
    test('an org admin cannot modify another org’s project', async () => {
      const res = await request(app)
        .patch(`/api/admin/projects/${s.dlProjectId}`)
        .set(bearer(s.priya.token))
        .send({ status: 'live' })
      assert.equal(res.status, 404)
      const { rows } = await pool.query('SELECT status FROM projects WHERE id = $1', [s.dlProjectId])
      assert.equal(rows[0].status, 'discovery')
    })
    test('admin stats only count the caller’s org', async () => {
      const res = await request(app).get('/api/admin/stats').set(bearer(s.priya.token))
      assert.equal(res.body.total_projects, 2)
      assert.equal(res.body.total_clients, 2)
    })
    test('a client sees only their own projects, not other clients in the same org', async () => {
      const res = await request(app).get('/api/projects').set(bearer(s.kiran.token))
      assert.deepEqual(res.body.map(p => p.id), [s.kiranProjectId])
      const other = await request(app).get(`/api/tasks/${s.lataProjectId}`).set(bearer(s.kiran.token))
      assert.equal(other.status, 404)
    })
    test('super admin can enter another org only by asking for it (X-Org-Id)', async () => {
      const own = await request(app).get('/api/projects').set(bearer(s.owner.token))
      assert.ok(!own.body.some(p => p.id === s.kiranProjectId))
      const entered = await request(app).get('/api/projects').set(bearer(s.owner.token)).set('X-Org-Id', String(s.acmeId))
      assert.ok(entered.body.some(p => p.id === s.kiranProjectId))
    })
    test('a non-super-admin cannot enter another org via X-Org-Id', async () => {
      const devlaunchId = s.dlClient.user.org.id
      const res = await request(app).get('/api/projects').set(bearer(s.priya.token)).set('X-Org-Id', String(devlaunchId))
      assert.ok(!res.body.some(p => p.id === s.dlProjectId))
      // The header is ignored entirely: she stays in her own org.
      const ctx = await request(app).get('/api/orgs/current').set(bearer(s.priya.token)).set('X-Org-Id', String(devlaunchId))
      assert.equal(ctx.body.org.id, s.acmeId)
    })
  })

  describe('roles inside an org', () => {
    test('a developer can create and self-assign tasks, and sees them in /mine', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set(bearer(s.dev.token))
        .send({ project_id: s.kiranProjectId, title: 'Build cart', assignee_id: s.dev.user.id })
      assert.equal(res.status, 201, JSON.stringify(res.body))
      s.taskId = res.body.id
      const mine = await request(app).get('/api/tasks/mine').set(bearer(s.dev.token))
      assert.deepEqual(mine.body.map(t => t.id), [s.taskId])
      assert.equal(mine.body[0].assignee_name, 'Dev')
    })
    test('tasks cannot be assigned to a client or to someone outside the org', async () => {
      for (const assignee of [s.kiran.user.id, s.owner.user.id]) {
        const res = await request(app)
          .post('/api/tasks')
          .set(bearer(s.priya.token))
          .send({ project_id: s.kiranProjectId, title: 'x', assignee_id: assignee })
        assert.equal(res.status, 400)
      }
    })
    test('a client can read tasks and comment, but not create or change them', async () => {
      const read = await request(app).get(`/api/tasks/${s.kiranProjectId}`).set(bearer(s.kiran.token))
      assert.equal(read.status, 200)
      const comment = await request(app).post(`/api/tasks/${s.taskId}/comments`).set(bearer(s.kiran.token)).send({ content: 'Looks good' })
      assert.equal(comment.status, 201)
      const create = await request(app).post('/api/tasks').set(bearer(s.kiran.token)).send({ project_id: s.kiranProjectId, title: 'x' })
      assert.equal(create.status, 403)
      const status = await request(app).patch(`/api/projects/${s.kiranProjectId}/status`).set(bearer(s.kiran.token)).send({ status: 'live' })
      assert.equal(status.status, 403)
    })
    test('a developer cannot manage members, milestones or see the audit log', async () => {
      const checks = [
        request(app).post('/api/orgs/current/invitations').set(bearer(s.dev.token)).send({ email: 'x@y.test', role: 'client' }),
        request(app).post('/api/milestones').set(bearer(s.dev.token)).send({ project_id: s.kiranProjectId, title: 'M1' }),
        request(app).get('/api/orgs/current/audit-log').set(bearer(s.dev.token)),
        request(app).get('/api/admin/stats').set(bearer(s.dev.token)),
      ]
      for (const res of await Promise.all(checks)) assert.equal(res.status, 403, res.req.path)
    })
    test('only staff can be a project lead', async () => {
      const bad = await request(app).patch(`/api/admin/projects/${s.kiranProjectId}`).set(bearer(s.priya.token)).send({ lead_id: s.kiran.user.id })
      assert.equal(bad.status, 400)
      const ok = await request(app).patch(`/api/admin/projects/${s.kiranProjectId}`).set(bearer(s.priya.token)).send({ lead_id: s.dev.user.id })
      assert.equal(ok.status, 200)
      assert.equal(ok.body.lead_name, 'Dev')
    })
    test('the last org admin cannot be demoted or removed', async () => {
      const demote = await request(app).patch(`/api/orgs/current/members/${s.priya.user.id}`).set(bearer(s.priya.token)).send({ role: 'developer' })
      assert.equal(demote.status, 400)
      const remove = await request(app).delete(`/api/orgs/current/members/${s.priya.user.id}`).set(bearer(s.priya.token))
      assert.equal(remove.status, 400)
    })
  })

  describe('invitations', () => {
    test('an accepted invitation link cannot be reused', async () => {
      const res = await request(app).get(`/api/invitations/${encodeURIComponent(s.devInvite)}`)
      assert.equal(res.status, 404)
    })
    test('only the invited email can accept', async () => {
      const inv = await request(app).post('/api/orgs/current/invitations').set(bearer(s.priya.token)).send({ email: 'someone@else.test', role: 'developer' })
      const token = tokenFromUrl(inv.body.invite_url)
      const preview = await request(app).get(`/api/invitations/${encodeURIComponent(token)}`)
      assert.equal(preview.body.org_name, 'Acme Studio')
      const wrong = await request(app).post(`/api/invitations/${encodeURIComponent(token)}/accept`).set(bearer(s.dlClient.token))
      assert.equal(wrong.status, 403)
      const wrongSignup = await request(app)
        .post('/api/auth/register')
        .send({ name: 'X', email: 'not-invited@x.test', password: 'correct horse battery', invite_token: token })
      assert.equal(wrongSignup.status, 400)
    })
    test('a revoked invitation stops working', async () => {
      const inv = await request(app).post('/api/orgs/current/invitations').set(bearer(s.priya.token)).send({ email: 'revoke@me.test', role: 'client' })
      await request(app).delete(`/api/orgs/current/invitations/${inv.body.invitation.id}`).set(bearer(s.priya.token))
      const res = await request(app).get(`/api/invitations/${encodeURIComponent(tokenFromUrl(inv.body.invite_url))}`)
      assert.equal(res.status, 404)
    })
    test('an existing user can accept an invite to a second org', async () => {
      const inv = await request(app).post('/api/orgs/current/invitations').set(bearer(s.priya.token)).send({ email: 'dee@client.test', role: 'client' })
      const res = await request(app).post(`/api/invitations/${encodeURIComponent(tokenFromUrl(inv.body.invite_url))}/accept`).set(bearer(s.dlClient.token))
      assert.equal(res.status, 200)
      assert.equal(res.body.user.orgs.length, 2)
      assert.equal(res.body.user.org.id, s.acmeId)
    })
    test('invitation tokens are stored hashed, never in plain text', async () => {
      const { rows } = await pool.query('SELECT token_hash FROM invitations')
      assert.ok(rows.length > 0)
      assert.ok(rows.every(r => /^[0-9a-f]{64}$/.test(r.token_hash) && r.token_hash !== s.devInvite))
    })
  })

  describe('revocation is immediate', () => {
    test('removing a developer cuts off access with their existing token', async () => {
      const before = await request(app).get('/api/tasks/mine').set(bearer(s.dev.token))
      assert.equal(before.status, 200)
      const removed = await request(app).delete(`/api/orgs/current/members/${s.dev.user.id}`).set(bearer(s.priya.token))
      assert.equal(removed.status, 200)
      const after = await request(app).get('/api/tasks/mine').set(bearer(s.dev.token))
      assert.equal(after.status, 403)
      const { rows } = await pool.query('SELECT assignee_id FROM tasks WHERE id = $1', [s.taskId])
      assert.equal(rows[0].assignee_id, null, 'their tasks are unassigned')
    })
  })

  describe('audit log', () => {
    test('records org actions and is scoped to the org', async () => {
      const res = await request(app).get('/api/orgs/current/audit-log').set(bearer(s.priya.token))
      assert.equal(res.status, 200)
      const actions = res.body.entries.map(e => e.action)
      for (const a of ['member.invited', 'member.removed', 'member.invitation_revoked', 'project.updated']) {
        assert.ok(actions.includes(a), `missing ${a}`)
      }
      const { rows } = await pool.query('SELECT DISTINCT org_id FROM audit_log WHERE id = ANY($1)', [res.body.entries.map(e => e.id)])
      assert.deepEqual(rows.map(r => r.org_id), [s.acmeId])
    })
  })

  describe('platform (super admin)', () => {
    test('only super admins can list organizations', async () => {
      const denied = await request(app).get('/api/platform/orgs').set(bearer(s.priya.token))
      assert.equal(denied.status, 403)
      const res = await request(app).get('/api/platform/orgs').set(bearer(s.owner.token))
      assert.deepEqual(res.body.map(o => o.slug).sort(), ['acme-studio', 'devlaunch'])
    })
    test('suspending an org blocks its members immediately, reactivating restores them', async () => {
      const suspend = await request(app).patch(`/api/platform/orgs/${s.acmeId}`).set(bearer(s.owner.token)).send({ status: 'suspended' })
      assert.equal(suspend.status, 200)
      const blocked = await request(app).get('/api/projects').set(bearer(s.kiran.token))
      assert.equal(blocked.status, 403)
      const login = await request(app).post('/api/auth/login').send({ email: 'priya@acme.test', password: 'correct horse battery' })
      assert.equal(login.status, 403)
      await request(app).patch(`/api/platform/orgs/${s.acmeId}`).set(bearer(s.owner.token)).send({ status: 'active' })
      const back = await request(app).get('/api/projects').set(bearer(s.kiran.token))
      assert.equal(back.status, 200)
    })
    test('the platform’s own org cannot be suspended', async () => {
      const devlaunchId = s.owner.user.org.id
      const res = await request(app).patch(`/api/platform/orgs/${devlaunchId}`).set(bearer(s.owner.token)).send({ status: 'suspended' })
      assert.equal(res.status, 400)
    })
  })

  describe('auth hardening', () => {
    test('emails are case-insensitive and passwords need 8+ characters', async () => {
      const login = await request(app).post('/api/auth/login').send({ email: 'PRIYA@Acme.test', password: 'correct horse battery' })
      assert.equal(login.status, 200)
      const short = await request(app).post('/api/auth/register').send({ name: 'S', email: 's@s.test', password: 'short' })
      assert.equal(short.status, 400)
      const dup = await request(app).post('/api/auth/register').send({ name: 'P', email: 'Priya@ACME.test', password: 'correct horse battery' })
      assert.equal(dup.status, 400)
    })
    test('the JWT carries identity only, not a role', async () => {
      const payload = JSON.parse(Buffer.from(s.priya.token.split('.')[1], 'base64url').toString())
      assert.equal(payload.role, undefined)
    })
  })

  describe('migrations', () => {
    test('re-running migrations is a no-op', async () => {
      const applied = await migrate(pool, { log: quiet })
      assert.deepEqual(applied, [])
    })
  })
})
