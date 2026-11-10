# SmartHire – Smart Recruitment & Applicant Tracking System (ATS)

SmartHire is a full-stack, intelligent web application designed for modern talent acquisition teams and candidates. It integrates automated Python-based PDF resume text extraction via PyMuPDF, a transparent multi-factor keyword and skill matching algorithm, complete candidate pipeline lifecycle management, and interview scheduling.

---

## 🌟 Key Features

### 1. Recruiter Workspace
- **Executive Analytics Dashboard**: Real-time metrics on open requisitions, applications, candidate volume, pipeline conversion, and interactive Recharts visualizations (Application Velocity, Funnel Distribution, Top Requisitions).
- **Job Requisitions Management**: Create, edit, publish, draft, close, or delete job postings with customizable experience levels, salary bands, required core skills, and preferred bonus skills.
- **Intelligent Applicant Pipeline**: Review all candidates ranked by their automated ATS Match Score. Inspect the 3-part score breakdown (Skills 55%, Experience 25%, Keywords 20%) and plain-English rationale.
- **In-Browser Resume Viewer**: Preview candidate PDF resumes in an embedded viewer or examine extracted NLP profile attributes.
- **Candidate Dossier & Internal Notes**: Deep candidate view with career history, educational background, audit trails, and private recruiter notes.
- **Stage Progression & Audit History**: Transition candidates through the 6-stage lifecycle (`Applied` → `Under Review` → `Shortlisted` → `Interview Scheduled` → `Selected` / `Rejected`) with timestamped audit logs.
- **Interview Scheduling**: Book Technical, HR, Coding, or System Design interviews with automated Google Meet links or in-person location details and candidate preparation guidelines.

### 2. Candidate Experience
- **Interactive Career Portal**: Search and filter published openings by department, employment type, location, and seniority level.
- **AI Resume Parser**: Drag-and-drop PDF resume upload powered by Python PyMuPDF. Extracts candidate full name, email, phone, technical skills, years of experience, and degrees into MongoDB.
- **One-Click Application with Instant Matching**: Apply with 1-click using your parsed profile. Instantly inspect your ATS matching score and gap analysis.
- **Application Tracking & Progress Stepper**: Track all submitted applications with a visual 5-step progress stepper and chronological audit logs.
- **Interview Calendar**: View scheduled interviews with 1-click Google Meet join links and preparation instructions.
- **Duplicate Application Prevention**: Guards against multiple submissions to the same role.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v6, Axios, Recharts, Lucide React |
| **Backend** | Node.js (v22), Express.js, RESTful APIs, JWT Authentication, bcryptjs, Multer |
| **Database** | MongoDB / Mongoose (with automated embedded `mongodb-memory-server` fallback for zero-setup execution) |
| **AI / NLP Engine** | Python 3.12 with PyMuPDF (`fitz`), Regular Expression tokenizers, and TF-IDF / keyword similarity matcher |

---

## 🚀 Pre-Seeded Demonstration Accounts

SmartHire comes pre-populated with realistic companies, open positions, candidate profiles, applications, and scheduled interviews:

| Role | Email | Password | Details |
|---|---|---|---|
| **Recruiter** | `recruiter@smarthire.com` | `password123` | Elena Rostova (Head of Talent Acquisition, NexaTech Solutions) |
| **Candidate 1** | `candidate@smarthire.com` | `password123` | Alex Morgan (Senior Full-Stack Engineer, 5 yrs exp, 92% match) |
| **Candidate 2** | `sarah.chen@example.com` | `password123` | Sarah Chen (Frontend UI/UX Specialist, 3 yrs exp, 88% match) |
| **Candidate 3** | `david.kumar@example.com` | `password123` | David Kumar (Backend Cloud & Python Engineer, 4 yrs exp) |
| **Candidate 4** | `priya.sharma@example.com` | `password123` | Priya Sharma (Associate MERN Developer, Selected) |

> 💡 **Tip**: On the Login page (`/login`), click any of the **Instant 1-Click Demo Logins** to jump into either workspace without typing credentials.

---

## 📦 Installation & Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3](https://www.python.org/) (with `pymupdf` installed: `pip install pymupdf`)
- MongoDB (Optional: SmartHire automatically connects to MongoDB if running or spins up an embedded in-memory MongoDB instance out of the box).

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
The server will start on `http://localhost:5000`. If the database is empty, it automatically seeds all demo accounts, jobs, applications, and sample PDF resumes.

### 2. Frontend Setup
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser to: **`http://localhost:5173`**

---

## 📡 Key REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create candidate or recruiter account
- `POST /api/auth/login` - Authenticate and return JWT token
- `GET /api/auth/me` - Fetch authenticated user profile

### Jobs
- `GET /api/jobs` - List jobs with search, department, and location filters
- `GET /api/jobs/:id` - Fetch single job details and candidate application status
- `POST /api/jobs` - Create new job requisition *(Recruiter only)*
- `PUT /api/jobs/:id` - Update job details or change status Draft/Published/Closed *(Recruiter only)*
- `DELETE /api/jobs/:id` - Delete job opening and associated applications *(Recruiter only)*

### Resumes & NLP Parsing
- `POST /api/resumes/upload` - Upload PDF resume, trigger PyMuPDF extraction, save to MongoDB *(Candidate only)*
- `GET /api/resumes/my` - Fetch current parsed candidate resume metadata

### Applications
- `POST /api/applications` - Submit application and trigger ATS matching algorithm *(Candidate only)*
- `GET /api/applications/my` - View candidate's applications and status history *(Candidate only)*
- `GET /api/applications/recruiter` - View all applicants across recruiter's jobs *(Recruiter only)*
- `GET /api/applications/job/:jobId` - View applicants for specific job *(Recruiter only)*
- `PUT /api/applications/:id/status` - Update candidate stage and record audit log *(Recruiter only)*

### Interviews & Analytics
- `POST /api/interviews` - Schedule technical / HR interview *(Recruiter only)*
- `GET /api/interviews/my` - Fetch interview calendar for current user
- `PUT /api/interviews/:id` - Update interview status or feedback *(Recruiter only)*
- `GET /api/analytics/recruiter` - Recruitment metrics and chart data *(Recruiter only)*
- `GET /api/analytics/candidate` - Candidate activity summary

---

## 🧮 ATS Matching Algorithm Details

The scoring system calculates a transparent 0–100 match score:
- **55% Skills Match**: Normalized intersection of candidate technical competencies vs. required job skills, plus bonus weight for preferred skills.
- **25% Experience Match**: Compares candidate's verified years of experience against the role's minimum threshold.
- **20% Contextual Keyword Overlap**: Keyword density and domain term intersection between resume text and job description.

Every applicant receives a clear, transparent explanation (e.g. *"Matches 6/6 required skills (React, Node.js, MongoDB, TypeScript, Docker, REST API) and exceeds minimum 4-year experience threshold."*).

