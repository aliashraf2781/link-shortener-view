<div align="center">

# SaaS Link Management

**Professional URL shortening and analytics platform**

[![Live Demo](https://img.shields.io/badge/Live_Demo-link--shortener--view.vercel.app-0d9488?style=for-the-badge&logo=vercel&logoColor=white)](https://link-shortener-view.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

A full-stack solution for generating, managing, and analyzing short links with rich click analytics, geolocation tracking, and real-time performance insights.

[Live Demo](https://link-shortener-view.vercel.app/) | [Backend Repo](https://github.com/Abdelrahman-Abdullah/SaaS-Link-Management-API) | [Flutter Client](https://github.com/MohamedEmad223/Dashboard-For-Url-Shortner-)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Security](#security)
- [Deployment](#deployment)
- [Related Repositories](#related-repositories)
- [License](#license)

---

## Overview

SaaS Link Management is a production-ready URL shortening platform that provides:

- Short link generation with optional custom aliases
- Detailed per-link and global analytics dashboards
- Click tracking with geolocation, device, browser, and referrer data
- Secure authentication with JWT-based session management
- A full password recovery flow (request, OTP verification, reset)
- QR code generation for any shortened link

The frontend is a Next.js 16 App Router application. The backend is a Laravel API with MySQL, deployed independently.

---

## Tech Stack

| Layer            | Technology                                                                                                                                                                                                                                                                                                                                              |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Framework**    | ![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)                                                                                                                                        |
| **Language**     | ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                                                                                                                                                                                       |
| **Styling**      | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)                                                                                                                                                                                                                                  |
| **Auth**         | ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) (Credentials + JWT)                                                                                                                                                                                                                   |
| **Data Fetching**| ![React Query](https://img.shields.io/badge/TanStack_React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)                                                                                                                                                                                                                              |
| **State**        | ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square&logo=react&logoColor=white)                                                                                                                                                                                                                                                    |
| **Forms**        | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) + ![Zod](https://img.shields.io/badge/Zod_4-3E67B1?style=flat-square&logo=zod&logoColor=white)                                                                                                                            |
| **Charts**       | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square&logo=chart.js&logoColor=white)                                                                                                                                                                                                                                               |
| **HTTP**         | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)                                                                                                                                                                                                                                                        |
| **Backend**      | ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white) + ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)                                                                                                                                               |
| **Deployment**   | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)                                                                                                                                                                                                                                                     |

---

## Features

### Frontend

| Feature                | Description                                                                 |
| :--------------------- | :-------------------------------------------------------------------------- |
| **Authentication**     | Secure login and registration with NextAuth Credentials provider and JWT    |
| **Password Recovery**  | 3-step forgot-password flow: request, OTP verification, reset               |
| **Protected Routes**   | Middleware-based route guards for authenticated pages                        |
| **Analytics Dashboard**| Interactive charts for click trends, peak hours, geo distribution           |
| **Real-Time Updates**  | React Query for efficient server-state synchronization and caching          |
| **QR Code Generation** | Generate downloadable QR codes for any shortened link                       |
| **Responsive Design**  | Fully responsive layout with collapsible sidebar navigation                 |
| **React Compiler**     | Enabled via Next.js 16 for automatic component optimization                 |

### Backend

| Feature                  | Description                                                               |
| :----------------------- | :------------------------------------------------------------------------ |
| **Short Link Generation**| Unique short codes with optional custom alias support                     |
| **Smart Redirection**    | Click capture with geolocation, device, browser, and referrer metadata    |
| **Link Status Toggle**   | Activate/deactivate links with rate limiting (once every 2 days)          |
| **Analytics Engine**     | Global overview, per-link deep analytics, trends, and live click feed     |
| **Multi-Tenant**         | Strict user-scoped data isolation -- users manage only their own links    |
| **Sanctum Auth**         | Token-based authentication via Laravel Sanctum                            |

---

