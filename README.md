🚀 Jobify — Full-Stack Job Portal

Jobify is a modern full-stack job portal that connects employers and candidates through a clean, role-based platform. Employers can post and manage job listings, while candidates can explore jobs and apply with resumes — all secured with JWT authentication and deployed on cloud infrastructure.

This project focuses on real-world architecture, production deployment, and clean UX, rather than just features.

🌐 Live Demo

Frontend (Vercel):
👉 https://jobify-frontend-nine.vercel.app

Backend (Render):
👉 https://jobify-backend-1wg0.onrender.com

✨ Features
👤 Authentication & Roles

JWT-based authentication

Role-based access:

Employer

Candidate

Secure protected routes (frontend + backend)

🧑‍💼 Employer Features

Post new job listings

Edit & delete existing jobs

View all applicants for posted jobs

Download or view candidate resumes

Clean dashboard with empty-state handling

🧑‍🎓 Candidate Features

Browse all available jobs

Search jobs by title/location

View detailed job descriptions

Apply to jobs with:

Resume upload

Cover letter

See application confirmation

📎 Resume Uploads

Cloud-based resume storage using Supabase Storage

Secure public URLs stored in database

No local file storage (production-safe)

🎨 UI & UX

Modern, clean UI using Tailwind CSS + shadcn/ui

Smooth animations with Framer Motion

Professional empty states (logo + helper text)

Skeleton loaders for better perceived performance

🛠️ Tech Stack
Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

Backend

Django

Django REST Framework

JWT Authentication

PostgreSQL (Production)

SQLite (Local)

Cloud & DevOps

Vercel — Frontend hosting

Render — Backend hosting

Supabase Storage — Resume uploads

Environment-based configuration

CORS handling for Vercel preview & production domains

🧠 Architecture Highlights

Clean separation of frontend and backend

RESTful API design

Role-based permission handling

Cloud-native file storage (no local media dependency)

Defensive frontend coding for production stability

Regex-based CORS handling for dynamic Vercel URLs

📂 Folder Structure (High Level)
jobify/
├── frontend/        # Next.js app
│   ├── app/
│   ├── components/
│   ├── context/
│   └── styles/
│
├── backend/         # Django API
│   ├── jobs/
│   ├── applications/
│   ├── users/
│   ├── utils/
│   └── settings.py

🔐 Environment Variables
Backend (Render)
SECRET_KEY=your_django_secret
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxxxx.supabase.co/
SUPABASE_SERVICE_KEY=your_service_key

Frontend (Vercel)
NEXT_PUBLIC_API_BASE_URL=https://jobify-backend-1wg0.onrender.com

🚧 Known Limitations / Future Improvements

Application status tracking (Applied / Reviewed / Accepted)

Candidate profile pages

Email notifications

Pagination & filtering for large job lists

Admin analytics dashboard

These were intentionally scoped out to prioritize deployment stability and clean architecture.

🎯 Why This Project Matters

This project was built to:

Simulate real-world SaaS development

Handle production-only bugs

Work with cloud storage & deployments

Demonstrate end-to-end full-stack ownership

It reflects practical engineering decisions rather than tutorial patterns.

👨‍💻 Author

Yatin
Aspiring Full-Stack Developer (Frontend-focused, Backend-capable)



LinkedIn: https://www.linkedin.com/in/yatin-sharma-12a34428b/

⭐ Final Note

If you find this project useful or inspiring, feel free to ⭐ the repo.
