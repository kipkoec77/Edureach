# Deployment Guide

## Backend Deployment (Render)

### 1. Push your code to GitHub
```bash
git add .
git commit -m "Configure for production deployment"
git push origin master
```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `Edureach` repository
5. Configure the service:
   - **Name**: `edureach-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `master`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGO_URI` = `mongodb+srv://Brian:25563124@cluster0.kx8dmgx.mongodb.net/Edureach?appName=Cluster0`
   - `JWT_SECRET` = `your-secure-random-string-here`
   - `JWT_REFRESH_SECRET` = `your-secure-refresh-token-secret-here`
   - `CLIENT_URL` = `https://edulearn-gold.vercel.app`

7. Click **"Create Web Service"**

8. Wait for deployment to complete (5-10 minutes)

9. Copy your Render URL (e.g., `https://edureach-backend.onrender.com`)

### 3. Update Frontend Environment Variables

Once your backend is deployed, update your Vercel environment variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`edulearn-gold`)
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
   
5. Redeploy your frontend:
   ```bash
   # In the client directory
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

## Frontend Deployment (Vercel)

Your frontend is already deployed at: https://edulearn-gold.vercel.app/

To update environment variables:
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `VITE_API_URL` with your Render backend URL

## Testing Production

1. Visit: https://edulearn-gold.vercel.app/
2. Try to sign up/login
3. Check if the frontend connects to the backend
4. Monitor Render logs for any errors

## Important Notes

- **Free Tier Limitations**: Render free tier spins down after inactivity. First request may take 30-60 seconds.
- **Database**: Your MongoDB is already configured and will work with the deployed backend.
- **CORS**: Already configured to allow requests from your Vercel URL.
- **Security**: Change JWT secrets to more secure random strings before production use.

## Troubleshooting

### Backend not responding
- Check Render logs for errors
- Verify environment variables are set correctly
- Ensure MongoDB connection string is correct

### CORS errors
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- Check that there are no trailing slashes

### Database connection issues
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check if your MongoDB credentials are correct
