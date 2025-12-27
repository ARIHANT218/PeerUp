# Student Preference Matching & Collaboration Platform

A full-stack MERN application that helps students find and collaborate with peers having similar academic preferences, including DSA proficiency, technical skills, and tech stack.

## 🎯 Features

### Phase 1 - Core Matching (✅ Complete)
- **Google OAuth Authentication** - Secure login via Google
- **User Profiles** - DSA rating, skills, and tech stack
- **Explainable Matching Algorithm** - Transparent scoring based on:
  - Skill overlap (5 points per matching skill)
  - Tech stack match (3 points)
  - DSA rating proximity (penalty-based)
- **Optional Search Filters** - All search fields are optional
- **Modern Pink-Purple UI** - Beautiful, modern SaaS-inspired design
- **Long Scrollable Dashboard** - Stats, hero section, and informational content

### Phase 2 - Groups (✅ Complete)
- **Skill-based Group Creation** - Create groups with DSA range, tech stack, and required skills
- **Capacity Management** - Set group capacity (2-50 members)
- **Join/Leave Functionality** - Easy group membership management
- **Status Indicators** - OPEN, LOCKED, and FULL status badges
- **Group Details Page** - View members, requirements, and group information
- **Creator Controls** - Group creators can delete groups

### Phase 3 - Real-time Chat (✅ Complete)
- **Socket.IO Integration** - Real-time messaging with Socket.IO
- **Group Chat Rooms** - Automatic chat room creation for groups
- **Persistent Messages** - Messages saved to MongoDB
- **Live Updates** - Instant message delivery to all group members
- **Message History** - View past messages when joining a room

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM
- Socket.IO Client (Real-time communication)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (Google OAuth)
- JWT Authentication
- Socket.IO (Real-time communication)

## 📦 Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `Backend` directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/student-match
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTH_CALLBACK_BASE_URL=http://localhost:5000/auth
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (optional):
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

## 🔐 Google OAuth Setup

Your Google OAuth credentials are configured:
- **Client ID**: `410799359983-3kvfg10evtjrumfgiuqh2pchalif6hb4.apps.googleusercontent.com`
- **Client Secret**: `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`

**Important:** Make sure to:
1. Add these credentials to your `Backend/.env` file
2. Set the authorized redirect URI in Google Cloud Console: `http://localhost:5000/auth/google/callback`

**See `SETUP.md` for detailed configuration instructions.**

## 🚀 Usage

1. Start MongoDB (if running locally)
2. Start the backend server (`npm run dev` in `Backend/`)
3. Start the frontend server (`npm run dev` in `frontend/`)
4. Navigate to `http://localhost:5173`
5. Sign in with Google
6. Complete your profile (DSA rating, skills, tech stack)
7. Search for matches using optional filters

## 📁 Project Structure

```
Student_project/
├── Backend/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── matchController.js
│   │   ├── statsController.js
│   │   ├── user.controller.js
│   │   ├── groupController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Group.js
│   │   ├── ChatRoom.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── match.routes.js
│   │   ├── stats.routes.js
│   │   ├── user.routes.js
│   │   ├── group.routes.js
│   │   └── chat.routes.js
│   ├── utils/
│   │   └── matchAlgo.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MatchCard.jsx
│   │   │   ├── GroupCard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── GroupDetails.jsx
│   │   │   └── Chat.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🎨 UI Theme

The application uses a pink-purple gradient theme:
- Primary gradient: `from-pink-500 via-purple-500 to-indigo-500`
- Light backgrounds: `bg-pink-50`, `bg-purple-50`
- Cards: `bg-white` with soft shadows
- Headings: `text-purple-700`
- Primary buttons: `bg-pink-500 hover:bg-pink-600`

## 🚀 New Features

### Groups
1. Navigate to `/groups` to view all available groups
2. Click "Create Group" to create a new skill-based group
3. Set requirements: DSA rating range, tech stack, required skills
4. Join groups that match your profile
5. View group details and members

### Real-time Chat
1. Join a group to access its chat room
2. Click "Open Chat" from the group details page
3. Send messages in real-time
4. All group members receive messages instantly
5. Message history is preserved

## 📦 Installation Updates

### Backend
After cloning, install the new dependency:
```bash
cd Backend
npm install socket.io
```

### Frontend
After cloning, install the new dependency:
```bash
cd frontend
npm install socket.io-client
```

## 📝 License

This project is open source and available under the MIT License.

