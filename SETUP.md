# StudyBuddy — Complete Setup Guide

> **Full-stack app:** React + Vite (frontend) · Node.js + Express (backend) · MongoDB Atlas · Socket.io · JWT Auth

---

## Project Structure

```
StudyBuddy/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Redux slices (auth, theme, group)
│   │   ├── hooks/            # Custom hooks (useAuth, useTheme, useSocket)
│   │   ├── layouts/          # Page layout wrappers
│   │   ├── pages/            # All 10 route-based pages
│   │   ├── services/         # Axios API service layer
│   │   ├── store/            # Redux store
│   │   └── utils/            # Helpers & constants
│   ├── .env                  # Dev env vars (edit before running)
│   ├── .env.example          # Production template
│   └── vercel.json           # Vercel deployment config
│
└── server/                   # Node.js + Express backend
    ├── config/db.js          # MongoDB Atlas connection
    ├── controllers/          # Business logic
    ├── middlewares/          # JWT auth, error handler, validator
    ├── models/               # User, Group, Connection, Message
    ├── routes/               # Express routers
    ├── socket/index.js       # Socket.io handlers
    ├── .env                  # Backend env vars (MUST fill in)
    ├── .env.example          # Env template
    ├── Procfile              # Railway start command
    └── railway.toml          # Railway deployment config
```

---

## Step 1 — MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new project → Build a free **M0** cluster (Free tier)
3. Choose a cloud provider and region
4. Go to **Database Access** → Add a new database user
   - Set username and password (save these!)
5. Go to **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`) for development
6. Go to **Clusters** → click **Connect** → **Connect your application**
7. connection string of mongoDb atlas

---

## Step 2 — Backend Setup

### Prerequisites
- Node.js v18+ installed ([nodejs.org](https://nodejs.org))

### Install & Run

```powershell
# Navigate to server directory
cd server

# All dependencies are already installed.
# If you need to reinstall:
npm install

# Start backend (development with auto-restart)
npm run dev

# OR for production
npm start
```

You should see:
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Atlas connected: cluster0.xxxxx.mongodb.net
🔌 Socket connected: <socket-id>
```

### Test the API
Open your browser and visit:
- `http://localhost:5000/api/health` — should return `{"status":"OK","message":"StudyBuddy API is running 🚀"}`

---

## Step 3 — Frontend Setup

```powershell
# Navigate to client directory
cd client

# All dependencies are already installed.
# If you need to reinstall:
npm install

# Start frontend dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Frontend .env
The `client/.env` file is already configured for local development:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Step 4 — Run Both Together

Open **two terminal windows**:

**Terminal 1 (Backend):**
```powershell
cd "c:\Users\sunny kumar\OneDrive\Desktop\StudyBuddy\server"
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd "c:\Users\sunny kumar\OneDrive\Desktop\StudyBuddy\client"
npm run dev
```

Access the app at: **http://localhost:5173**

---

## Step 5 — Test the Application

### Full User Flow
1. Go to `/signup` → create an account
2. Complete the 4-step onboarding (skills, interests, subjects)
3. View the Dashboard — see smart match suggestions
4. Visit `/users` → search students, send connection requests
5. Go to `/groups` → browse or create a group
6. Open a group → send real-time chat messages
7. Open the same group in another browser tab → see messages arrive instantly
8. Toggle dark/light mode using the sun/moon button in the navbar

### API Testing (optional)
You can test APIs using [Postman](https://www.postman.com) or [Insomnia](https://insomnia.rest):

| Endpoint | Method | Body |
|---|---|---|
| `/api/auth/signup` | POST | `{name, email, password, department}` |
| `/api/auth/login` | POST | `{email, password}` |
| `/api/auth/me` | GET | Bearer token required |
| `/api/users` | GET | Optional: `?search=react&department=CSE` |
| `/api/users/matches` | GET | Bearer token required |
| `/api/groups` | GET | Bearer token required |
| `/api/groups/create` | POST | `{name, description, tags[]}` |
| `/api/connections/request` | POST | `{receiverId}` |
| `/api/connections/accept` | POST | `{connectionId}` |

---


## API Reference

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login → JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

### Users
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/users` | ✅ | Get all users (filterable) |
| GET | `/api/users/matches` | ✅ | Smart match suggestions |
| GET | `/api/users/:id` | ✅ | Get user profile |
| PUT | `/api/users/edit-profile` | ✅ | Update profile |
| PUT | `/api/users/onboarding` | ✅ | Complete onboarding |

### Groups
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/groups/create` | ✅ | Create group |
| GET | `/api/groups` | ✅ | All groups |
| GET | `/api/groups/mine` | ✅ | My groups |
| GET | `/api/groups/:id` | ✅ | Group + messages |
| POST | `/api/groups/:id/join` | ✅ | Join group |

### Connections
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/connections/request` | ✅ | Send request |
| POST | `/api/connections/accept` | ✅ | Accept request |
| POST | `/api/connections/reject` | ✅ | Reject request |
| GET | `/api/connections` | ✅ | My connections |
| GET | `/api/connections/pending` | ✅ | Pending requests |

---

## Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `join-room` | Client → Server | `{ groupId, userId }` |
| `send-message` | Client → Server | `{ groupId, userId, content }` |
| `receive-message` | Server → Client | `{ _id, sender, content, createdAt }` |
| `user-joined` | Server → Client | `{ userName, userId }` |
| `leave-room` | Client → Server | `{ groupId }` |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `MongoServerError: Authentication failed` | Check username/password in Atlas URI, ensure no special chars are URL-encoded |
| `CORS error` | Make sure `CLIENT_URL` in `server/.env` exactly matches your frontend URL |
| `Socket.io not connecting` | Ensure `VITE_SOCKET_URL` points to backend without trailing slash |
| `404 on Vercel refresh` | Already handled by `vercel.json` rewrites |
| `Cannot find module react-router-dom` | Run `npm install` inside the `client/` directory |

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 |
| State | Redux Toolkit |
| Routing | React Router v6 |
| HTTP | Axios |
| Real-time | Socket.io |
| Backend | Node.js + Express |
| Auth | JWT + bcryptjs |
| Database | MongoDB Atlas (Mongoose) |

