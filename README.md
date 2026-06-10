<div align="center">
  <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200" alt="AURA Banner" style="border-radius: 16px; width: 100%; max-width: 800px" />
  <br/><br/>
  <h1 align="center" style="font-family: 'Playfair Display', serif; font-size: 4rem; letter-spacing: 0.1em; margin: 0;">AURA</h1>
  <p align="center"><strong>Crafted For Modern Living</strong></p>
  <p align="center">
    A full-stack luxury e-commerce platform with Express, MySQL, React, Redis, and Docker.
  </p>
  <p align="center">
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-environment-variables">Environment</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-docker">Docker</a>
  </p>
</div>

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog** — Browse, search, filter by category/price with pagination
- **Product Detail** — Full product info with image, description, stock, and reviews
- **Quick View** — Hover-to-preview modal on any product card
- **Shopping Cart** — Add/update/remove items, real-time subtotal calculation
- **Wishlist** — Save products for later
- **Checkout** — Card and UPI payment methods with form validation

### 🔐 Authentication & Authorization
- **JWT with Refresh Token Rotation** — 15-min access tokens, 7-day refresh tokens stored in DB
- **Auto Token Refresh** — Axios interceptor silently refreshes expired tokens
- **Role-Based Access** — Admin vs Customer roles, admin-only routes protected
- **Rate Limiting** — 100 req/15min global, 20 req/15min for auth endpoints

### 👑 Admin Dashboard
- **HTML Dashboard** at `/admin` — Stats, products, orders, users, categories CRUD
- **React Admin Panel** at `/admin/*` — Full-featured with tabs for Overview, Products, Orders, Users, Categories
- **Order Management** — Update order status (pending → processing → shipped → delivered)
- **Product Management** — Toggle featured, delete products
- **User Management** — View all registered users
- **Category Management** — Add/delete categories

### 📦 Order & Payment Processing
- **Transactional Order Placement** — Stock decrement + cart clear in single DB transaction
- **Async Payment Queue** — BullMQ + Redis processes payments with retry & backoff
- **Payment Status Tracking** — Poll payment job status via job ID
- **Email Queue** — Workers for order_confirmation, payment_received, welcome, order_shipped

### 🎨 Frontend
- **15 Pages** — Home, Shop, Product Detail, Craft, Journal, Maison, Contact, Checkout, Orders, Order Detail, Wishlist, Login, Register, Profile, Admin
- **Luxury Design** — Custom Tailwind theme with Framer Motion animations
- **Cinematic Loader** — Full-screen AURA intro animation on first visit
- **Custom Cursor** — Premium cursor with magnetic hover effects
- **Fullscreen Menu** — Immersive navigation with hover images
- **Search Overlay** — Real-time product search
- **Responsive** — Mobile-first, fully responsive layout

### ⚙️ Infrastructure
- **MySQL 8.0** — Joins, foreign keys, transactions, stored procedures, performance indexes
- **Redis 7** — BullMQ job queue backend with graceful fallback
- **Winston Logging** — Error + combined logs to files and console
- **Helmet** — Security headers (CSP, XSS, etc.)
- **Swagger Docs** — Interactive API documentation at `/api-docs`
- **Cloudinary Uploads** — Image upload via memory buffer streaming
- **Docker Compose** — One-command local development environment

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js 22, Express 5 |
| **Database** | MySQL 8.0 (via mysql2/promise) |
| **Cache / Queue** | Redis 7, BullMQ |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Validation** | Joi |
| **Uploads** | Multer, Cloudinary, streamifier |
| **Logging** | Winston |
| **Security** | Helmet, express-rate-limit, CORS |
| **Docs** | Swagger JSDoc, swagger-ui-express |
| **Frontend** | React 18, Vite 5, React Router 6 |
| **Styling** | Tailwind CSS 3 |
| **Animations** | Framer Motion 11 |
| **Icons** | Lucide React |
| **Container** | Docker, Docker Compose |

---

## 🏗 Architecture

```
                         Nginx (port 80)
                        /              \
             /api, /admin,           Static Frontend
           /api-docs, /health        (dist/index.html)
                       |
               Express API (port 5000)
              /     |     |     |     \
          Auth   Products  Cart  Orders  ...
              \     |     |     |     /
              MySQL 8.0 (Connection Pool)
                       |
               BullMQ Worker Processes
              /         |         \
        Payments    Emails    Inventory
              \         |         /
               Redis 7 (Queue Backend)
```

**Workflow:**
1. User browses products (React → Express → MySQL)
2. User adds to cart (React → Express → MySQL)
3. User checks out (React → Express → MySQL transaction)
4. Payment enqueued (Express → Redis → BullMQ Worker → MySQL)
5. Email notifications queued (Worker → Redis → Email Worker)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Option 1: Docker (Recommended)

