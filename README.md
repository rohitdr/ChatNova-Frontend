
# 💬 ChatNova Frontend

Frontend client for **ChatNova – Real-Time Chat Application** built using modern React ecosystem and real-time technologies.


## 🚀 Overview

ChatNova is a real-time messaging platform supporting instant chat, online presence, message status tracking, and secure authentication.

This repository contains the **frontend (client-side)** implementation.


## ⚙️ Tech Stack

* ⚛️ React (Vite)
* 🔌 Socket.IO Client
* 📡 React Query (Server State Management)
* ⚡ React Virtuoso (Message List Virtualization)
* 📶 Firebase Cloud Messaging (Push Notifications)
* 📊 React Top Loading Bar (Progress UI)
* 🌐 Axios (API Requests)
* 🎨 Tailwind CSS
* 🔐 JWT Authentication (Access + Refresh Token Flow)


## ✨ Features

* ⚡ Real-time messaging with Socket.IO
* 🟢 Online/offline user presence
* 💬 Message status (sent, delivered, seen)
* 🔔 Unread message count tracking per conversation
* 👍 Message reactions (like, emoji interactions)
* ↩️ Reply to specific messages (threaded context)
* 👥 Group chat support (multi-user conversations)
* 🛠️ Group management (create, update, manage participants)
* 🧑‍💼 Admin roles in groups for moderation and control
* ⌨️ Typing indicators
* 🔄 Optimistic UI updates
* 📦 Virtualized message list for performance (Virtuoso)
* 🔔 Push notifications (Firebase)
* 🔐 Protected routes with JWT authentication
* 📱 Fully responsive UI


## 📁 Folder Structure

```
ChatNova-Frontend/
│
├── public/ # Static files (index.html, icons, etc.)
│
├── src/
│ ├── assets/            # Images, icons, media files
│ ├── components/        # Reusable UI components
│   ├── hooks/           # Custom hooks (your case)
│ ├── context/           # Global state (Auth, Socket)
│ ├── hooks/             # Custom React hooks
│ ├── api/               # Axios API calls & services
│ ├── App.jsx            # Main app component
│ ├── main.jsx           # Entry point
│
├── .env # Environment variables
├── package.json # Dependencies & scripts
├── vite.config.js # Vite configuration
```


## 🔧 Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_API=your_backend_api_url
VITE_SOCKET=your_socket_server_url

VITE_UPLOAD_PRESET=your_cloudinary_upload_preset
VITE_DATABASE_NAME=your_database_name

VITE_VAPIEDKEY=your_firebase_vapid_key
```

### 📌 Description

* **VITE_API** → Backend REST API base URL
* **VITE_SOCKET** → Socket.IO server URL
* **VITE_UPLOAD_PRESET** → Cloudinary upload preset for media uploads
* **VITE_DATABASE_NAME** → Database reference name (used for config)
* **VITE_VAPIEDKEY** → Firebase VAPID key for push notifications

## ▶️ Getting Started

### 1. Clone repo

```
git clone https://github.com/rohitdr/ChatNova-Frontend.git
cd ChatNova-Frontend
```

### 2. Install dependencies

```
npm install
```

### 3. Run development server

```
npm run dev
```


## 🔗 Backend Repository


👉 https://github.com/rohitdr/ChatNova-Backend.git


## 🎥 Demo

[![Watch Demo](https://res.cloudinary.com/do2twyxai/image/upload/v1776421201/Screenshot_242_e87la4.png)](https://youtu.be/UGOtACSJBls)

---

## 📸 Screenshots

### 💬 Chat UI

![Chat UI](https://res.cloudinary.com/do2twyxai/image/upload/v1776486309/ChatUi_b4nbfo.png)

### 🟢 Online Presence

![Online Presence](https://res.cloudinary.com/do2twyxai/image/upload/v1776486305/OnlinePresence_c8qxut.png)

### 👥 Group Chat

![Group Chat](https://res.cloudinary.com/do2twyxai/image/upload/v1776486307/GroupChat_aturwi.png)

### 👍 Message Status & Reactions

![Message Status & Reactions](https://res.cloudinary.com/do2twyxai/image/upload/v1776486308/Reaction_Status_qs5lef.png)


## 🧠 Key Concepts Used

* Event-driven architecture (Socket.IO)
* Virtualized rendering for performance
* Optimistic UI updates
* Real-time state synchronization
* JWT authentication with refresh flow
* Push notification system (Firebase)


## 📌 Notes

* Backend must be running before frontend
* Ensure correct socket and API URLs
* Firebase config required for notifications


## 👨‍💻 Author

Rohit Kumar


## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
