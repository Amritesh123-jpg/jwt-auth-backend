# 🔐 JWT Authentication Backend API

A production-ready authentication system built using **Node.js, Express, MongoDB, and JSON Web Tokens (JWT)**.

This backend implements secure user authentication with password hashing, token-based authorization, and protected route access control.

---

## 🌐 Live API

**Base URL:**

https://jwt-auth-backend-58ws.onrender.com

---

## 🚀 Features

- User Signup with password confirmation validation  
- Secure password hashing using bcrypt  
- JWT-based stateless authentication  
- Protected routes using middleware  
- MongoDB Atlas integration  
- Environment variable configuration  
- MVC-based folder structure  
- Production deployment on Render  

---

## 🛠 Tech Stack

- **Node.js** – Runtime environment  
- **Express.js** – Backend framework  
- **MongoDB Atlas** – Cloud database  
- **Mongoose** – ODM  
- **jsonwebtoken (JWT)** – Authentication  
- **bcryptjs** – Password hashing  
- **dotenv** – Environment variable management  

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

### 3️⃣ Create a `config.env` file

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

Server runs on:

```
http://localhost:3000
```

---

## 🔑 API Endpoints

### 🟢 Signup

**POST** `/auth/signup`

#### Request Body:

```json
{
  "name": "Amrit",
  "email": "amrit@test.com",
  "password": "12345678",
  "passwordConfirm": "12345678"
}
```

#### Response:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔵 Login

**POST** `/auth/login`

#### Request Body:

```json
{
  "email": "amrit@test.com",
  "password": "12345678"
}
```

#### Response:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔐 Protected Route Example

**GET** `/test`

Requires header:

```
Authorization: Bearer <your_token>
```

#### Response:

```json
{
  "status": "success",
  "message": "Protected route working",
  "user": {
    "_id": "...",
    "name": "Amrit",
    "email": "amrit@test.com"
  }
}
```

---

## 🔐 Security Implementation

- Password hashing using bcrypt (one-way encryption)
- JWT token generation on successful login
- Middleware-based token verification
- Protected route authorization
- Environment-based secret configuration
- Stateless authentication architecture

---

## 🧠 Architecture Overview

- MVC folder structure
- Stateless JWT authentication
- Middleware-based request interception
- MongoDB document modeling using Mongoose
- Production-ready environment variable management

---

## 📚 What I Learned

- Building secure authentication systems  
- JWT lifecycle and token verification  
- Password hashing best practices  
- Middleware design pattern in Express  
- MongoDB Atlas integration  
- Production deployment workflow (GitHub → Render)  

---

## 🚀 Future Improvements

- Role-based authorization (Admin/User)
- Refresh token implementation
- Password reset functionality
- API rate limiting
- Logging & monitoring integration
- Unit & integration testing

---

## 👨‍💻 Author

**Amritesh Raj**

GitHub:  
https://github.com/Amritesh123-jpg

---

## 📜 License

This project is licensed under the MIT License.
