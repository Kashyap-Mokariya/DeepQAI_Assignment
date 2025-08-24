# DeepQ AI Web Application

This project is a **full-stack web application** built with:

- **Backend:** Django + Django REST Framework + JWT Authentication
- **Frontend:** Next.js (React + TypeScript + TailwindCSS + ShadCN UI + MUI)
- **Database:** SQLite (default, can be replaced with PostgreSQL/MySQL)
- **Auth:** Custom Django `User` model with JWT & OTP-based reset

---

## 🚀 Features
- User authentication with JWT (Register, Login, Logout)
- Password reset via OTP (email-based)
- Role management (`is_superuser`, `is_staff`, `is_authorized`)
- Protected APIs using `rest_framework_simplejwt`
- Frontend dashboard with charts (MUI, Recharts)
- Integrated with World Bank API (via `lib/world-bank-api.ts`)
- Theming & UI components using **ShadCN + TailwindCSS**

---

## 📂 Project Structure

```
kashyap-mokariya-deepqai/
│── auth/ # Django Backend
│ ├── manage.py
│ ├── auth/ # Django project settings
│ └── Home/ # Custom user app
│
│── client/ # Next.js Frontend
│ ├── app/ # Pages & layouts
│ ├── components/ # UI & custom components
│ ├── lib/ # API clients & utilities
│ ├── styles/ # Global styles
│ └── package.json
```

---

## ⚙️ Setup Instructions

## 1. Backend (Django)
```bash
cd auth
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
python manage.py migrate
python manage.py runserver

- Backend runs on http://localhost:8000
```

## 2. Frontend (Next.js)

```
cd client
pnpm install   # or npm install / yarn install
pnpm dev       # starts Next.js dev server
```

## API Endpoints

Authentication -

- ```POST /register/``` → Register a new user

- ```POST /login/``` → Login with username & password

- ```POST /logout/``` → Logout (invalidate refresh token)

- ```POST /api/token/refresh/``` → Get new access token

Password Reset -

- ```POST /reset-password-email/``` → Send OTP to email

- ```GET /reset-password-confirmation/?email=...&otp=...``` → Verify OTP & reset password

## 🏗️ Architecture Overview

- Frontend (Next.js)

    - Dashboards, charts, filters

    - Uses react-hook-form, shadcn/ui, MUI

    - API calls in lib/api.ts

- Backend (Django + DRF)

    - Handles authentication, password reset

    - Custom User model (email, full_name, roles)

    - JWT authentication (short-lived access + refresh tokens)

- Database

    - Default: SQLite

    - Can be replaced with PostgreSQL/MySQL by editing settings.py

- Communication

    - CORS enabled (http://localhost:3000)

    - Refresh tokens stored in cookies

---

## ⚠️ Common Issues

- CORS Errors

    - Update CORS_ALLOWED_ORIGINS in auth/settings.py

- Token Expiry

    - Access token expires in 1 min (see SIMPLE_JWT config)

    - Refresh token via /api/token/refresh/

- Email (OTP)

    - Uses console backend in dev (OTP shown in terminal)

    - Configure SMTP in settings.py for production

---

## 📈 Deployment

- Frontend: Deploy on Vercel

- Backend: Deploy on Render/Heroku/DigitalOcean

- Update environment variables:

- CORS_ALLOWED_ORIGINS in Django

- API URLs in client/lib/api.ts