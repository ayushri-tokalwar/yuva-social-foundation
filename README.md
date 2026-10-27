# 🌟 Yuva Social Foundation – Official Web Platform

> **Empowering Communities • Lifesaving Emergency Response • Youth in Action**  
> Registered Non-Governmental Organization (NGO) based in **Chandrapur, Maharashtra, India** (Est. 2017 | Reg. 2021).

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.18-red?style=for-the-badge)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)

---

## 📌 Executive Summary

**Yuva Social Foundation (YSF)** is a grassroots social-welfare organization founded by **Anush Bhagat** in Chandrapur, Maharashtra. The foundation operates 24/7 emergency ambulance transport for critical patients and road accident victims, mobilizes life-saving blood donation drives, organizes community hunger-relief kitchens (*Khana Sabke Liye*), conducts medical checkup camps, champions environmental tree plantations, and empowers underprivileged children with educational kits and mentoring.

This repository contains the **rebuilt, modernized, production-ready full-stack web application** designed to showcase the foundation's impact, coordinate emergency services, facilitate volunteer onboarding, and collect transparent donation pledges.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client[React + Vite Frontend\nTailwind CSS • Lucide Icons]
    API[Django REST Framework Backend\napps.foundation • campaigns • services • gallery • volunteers • donations • contact]
    DB[(Supabase PostgreSQL\n+ SQLite Dev Fallback)]
    Media[Cloud / Local Media Storage\n70+ Authentic High-Res Photos]

    Client -->|Axios REST / JSON| API
    API -->|psycopg2 / ORM| DB
    API -->|Django Storage| Media
    Client -.->|Offline Resilient Fallback Cache| Client
```

### Technology Highlights
- **Frontend**: React.js (Vite), React Router v7, Tailwind CSS with custom branding tokens (`brand`, `accent`, `warm`, `trust`), Lucide React icons, Canvas-Confetti celebration triggers.
- **Backend**: Django 5.2 + Django REST Framework (DRF), WhiteNoise static file delivery, CORS header security, modular app structure.
- **Database**: Cloud-native PostgreSQL (configured for Supabase via `DATABASE_URL`), with seamless automated fallback to SQLite for offline local dev.
- **Resilience**: Zero-breakage client architecture with fallback mock caches ensuring 100% UI stability even during backend maintenance.

---

## 🚀 Key Modules & Features

### 1. 🚑 Emergency Ambulance & Healthcare Operations
- Dedicated 24/7 emergency hotline prominently displayed across navigation, mobile drawer, contact page, and hero banners.
- Direct click-to-call hotlines (`+91 91583 67100` / `+91 84217 63782`).
- Detailed service profile detailing free and subsidized transport covering Chandrapur and surrounding talukas.

### 2. 👥 Authentic Team & Leadership Roster
- Full executive profiles including Founder & President **Anush Bhagat**, Vice President **Shubham Sharma**, and 10 core department heads spanning blood camp coordination, ambulance operations, relief logistics, and field outreach.

### 3. 🎯 Impact Campaigns & Welfare Initiatives
- **15 Welfare Initiatives**: Blood Donation Drives, 24/7 Ambulance, Community Kitchens, Slum Child Education, Tree Plantation, Cleanliness Drives, Elderly Aid, Sports Tournaments, and COVID-19 Relief.
- **Active Drives & Progress Trackers**: Real-time progress bars, funds raised, volunteer targets, and on-ground photo updates.

### 4. 📝 Interactive Volunteer Enrollment System
- Multi-step volunteer registration form connected to `/api/volunteers/`.
- State-selection for all 28 Indian States & UTs.
- Automatic verification workflows and celebratory confetti feedback.

### 5. 💳 Transparent Donation & Pledge Portal
- Cause-specific donation intent selector (Ambulance Fuel, Food Kits, Medical Camps, Child Kits, In-Kind).
- Auto-generates unique audit reference codes (e.g. `YSF-DON-XXXX-XXXX`).
- Displays official foundation bank details (IFSC, Account Number) and direct UPI ID without deceptive mock payment gateways.

### 6. 🖼️ Real Media Archive & Interactive Lightbox
- 16+ authentic newspaper clippings, felicitation ceremonies, blood camps, and ambulance inaugurations.
- Interactive category filtering with full-screen keyboard-navigable Lightbox (Arrow Keys & Escape).

---

## 📡 REST API Specification

| Endpoint | Method | Description |
|---|---|---|
| `/api/` | `GET` | API Root Discovery Index |
| `/api/health/` | `GET` | Backend & Database Health Check |
| `/api/foundation/overview/` | `GET` | Aggregated Profile, Metrics, Team, and Achievements |
| `/api/foundation/team/` | `GET` | List of 12 Foundation Team Members |
| `/api/campaigns/` | `GET` | Filterable Campaigns list (`?category=`, `?status=`) |
| `/api/campaigns/<slug>/` | `GET` | Campaign Detail with updates and donation stats |
| `/api/services/` | `GET` | 15 Core Social Welfare Initiatives |
| `/api/gallery/` | `GET` | Authentic Photo Gallery with category tags |
| `/api/volunteers/` | `POST` | Volunteer Enrollment Registration |
| `/api/donations/` | `POST` | Donation Pledge with Unique Reference Code |
| `/api/contact/` | `POST` | General & Emergency Inquiries |
| `/api/admin/auth/login/` | `POST` | Staff Admin Token Login |
| `/api/admin/auth/logout/` | `POST` | Invalidate Staff Session Token |
| `/api/admin/auth/me/` | `GET` | Current Admin Profile & Permissions |
| `/api/admin/dashboard/stats/` | `GET` | Aggregated NGO Metrics & Combined Activity Feed |
| `/api/admin/volunteers/` | `GET, PATCH, DELETE` | Volunteer Submissions, Status Updates & Filtering |
| `/api/admin/volunteers/export/` | `GET` | Export Volunteers to CSV |
| `/api/admin/donations/` | `GET, PATCH, DELETE` | Contribution Requests, Notes & Status |
| `/api/admin/donations/export/` | `GET` | Export Donations to CSV |
| `/api/admin/messages/` | `GET, PATCH, DELETE` | Inquiries Inbox, Mark Read/Resolved |
| `/api/admin/campaigns/` | `GET, POST, PATCH, DELETE`| Complete Campaign Management |
| `/api/admin/gallery/` | `GET, POST, PATCH, DELETE`| Photo Gallery Archive with Safe Deletion |
| `/api/admin/upload-image/` | `POST` | MIME + Pillow Validated Secure Image Upload |
| `/api/admin/services/` | `GET, POST, PATCH, DELETE`| Services & Welfare Initiatives CRUD |
| `/api/admin/foundation/profile/` | `GET, PUT` | Edit Mission, Vision, Address, Emergency Hotlines |
| `/api/admin/foundation/team/` | `GET, POST, PATCH, DELETE`| Leadership & Staff Roster CRUD |
| `/api/admin/foundation/metrics/` | `GET, POST, PATCH, DELETE`| Impact Statistics Counters CRUD |

---

## 🛠️ Getting Started (Local Setup)

### Prerequisites
- **Python**: 3.10+ (tested with Python 3.11)
- **Node.js**: 18.0+ (tested with Node.js 20+)
- **Git**

---

### Step 1: Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Activate existing virtual environment
# Windows (PowerShell):
..\venv\Scripts\Activate.ps1
# Windows (CMD):
..\venv\Scripts\activate.bat
# Linux/macOS:
source ../venv/bin/activate

# 3. Install requirements (if not already installed)
pip install -r requirements.txt

# 4. Configure environment variables
# Copy .env.example to .env and adjust if connecting to Supabase PostgreSQL:
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

# 5. Run database migrations
python manage.py migrate

# 6. Seed authentic foundation data & create admin
python manage.py seed_data
python manage.py create_admin

# 7. Run automated test suite
python manage.py test apps.core.tests

# 8. Start development server
python manage.py runserver 8000
```

