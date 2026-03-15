# AgroHackton Deployment Guide

This guide will help you deploy your AgroHackton application (Django Backend + React Frontend) so anyone can access it online.

## Architecture Overview

- **Backend**: Django REST API (Python) - Handles authentication, weather data, crop analytics, labor management, etc.
- **Frontend**: React + TypeScript + Vite - User interface

## Recommended Deployment Platforms

### Free Tier Options (Recommended)

| Platform | Backend | Frontend | Database |
|----------|---------|----------|----------|
| [Render](https://render.com) | ✅ | ❌ | ✅ (PostgreSQL) |
| [Railway](https://railway.app) | ✅ | ✅ | ✅ |
| [PythonAnywhere](https://www.pythonanywhere.com) | ✅ | ❌ | ✅ (MySQL) |
| [Vercel](https://vercel.com) | ❌ | ✅ | ❌ |
| [Netlify](https://www.netlify.com) | ❌ | ✅ | ❌ |

### Recommended Setup

1. **Backend**: Deploy to [Render](https://render.com) (Free tier available)
2. **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://www.netlify.com)
3. **Database**: Use Render's free PostgreSQL or continue with SQLite (limited)

---

## Step-by-Step Deployment

### Part 1: Deploy Backend to Render

1. **Create a GitHub Repository**
   ```bash
   # Push your code to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub and push
   ```

2. **Sign up for [Render](https://render.com)**

3. **Create a Web Service**
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure:
     - **Name**: agrohackton-backend
     - **Root Directory**: backend
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn core.wsgi:application`

4. **Environment Variables** (in Render dashboard)
   ```
   SECRET_KEY = your-secret-key-here
   DEBUG = False
   ALLOWED_HOSTS = your-frontend-domain.onrender.com
   ```

5. **Note your Backend URL**
   - After deployment, you'll get a URL like: `https://agrohackton-backend.onrender.com`

### Part 2: Deploy Frontend to Vercel

1. **Sign up for [Vercel](https://vercel.com)**

2. **Update API Configuration**
   - Create `.env` file in `frontend/` directory:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

3. **Deploy**
   - Go to Vercel Dashboard → Add New → Project
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: frontend
   - Add Environment Variable:
     - `VITE_API_URL`: your-backend-url
   - Deploy!

### Part 3: Update CORS Settings (Important!)

After deployment, update your backend's `ALLOWED_HOSTS` in Render to include your frontend domain.

---

## Alternative: Deploy Both to Railway

Railway allows deploying both frontend and backend together with a unified dashboard.

### Backend on Railway:
1. Create new project → Add PostgreSQL
2. Add new service → GitHub repo → backend folder
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn core.wsgi:application`
5. Environment Variables:
   ```
   SECRET_KEY = your-secret-key
   DEBUG = False
   ALLOWED_HOSTS = your-app.railway.app
   DATABASE_URL = (from Railway variables)
   ```

### Frontend on Railway:
1. Add new service → GitHub repo → frontend folder
2. Build Command: `npm install && npm run build`
3. Output Directory: `dist`

---

## Quick Deploy (No GitHub)

If you want to deploy quickly without GitHub:

### Backend - PythonAnywhere:
1. Sign up at pythonanywhere.com
2. Upload your backend files via Files tab
3. Go to Web tab → Add new web app
4. Configure virtualenv and WSGI
5. Run: `python manage.py migrate`

### Frontend - Netlify Drop:
1. Build frontend: `cd frontend && npm run build`
2. Go to netlify.com/drop
3. Drag and drop the `dist` folder

---

## Database Migration (Important)

For production, it's recommended to use PostgreSQL. Update your settings:

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': '5432',
    }
}
```

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ALLOW_ALL_ORIGINS = True` in settings
- Or specify your frontend URL in `CORS_ALLOWED_ORIGINS`

### Static Files Not Loading
- Run: `python manage.py collectstatic`
- Ensure whitenoise is configured

### 500 Error on Backend
- Check Render logs for error details
- Ensure database is migrated: `python manage.py migrate`

---

## Production Checklist

- [ ] Set `DEBUG = False`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL (not SQLite for production)
- [ ] Set up HTTPS (automatic on Render/Vercel)
- [ ] Configure proper CORS settings

---

## Support

For issues, check:
1. Backend logs in Render dashboard
2. Network tab in browser DevTools
3. Console errors in browser
