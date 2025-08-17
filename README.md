# 📚 Course Management System

A **full-stack PERN-style application** built with **React + Node.js + Express + PostgreSQL** that provides a role-based course management platform.

* **Admins** can manage students, courses, and enrollments (full CRUD).
* **Students** can browse courses, enroll/unenroll, manage their profile, and view their enrolled courses.
* **Role-based JWT authentication** ensures secure access control.

---

## 🚀 Features

### 👨‍💻 Student

* Sign up / Login with JWT authentication.
* View available courses.
* Enroll in up to **5 courses**.
* Unenroll from courses.
* View list of enrolled courses.
* Manage profile (update name, email, password).

### 🛠️ Admin

* Secure login with admin role.
* **Courses Management**: Create, Read, Update, Delete courses.
* **Student Management**: View all students, create/edit student accounts.
* **Enrollment Management**: Manage all course enrollments.
* Dashboard with quick access to all entities.

---

## 🏗️ Tech Stack

### Frontend

* ⚛️ React
* 🌐 React Router DOM
* 🎨 Tailwind CSS + Flowbite React

### Backend

* 🟢 Node.js + Express.js
* 🐘 PostgreSQL with `pg`
* 🔐 JWT Authentication (`jsonwebtoken`)
* 🔑 Password hashing (`bcrypt`)
* ⚙️ Environment management (`dotenv`)

---

## 🗄️ Database Schema

```sql
-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'student')) NOT NULL
);

-- courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- enrollments
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔑 Authentication & Authorization

* **JWT-based authentication**:

  * Token is required for all protected routes.
  * Stored in `Authorization: Bearer <token>`.

* **Role-based authorization**:

  * Middleware `authorizeRoles('admin')` restricts routes to Admins.
  * Middleware `authorizeRoles('student')` restricts routes to Students.

---

## 📂 Project Structure

### Frontend (`/client`)

* `/pages/admin` → Admin dashboards & CRUD screens.
* `/pages/student` → Student dashboard, courses, profile, enrollments.
* `/components` → Shared layout, protected route guards (`AuthRequired`, `AdminRequired`, `StudentRequired`).

### Backend (`/server`)

* `/routes` → API routes (auth, courses, students, enrollments).
* `/controllers` → Business logic for routes.
* `/db` → Database connection (`pg` pool).
* `/utils` → Helper functions (validation, etc.).

---

## ⚡ API Endpoints

### Auth

* `POST /api/auth/signup` → Register new user.
* `POST /api/auth/login` → Authenticate & receive JWT.

### Admin

* `GET /api/admin/courses` → List courses.

* `POST /api/admin/courses` → Add course.

* `PUT /api/admin/courses/:id` → Update course.

* `DELETE /api/admin/courses/:id` → Delete course.

* `GET /api/admin/students` → List students.

* `POST /api/admin/students` → Add student.

* `PUT /api/admin/students/:id` → Update student.

* `DELETE /api/admin/students/:id` → Delete student.

* `GET /api/admin/enrollments` → List enrollments.

* `POST /api/admin/enrollments` → Add enrollment.

* `DELETE /api/admin/enrollments/:id` → Remove enrollment.

### Student

* `GET /api/student/courses` → Browse courses.
* `GET /api/student/enrollments` → List enrolled courses.
* `POST /api/student/enrollments` → Enroll in a course.
* `DELETE /api/student/enrollments/:id` → Unenroll.
* `GET /api/student/profile` → Get profile.
* `PUT /api/student/profile` → Update profile.

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js (>=16)
* PostgreSQL (>=13)

### Backend

```bash
cd Backend
npm install
cp .env.example .env   # configure DB + JWT_SECRET
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔮 Future Improvements

* Add **admin analytics dashboard** (e.g., enrollment stats).
* Support **pagination & filtering** for large datasets.
* Add **profile pictures** for students.
* Email verification & password reset flow.