```bash
# 1. Clone and enter
git clone <repo-url> && cd backend

# 2. Start all services
docker compose up -d

# 3. Seed the database
docker compose exec api node seed.js

# 4. Install & start frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Option 2: Manual Setup

```bash
# 1. Install backend dependencies
npm install

# 2. Set up MySQL & Redis (must be running locally)
#    Edit .env with your MySQL root password

# 3. Create database and tables
mysql -u root -p < sql/schema.sql

# 4. Seed data
npm run seed

# 5. Start backend + workers
npm run start:all

# 6. Install & start frontend (new terminal)
cd frontend && npm install && npm run dev
```

### Access

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:5173 | 5173 |
| **API** | http://localhost:5000 | 5000 |
| **Swagger Docs** | http://localhost:5000/api-docs | 5000 |
| **Admin Dashboard** | http://localhost:5000/admin | 5000 |
| **MySQL** | localhost:3307 | 3307 |
| **Redis** | localhost:6379 | 6379 |

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@shop.com | admin123 |
| **Customer** | john@example.com | user123 |
| **Customer** | jane@example.com | user123 |

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=ecommerce

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redispass123

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional - currently logs only)
RESEND_API_KEY=your_resend_api_key
```

When running via Docker, these are overridden by `docker-compose.yml` environment variables.

---

## 📖 API Documentation

Full interactive Swagger docs available at **`http://localhost:5000/api-docs`** when the server is running.

### API Overview (44 endpoints)

| Group | Endpoints | Auth |
|-------|-----------|------|
| **Health** | `GET /api/health` | Public |
| **Auth** | Register, Login, Refresh, Logout, Profile | Mixed |
| **Products** | Full CRUD + List with filters + Image Upload | Admin for write |
| **Categories** | Full CRUD with product count | Admin for write |
| **Cart** | Get, Add, Update, Remove, Clear | Authenticated |
| **Wishlist** | Get, Add, Remove | Authenticated |
| **Orders** | Place (transactional), Mine, By ID, Cancel, Admin All, Update Status | Mixed |
| **Payments** | Process (queued), Status by Job, By Order | Authenticated |
| **Reviews** | By Product (public), Add, Update, Delete | Mixed |
| **Admin** | Dashboard Stats, Users, Product Sales, Daily Revenue | Admin |

See [`BACKEND.md`](./BACKEND.md) for full endpoint details with request/response examples.

---

## 🐳 Docker

### Services

| Service | Image | Port (Host:Container) | Purpose |
|---------|-------|-----------------------|---------|
| `mysql` | mysql:8.0 | 3307:3306 | Database |
| `redis` | redis:7-alpine | 6379:6379 | Cache & Queue |
| `api` | custom (node:22) | 5000:5000 | Express API |
| `worker` | custom (node:22) | — | BullMQ workers |

### Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild API image (after code changes)
docker compose build api

# Run seed inside container
docker compose exec api node seed.js

# Access MySQL
docker compose exec mysql mysql -uroot -prootpassword ecommerce

# Access Redis CLI
docker compose exec redis redis-cli -a redispass123
```

---

## 📁 Project Structure

```
backend/
├── config/              # DB, Redis, Queue, Swagger, Logger configs
├── controllers/         # Route handlers (9 files)
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   └── adminController.js
├── middleware/          # Auth, Validation, Upload middleware
├── routes/              # Express route definitions (9 files)
├── workers/             # BullMQ workers (payment, email, inventory)
├── sql/                 # Schema & stored procedures
├── dashboard/           # Static admin dashboard HTML
├── frontend/            # React application
│   ├── src/
│   │   ├── api/         # Axios client with auto-refresh interceptor
│   │   ├── context/     # Auth & Cart React contexts
│   │   ├── pages/       # 15 page components
│   │   ├── components/  # UI components (Navbar, Footer, Menu, etc.)
│   │   └── ...
│   └── ...
├── logs/                # Application logs
├── server.js            # Express entry point
├── seed.js              # Database seeder
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Multi-service orchestration
├── nginx.conf           # Reverse proxy config
└── package.json         # Backend dependencies & scripts
```

---

## 📜 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start API server |
| `npm run seed` | Seed database with demo data |
| `npm run worker` | Start BullMQ workers |
| `npm run start:all` | Start server + workers concurrently |
| `npm run docker:up` | `docker compose up -d` |
| `npm run docker:down` | `docker compose down` |

---

## 📄 License

MIT © AURA Maison Inc.
