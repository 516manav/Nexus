# 💬 Nexus

A real-time chat web app where users can message any registered user, build friendships, and create group chats — all with secure authentication and real-time updates.

## 🚀 Features

- 🔍 Discover and message any registered user in real time
- 👤 Add users as friends based on conversations
- 👥 Create and manage group chats with multiple users
- 🔒 Secure login with Google OAuth 2.0 or email/password
- 📡 Real-time messaging powered by Socket.io
- 🍪 Secure session management using HTTP-only cookies

## 🛠 Tech Stack

**Frontend**:
- React.js  
- HTML/CSS  
- Axios  

**Backend**:
- Node.js  
- Express.js  
- Socket.io  
- Passport.js (OAuth 2.0 & local)  
- Bcrypt (password hashing)  

**Database**:
- PostgreSQL  

## 📂 Folder Structure

<pre> nexus/ 
  ├── backend/ # Backend logic (Express.js, Socket.io, Auth) 
    ├── config.js  
    ├── db.js 
    ├── index.js 
    ├── middlewares.js 
    ├── passport-setup.js 
    ├── routes.js  
    ├── socket.js 
    ├── package.json 
    └── ... 
  ├── frontend/ # Frontend built with React 
    ├── public/ 
      ├── index.html 
      └── nexus.ico 
    ├── src/ 
      ├── components/ # Reusable React components 
      ├── resources/ # Assets and styles 
      ├── index.css 
      └── index.js 
    ├── package.json 
    └── README.md </pre>


## 🧪 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nexus.git
2. Set up environment variables:

    - Create .env files in both /backend and /frontend if needed.
    - Add your Google OAuth credentials and PostgreSQL connection details.

3. Install dependencies:
   ```bash
    cd backend && npm install
    cd ../frontend && npm install

4. Start the app:
   ```bash
    # In one terminal
    cd backend
    npm run dev

    # In another terminal
    cd frontend
    npm start

## ✍️ Author
Manav Singh
