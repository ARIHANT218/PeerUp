# Fix OAuth Redirect URI Mismatch Error

## The Problem
Error 400: `redirect_uri_mismatch` means the redirect URI in Google Cloud Console doesn't match what your app is sending.

## Solution

### Step 1: Verify Your Backend .env Configuration

Make sure your `Backend/.env` file has:
```env
OAUTH_CALLBACK_BASE_URL=http://localhost:5000/auth
```

This will create the callback URL: `http://localhost:5000/auth/google/callback`

### Step 2: Add the Redirect URI in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID: `410799359983-3kvfg10evtjrumfgiuqh2pchalif6hb4`
4. Scroll down to **Authorized redirect URIs**
5. Click **+ ADD URI**
6. Add **exactly** this URI (copy-paste to avoid typos):
   ```
   http://localhost:5000/auth/google/callback
   ```
7. Click **SAVE**

### Step 3: Important Notes

⚠️ **The URI must match EXACTLY:**
- ✅ Correct: `http://localhost:5000/auth/google/callback`
- ❌ Wrong: `http://localhost:5000/auth/google/callback/` (trailing slash)
- ❌ Wrong: `https://localhost:5000/auth/google/callback` (https instead of http)
- ❌ Wrong: `http://127.0.0.1:5000/auth/google/callback` (IP instead of localhost)

### Step 4: Restart Your Backend Server

After making changes:
```bash
# Stop the server (Ctrl+C)
# Then restart it
cd Backend
npm run dev
```

### Step 5: Test Again

1. Clear your browser cache or use incognito mode
2. Go to `http://localhost:5173`
3. Click "Sign in with Google"
4. It should work now!

## Alternative: If You're Using a Different Port

If your backend runs on a different port (not 5000), update both:

1. **Backend/.env:**
   ```env
   PORT=YOUR_PORT
   OAUTH_CALLBACK_BASE_URL=http://localhost:YOUR_PORT/auth
   ```

2. **Google Cloud Console:** Add the corresponding redirect URI:
   ```
   http://localhost:YOUR_PORT/auth/google/callback
   ```

## Still Having Issues?

1. **Check the exact error message** - Google sometimes shows the expected URI
2. **Verify your .env file** - Make sure there are no extra spaces or quotes
3. **Check server logs** - See what callback URL is being used
4. **Wait a few minutes** - Google changes can take 1-2 minutes to propagate

## For Production

When deploying, you'll need to:
1. Add your production redirect URI (e.g., `https://yourdomain.com/auth/google/callback`)
2. Update `OAUTH_CALLBACK_BASE_URL` in your production environment variables
3. Make sure both development and production URIs are added in Google Console

