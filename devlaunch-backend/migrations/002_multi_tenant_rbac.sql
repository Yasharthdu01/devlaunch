-- Multi-tenancy + role-based access (expand step).
--
-- Additive only: no columns or tables are dropped and existing rows keep their
-- data. Everything that existed before becomes the "DevLaunch" organization:
--   * existing 'admin' users  -> org_admin of DevLaunch + platform super admin
--   * every other user        -> client of DevLaunch
--   * every project / ticket  -> belongs to DevLaunch
--
-- The legacy users.role column is kept (old code still reads it during the
-- deploy window) but is no longer the source of authority; memberships are.

-- Organizations (tenants): one per agency.
CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(60) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A user's role inside an organization. Composite key: one role per user per org.
CREATE TABLE IF NOT EXISTS memberships (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('org_admin', 'developer', 'client')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, org_id)
);
CREATE INDEX IF NOT EXISTS memberships_org_idx ON memberships (org_id);

-- Pending invitations. Only a SHA-256 hash of the token is stored, so a leaked
-- database dump can't be used to accept invitations.
CREATE TABLE IF NOT EXISTS invitations (
  id SERIAL PRIMARY KEY,
  org_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('org_admin', 'developer', 'client')),
  token_hash CHAR(64) NOT NULL UNIQUE,
  invited_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS invitations_org_idx ON invitations (org_id);

-- Who did what, in which org. Append-only from the app's point of view.
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  org_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(60) NOT NULL,
  entity_type VARCHAR(40),
  entity_id VARCHAR(40),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS audit_log_org_created_idx ON audit_log (org_id, created_at DESC);

-- Platform-level flag, separate from any org role.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Tenant columns.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id INTEGER REFERENCES organizations(id);
ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS org_id INTEGER REFERENCES organizations(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
-- The developer leading a project. Previously the admin panel wrote the
-- developer's name into projects.platform, overwriting the client's choice.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Backfill: existing data becomes the DevLaunch organization.
INSERT INTO organizations (name, slug) VALUES ('DevLaunch', 'devlaunch')
ON CONFLICT (slug) DO NOTHING;

UPDATE projects
SET org_id = (SELECT id FROM organizations WHERE slug = 'devlaunch')
WHERE org_id IS NULL;

UPDATE support_tickets t
SET org_id = COALESCE(
  (SELECT p.org_id FROM projects p WHERE p.id = t.project_id),
  (SELECT id FROM organizations WHERE slug = 'devlaunch')
)
WHERE t.org_id IS NULL;

INSERT INTO memberships (user_id, org_id, role)
SELECT u.id, o.id, CASE WHEN u.role = 'admin' THEN 'org_admin' ELSE 'client' END
FROM users u
CROSS JOIN organizations o
WHERE o.slug = 'devlaunch'
ON CONFLICT (user_id, org_id) DO NOTHING;

UPDATE users SET is_super_admin = TRUE WHERE role = 'admin' AND is_super_admin = FALSE;

-- Deploy-window shim: the previous release keeps serving traffic for a few
-- seconds after this migration runs and inserts projects/tickets without
-- org_id. Default those rows to DevLaunch so NOT NULL is safe right away.
-- A later "contract" migration drops these triggers once no old code runs.
CREATE OR REPLACE FUNCTION default_org_id() RETURNS trigger AS $$
BEGIN
  IF NEW.org_id IS NULL THEN
    NEW.org_id := (SELECT id FROM organizations WHERE slug = 'devlaunch');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_default_org ON projects;
CREATE TRIGGER projects_default_org BEFORE INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION default_org_id();

DROP TRIGGER IF EXISTS support_tickets_default_org ON support_tickets;
CREATE TRIGGER support_tickets_default_org BEFORE INSERT ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION default_org_id();

ALTER TABLE projects ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE support_tickets ALTER COLUMN org_id SET NOT NULL;

-- Indexes for the tenant-scoped queries the app now runs.
CREATE INDEX IF NOT EXISTS projects_org_idx ON projects (org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS projects_client_idx ON projects (client_id);
CREATE INDEX IF NOT EXISTS tasks_project_idx ON tasks (project_id);
CREATE INDEX IF NOT EXISTS tasks_assignee_idx ON tasks (assignee_id);
CREATE INDEX IF NOT EXISTS milestones_project_idx ON milestones (project_id);
CREATE INDEX IF NOT EXISTS support_tickets_org_idx ON support_tickets (org_id, created_at DESC);
