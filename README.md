<div align="center">

# ⚡ ReimburseIQ

**Intelligent Expense Reimbursement — Odoo Hackathon 2026**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

A full-stack MERN app that automates expense claims — from AI receipt scanning to multi-level conditional approvals.

</div>

---

## Features

- 🧾 **OCR Receipt Scanning** — Tesseract.js auto-fills amount, date & merchant from a photo
- 💱 **Live Currency Conversion** — Real-time rates via ExchangeRate API, cached for 1 hour
- ✅ **Configurable Approval Chains** — Sequential, percentage-based, specific-approver, or hybrid logic
- 🛡️ **Role-Based Access** — Admin, Manager, and Employee dashboards with scoped permissions
- 📱 **Responsive UI** — Mobile-first design with animated sidebar and smooth page transitions

---

## Tech Stack

| | |
|---|---|
| **Frontend** | React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express 5, Mongoose, JWT, bcryptjs |
| **Database** | MongoDB |
| **OCR** | Tesseract.js / Google Cloud Vision (optional) |

---

## Getting Started

### Prerequisites
- Node.js v18+, MongoDB running locally

### Install & Run

```bash
git clone https://github.com/your-username/Odoo-hackathon2026.git
cd Odoo-hackathon2026

# Install all dependencies
npm run install-all

# Configure environment
cp server/.env.example
# → Fill in MONGO_URI, JWT_SECRET, EXCHANGE_RATE_API_KEY

echo "VITE_API_BASE_URL=http://localhost:5000/api" > client/.env

# Start both servers
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000/api |

---

## Key Environment Variables (`server/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `EXCHANGE_RATE_API_KEY` | Key from [exchangerate-api.com](https://www.exchangerate-api.com) |
| `CLIENT_URL` | Frontend URL for CORS (e.g. `http://localhost:5173`) |
| `GOOGLE_VISION_API_KEY` | *(Optional)* Falls back to Tesseract.js if unset |

---

## Roles

| Role | Can Do |
|---|---|
| **Admin** | Manage users, define approval rules, view & override all expenses |
| **Manager** | Process pending approval queue, approve/reject with comments |
| **Employee** | Submit claims, upload receipts, track approval status |

---

## License

MIT © Odoo Hackathon 2026