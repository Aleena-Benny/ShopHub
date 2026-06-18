# Quick Fix: MongoDB & Products Not Loading

Your Vercel deployment is missing the MongoDB connection string. Here's how to fix it in 5 minutes:

## The Problem
- ❌ "No products found" message
- ❌ MongoDB connection failing
- ❌ API returning 404 errors

## The Solution: Add Environment Variables to Vercel

### Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Log in to your account
3. Click on your **Cluster**
4. Click **"Connect"** button
5. Click **"Connect your application"**
6. Copy the connection string:
   ```
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce
   ```
   - Replace `YOUR_USERNAME` with your database user
   - Replace `YOUR_PASSWORD` with your database password
   - Change `myFirstDatabase` to `ecommerce`

### Step 2: Add to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your **shophub-app** project
3. Click **Settings**
4. Click **"Environment Variables"** (left sidebar)
5. Click **"Add New"** button
6. Fill in:
   - **Name**: `MONGODB_URI`
   - **Value**: (paste your connection string from Step 1)
   - Keep "Production, Preview, Development" all checked
7. Click **"Save"**
8. Add another variable:
   - **Name**: `JWT_SECRET`
   - **Value**: (generate a random string, e.g., `your-super-secret-key-12345`)
   - Click **"Save"**

### Step 3: Redeploy

1. In Vercel, go to **"Deployments"**
2. Find the latest deployment
3. Click the **three dots (...)** menu
4. Select **"Redeploy"**
5. Click **"Redeploy"** to confirm

⏳ Wait 1-2 minutes for the deployment to complete...

### Step 4: Test

1. Go to [shophub-app.vercel.app](https://shophub-app.vercel.app)
2. You should now see products! 🎉
3. If you still don't see products:
   - Go to [shophub-app.vercel.app](https://shophub-app.vercel.app)
   - Right-click → **Inspect** → **Console** tab
   - Look for error messages
   - Check Vercel logs: Dashboard → Deployments → Latest → Functions → /api

## Seed Your Database (Optional but Recommended)

To populate sample data, run locally:

```bash
cd server
# PowerShell:
$env:MONGODB_URI="your-connection-string-here"
npm run seed

# Or Mac/Linux:
export MONGODB_URI="your-connection-string-here"
npm run seed
```

Then redeploy on Vercel (Step 3 above).

## Already Done but Still Not Working?

### Check if Variables Are Set
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `MONGODB_URI` and `JWT_SECRET` exist
3. Verify they're not in the wrong tab (should be in "Production")

### Troubleshooting Logs
1. Vercel Dashboard → Deployments → Latest deployment
2. Click **Functions** tab
3. Click `/api`
4. Check console output for error messages
5. Look for: "MongoDB connected" ✓ or connection errors ❌

### MongoDB Connection String Format
Should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce
```

Not like:
```
mongodb://127.0.0.1:27017  ❌ (local only)
mongodb+srv://user:pass@cluster  ❌ (incomplete)
```

## Questions?
- Check [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed instructions
- Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
- Check Vercel documentation: https://vercel.com/docs/environment-variables
