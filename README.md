# Project & Task Management System

A full-stack application for managing projects and tasks, built as part of a technical assignment. This system features secure JWT authentication, a React frontend with a clean UI, and a NestJS backend powered by MySQL.

##  Tech Stack

**Frontend:**
*   React 18 (Vite)
*   Tailwind CSS (Styling)
*   Lucide React (Icons)
*   React Router DOM
*   Context API (State Management)
*   Axios

**Backend:**
*   NestJS (Node.js Framework)
*   Prisma ORM
*   MySQL (Database)
*   Passport JWT (Authentication)

---

## 🚀 Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MySQL Server running locally

### 1. Backend Setup (NestJS)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` root and configure your database connection:
    ```env
    # backend/.env
    DATABASE_URL="mysql://root:@localhost:3306/tms"
    JWT_SECRET="SUPER_SECRET_KEY_123"
    ```
    *(Note: The database name is `tms`. If your local MySQL has a password, add it after `root:` like `root:yourpassword@...`)*

4.  Run database migrations to create tables:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Seed the database** (Crucial for Login):
    This creates the default Admin user and demo data.
    ```bash
    npx prisma db seed
    ```

6.  Start the backend server:
    ```bash
    npm run start:dev
    ```
    The API will run at `http://localhost:3000`.

### 2. Frontend Setup (React)

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The UI will run at `http://localhost:5173` (or similar).

---

##  Login Credentials (Seeded)

Use the following credentials to log in (created via the seed script):

*   **Email:** `admin@gmail.com`
*   **Password:** `admin@123`

*(Alternative user from seed: `abc@gmail.com` / `12345`)*

---

## 📡 API Endpoints Summary

### Authentication
*   `POST /auth/login` - Authenticate user and return JWT.
*   `POST /auth/register` - Register a new user.

### Projects (Protected)
*   `GET /projects` - List all projects.
*   `POST /projects` - Create a new project.
*   `PATCH /projects/:id` - Update a project.
*   `DELETE /projects/:id` - Delete a project.
*   `GET /projects/:id/tasks` - Get all tasks for a specific project.
*   `GET /projects/:id/users` - Get users assigned to a project.

### Tasks (Protected)
*   `POST /tasks` - Create a new task.
*   `PATCH /tasks/:id` - Update a task (status, priority, etc.).
*   `DELETE /tasks/:id` - Delete a task.

---

##  Known Limitations

1.  **Token Expiry:** The JWT Access Token is set to expire in 1 hour. There is currently no "Refresh Token" mechanism implemented. If the token expires, the user must log out and log back in.
2.  **Local Database:** The project relies on a local MySQL instance; it is not deployed to the cloud.
3.  **Role Management:** While the database supports roles (Admin/User), the UI currently treats the logged-in user as an Admin with full access.
4.  **Error Handling:** Basic error handling is implemented via Toast notifications, but complex network failures might need a page refresh.

---

##  Running Tests

To run the unit tests included in the repository:

**Frontend:**
```bash
cd frontend
npm test