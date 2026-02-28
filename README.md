# 🔐 JWT Authentication Backend API

A secure backend authentication system built using **Node.js, Express, MongoDB, and JWT**.

This project implements user signup, login, password hashing, and protected routes using JSON Web Tokens.

---

## 🚀 Features

- User Signup with password confirmation
- Secure password hashing using bcrypt
- JWT-based authentication
- Protected routes middleware
- MongoDB database integration
- Environment variable configuration
- Clean MVC folder structure

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---

## 📂 Project Structure

```
jwt-auth-backend/
│
├── controller/
│   └── authController.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── model/
│   └── userModel.js
│
├── routes/
│   ├── authRoute.js
│   └── testRoutes.js
│
├── app.js
├── server.js
├── package.json
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Amritesh123-jpg/jwt-auth-backend.git
cd jwt-auth-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a config.env file

```
PORT=3000
DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=90d
```

### 4️⃣ Start the server

```bash
npm start
```

Server will run on:
```
http://localhost:3000
```

---

## 🔑 API Endpoints

### Signup
```
POST /auth/signup
```

### Login
```
POST /auth/login
```

### Protected Route Example
```
GET /api/test
```
Requires:
```
Authorization: Bearer <token>
```

---

## 🔐 Security Implementation

- Password hashing using bcrypt
- JWT token generation after login
- Token verification middleware
- Protected route access control
- Environment variable based secrets

---

## 📌 Future Improvements

- Role-based authorization (Admin/User)
- Refresh token mechanism
- Password reset feature
- API rate limiting
- Deployment to cloud platform

---

## 👨‍💻 Author

**Amritesh Raj**

GitHub: https://github.com/Amritesh123-jpg

---

## 📜 License

This project is open source and available under the MIT License.
