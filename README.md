# 🎓 e-Learning Management System (eLMS)

A simple full-stack, role-based e-Learning Management System (eLMS) featuring customized dashboards for Students (track progress), Mentors (manage courses), and Admins (manage users). It uses a dynamic React frontend connected to a Node.js/Express API backend with a PostgreSQL database.

## 🚀 Features

- **Authentication:** Secure user registration and login.
- **Role-Based Access:** Distinct workflows for Students, Mentors, and Administrators.
- **Course Management:** Structured organization of learning modules and lessons.
- **Enrollment System:** Easy student enrollment into available courses.
- **Progress Tracking:** Real-time completion tracking for students.
- **Security:** Route protection on both frontend and backend layers.

## 📁 Project Structure

```text
├── client/      # Frontend React application (Vite)
├── server/      # Backend Node.js / Express API
└── database/    # PostgreSQL table queries
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sjamusb4/e-Learning-Management-System
cd e-Learning-Management-Systemt
```

### 2. Database Setup

1. Create a new database instance in PostgreSQL.
2. Execute the initialization script located at `database/allTables.sql` to generate the schema.

### 3. Environment Configuration

Create a `.env` file in both the `server` and `client` directories using the templates below:

#### Backend (`server/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
JWT_SECRET=your_jwt_secure_secret_key
```

#### Frontend (`client/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000
```

## ▶️ Running the Application

### Start the Backend Server

```bash
cd server
npm install
node index.js
```

### Start the Frontend Client

```bash
cd client
npm install
npm run dev
```
