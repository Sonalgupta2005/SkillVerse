# SkillVerse - Peer-to-Peer Skill Sharing Platform

SkillVerse is a modern, full-stack skill exchange platform that empowers users to connect, learn, and grow by sharing their unique talents. Whether you're a developer looking to learn guitar or a designer wanting to master French, SkillVerse makes skill-sharing simple, real-time, and rewarding.

---

## 🚀 Key Features

### 🔍 Discovery & Intelligent Search
- **Multi-Category Filtering**: Browse profiles by specific interest categories like Technology, Music, Languages, and more.
- **Advanced Search**: Real-time keyword search for skills, names, and locations.
- **Pulsing Activity Indicators**: Visual feedback when active filters are narrowing your results.

### 🤝 Seamless Skill Swapping
- **Request System**: Send tailored skill swap requests directly to other users.
- **Accept/Reject/Cancel Workflow**: Intuitive management of pending and active exchanges.
- **Dynamic Status Badges**: Stay informed with clear status indicators throughout the app.

### 💬 Real-Time Interaction
- **Instant Messaging**: Powered by Socket.io for immediate, live conversation once a swap is accepted.
- **Smart Chat Layout**: Intuitive sender-based message alignment and theme-consistent styling.
- **Notification-Free UX**: Seamlessly transitions from browsing to chatting without losing context.

### 👤 Profile & Privacy
- **Customizable Profiles**: Showcase your skills offered and skills you're eager to learn.
- **Visibility Toggles**: Complete control over whether your profile is public or restricted.
- **Secure Authentication**: Robust JWT-based auth with HTTP-only cookies for enhanced security.

### 🌓 Premium Experience
- **Fully Responsive**: Optimized for every device—from mobile phones to wide desktops.
- **Mobile Hamburger Menu**: Elegant side-navigation for effortless browsing on the go.
- **Dark/Light Mode**: Full support for both themes with sophisticated visual tokens.

---

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite-powered)
- **Tailwind CSS** (Styling & Design System)
- **shadcn/ui** (Premium UI Components)
- **Framer Motion** (Subtle Micro-animations)
- **React Query** (Efficient Data Fetching)
- **Lucide Icons** (Consistent iconography)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (NoSQL Database)
- **Socket.io** (WebSockets for Real-time)
- **JWT & Cookie-Parser** (Secure Session Management)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB account or local installation

### 1. Clone the repository
```bash
git clone https://github.com/Sonalgupta2005/SkillVerse.git
cd SkillVerse
```

### 2. Setup Server
```bash
cd server
npm install
```
- Create a `.env` file in the `/server` directory and add:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```
- Start the server:
```bash
npm start
```

### 3. Setup Client
```bash
cd ../client
npm install
```
- Create a `.env` file in the `/client` directory and add:
```env
VITE_API_URL=http://localhost:5000
```
- Start the development server:
```bash
npm run dev
```

---

## 📂 Project Structure
```bash
SkillVerse/
├── client/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components (Browse, MySwaps, Home)
│   │   └── services/    # API and Auth services
├── server/           # Express backend
│   ├── controllers/  # Business logic
│   ├── models/       # Database schemas
│   └── routes/       # API endpoints
└── README.md
```

---

## 🛤 Future Roadmap
- [ ] **Video Mentorship**: Integrated video calls for live sessions.
- [ ] **Reviews & Ratings**: Formal feedback system after completed swaps.
- [ ] **In-App Notifications**: Real-time alerts for new swap requests and messages.
- [ ] **Skill Progression Tracking**: Gamified learning milestones.

---
