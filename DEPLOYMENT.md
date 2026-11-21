# Yaba Fast Food – Production Deployment Guide

This guide provides step-by-step instructions for deploying both the Django backend and the React frontend of **Yaba Fast Food** into production.

---

## 1. Architecture Overview

- **Backend**: Django 6.1, Django REST Framework, SimpleJWT, Gunicorn, WhiteNoise, dj-database-url, psycopg2.
- **Database**: PostgreSQL (Supabase / Render / Railway / Neon / AWS RDS) or local SQLite for testing.
- **Media Storage**: Supabase Storage (`menu-images` bucket) with local filesystem fallback.
- **Frontend**: React 18, Vite, Redux Toolkit, RTK Query, Tailwind CSS, React Router 6.

---

## 2. Deployment Order

1. **Database & Supabase Storage**: Set up PostgreSQL and create the Supabase storage bucket.
2. **Backend (Django API)**: Deploy the Django application, run migrations, collect static files, and seed initial categories and branches.
3. **Frontend (React / Vite)**: Set `VITE_API_BASE_URL` pointing to the deployed backend domain, run `npm run build`, and deploy `dist/` to a CDN or static hosting platform (Vercel, Netlify, Cloudflare Pages, S3).

---

## 3. Backend Deployment

### 3.1 Prerequisites
- **Python**: Version 3.11, 3.12, 3.13, or 3.14.
- **Virtual Environment**: Recommended (`python -m venv env`).

### 3.2 Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3.3 Backend Environment Variables
Create a `.env` file in the `backend/` directory or configure these variables in your hosting provider's dashboard (Render, Railway, Fly.io, Heroku, AWS):

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DJANGO_ENV` | Environment mode (`production` or `development`) | `production` |
| `DJANGO_DEBUG` | Must strictly be `False` in production | `False` |
| `DJANGO_SECRET_KEY` | Cryptographic key (50+ random characters) | `generate-a-strong-random-key` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated domains accepting traffic | `api.yabafastfood.com,yabafastfood.com` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@db.xyz.supabase.co:5432/postgres` |
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_SECRET_KEY` | Supabase service role secret key | `sb_secret_...` |
| `SUPABASE_BUCKET_NAME` | Storage bucket for food & gallery uploads | `menu-images` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend domains | `https://yabafastfood.com,https://www.yabafastfood.com` |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated origins for CSRF checks | `https://yabafastfood.com,https://api.yabafastfood.com` |
| `SECURE_SSL_REDIRECT` | Automatically redirect HTTP to HTTPS | `True` |

### 3.4 Apply Migrations & Collect Static Files
```bash
cd backend
python manage.py migrate
python manage.py collectstatic --noinput
```

### 3.5 Seed Standard Categories and Branches
Run the built-in idempotent seeding command to populate all 8 categories and 5 Hyderabad branches:
```bash
python manage.py seed_data
```

### 3.6 Create Superuser (Admin Access)
```bash
python manage.py createsuperuser
```

### 3.7 Production Start Command
Run with Gunicorn (binds to the port assigned by your PaaS or container):
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3 --threads 2
```

---

## 4. Supabase Storage Setup

1. In your **Supabase Dashboard**, navigate to **Storage**.
2. Create a new bucket named: `menu-images`.
3. Set the bucket to **Public** (or add a storage policy allowing public `SELECT` access so uploaded photos render on the customer menu).
4. In **Project Settings → API**, copy your **Project URL** (`SUPABASE_URL`) and **service_role secret** (`SUPABASE_SECRET_KEY`).
5. Configure these in `backend/.env`.

---

## 5. Frontend Deployment

### 5.1 Prerequisites
- **Node.js**: Version 18.x, 20.x, or 22.x.
- **npm**: Version 9.x or 10.x.

### 5.2 Configure Production API Endpoint
In `frontend/.env` (or via your hosting provider's build environment variables):
```env
VITE_API_BASE_URL=https://api.yabafastfood.com/api/
```
*(If the frontend and backend are served under the same origin through Nginx, omit or leave as `/api/`)*

### 5.3 Install & Build
```bash
cd frontend
npm install
npm run build
```
This produces an optimized production build in `frontend/dist/`.

### 5.4 Deploying to Static Hosts
- **Vercel**: `vercel.json` is preconfigured with SPA rewrite rules. Deploy `frontend/` directly.
- **Netlify**: `public/_redirects` is preconfigured (`/*  /index.html  200`). Set publish directory to `dist`.
- **Nginx**: Ensure your server block includes SPA fallback:
  ```nginx
  location / {
      root /var/www/yaba-frontend/dist;
      try_files $uri $uri/ /index.html;
  }
  ```

---

## 6. Verification Checklist

Execute these checks after deploying:

- [ ] **Public Health & Branches**: `curl https://<backend-domain>/api/branches/` returns 200 OK with the 5 Hyderabad branches.
- [ ] **Public Menu**: `curl https://<backend-domain>/api/menu/` returns 200 OK with menu items.
- [ ] **Categories**: `curl https://<backend-domain>/api/categories/` returns 200 OK with categories.
- [ ] **Owner Login**: Access `/home/Yaba7qK29700rest` and sign in with owner credentials.
- [ ] **Image Upload**: Upload a menu dish image from Owner Dashboard; verify it uploads to Supabase Storage.
- [ ] **CORS Verification**: Open customer site in browser dev tools; ensure zero CORS or preflight errors on API calls.
- [ ] **SPA Direct URL Refresh**: Open `https://<frontend-domain>/menu/1` and refresh; verify the page loads without 404 errors.
