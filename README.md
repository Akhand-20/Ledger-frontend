# Ledgr — Frontend

React frontend for Ledgr, a double-entry financial ledger system.

## 🔗 Links

- **Live App:** https://ledger-frontend-gamma.vercel.app
- **Backend API:** https://ledger-backend-3h87.onrender.com
- **API Docs:** https://ledger-backend-3h87.onrender.com/api/docs
- **Backend Repo:** https://github.com/Akhand-20/Ledger-backend

## ⚡ Tech Stack

React, Vite, Tailwind CSS v4, Axios, React Router DOM, Lucide React

## 📱 Pages

| Page | Description |
|------|-------------|
| `/login` | JWT cookie-based authentication |
| `/register` | New user registration with email notification |
| `/` | Dashboard — live balance, recent transactions, copy account ID |
| `/send` | Send money by username search |
| `/transactions` | Paginated transaction history with sent/received breakdown |

## ✨ Features

- **Username-based transfers** — search recipient by username, no raw IDs
- **Live balance** — derived from ledger entries on every load
- **Transaction history** — paginated table with sent/received indicators and status badges
- **Auto account creation** — new users prompted to create account from dashboard
- **Password show/hide toggle** on login and register
- **Copy Account ID** button on dashboard
- **Responsive layout** — works across screen sizes

## 🚀 Local Setup

```bash
git clone https://github.com/Akhand-20/Ledger-frontend.git
cd Ledger-frontend
npm install
npm run dev
```

> Make sure the backend is running on `http://localhost:3000` or update `src/api/axios.js` with your backend URL.