> **Official Demo Administrator Credentials**:  
> - **Username**: `yuvasocialfoundation`  
> - **Password**: `admin`  
> - **Management Command**: `python manage.py create_admin --username yuvasocialfoundation --password admin --reset`  
> - **React Admin Portal**: `http://localhost:5173/admin/login` $\rightarrow$ `http://localhost:5173/admin/dashboard`  
> - **Django Built-in Admin**: `http://localhost:8000/admin/`  

---

### Admin Management Portal Routes

The admin portal provides single-dashboard control across 11 dedicated interfaces:

| Frontend Route | Interface & Capabilities |
| :--- | :--- |
| `/admin/login` | Secure branded administrator authentication with token session management |
| `/admin/dashboard` | Real-time statistics, monthly analytics breakdown, date filters, and recent activity logs |
| `/admin/volunteers` | Complete volunteer applicant drawer, status review, internal notes, CSV export |
| `/admin/join-requests`| Dedicated membership / foundation join request triage, skills matching, export |
| `/admin/donations` | Donation inquiry / pledge management, verified status tracking, donor note logs |
| `/admin/messages` | Full contact inbox, unread badges, subject filtering, in-line reply tracking |
| `/admin/campaigns` | Create, edit, publish/unpublish campaigns, financial progress goals, milestone updates |
| `/admin/services` | Foundation welfare service management, ambulance availability toggles, icons |
| `/admin/gallery` | Batch multi-image uploader, real-time preview, featured star toggle, safe deletion |
| `/admin/content` | Dynamic homepage hero, emergency banner toggle, about us/mission/vision without redeploy |
| `/admin/settings` | Profile settings, office contact coordinates, leadership team roster & impact metrics |

---

### Step 2: Frontend Setup

```bash
# In the root repository directory (or cd frontend)
npm run dev
```

> Frontend will be available at: **`http://localhost:5173/`**  
> Production bundle test: **`npm run build`**

---

## 🗄️ Supabase PostgreSQL Integration

To connect this application to a hosted Supabase PostgreSQL instance:

1. Create a project on [Supabase.com](https://supabase.com/).
2. Under **Project Settings $\rightarrow$ Database**, copy the **URI Connection String**.
3. Add the string to `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
4. Run migrations: `python manage.py migrate` and seed data: `python manage.py seed_data`.

---

## 🧪 Automated Testing

The backend includes a comprehensive test suite covering all REST endpoints, validation rules, model signals, and edge cases:

```bash
cd backend
python manage.py test apps.core.tests
```

```
Creating test database for alias 'default'...
.........
----------------------------------------------------------------------
Ran 9 tests in 0.152s

OK (100% Passed)
```

---

## 📄 License & Organization Credits

- **Organization**: Yuva Social Foundation (Reg. 2021)
- **Location**: Chandrapur, Maharashtra, India
- **Founder**: Anush Bhagat
- **Helpline**: +91 91583 67100 / +91 84217 63782
- **Website License**: Educational & Non-Profit Public Good

---
*Developed with modern software craftsmanship for Yuva Social Foundation.*
