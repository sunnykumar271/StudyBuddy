# 📚 StudyBuddy

> A full-stack real-time study group platform where students connect, collaborate, and learn together.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?logo=socket.io&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup, login, and protected routes
- 🧠 **Smart Match System** — Suggests study partners based on skills, interests, and subjects
- 👥 **Study Groups** — Create, browse, and join groups by topic
- 💬 **Real-time Chat** — Instant messaging inside groups powered by Socket.io
- 🔗 **Connection Requests** — Send, accept, and manage student connections
- 🌓 **Dark / Light Mode** — Toggle theme from the navbar
- 📋 **4-step Onboarding** — Set up your profile with skills, interests, and subjects

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS 3 |
| State Management | Redux Toolkit |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Real-time | Socket.io |
| Backend | Node.js + Express |
| Authentication | JWT + bcryptjs |
| Database | MongoDB Atlas (Mongoose) |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 📁 Project Structure

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
│   ├── .env.example          # Frontend env template
│   └── vercel.json           # Vercel SPA routing config
│
└── server/                   # Node.js + Express backend
    ├── config/db.js          # MongoDB Atlas connection
    ├── controllers/          # Route business logic
    ├── middlewares/          # JWT auth, error handler, validator
    ├── models/               # User, Group, Connection, Message
    ├── routes/               # Express routers
    ├── socket/index.js       # Socket.io event handlers
    ├── .env.example          # Backend env template
    └── Procfile              # Railway start command
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js v18+](https://nodejs.org)
- [MongoDB Atlas](https://www.mongodb.com/atlas) free account

### 1. Clone the repository

```bash
git clone https://github.com/sunnykumar271/StudyBuddy.git
cd StudyBuddy
```

### 2. Set up MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user under **Database Access**
3. Allow all IPs under **Network Access** → `0.0.0.0/0`
4. Copy your connection string from **Clusters → Connect → Connect your application**

### 3. Configure environment variables

**Backend** — create `server/.env` using `server/.env.example` as a template:

**Frontend** — create `client/.env` using `client/.env.example` as a template:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Install dependencies & run

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server
npm install
npm run dev
```

You should see:
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Atlas connected
🔌 Socket.io ready
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🧪 Testing the App

1. Go to `/signup` → create an account
2. Complete the 4-step onboarding (skills, interests, subjects)
3. View the Dashboard — see smart match suggestions
4. Visit `/users` → search students, send connection requests
5. Go to `/groups` → browse or create a study group
6. Open a group → send real-time chat messages
7. Open the same group in another browser tab → messages arrive instantly
8. Toggle dark/light mode with the sun/moon button in the navbar

### Health Check

```
GET http://localhost:5000/api/health
→ { "status": "OK", "message": "StudyBuddy API is running 🚀" }
```

---

## 📡 API Reference

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login → returns JWT |
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
| POST | `/api/groups/create` | ✅ | Create a group |
| GET | `/api/groups` | ✅ | All groups |
| GET | `/api/groups/mine` | ✅ | My groups |
| GET | `/api/groups/:id` | ✅ | Group details + messages |
| POST | `/api/groups/:id/join` | ✅ | Join a group |

### Connections
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/connections/request` | ✅ | Send connection request |
| POST | `/api/connections/accept` | ✅ | Accept request |
| POST | `/api/connections/reject` | ✅ | Reject request |
| GET | `/api/connections` | ✅ | My connections |
| GET | `/api/connections/pending` | ✅ | Pending requests |

---

## 🔌 Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `join-room` | Client → Server | `{ groupId, userId }` |
| `send-message` | Client → Server | `{ groupId, userId, content }` |
| `receive-message` | Server → Client | `{ _id, sender, content, createdAt }` |
| `user-joined` | Server → Client | `{ userName, userId }` |
| `leave-room` | Client → Server | `{ groupId }` |

---

## 🚨 Troubleshooting

| Issue | Fix |
|---|---|
| `MongoServerError: Authentication failed` | Check your Atlas username/password; URL-encode special characters |
| `CORS error` | Make sure `CLIENT_URL` in `server/.env` exactly matches your frontend URL |
| `Socket.io not connecting` | Ensure `VITE_SOCKET_URL` has no trailing slash |
| `404 on Vercel page refresh` | Already handled by `vercel.json` rewrites |
| `Cannot find module react-router-dom` | Run `npm install` inside the `client/` directory |

---

## ☁️ Deployment

| Service | Platform | Docs |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Set root directory to `client/`, add env vars |
| Backend | [Railway](https://railway.app) | Select `server/` directory, add env vars |

> After deploying both services, update `CLIENT_URL` in Railway to your Vercel URL to fix CORS in production.

---

## 👨‍💻 Author

**Sunny Kumar**
- GitHub: [@sunnykumar271](https://github.com/sunnykumar271)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
