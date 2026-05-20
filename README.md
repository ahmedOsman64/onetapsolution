<div align="center">
  <img src="./frontend/public/assets/images/logo.png" alt="OneTap Solution Logo" width="180" />
  
  <h1>OneTap Solution 🚀</h1>
  <p><b>Premium Digital Services & Portfolio Platform</b></p>
  
  <p>
    <img src="https://img.shields.io/badge/License-MIT-04C244?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Version-1.1.0-04C244?style=for-the-badge" alt="Version" />
    <img src="https://img.shields.io/badge/React-18.0-04C244?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Flask-3.0-04C244?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  </p>
  <br>
</div>

**OneTap Solution** is a premium, high-fidelity web platform designed to elevate digital service agencies. It features a stunning, glassmorphic public-facing portfolio and a secure, comprehensive Administrative Dashboard for managing content, projects, and client interactions in real-time.

---

## 🌟 Key Features

### Public Frontend
- **Modern UI/UX**: Premium dark-mode aesthetic utilizing glassmorphism, dynamic micro-animations, and fully responsive layouts.
- **Dynamic Content**: Real-time fetching of Services, Portfolios, Testimonials, and News directly from a robust Python/PostgreSQL (Supabase) backend.
- **Interactive Elements**: Auto-playing carousels, animated page transitions, and engaging call-to-action sections.

### Admin Dashboard (`/admin`)
- **Content Management System (CMS)**: Intuitive interface for managing Services, Projects, Testimonials, and News articles.
- **Seamless Media Handling**: Built-in support for high-quality image uploads and processing.
- **Advanced Role-Based Access Control (RBAC)**: Fine-grained permissions (e.g. `view_users`, `edit_project`, `manage_settings`) dynamically retrieved from the database, protecting both API endpoints and frontend views.
- **SuperAdmin Protection Rules**: Built-in safety guards preventing SuperAdmins from self-blocking, self-deleting, or losing admin rights, while retaining full capability to manage other team members.
- **Real-Time Synchronization**: Instant data propagation between the admin panel and the public interface.

---

## 🛠 Tech Stack

### Frontend Architecture
- **Framework**: React 18 (Vite-based development server, located in `/frontend`)
- **Styling**: Vanilla CSS with modern custom properties, glassmorphism, and responsive breakpoints
- **Routing**: React Router DOM with secure Route Guards
- **UI Components**: Lucide React & Framer Motion for smooth micro-animations

### Backend Architecture
- **Server**: Python / Flask (Modular Controller-Service-Repository pattern, located in `/backend`)
- **ORM & Database**: SQLAlchemy connecting to PostgreSQL (via psycopg2)
- **Security**: JWT tokens, bcrypt password hashing, CORS, Flask-Limiter, and Talisman protection headers
- **PostgreSQL Compatibility**: All queries utilize standard boolean parameters to prevent PostgreSQL database type mismatch errors.

---

## 🛡 Security & Role System

The platform enforces a multi-tier authorization hierarchy:

| Role | Slug | Description | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin` | System owner. Unblockable, undeletable, holds all permissions. | `all` |
| **Admin** | `admin` | Full management access, can manage users, projects, and settings. | User, Project, Content management |
| **Editor** | `editor` | Content publisher. Can create and edit projects/news, but cannot manage users. | Content management, no user access |
| **Employee** | `employee` | Content viewer. Access to analytics dashboard and viewing of contents. | Read-only access |
| **Viewer** | `viewer` | Read-only viewer of analytics metrics. | Read-only dashboard |

---

## ⚙️ Local Development Setup

### 1. Database Configuration (Supabase / PostgreSQL)
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy the queries from [database/schema.sql](file:///d:/OTS/OTS/database/schema.sql), [database/triggers.sql](file:///d:/OTS/OTS/database/triggers.sql), and [database/policies.sql](file:///d:/OTS/OTS/database/policies.sql) and execute them in the **SQL Editor** of the Supabase dashboard.
3. If you want to load mock data, copy the queries from [database/seed.sql](file:///d:/OTS/OTS/database/seed.sql) and run them in the SQL Editor.

### 2. Backend Initialization (Flask)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up a Python virtual environment:
   ```bash
   python -m venv venv
   ```
   - Windows: `venv\Scripts\activate`
   - Unix/macOS: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables. Create a `.env` file in the `backend` directory:
   ```env
   FLASK_ENV=development
   FLASK_DEBUG=1
   SECRET_KEY=<generate_a_secure_random_string_here>
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```
5. Launch the backend server (default port 5000):
   ```bash
   python app.py
   ```

### 3. Frontend Initialization (React/Vite)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Administrative Access

To initialize the Super Admin account for your local environment, run the provided seeding script:
```bash
cd backend
venv\Scripts\python.exe -c "import sys; sys.path.append('backend'); from app import app; from database.db import db; from services.auth_service import AuthService; app.app_context().__enter__(); u = AuthService.register_user(name='Ahmed Osman', email='ahmedothmanii64@gmail.com', password='ahmedothmanii64@gmail.com', role_id=1); print('SuperAdmin registered:', u.email)"
```

---

## 🤝 Contributing

We welcome contributions! If you'd like to contribute:
1. Fork the repository.
2. Create a new secure feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<br>

<div align="center">
  <b>Created with 💚 & ☕ by the <strong>OneTap Solution Team</strong></b>
  <br>
  <i>Empowering businesses through digital innovation.</i>
</div>