## Project Structure

```
src/
  app/
    (pages)/
      (app)/
        dashboard/          -- Main dashboard with links table
          analytics/        -- Analytics charts and insights
          settings/         -- User settings
      auth/
        login/              -- Login page
        register/           -- Registration page
        forget-password/    -- Password reset request
        verify-otp/         -- OTP verification step
        change-password/    -- New password form
      go/
        [slug]/             -- Short link redirection handler
    api/
      auth/
        [...nextauth]/      -- NextAuth API route (Credentials + JWT)
  components/
    core/                   -- App-level components (Dashboard, Modals, Docs)
    ui/                     -- Reusable primitives (Button, FormField, Modal, Table)
  constants/                -- App constants (allowed email domains)
  hooks/                    -- Custom hooks (auth, links, analytics, redirects)
  lib/                      -- Utilities (Axios client, toast, cn helper)
  Providers/                -- Global providers (SessionProvider, QueryClient, Toaster)
  schemas/                  -- Zod validation schemas (auth, links)
  services/                 -- API service functions (auth, links, analytics)
  types/                    -- TypeScript type definitions
```

---

## Prerequisites

Before running this project, ensure you have the following installed:

| Requirement          | Version    | Link                                             |
| :------------------- | :--------- | :----------------------------------------------- |
| **Node.js**          | >= 18.x    | [nodejs.org](https://nodejs.org/)                |
| **npm**              | >= 9.x     | Included with Node.js                            |
| **Git**              | Latest     | [git-scm.com](https://git-scm.com/)             |
| **Backend API**      | Running    | [Backend Repo](https://github.com/Abdelrahman-Abdullah/SaaS-Link-Management-API) |

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/aliashraf2781/link-shortener-view.git
cd link-shortener-view
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables** (see section below)

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Base URL of the Laravel backend API (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# NextAuth configuration
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:5000
```

| Variable               | Required | Description                                          |
| :--------------------- | :------: | :--------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Yes      | Backend API base URL. All service calls use this.    |
| `NEXTAUTH_SECRET`      | Yes      | Secret key for signing JWT tokens and cookies.       |
| `NEXTAUTH_URL`         | Yes      | Canonical URL of the frontend (used by NextAuth).    |

> **Note:** If `NEXT_PUBLIC_API_URL` is missing or incorrect, all authentication and API calls will fail.

---

## Running the Project

### Development

```bash
npm run dev
```

Starts the Next.js development server on **port 5000** with hot module replacement.

### Production Build

```bash
npm run build
npm start
```

Creates an optimized production build and starts the Node.js server.

### Linting

```bash
npm run lint
```

Runs ESLint across the project using the configuration in `eslint.config.mjs`.

---

## Available Scripts

| Command          | Description                                              |
| :--------------- | :------------------------------------------------------- |
| `npm run dev`    | Start development server on port 5000                    |
| `npm run build`  | Create optimized production build                        |
| `npm start`      | Start production server                                  |
| `npm run lint`   | Run ESLint checks                                        |
| `npm run ngrok`  | Expose local port 5000 via ngrok tunnel                  |

---

## Authentication Flow

The application uses **NextAuth.js** with the Credentials provider and JWT session strategy.

```
                                    +------------------+
                                    |   Login Form     |
                                    | (react-hook-form |
                                    |  + zod schema)   |
                                    +--------+---------+
                                             |
                                             v
                                    +------------------+
                                    | signIn()         |
                                    | NextAuth Client  |
                                    +--------+---------+
                                             |
                                             v
                                    +------------------+
                                    | Credentials      |
                                    | Provider         |
                                    | POST /api/login  |
                                    +--------+---------+
                                             |
                                             v
                                    +------------------+
                                    | Laravel Backend   |
                                    | Returns JWT      |
                                    | access_token     |
                                    +--------+---------+
                                             |
                                             v
                                    +------------------+
                                    | JWT Callback     |
                                    | Stores token in  |
                                    | session          |
                                    +--------+---------+
                                             |
                                             v
                                    +------------------+
                                    | session.         |
                                    | accessToken      |
                                    | available to all |
                                    | API calls        |
                                    +------------------+
```

**Password Recovery** follows a 3-step flow:

1. `POST /forgot-password` -- Send OTP to the user's email
2. `POST /forgot-password/verify` -- Verify OTP and receive a reset token
3. `POST /reset-password` -- Submit new password with the reset token

---

## API Reference

All endpoints are prefixed with the `NEXT_PUBLIC_API_URL` base path. Protected endpoints require a Bearer token in the `Authorization` header.

### Authentication

| Method | Endpoint                  | Auth     | Description                                  |
| :----- | :------------------------ | :------- | :------------------------------------------- |
| POST   | `/register`               | Public   | Register a new user account                  |
| POST   | `/login`                  | Public   | Authenticate and receive an access token     |
| POST   | `/logout`                 | Required | Revoke current authentication token          |
| POST   | `/forgot-password`        | Public   | Request password reset with email            |
| POST   | `/forgot-password/verify` | Public   | Verify reset code and get verification token |
| POST   | `/reset-password`         | Public   | Complete password reset with new password    |

### Link Management

| Method | Endpoint              | Auth     | Description                                   |
| :----- | :-------------------- | :------- | :-------------------------------------------- |
| GET    | `/links`              | Required | List all user's shortened links               |
| POST   | `/generate`           | Required | Generate a new short link (optional alias)    |
| DELETE | `/links/:id`          | Required | Delete a specific shortened link              |
| PUT    | `/links/:id/toggle`   | Required | Toggle link active/inactive status            |
| GET    | `/redirect`           | Public   | Redirect to original URL and record analytics |

### Analytics

| Method | Endpoint               | Auth     | Description                                      |
| :----- | :--------------------- | :------- | :----------------------------------------------- |
| GET    | `/overview`            | Required | Global analytics summary and dashboard metrics   |
| GET    | `/clicks-over-time`    | Required | Click trends over a specified period             |
| GET    | `/link-analytics/:id`  | Required | Detailed analytics for a specific link           |
| GET    | `/recent-clicks`       | Required | Latest click events with metadata                |

---

## Security

| Measure                        | Details                                                        |
| :----------------------------- | :------------------------------------------------------------- |
| **Token-Based Auth**           | Laravel Sanctum tokens stored in JWT session cookies           |
| **Route Protection**           | Middleware guards all authenticated routes                      |
| **User-Scoped Data**           | All operations are strictly scoped to the authenticated user   |
| **Rate Limiting**              | Link status toggle limited to once every 2 days                |
| **Form Validation**            | Zod schemas on the client; FormRequest validation on the API   |
| **Domain Restriction**         | Only common email providers are accepted during registration   |

---

## Deployment

The frontend is deployed on **Vercel** and is accessible at:

**[https://link-shortener-view.vercel.app](https://link-shortener-view.vercel.app/)**

To deploy your own instance:

1. Push the repository to GitHub
2. Import the project into [Vercel](https://vercel.com/)
3. Add the required environment variables in the Vercel dashboard
4. Deploy

Vercel automatically builds and deploys on every push to the main branch.

---

## Related Repositories

| Repository       | Description                          | Link                                                                                         |
| :--------------- | :----------------------------------- | :------------------------------------------------------------------------------------------- |
| **Backend API**  | Laravel REST API with Sanctum auth   | [SaaS-Link-Management-API](https://github.com/Abdelrahman-Abdullah/SaaS-Link-Management-API) |
| **Flutter App**  | Mobile client built with Flutter     | [Dashboard-For-Url-Shortner](https://github.com/MohamedEmad223/Dashboard-For-Url-Shortner-) |

---

## License

This project is open source and available under the [MIT License](LICENSE).
