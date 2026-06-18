# Deploy ShopHub to Netlify + Render

Netlify hosts the **React frontend**. The **Node.js API** runs on [Render](https://render.com) (free tier). MongoDB uses [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier).

## Step 1 — MongoDB Atlas (database)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user and allow access from anywhere (`0.0.0.0/0`)
3. Copy your connection string, e.g.:
   ```
   mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/ecommerce
   ```

## Step 2 — Deploy API to Render

1. Push this project to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your repo — Render reads `render.yaml` automatically
4. Set environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `CLIENT_URL` — your Netlify URL (set after Step 3), e.g. `https://shophub-app.netlify.app`
5. After deploy, note your API URL, e.g. `https://shophub-api.onrender.com`

Seed the database (run once locally with Atlas URI):
```bash
cd server
MONGODB_URI="your-atlas-uri" npm run seed
```

## Step 3 — Deploy frontend to Netlify

### Option A: Netlify Dashboard (recommended)

1. Go to [Netlify Projects](https://app.netlify.com/teams/aleena-benny/projects)
2. **Add new project** → **Import from Git** (or **Deploy manually**)
3. Build settings (auto-detected from `netlify.toml`):
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-api.onrender.com/api`
5. Deploy

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --build
```

Set `VITE_API_URL` in Netlify:
```bash
netlify env:set VITE_API_URL https://your-api.onrender.com/api
```

## Step 4 — Update CORS on Render

After Netlify gives you a URL, update Render env:
```
CLIENT_URL=https://your-app.netlify.app
```

Redeploy the API service.

## Test accounts (after seeding)

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@shop.com  | admin123  |
| User  | demo@shop.com   | demo123   |
