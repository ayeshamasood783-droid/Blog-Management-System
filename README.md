# 📝  Astra Blog - Blog Management System

A secure, full-stack **Blog Management System** built with **Node.js, Express.js, MongoDB, HTML, CSS, and JavaScript**.

The system allows users to register and log in, create and manage blog posts, search published content, and read individual posts through a modern, responsive interface.

---

## ✨ Features

### 🔐 Authentication

* User registration
* Secure login
* Password hashing with bcrypt
* JWT-based authentication
* Protected routes
* Authentication rate limiting

### 📝 Blog Management

* Create blog posts
* View all posts
* Read individual posts
* Search posts
* Update posts
* Delete posts
* User-based post ownership

### 🛡️ Security

* Password hashing using `bcryptjs`
* JWT authentication
* Helmet security headers
* CORS configuration
* Authentication rate limiting
* Express input validation
* Request body size limits
* Environment variables for sensitive configuration
* `.env` excluded from GitHub

### 🎨 Frontend

* Modern premium interface
* Responsive design
* Animated/3D visual elements
* Smooth interactions
* Mobile-friendly layout
* Clean blog browsing experience

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcryptjs
* Helmet
* CORS
* Express Rate Limit
* Express Validator

### Development

* VS Code
* Nodemon
* Git
* GitHub

---

## ⚙️ Requirements

Before running the project, make sure you have:

* Node.js installed
* npm installed
* MongoDB installed locally **or** access to MongoDB Atlas
* Git installed

---

## 📝 Blog Flow

```text
Login
  ↓
Authenticated User
  ↓
Create Post
  ↓
MongoDB
  ↓
View / Search Posts
  ↓
Read Individual Post
  ↓
Update / Delete Own Post
```

---

## 🔌 API Overview

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Posts

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/api/posts`     | Get all posts       |
| GET    | `/api/posts/:id` | Get individual post |
| POST   | `/api/posts`     | Create a post       |
| PUT    | `/api/posts/:id` | Update a post       |
| DELETE | `/api/posts/:id` | Delete a post       |

> Exact endpoint behavior depends on the final route implementation.

---

## 🛡️ Security Approach

This project is designed with security in mind.

### Password Security

Passwords are never stored as plain text.

They are hashed before being stored in MongoDB using:

```text
bcryptjs
```

### Authentication

The application uses:

```text
JWT
```

for authenticated requests.

### HTTP Security

The application uses:

```text
Helmet
```

to add security-related HTTP headers.

### Rate Limiting

Authentication endpoints are protected with rate limiting to reduce brute-force login attempts.

### Environment Variables

Sensitive configuration such as:

```text
MONGO_URI
JWT_SECRET
```

is stored in `.env`.

The `.env` file is excluded from Git using `.gitignore`.

---

## 🔒 Environment Variables

Create your own `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Never commit real credentials or secrets to GitHub.

---

## 🧪 Testing Checklist

Before deployment, test:

* [ ] User registration
* [ ] User login
* [ ] Invalid login handling
* [ ] Logout
* [ ] Create post
* [ ] View posts
* [ ] Search posts
* [ ] Read individual post
* [ ] Edit post
* [ ] Delete post
* [ ] Unauthorized post access
* [ ] Invalid post ID
* [ ] Rate limiting
* [ ] Responsive design
* [ ] MongoDB connection

---

## 🌐 Deployment

The application can be deployed using free-tier services such as:

* **GitHub** — source code
* **Render** — Node.js/Express hosting
* **MongoDB Atlas** — cloud database

For production deployment, environment variables should be configured directly on the hosting platform rather than committing `.env` to the repository.

---

## 💡 Future Improvements

Possible future enhancements include:

* User profile pages
* Post categories
* Tags
* Comments
* Likes
* Image uploads
* Rich-text editor
* Admin dashboard
* Pagination
* Post drafts
* Featured posts
* Email verification
* Password reset
* Advanced search and filtering
* Role-based authorization
* Cloud image storage

---

## 📌 Project Purpose

This project was built to demonstrate practical full-stack development skills including:

* REST API development
* Authentication
* CRUD operations
* Database integration
* Frontend development
* Backend architecture
* API security
* MongoDB data management
* Deployment preparation

---

## 👩‍💻 Author

**Ayesha Masood**

Software Engineering Student & Web Developer

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is available for educational and portfolio purposes.
