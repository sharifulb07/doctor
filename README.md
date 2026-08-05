# DentistApp — Full-Stack Appointment Booking

A production-ready web application for booking dentist appointments, built with **Next.js 15 (App Router)**, **TypeScript**, **TailwindCSS v4**, and **MongoDB**.

## Features

- **Role-based access** — Patient, Dentist, Admin
- **Appointment lifecycle** — Pending → Confirmed → Completed / Cancelled
- **Double-booking prevention** — Slot availability tracked in real time
- **JWT auth** — HTTP-only cookies, account locking after 5 failed attempts
- **Email notifications** — Booking confirmation, cancellation, welcome email
- **Admin dashboard** — Stats, appointment management, dentist activation, patient list
- **Security** — Zod validation, rate limiting, CSP headers, bcrypt (12 rounds)
- **Structured logging** — Pino with MongoDB persistence (90-day TTL)

## Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| Framework     | Next.js 15 (App Router) |
| Language      | TypeScript 5            |
| Styling       | TailwindCSS v4          |
| Database      | MongoDB + Mongoose 9    |
| Auth          | jose (JWT) + bcryptjs   |
| Validation    | Zod 4                   |
| Email         | Nodemailer              |
| Logging       | Pino + pino-pretty      |
| Rate Limiting | rate-limiter-flexible   |

---

## Local Development

### 1. Prerequisites

- Node.js ≥ 20
- A MongoDB connection (local or [MongoDB Atlas](#mongodb-atlas-setup))

### 2. Clone & Install

```bash
git clone <repo-url>
cd dentistappointment
pnpm install
```

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values (see comments in the file).

### 4. Run the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## MongoDB Atlas Setup

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a **free M0 cluster**
3. Under **Database Access** → Add a database user with Read/Write access
4. Under **Network Access** → Add `0.0.0.0/0` for development (restrict to Vercel IPs in production)
5. Click **Connect** → **Drivers** → copy the connection string
6. Paste it as `MONGODB_URI` in your `.env.local`, replacing `<username>` and `<password>`

---

## Creating an Admin User

Register normally at `/register`, then update the role in MongoDB:

```js
// MongoDB shell / Atlas UI
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } });
```

---

## Vercel Deployment

1. Push the repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add the following **Environment Variables** in Project Settings:

| Key                   | Example Value                                            |
| --------------------- | -------------------------------------------------------- |
| `MONGODB_URI`         | `mongodb+srv://user:pass@cluster.mongodb.net/dentistapp` |
| `JWT_SECRET`          | 32+ random chars (use `openssl rand -base64 32`)         |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app`                            |
| `SMTP_HOST`           | `smtp.gmail.com`                                         |
| `SMTP_PORT`           | `587`                                                    |
| `SMTP_SECURE`         | `false`                                                  |
| `SMTP_USER`           | `you@gmail.com`                                          |
| `SMTP_PASS`           | Gmail App Password                                       |
| `EMAIL_FROM`          | `DentistApp <you@gmail.com>`                             |
| `LOG_LEVEL`           | `info`                                                   |

4. Click **Deploy** — Vercel auto-builds and deploys on every push to `main`

---

## Project Structure

```
dentistappointment/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # REST API endpoints
│   │   ├── auth/           # login, register, logout, me
│   │   ├── appointments/   # CRUD + reschedule
│   │   ├── dentists/       # Public dentist profiles
│   │   ├── availability/   # Slot management
│   │   └── admin/          # Admin-only endpoints
│   ├── admin/              # Admin dashboard pages
│   ├── appointments/       # Patient appointment pages
│   ├── dentists/           # Dentist listing & profile
│   ├── login/
│   ├── register/
│   └── book-appointment/
├── components/             # Reusable UI components
│   ├── ui/                 # Button, Input, Card, Badge
│   ├── layout/             # Navbar, Footer
│   ├── auth/               # LoginForm, RegisterForm
│   ├── dentists/           # DentistCard
│   └── appointments/       # AppointmentCard, BookingForm
├── lib/                    # Core utilities
│   ├── mongodb.ts          # Cached Mongoose connection
│   ├── auth.ts             # JWT helpers (jose)
│   ├── logger.ts           # Pino structured logger
│   └── email.ts            # Nodemailer templates
├── middleware/             # Route guards & rate limiter
├── models/                 # Mongoose schemas
├── types/                  # TypeScript interfaces & enums
└── utils/                  # apiResponse, validators, cn
```

---

## API Reference

### Auth

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Register a new patient           |
| POST   | `/api/auth/login`    | Login (returns HTTP-only cookie) |
| POST   | `/api/auth/logout`   | Clear auth cookie                |
| GET    | `/api/auth/me`       | Get current user info            |

### Dentists

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| GET    | `/api/dentists`     | List dentists (search, pagination) |
| GET    | `/api/dentists/:id` | Get dentist profile                |
| PATCH  | `/api/dentists/:id` | Update profile (dentist/admin)     |

### Appointments

| Method | Endpoint                | Description                       |
| ------ | ----------------------- | --------------------------------- |
| POST   | `/api/appointments`     | Book appointment                  |
| GET    | `/api/appointments`     | List appointments (role-filtered) |
| GET    | `/api/appointments/:id` | Get appointment                   |
| PATCH  | `/api/appointments/:id` | Update status / reschedule        |
| DELETE | `/api/appointments/:id` | Delete (admin only)               |

### Availability

| Method | Endpoint                       | Description                      |
| ------ | ------------------------------ | -------------------------------- |
| GET    | `/api/availability`            | Get slots for dentist + date     |
| GET    | `/api/availability/:dentistId` | Get dentist availability config  |
| POST   | `/api/availability/:dentistId` | Set availability (dentist/admin) |

### Admin

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/api/admin/dashboard` | Stats + recent logs            |
| GET    | `/api/admin/dentists`  | All dentists                   |
| GET    | `/api/admin/users`     | All users (filterable by role) |

---

## License

MIT
