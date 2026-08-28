# E-commerce Secured REST API

A hardened, production-ready Node.js & Express REST API for an e-commerce platform connected to a Neon PostgreSQL database. Built with comprehensive security controls including JWT authentication, Role-Based Access Control (RBAC), IDOR protection, parameterized queries, centralized validation, and rate limiting.

---

## 🛡️ Security Features & Implementations

* **Authentication & Password Hashing**: User authentication using JSON Web Tokens (JWT) and passwords securely hashed with `bcryptjs` (salt rounds: 12).
* **Role-Based Access Control (RBAC)**: Enforced segregation of duties between `customer` and `admin` roles, returning `403 Forbidden` for unauthorized actions.
* **IDOR Prevention**: Protected horizontal access to user profiles and resources by validating ownership against authenticated tokens (`req.user.id`).
* **Input Validation & Sanitization**: Comprehensive payload validation using `express-validator` across all endpoints to block malformed data and mitigate injection risks.
* **SQL Injection Prevention**: All database interactions use strictly parameterized queries (`$1`, `$2`, etc.).
* **Security Headers**: `helmet` enabled to enforce standard HTTP response headers (XSS Filter, MIME-sniffing prevention, Frameguard).
* **CORS & Secrets Management**: Strict CORS origin whitelisting with credentials support; environment variables managed via `.env` and isolated from version control.
* **Brute-Force & Rate Limiting**: Global API throttling and a strict limiter on authentication routes (`POST /api/auth/login`) returning `429 Too Many Requests`.
* **Safe Error Handling & Logging**: Centralized error and 404 handlers that sanitize production responses, hiding stack traces, database schemas, and passwords.

---

## 🛠️ Tech Stack

* **Runtime & Framework**: Node.js, Express.js
* **Database**: PostgreSQL (Neon Serverless)
* **Database Driver**: `pg` (node-postgres)
* **Security & Auth**: `jsonwebtoken`, `bcryptjs`, `helmet`, `express-rate-limit`, `express-validator`, `cors`
* **Development**: `dotenv`, `nodemon`

---

## 📁 Project Structure

```text
ecommerce-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoriesController.js
│   │   ├── productsController.js
│   │   └── usersController.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoriesRoutes.js
│   │   ├── productsRoutes.js
│   │   └── usersRoutes.js
│   ├── validators/
│   │   └── schemaValidators.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── ecommerce_security_tests.postman_collection.json
├── package.json
├── README.md
├── SECURITY_REVIEW.md
└── Web_Security_Testing_Report.docx

🚀 Getting Started
1. Prerequisites
Node.js (v18 or higher recommended)

npm (Node Package Manager)

Neon PostgreSQL account/database instance

2. Installation
Clone the repository and install the project dependencies:

Bash
git clone <YOUR_REPOSITORY_URL>
cd ecommerce-api
npm install
3. Environment Variables Setup
Create a .env file in the root directory by copying .env.example:

Bash
cp .env.example .env
Update .env with your actual credentials:

مقتطف الرمز
PORT=3000
DATABASE_URL=postgresql://your_db_user:your_db_password@your_neon_host/neondb?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
4. Running the Application
Development Mode (with auto-reload):

Bash
npm run dev
Production Mode:

Bash
npm start
🧪 Testing & Postman Collection
Import ecommerce_security_tests.postman_collection.json into Postman.

Execute the 15 mandatory test cases in sequential order covering:

Registration & Login flows (201, 200, 401, 409)

Protected Route access & Invalid Tokens (401)

Role-Based Access Control on Product creation (403 vs 201)

Input validation for negative prices and invalid emails (400)

IDOR prevention across accounts (403)

Rate limiting thresholds on login endpoints (429)

Centralized 404 responses and password hash omission checks (200)

Helmet security header verification