# Drift E-Commerce

A full-stack modern streetwear and apparel e-commerce platform built with Node.js, Express 5, React 19, Vite 8, and MongoDB.

Developed by **[Tabrez Rabbani](https://github.com/tabrez-rabbani)**

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Key Features](#key-features)
  - [Backend & Security](#1-backend--security)
  - [Frontend Storefront](#2-frontend-storefront)
  - [Admin Panel](#3-admin-panel)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Admin Panel Setup](#3-admin-panel-setup)
  - [Docker Setup](#docker-setup)
- [Environment Variables](#environment-variables)
  - [Backend (.env)](#backend-env)
  - [Frontend (.env)](#frontend-env)
  - [Admin (.env)](#admin-env)
- [Production Build](#production-build)
- [Author](#author)
- [License](#license)

---

## Overview

Drift is a monorepo consisting of three decoupled layers:

1. **Backend (`/backend`)**: REST API built with Express 5, MongoDB, and Mongoose using a layered DAO pattern. Handles authentication, Razorpay payments, image uploads via ImageKit, and transactional emails via Resend.
2. **Frontend (`/Frontend`)**: Fast, consumer-facing storefront built with React 19, Vite, Redux Toolkit, Framer Motion, and Swiper.
3. **Admin Panel (`/Admin`)**: Real-time management dashboard built with React 19, CSS Modules, lightweight SVG analytics, and global command search.

---

## Screenshots

### Storefront Views

| Homepage Hero | Promotional Banner |
| :---: | :---: |
| <img src="https://ik.imagekit.io/8krmfgv2b/readme/hero.webp" alt="Homepage Hero" width="450"/> | <img src="https://ik.imagekit.io/8krmfgv2b/readme/banner.webp" alt="Promotional Banner" width="450"/> |

| Trending Showcase | Product Catalog & Collections |
| :---: | :---: |
| <img src="https://ik.imagekit.io/8krmfgv2b/readme/trending_section.webp" alt="Trending Showcase" width="450"/> | <img src="https://ik.imagekit.io/8krmfgv2b/readme/collection.webp" alt="Catalog & Collections" width="450"/> |

| Product Experience | Slide-out Cart Drawer |
| :---: | :---: |
| <img src="https://ik.imagekit.io/8krmfgv2b/readme/product_details.webp" alt="Product Detail" width="450"/> | <img src="https://ik.imagekit.io/8krmfgv2b/readme/cart_drawer.webp" alt="Cart Drawer" width="450"/> |

### Admin Dashboard Views

| Operational Analytics & KPIs | Sales Trends & Recent Orders |
| :---: | :---: |
| <img src="https://ik.imagekit.io/8krmfgv2b/readme/admin-dashboard.webp" alt="Admin Dashboard KPIs" width="450"/> | <img src="https://ik.imagekit.io/8krmfgv2b/readme/admin_dashboard2.webp" alt="Recent Orders and Trends" width="450"/> |

| Inventory & Product Management |
| :---: |
| <img src="https://ik.imagekit.io/8krmfgv2b/readme/admin_product_list.webp" alt="Product Management Table" width="920"/> |

---

## Tech Stack

### 1. Backend Service
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database & ODM**: MongoDB with Mongoose 9
- **Architecture**: Layered DAO (Data Access Object) Pattern
- **Authentication**: JWT with HTTP-only cookies and Refresh Token rotation
- **OAuth**: Google OAuth 2.0 via Passport.js
- **Media Storage**: ImageKit SDK with Multer memory storage
- **Payments**: Razorpay Node SDK with HMAC SHA-256 signature verification
- **Emails**: Resend API
- **Security**: Helmet, Express Rate Limit, Cookie Parser, Compression

### 2. Frontend Storefront
- **Framework**: React 19 + Vite 8
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM 7
- **Styling & UI**: Vanilla CSS + Tailwind, Framer Motion, Swiper
- **Icons & Alerts**: Lucide React, Sonner
- **HTTP Client**: Axios with automatic token refresh interceptor

### 3. Admin Panel
- **Framework**: React 19 + Vite 8
- **Styling**: Modular CSS (Zero runtime overhead)
- **Visualizations**: Native SVG Donut and Bar charts
- **Search System**: Global Command Search with AbortController cancellation and regex sanitization
- **Routing**: React Router DOM 7
- **Icons & Alerts**: Lucide React, Sonner

---

## Repository Structure

```
Drift/
├── backend/                     # Express 5 REST API service
│   ├── src/
│   │   ├── config/              # MongoDB and third-party service configs
│   │   ├── controllers/         # Request handling and HTTP responses
│   │   ├── dao/                 # Data Access Object abstraction layer
│   │   ├── middlewares/         # Auth guards, role verification, error handlers
│   │   ├── models/              # Mongoose schemas and compound indexes
│   │   ├── routes/              # Route definitions per domain
│   │   ├── services/            # Razorpay, ImageKit, and Resend integrations
│   │   └── utils/               # AppError and helper utilities
│   ├── server.js                # Server entry point
│   └── package.json
│
├── Frontend/                    # Consumer storefront application
│   ├── src/
│   │   ├── components/          # Reusable UI elements and layout
│   │   ├── pages/               # Home, Shop, Product Details, Cart, Checkout
│   │   ├── redux/               # Redux slices (cart, auth, products)
│   │   └── services/            # Client API calls
│   └── package.json
│
├── Admin/                       # Administrative dashboard application
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, shared UI
│   │   ├── features/            # Feature-sliced modules
│   │   │   ├── dashboard/       # Stat cards, revenue bar chart, SVG donut chart
│   │   │   ├── globalSearch/    # Command palette search (products, orders, users)
│   │   │   ├── orders/          # Order management and status updates
│   │   │   ├── products/        # Inventory and product forms
│   │   │   └── users/           # Buyer directory
│   │   └── pages/               # Container pages
│   └── package.json
│
├── docker-compose.yml           # Multi-container orchestration
└── README.md
```

---

## Key Features

### 1. Backend & Security
- **Layered DAO Architecture**: Clean separation between controllers, data access objects, and database models.
- **Secure Cookie-Based Auth**: Access and refresh tokens stored in HTTP-only, SameSite cookies to protect against XSS.
- **Cryptographic Payment Verification**: Razorpay payment signatures validated with HMAC SHA-256 before marking orders as paid.
- **Media Upload Pipeline**: Multi-file image uploads streamed directly to ImageKit with optimized CDN paths.
- **Compound Database Indexes**: Optimized queries on order history, catalog filters, and full-text title search.

### 2. Frontend Storefront
- **Dynamic Catalog**: Category filtering, price sorting, and search with instant UI feedback.
- **Interactive Product Pages**: Multi-color thumbnail switching, size pickers, and real-time inventory validation.
- **Cart & Bag Experience**: Persistent slide-out cart drawer, stock validation, and quantity updates.
- **Checkout Flow**: Multi-step shipping address form with integrated Razorpay payment gateway modal.
- **Account Management**: Order history, order tracking, and profile management.

### 3. Admin Panel
- **Real-Time Operational Analytics**:
  - KPI Stat Cards with hover animations (Revenue, Orders, Products, Users).
  - Native SVG Orders Overview donut chart.
  - Monthly Revenue Trend chart with hover indicators.
  - Top Categories ranking with thumbnail previews and balanced metrics.
  - Recent orders and best-selling products list.
- **Global Search Command Palette**:
  - Instant modal search across Products, Orders, and Users.
  - Safe regex escaping preventing ReDoS and syntax errors.
  - `AbortController` integration canceling in-flight requests on rapid typing.
- **Inventory & Orders Management**:
  - Multi-image and multi-color product creation/editing.
  - One-click stock toggle (In Stock / Out of Stock).
  - Order status pipeline: `placed` -> `processing` -> `shipped` -> `delivered` / `cancelled`.

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- MongoDB (Local server or MongoDB Atlas connection string)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend` using the variables listed in the [Backend Environment](#backend-env) section.

Start the backend development server:
```bash
npm run dev
```
Backend runs on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in `/Frontend`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the storefront:
```bash
npm run dev
```
Storefront runs on `http://localhost:5173`.

---

### 3. Admin Panel Setup

```bash
cd ../Admin
npm install
```

Create a `.env` file in `/Admin`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STOREFRONT_URL=http://localhost:5173
```

Start the admin dashboard:
```bash
npm run dev
```
Admin dashboard runs on `http://localhost:5175`.

---

### Docker Setup

To launch all three services simultaneously via Docker Compose:

```bash
docker-compose up --build
```

---

## Environment Variables

### Backend (.env)

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (Default: `5000`) |
| `NODE_ENV` | Application environment (`development` / `production`) |
| `MONGO_URI` | MongoDB connection URI |
| `CLIENT_URL` | Storefront origin URL (`http://localhost:5173`) |
| `ADMIN_URL` | Admin panel origin URL (`http://localhost:5175`) |
| `JWT_ACCESS_SECRET` | Secret key for JWT access tokens |
| `JWT_ACCESS_EXPIRE` | Access token lifespan (e.g. `15m`) |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens |
| `JWT_REFRESH_EXPIRE` | Refresh token lifespan (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key |
| `RAZORPAY_KEY_ID` | Razorpay public key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay private secret key |
| `RAZORPAY_WEBHOOK_SECRET`| Razorpay webhook signing secret |
| `RESEND_API_KEY` | Resend API key for transactional emails |

### Frontend (.env)

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend API base URL (`http://localhost:5000/api`) |

### Admin (.env)

| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend API base URL (`http://localhost:5000/api`) |
| `VITE_STOREFRONT_URL` | Storefront URL for previews (`http://localhost:5173`) |

---

## Production Build

```bash
# Build Storefront
cd Frontend && npm run build

# Build Admin Dashboard
cd ../Admin && npm run build

# Start Backend in Production
cd ../backend && NODE_ENV=production npm start
```

---

## Author

**Tabrez Rabbani**
- GitHub: [@tabrez-rabbani](https://github.com/tabrez-rabbani)
- Email: tabrezrabbani750@gmail.com
- Portfolio: [tabrezrabbani.in](https://tabrezrabbani.in)

---

## License

This project is licensed under the ISC License.
