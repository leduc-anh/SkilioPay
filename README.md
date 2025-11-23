# 💳 SkilioPay PayLater MVP

![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)

A modern Buy Now, Pay Later solution for Southeast Asia with flexible payment plans and cloud database.

🚀 **Live Demo**: [https://skilio-pay.vercel.app](https://skilio-pay.vercel.app)

## ✨ Features

### 🛒 Payment Plans

- **4 Flexible Options**: Split payments into 1, 3, 6, or 12 monthly installments
- **Interest-Free**: 0% interest on all payment plans
- **Instant Approval**: Real-time eligibility checking
- **"POPULAR" Badge**: Highlighted 3-month plan recommendation

### 📱 User Interface

- **6 Complete Screens**:
  - Checkout - Product selection with payment plan options
  - Plan Details - Installment schedule breakdown
  - Success - Animated confirmation page
  - Dashboard - Active plans overview
  - Payment Due - Urgent payment notifications
  - Payment History - Complete transaction log
- **Mobile-First Design**: iPhone-style frame with status bar
- **Smooth Animations**: 300ms slide transitions between screens
- **Responsive Layout**: Optimized for mobile devices

### 💾 Database & Data

- **SQLite Integration**: Persistent local storage
- **5 Relational Tables**: users, carts, agreements, installments, activity_logs
- **8 Test Users**: Pre-loaded with varied profiles
- **9 Sample Carts**: Different price points and products
- **Foreign Key Constraints**: Data integrity enforcement

### 🌏 Multi-Region Support

- **4 Currencies**: IDR (Indonesia), VND (Vietnam), MYR (Malaysia), SGD (Singapore)
- **Timezone Handling**: Asia/Jakarta, Asia/Ho_Chi_Minh, Asia/Kuala_Lumpur, Asia/Singapore
- **Locale Support**: id-ID, vi-VN, ms-MY, en-SG

### 📊 Payment Tracking

- **Real-Time Status**: PAID, DUE, UPCOMING, FAILED states
- **Progress Bars**: Visual completion indicators
- **Due Date Badges**: "Due Today" notifications
- **Payment Timeline**: 3-installment progress view
- **Activity Logs**: Complete audit trail

### 🎨 UI Components

- **Animated Checkmark**: Bouncing success animation
- **Payment Reminder Box**: Amber-themed alert with bell icon
- **Summary Cards**: Active plans count, total remaining, next due
- **Status Badges**: Color-coded payment states
- **Action Buttons**: Pay Now, Update Payment Method, Dismiss

### 🔧 Developer Features

- **TypeScript**: Full type safety with strict mode
- **Hot Module Replacement**: Instant updates with Vite HMR
- **ESLint**: Code quality enforcement
- **Database Scripts**: Easy setup with `npm run db:setup`
- **Mock Data**: CSV fixtures for testing scenarios

## Getting Started

### Local Development

```bash
# Install
npm install

# Setup database
npm run db:setup

# Run
npm run dev
```

### Deploy to Vercel

**Quick Start:**

```bash
# 1. Create Neon database at console.neon.tech
# 2. Set DATABASE_URL and run migration
export DATABASE_URL="your-neon-connection-string"
npx tsx scripts/setupVercelDb.ts

# 3. Deploy to Vercel
vercel --prod
```

**Detailed Instructions:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Key Steps:**

1. Create Neon Database → Get connection string
2. Run migration script → Creates tables + seeds data
3. Set environment variables in Vercel:
   - `DATABASE_URL` = Your Neon connection string
   - `VITE_USE_VERCEL_DB` = `true`
4. Deploy via Vercel Dashboard or CLI

**Auto-Deploy:** Push to GitHub `main` branch → Automatic production deployment

## Tech Stack

- React 18.2 + TypeScript 5.2
- Vite 5.0
- Tailwind CSS 3.3
- SQLite 3 (development) + Neon Postgres (production)

## License

MIT License

---

Made with  by the SkilioPay Team
