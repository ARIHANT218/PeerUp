# Setup Guide

## Quick Start Configuration

### 1. Backend Environment Setup

Create a `.env` file in the `Backend` directory with the following content:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB Connection
# Replace with your MongoDB connection string
MONGO_URI=mongodb://localhost:27017/student-match

# JWT Secret
# Generate a strong random string for production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Google OAuth Configuration
GOOGLE_CLIENT_ID=410799359983-3kvfg10evtjrumfgiuqh2pchalif6hb4.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
OAUTH_CALLBACK_BASE_URL=http://localhost:5000/auth
```

### 2. Google OAuth Credentials ✅

Your Google OAuth credentials are already configured:
- **Client ID**: `410799359983-3kvfg10evtjrumfgiuqh2pchalif6hb4.apps.googleusercontent.com`
- **Client Secret**: `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`

Simply copy these values into your `Backend/.env` file as shown above.

### 3. Configure OAuth Redirect URI ⚠️ CRITICAL

**This is the most common source of errors!** The redirect URI must match EXACTLY.

Make sure your Google OAuth credentials have this authorized redirect URI:
```
http://localhost:5000/auth/google/callback
```

To add it:
1. In Google Cloud Console, go to your OAuth 2.0 Client ID
2. Under **Authorized redirect URIs**, click **ADD URI**
3. Add **exactly** (copy-paste to avoid typos): `http://localhost:5000/auth/google/callback`
   - ✅ Must be `http://` (not `https://`)
   - ✅ Must be `localhost` (not `127.0.0.1`)
   - ✅ No trailing slash
   - ✅ Port must be `5000` (or match your PORT in .env)
4. Click **SAVE**

**If you get "redirect_uri_mismatch" error, see `OAUTH_FIX.md` for detailed troubleshooting.**

### 4. Frontend Environment (Optional)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

This is optional - the app will default to `http://localhost:5000` if not set.

### 5. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/student-match`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Replace `MONGO_URI` in `.env` with your Atlas connection string

### 6. Install Dependencies

#### Backend
```bash
cd Backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 7. Start the Application

#### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```

The backend should start on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173`

### 8. Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Sign in with Google"
3. Complete your profile (DSA rating, skills, tech stack)
4. Start searching for matches!

## Troubleshooting

### OAuth Errors
- **"redirect_uri_mismatch"**: Make sure the redirect URI in Google Console matches exactly: `http://localhost:5000/auth/google/callback`
- **"invalid_client"**: Check that your Client ID and Secret are correct in the `.env` file

### MongoDB Connection Errors
- Make sure MongoDB is running (if using local)
- Check your connection string format
- For Atlas, ensure your IP is whitelisted

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default: `http://localhost:5173`

## Security Notes

⚠️ **Important**: 
- Never commit your `.env` files to version control
- Use a strong, random `JWT_SECRET` in production (minimum 32 characters)
- Keep your Google OAuth Client Secret secure
- For production, use environment variables on your hosting platform

