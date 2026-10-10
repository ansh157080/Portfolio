# Anshu Thakur – Personal Portfolio Website (Full-Stack)

[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-MariaDB-orange.svg)](https://www.mysql.com/)
[![Thiranex](https://img.shields.io/badge/Internship-Thiranex-purple.svg)](https://thiranex.com/)
[![Status](https://img.shields.io/badge/Tests-5%20Passing-brightgreen.svg)]()

A complete, responsive, dark-themed **Personal Portfolio Website** built for **Anshu Thakur** (Computer Engineering student) as part of the **Thiranex Internship**. 

This application connects a vanilla **HTML, CSS, and JavaScript** frontend with a **Node.js + Express.js** REST API backend and a **MySQL** database.

---

## 🌟 Key Features

1. **Modern Dark Theme Aesthetic**:
   - Deep obsidian palette (`#0a0e17`), electric cyan (`#00f2fe`) and indigo (`#6366f1`) glowing accents.
   - Glassmorphism frosted-glass cards, subtle grid patterns, and responsive layout across mobile, tablet, and desktop screens.
   - Live animated typing role effect and smooth navigation.

2. **Complete Sections**:
   - **Home**: Dynamic hero greeting, typing role animation, quick stats, CV download button, and visual developer avatar.
   - **About**: Engineering mindset, core values, CS foundation, and career focus.
   - **Skills**: Categorized grids with icons (Programming Languages, Frontend, Backend & Database, AI/ML, Tools & Workflow, CS Core).
   - **Projects**: Category filter buttons, project cards with tech pills, and GitHub / Live Demo action buttons.
   - **Education**: Academic timeline with Computer Engineering coursework.
   - **Certifications**: Industry training credentials including Thiranex Internship and Smart India Hackathon (SIH).
   - **Contact**: Interactive form with real-time feedback and direct MySQL database persistence.

3. **Featured Projects (Stored in MySQL)**:
   - **Suraksha Kawach – AI Powered Fraud Intelligence System**: AI/ML fraud detection prototype analyzing transactions with XGBoost, SHAP explainability, and Streamlit.
   - **Mausam – Personalized Weather Experience**: Smart meteorological web prototype with real-time weather alerts and interactive insights (Smart India Hackathon).
   - **Crime Record Management System**: Centralized digital case management system enabling law enforcement to log FIRs, manage criminal history, and track investigation updates.

4. **Dynamic REST API & MySQL Integration**:
   - Projects are fetched dynamically from MySQL via `GET /api/projects`.
   - Contact form submissions are validated and stored in MySQL table `contacts` via `POST /api/contact`.
   - Real-time database connection status badge in the header (`MySQL Active 🟢`).

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Glassmorphism design system), Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: MySQL / MariaDB (via `mysql2/promise` connection pool)
- **Testing**: Node.js Test Runner (`node:test`, `node:assert`)

---

## 📂 Project Structure

```
Anshu_portfolio/
├── .env                  # Local environment configuration
├── .env.example          # Template environment configuration
├── .gitignore            # Git ignored files (node_modules, .env, etc.)
├── database.sql          # Complete MySQL schema and initial seed data
├── package.json          # Node dependencies and project scripts
├── server.js             # Express app entry point & static file server
├── src/
│   ├── config/
│   │   └── db.js         # MySQL connection pool & auto-init helper
│   ├── routes/
│   │   ├── projectRoutes.js  # REST API for projects (GET, POST)
│   │   └── contactRoutes.js  # REST API for contact messages (POST, GET)
│   └── scripts/
│       └── initDb.js     # Standalone database initialization script
├── tests/
│   └── api.test.js       # Automated integration test suite
└── public/               # Frontend static assets
    ├── index.html        # Main single-page portfolio
    ├── css/
    │   └── style.css     # Dark theme styling, glassmorphism, responsive rules
    ├── js/
    │   └── main.js       # API fetching, typing animation, category filtering, form submit
    └── assets/
        ├── avatar.svg            # Developer profile graphic
        ├── suraksha-kawach.svg   # Suraksha Kawach project thumbnail
        ├── mausam.svg            # Mausam weather project thumbnail
        └── crime-management.svg  # Crime Record Management thumbnail
```

---

## 🚀 Step-by-Step Instructions to Run on Windows

### Prerequisites
- **Node.js** (v18 or higher recommended; v22 is tested)
- **XAMPP** (or standalone MySQL / MariaDB Server)

---

### Step 1: Start MySQL

#### Option A: Using XAMPP (Recommended & Easiest)
1. Open the **XAMPP Control Panel** from your Windows Start Menu.
2. In the `MySQL` row, click the **Start** button.
3. Ensure MySQL status changes to green with port `3306`.

#### Option B: Using Windows Command Prompt
If you run MySQL via command line or service:
```powershell
# In PowerShell:
Start-Process "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini"
```

---

### Step 2: Open Terminal & Navigate to Project

Open PowerShell or Command Prompt:
```powershell
cd "c:\Users\Anshu Thakur\OneDrive\Desktop\Anshu_portfolio"
```

---

### Step 3: Install Node.js Dependencies

```powershell
npm install
```

---

### Step 4: Configure Environment Variables

The project comes with pre-configured `.env` and `.env.example` files:
```env
PORT=5000
NODE_ENV=development

# MySQL Settings (Default XAMPP configuration)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_db
DB_PORT=3306
```

> **Note**: If your MySQL `root` user has a password, enter it in `DB_PASSWORD=your_password`.

---

### Step 5: Initialize the Database

Run the automated database setup command:
```powershell
npm run init-db
```

This command will:
1. Automatically create the database `portfolio_db` if it doesn't exist.
2. Create tables `projects` and `contacts`.
3. Seed the initial projects: **Suraksha Kawach**, **Mausam**, and **Crime Record Management System**.

*(Alternatively, you can import `database.sql` directly into **phpMyAdmin** at `http://localhost/phpmyadmin`)*.

---

### Step 6: Start the Server

```powershell
npm start
```
*(Or use `npm run dev` for auto-reloading during development).*

You will see the console confirmation:
```
============================================================
🌟 ANSHU THAKUR - PERSONAL PORTFOLIO WEBSITE (FULL-STACK)
============================================================
🚀 Local Server:      http://localhost:5000
🔌 Projects API:     http://localhost:5000/api/projects
📨 Contact API:      http://localhost:5000/api/contact
❤️  Health Check:     http://localhost:5000/api/health
📁 Database:         MySQL (XAMPP / Local) -> "portfolio_db"
============================================================
```

---

### Step 7: Open the Website in Your Browser

Open any web browser and visit:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🧪 Running Automated Tests

To verify that the Express REST APIs, health check, project filtering, and MySQL contact persistence are working correctly, run:

```powershell
npm test
```

Expected result:
```
✔ GET /api/health returns 200 with database status
✔ GET /api/projects returns seeded portfolio projects
✔ GET /api/projects?category=AI / Machine Learning filters correctly
✔ POST /api/contact validates missing fields and rejects invalid email
✔ POST /api/contact saves valid submission into MySQL database

tests 5, pass 5, fail 0
```

---

## ✏️ How to Edit or Add Projects in MySQL

All project information is decoupled from the frontend code and stored directly in MySQL table `projects`.

### Method 1: Via phpMyAdmin (Visual Interface)
1. Open your browser and navigate to `http://localhost/phpmyadmin`.
2. Click on the database `portfolio_db` in the left sidebar.
3. Click on the `projects` table.
4. Click **Insert** to add a new project, or click **Edit** next to any existing row to change:
   - `title`: Project title
   - `subtitle`: Short tagline
   - `description`: Overview description
   - `category`: e.g., `AI / Machine Learning`, `Web Development / SIH`, `Full Stack / Database`
   - `technologies`: Comma-separated list (e.g., `Python, Streamlit, XGBoost`)
   - `github_url`: Replace placeholder `#` with your real GitHub repo URL
   - `demo_url`: Replace placeholder `#` with your live deployment URL
   - `image_url`: Path to SVG/image (e.g., `/assets/suraksha-kawach.svg`)
5. Click **Go** to save. The website updates automatically upon refresh!

### Method 2: Via SQL Query
```sql
USE portfolio_db;

-- Update GitHub or Live Demo URL for Suraksha Kawach:
UPDATE projects 
SET github_url = 'https://github.com/your-username/suraksha-kawach',
    demo_url = 'https://suraksha-kawach-demo.streamlit.app'
WHERE id = 1;

-- Add a new project:
INSERT INTO projects (title, subtitle, description, category, technologies, github_url, demo_url, image_url)
VALUES (
  'Smart Attendance System',
  'Facial Recognition & Classroom Analytics',
  'An automated attendance tracker utilizing OpenCV and Haar Cascades with real-time log export.',
  'AI / Machine Learning',
  'Python, OpenCV, Tkinter, SQLite',
  '#',
  '#',
  '/assets/suraksha-kawach.svg'
);
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Checks server health & MySQL database connection status |
| `GET` | `/api/projects` | Retrieves all projects (`?category=...` for filtering) |
| `GET` | `/api/projects/:id` | Retrieves a specific project by ID |
| `POST` | `/api/projects` | Adds a new project record to MySQL |
| `POST` | `/api/contact` | Submits and saves a contact message into MySQL |
| `GET` | `/api/contact` | Lists all contact messages submitted to date |

---

## 🛡️ License

This project was developed by **Anshu Thakur** for the **Thiranex Internship**. Licensed under the [MIT License](LICENSE).
