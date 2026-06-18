# Deploy ShopHub to Vercel

Deploy the full app (React frontend + Node.js API) on [Vercel](https://vercel.com).

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster
- GitHub repository with this code pushed

## Step 1 — MongoDB Atlas Setup (CRITICAL)

This is the most important step to fix the "MongoDB token" and "no products found" errors.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new free cluster
3. Create a database user:
   - Click "Database Access"
   - Click "Add New Database User"
   - Enter username and password (save these!)
   - Click "Add User"
4. Allow network access:
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (use `0.0.0.0/0`)
   - Click "Confirm"
5. Get connection string:
   - Click "Databases" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `myFirstDatabase` with `ecommerce`
   - Example: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/ecommerce`

## Step 2 — Deploy to Vercel

### Option A: Vercel Dashboard (RECOMMENDED)

1. Push this project to GitHub (you may have already done this)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Click "Import Git Repository"
4. Select your GitHub repository
5. Click "Import"
6. Vercel auto-detects settings from `vercel.json` ✓
7. **IMPORTANT: Add Environment Variables:**
   - Click "Environment Variables"
   - Add these variables:
     | Name          | Value                              |
     |---------------|------------------------------------|
     | `MONGODB_URI` | your MongoDB connection string (from Step 1) |
     | `JWT_SECRET`  | generate a long random string (e.g., run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
8. Click **"Deploy"**

### Option B: Vercel CLI

```bash
# Login to Vercel
npx vercel login

# Deploy
npx vercel

# Add environment variables
npx vercel env add MONGODB_URI
npx vercel env add JWT_SECRET

# Deploy to production
npx vercel --prod
```

## Step 3 — Seed Initial Data (One-time)

After deployment, seed the database with sample products:

### Option A: Using Node (Local)

```bash
cd server
# Windows PowerShell:
$env:MONGODB_URI="your-atlas-connection-string"
npm run seed

# Or Mac/Linux:
export MONGODB_URI="your-atlas-connection-string"
npm run seed
```

### Option B: Using Vercel CLI

```bash
npx vercel env pull  # Downloads .env.local with production variables
cd server
npm run seed
```

## How it Works

- **Frontend** — React app in `client/` built to static files
- **API** — Express server in `server/` runs as serverless function at `/api/*`
- **Database** — MongoDB Atlas (required for production)
- **CORS** — Automatically handles frontend-to-API requests

## Troubleshooting

### "No Products Found" Error
- **Cause**: MongoDB connection failed
- **Fix**: 
  1. Check that `MONGODB_URI` is set in Vercel Environment Variables
  2. Check that the connection string format is correct
  3. Verify MongoDB Atlas network access allows `0.0.0.0/0`
  4. Check Vercel Function logs: Dashboard → Project → Logs

### "MongoDB token" Error
- **Cause**: `MONGODB_URI` not set or invalid
- **Fix**: 
  1. Go to Vercel Project Settings
  2. Click "Environment Variables"
  3. Add `MONGODB_URI` with your MongoDB Atlas connection string
  4. Redeploy: Click "Deployments" → Choose latest → Click "..." → "Redeploy"

### API 404 Errors
- **Cause**: Environment variables not loaded, or database connection failed
- **Fix**:
  1. Redeploy after setting environment variables: Dashboard → "Deployments" → Redeploy latest
  2. Check Vercel logs for error messages
  3. Verify `MONGODB_URI` format is correct

### How to Check Vercel Logs
1. Go to your project on [vercel.com](https://vercel.com)
2. Click "Deployments"
3. Click on the latest deployment
4. Click "Functions" → `/api`
5. View the console output for error messages

## Test Accounts (After Seeding)

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@shop.com  | admin123  |
| User  | demo@shop.com   | demo123   |

## Local Development

```bash
# Install all dependencies
npm run install:all

# Create .env.local with:
MONGODB_URI=your-local-or-atlas-connection-string

# Seed database (one time)
npm run seed

# Run development servers
npm run dev:server    # Express server on port 5000
npm run dev:client    # React dev server on port 3000
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 errors on API routes | Set `MONGODB_URI` env var and redeploy |
| "No products found" | Seed database and ensure MongoDB connection works |
| CORS errors | Check `CLIENT_URL` env var is set correctly |
| Server errors in logs | Check environment variables and database connection |
