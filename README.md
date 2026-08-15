# E-commerce REST API

A scalable Node.js & Express REST API for an e-commerce platform using Neon PostgreSQL database.

## 🚀 Features

- **Products Management**: Get, Create, Update, and Soft Delete (Deactivate) products.
- **Categories Management**: Get, Create, and Update product categories.
- **Users Management**: Get, Create, and Toggle active status for users.
- **Security & Integrity**: Parameterized queries to prevent SQL Injection, inputs validation, and global error handling.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **Database Client**: `pg` (node-postgres)
- **Utilities**: `dotenv`, `cors`, `nodemon`

## 📁 Project Structure

```text
ecommerce-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── categoriesController.js
│   │   ├── productsController.js
│   │   └── usersController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── categoriesRoutes.js
│   │   ├── productsRoutes.js
│   │   └── usersRoutes.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md