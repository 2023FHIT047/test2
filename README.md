# AgroCast – Hyperlocal Climate Intelligence for Farmers

A complete full-stack web platform for farmers to access farm-level weather forecasts, climate alerts, and agricultural insights.

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT & bcrypt

## 📁 Project Structure

- `frontend/`: React application (Vite)
- `backend/`: Express server & Prisma schema

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js installed
- PostgreSQL database running

### 2. Backend Setup
1. Go to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env`:
   - Open `backend/.env`
   - Update `DATABASE_URL` with your PostgreSQL credentials
4. Run migrations: `npm run prisma:migrate`
5. Start server: `npm run dev`

### 3. Frontend Setup
1. Go to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## ✨ Features
- **Premium UI**: Glassmorphism design with nature-themed colors.
- **Farmer Auth**: Secure registration and login for farmers.
- **Smart Dashboard**: Weather summaries, farm profiles, and risk alerts.
- **Responsive**: Fully optimized for mobile devices.

---
Built for Agro-Hackathon 2026.
