# 🔐 JWT Authentication & Role-Based Authorization API

A production-ready authentication and authorization backend built using **Node.js, Express, MongoDB, and JSON Web Tokens (JWT)**.

This project implements secure user authentication, role-based access control (RBAC), protected routes, and secure password management following industry best practices.

---

## 🌐 Live API

**Base URL:**

https://jwt-auth-backend-58ws.onrender.com

---

## 🚀 Features

- User Signup with validation
- Secure password hashing using bcrypt
- JWT-based stateless authentication
- Role-Based Access Control (Admin/User)
- Middleware-based protected routes
- Admin-only routes (view & delete users)
- User profile update (safe field filtering)
- Secure password update (with current password verification)
- Self account deletion
- MongoDB Atlas integration
- Environment variable configuration
- Clean MVC-based architecture
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
│   ├── authController.js
│   └── userController.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── model/
│   └── userModel.js
│
├── routes/
│   ├── authRoute.js
│   ├── userRoute.js
│   └── testRoutes.js
│
├── utils/
│   └── signToken.js
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

# 🔑 API Endpoints

---

## 🟢 Authentication Routes

### Signup

**POST** `/auth/signup`

```json
{
  "name": "Amrit",
  "email": "amrit@test.com",
  "password": "12345678",
  "passwordConfirm": "12345678"
}
```

---

### Login

**POST** `/auth/login`

```json
{
  "email": "amrit@test.com",
  "password": "12345678"
}
```

Returns a JWT token for authenticated access.

---

## 🔐 Protected Route Example

**GET** `/test`

Requires header:

```
Authorization: Bearer <your_token>
```

---

# 👤 User Routes (Logged-in Users)

All routes require authentication.

---

### Get Own Profile

**GET** `/users/me`

---

### Update Profile

**PATCH** `/users/update-me`

Allowed fields:
- name
- email

---

### Update Password

**PATCH** `/users/update-password`

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "passwordConfirm": "newpassword"
}
```

✔ Verifies current password  
✔ Hashes new password  
✔ Generates new JWT  

---

### Delete Own Account

**DELETE** `/users/delete-me`

---

# 👑 Admin Routes (Admin Only)

Requires:
- Authentication
- Role: `admin`

---

### Get All Users

**GET** `/users`

Returns all users with role `user`.

---

### Delete Any User

**DELETE** `/users/:id`

Allows admin to remove any user account.

---

# 🔐 Security Implementation

- Password hashing using bcrypt (one-way encryption)
- JWT token generation with role embedded
- Middleware-based token verification
- Role-based authorization middleware
- Field filtering to prevent privilege escalation
- Secure password update flow
- Stateless authentication architecture
- Environment-based secret configuration

---

# 🧠 Architecture Overview

- MVC folder structure
- Stateless JWT authentication
- Role-Based Access Control (RBAC)
- Middleware-based request interception
- MongoDB document modeling using Mongoose
- Utility-based token generation
- Production-ready environment management

---

# 📚 What I Learned

- Designing secure authentication systems
- Implementing Role-Based Access Control (RBAC)
- JWT lifecycle management
- Secure password handling best practices
- Middleware design patterns in Express
- MongoDB schema modeling
- Production deployment workflow (GitHub → Render)
- Handling Git merge conflicts professionally

---

# 🚀 Future Improvements

- Forgot password (email-based reset system)
- Refresh token implementation
- Token invalidation after password change
- API rate limiting
- Logging & monitoring integration
- Unit & integration testing

---

# 👨‍💻 Author

**Amritesh Raj**

GitHub:  
https://github.com/Amritesh123-jpg

---

# 📜 License

This project is licensed under the MIT License.
