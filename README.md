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
* PostgreSQL (Neon)
* Sequelize ORM

### AI Integration

* OpenAI API
* Anthropic Claude API

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

Backend runs on:

```
${API_URL}
```

---

## 🔐 Environment Variables

### Backend (`.env`)

```
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=your_neon_database_url
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=${API_URL}
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
