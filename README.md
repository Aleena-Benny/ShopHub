# ShopHub — E-Commerce Application

A full-stack e-commerce application built with **React**, **Node.js**, **Express**, and **MongoDB**.

## Features

- Browse products with category filters and search
- User registration and JWT authentication
- Shopping cart (add, update, remove items)
- Checkout with shipping address
- Order history
- Admin panel for product management (CRUD)

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, React Router, Vite        |
| Backend  | Node.js, Express                    |
| Database | MongoDB with Mongoose               |
| Auth     | JWT + bcrypt                        |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

Copy the server environment file and update if needed:

```bash
cp server/.env.example server/.env
```

Default values:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### 3. Seed the database

Make sure MongoDB is running, then:

```bash
npm run seed
```

This creates sample products and two test accounts:

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@shop.com  | admin123  |
| User  | demo@shop.com   | demo123   |

### 4. Start the servers

Open two terminals:

**Terminal 1 — API server (port 5000):**
```bash
npm run dev:server
```

**Terminal 2 — React app (port 3000):**
```bash
npm run dev:client
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint              | Description              | Auth     |
|--------|-----------------------|--------------------------|----------|
| POST   | `/api/auth/register`  | Register user            | Public   |
| POST   | `/api/auth/login`     | Login user               | Public   |
| GET    | `/api/auth/profile`   | Get user profile         | User     |
| GET    | `/api/products`       | List products            | Public   |
| GET    | `/api/products/:id`   | Get product              | Public   |
| POST   | `/api/products`       | Create product           | Admin    |
| PUT    | `/api/products/:id`   | Update product           | Admin    |
| DELETE | `/api/products/:id`   | Delete product           | Admin    |
| GET    | `/api/cart`           | Get cart                 | User     |
| POST   | `/api/cart`           | Add to cart              | User     |
| PUT    | `/api/cart/:id`       | Update cart item         | User     |
| DELETE | `/api/cart/:id`       | Remove from cart         | User     |
| POST   | `/api/orders`         | Place order              | User     |
| GET    | `/api/orders/myorders`| Get user orders          | User     |

## Project Structure

```
portfolioproject/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # API client
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth & Cart state
│       └── pages/       # Route pages
├── server/          # Node.js backend
│   └── src/
│       ├── config/      # Database connection
│       ├── middleware/  # Auth middleware
│       ├── models/      # Mongoose schemas
│       └── routes/      # API routes
└── package.json     # Root scripts
```
# ShopHub
