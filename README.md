# 🚀 DevLaunch – AI-Powered Client Onboarding & Project Delivery Platform

DevLaunch is a full-stack SaaS platform that helps businesses and clients collaborate to build applications end-to-end — from idea to deployment — with AI-powered assistance.

---

## 🌟 Features

### 🏠 Client-Facing Platform

* Explore service categories (Travel, E-commerce, Healthcare, SaaS, etc.)
* View portfolio of delivered projects
* Client reviews & testimonials
* Profile & onboarding dashboard

### 🤖 AI Assistant

* Chatbot to answer queries about:

  * Tech stack
  * Cost estimation
  * Timeline
  * Features & architecture

### 🧩 Project Wizard (Onboarding Flow)

* 6-step guided onboarding
* AI suggestions at each step:

  * Tech stack recommendation
  * Feature suggestions
  * Deployment planning

### 📊 Advanced Modules (Planned)

* Live project tracking (progress + milestones)
* AI-based cost estimator
* Proposal generator (PDF)
* Admin dashboard (client + project management)
* Marketing AI (SEO, ads, social content)
* Deployment simulation
* Support & ticket system

---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* Tailwind CSS
* Axios
* React Hot Toast
* Lucide Icons

### Backend

* Node.js
* Express.js
* PostgreSQL (Neon), queried with `pg` (parameterized SQL)
* zod (request + LLM-output validation), express-rate-limit

### AI Integration

* Any OpenAI-compatible LLM API (OpenAI, Groq, OpenRouter, ...) in production
* Ollama locally, through the same client (`lib/llm.js`)

### Deployment

* Frontend: Vercel
* Backend: Railway

---

## 📁 Project Structure

devlaunch/
├── devlaunch-frontend/ # Next.js frontend
├── devlaunch-backend/ # Express backend

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Yasharthdu01/devlaunch.git
cd devlaunch
```

---

### 2️⃣ Frontend Setup

```bash
cd devlaunch-frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

### 3️⃣ Backend Setup

```bash
cd devlaunch-backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`. Copy `devlaunch-backend/.env.example` to `.env` first.

Run the backend tests (no database or API key needed; both are faked):

```bash
npm test
```

---

## 🔐 Environment Variables

### Backend (`.env`)

See [`devlaunch-backend/.env.example`](devlaunch-backend/.env.example). The important ones:

```
DATABASE_URL=...
JWT_SECRET=...
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
LLM_BASE_URL=https://api.groq.com/openai/v1   # or http://localhost:11434/v1 for Ollama
LLM_MODEL=llama-3.1-8b-instant
LLM_API_KEY=...
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEMO_MODE=true   # shows the "sample data" banner; set false once testimonials/portfolio are real
```

---

## 🛠️ Engineering Notes

**LLM reliability.** All AI features go through one client (`lib/llm.js`). JSON-producing features (MVP planner, proposals, marketing) validate the model's output against a zod schema; on failure the validation errors are sent back to the model and it retries (up to 3 attempts). If the AI is unavailable the API returns `503` with a clear message instead of silently returning canned data. Proposal totals are recomputed server-side from line items rather than trusting model arithmetic.

**Prompt-injection hygiene.** User text is wrapped in `<user_input>` tags and the system prompt tells the model to treat it as data. Chat history only accepts `user`/`assistant` roles, so clients can't inject system messages.

**Authorization.** Tasks, milestones and proposals are checked against project ownership (`lib/access.js`); other users get `404`, not someone else's data.

**SSRF protection.** The website audit fetches user-supplied URLs server-side. `lib/safeFetch.js` blocks private, loopback, link-local (cloud metadata) and reserved addresses, checked at DNS-lookup time so redirects and DNS rebinding are covered too.

**Cost control.** AI routes are rate-limited per IP and chat history is capped at the last 10 turns.

---

## 👥 Roles & Multi-tenancy

DevLaunch is multi-tenant: each agency is an **organization** with its own clients, projects and team.

| Role | Who | Can |
|---|---|---|
| **Super admin** | Platform operator (`users.is_super_admin`) | List / suspend agencies, see platform stats, enter any org for support (`X-Org-Id` header) |
| **Org admin** | Agency owner / manager | Everything in their org: team & roles, invitations, all projects, proposals, milestones, activity log |
| **Developer** | Agency team member | All org projects and tasks, assigned work (`/api/tasks/mine`); no team or billing access |
| **Client** | The agency's customer | Only their own projects: wizard, proposals, read tasks & comment, support tickets |

How it's enforced:
- The JWT carries **identity only**. Roles and org membership are loaded from the database on every request, so removing someone or suspending an org takes effect immediately.
- Routes check **permissions**, not roles (`lib/rbac.js`), and every query is scoped to the caller's org (`lib/access.js`). Cross-tenant ids return `404`.
- Security-relevant actions are written to `audit_log` (Team → Activity log).
- `test/tenancy.integration.test.js` proves isolation against a real Postgres (run with `TEST_DATABASE_URL`).

Signup paths: public signup → client of the DevLaunch org · "I run an agency" → new org, you're its admin · invitation link → the inviting org with the invited role.

## 🗄️ Database migrations

Schema lives in `devlaunch-backend/migrations/*.sql` and is applied by `npm run migrate` (transactional, checksummed, advisory-locked). In production this runs as Railway's **pre-deploy command**, so a failed migration aborts the deploy and the previous release keeps serving. Migrations are additive (expand/contract): never edit an applied migration, add a new one.

```bash
cd devlaunch-backend
npm run migrate                      # apply pending migrations
ADMIN_EMAIL=you@x.com ADMIN_PASSWORD='12+ chars' npm run seed:admin   # create/reset the super admin
TEST_DATABASE_URL=postgres://localhost/devlaunch_test npm test        # unit + integration tests
```

---

## 🚀 Roadmap

### Phase 1 (Completed)

* Project setup (Frontend + Backend)
* Basic server setup

### Phase 2 (In Progress)

* UI Design (Sidebar, Home, Portfolio, Reviews)
* API integration

### Phase 3

* Authentication (Login/Register)
* Database models

### Phase 4

* Project Wizard + AI Suggestions

### Phase 5

* Chatbot Integration

### Phase 6

* Admin Dashboard & Analytics

### Phase 7

* Deployment & Optimization

---

## 🎯 Vision

DevLaunch aims to become a **one-stop AI-powered platform** where clients can:

* Describe their idea
* Get complete technical planning
* Track development
* Deploy their product

---

## 🤝 Contribution

This is currently a personal project. Contributions and suggestions are welcome!

---

## 👨‍💻 Author

**Yasharth Dubey**
Software Developer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
