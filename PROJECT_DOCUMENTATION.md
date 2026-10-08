# Web n Code Technologies — Complete System Documentation

Comprehensive architecture, features, database models, API reference, and operational guide for the official **Web n Code Technologies** company web platform.

---

## 📌 Executive Summary

**Web n Code Technologies** (`webncode.in`) is a full-stack, enterprise-grade software company website and client portal. Initially conceived as a static product showcase, it has evolved into a dynamic **MERN/Vite stack application** equipped with an interactive public portfolio, dynamic careers & job application pipeline, and a dedicated **SuperAdmin Control Panel**.

### Core Business Domains Served:
- 🏫 **School & Education ERP** (Student info, fees, online admissions, report cards, parent portals)
- ⏱️ **Academic Scheduling & Timetable Pro** (Teacher allocation, period scheduling, homework tracking)
- 📊 **Result & Assessment Management System** (Exams, marksheets, grade cards, analytics)
- 📋 **Digital Attendance Management** (Biometric sync, daily reporting, absent SMS triggers)
- 🌐 **Web Builder Pro** (Drag-and-drop no-code CMS for schools and institutions)
- 🏢 **Enterprise & Custom Software Solutions**

---

## 🏗️ Architecture & Technology Stack

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND CLIENT                      │
│   React 19 + TypeScript + Vite 8 + Tailwind CSS v4     │
│   Framer Motion 12 (Animations & Micro-interactions)   │
│   React Router DOM v7 (Modular Public & Admin Routes)   │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON (Axios)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND REST API                     │
│   Node.js + Express.js                                 │
│   JWT Authentication + Bcryptjs Password Hashing       │
│   Nodemailer (Automated Email Alerts)                  │
│   ImageKit Cloud Media Integration                     │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ORM
                           ▼
┌────────────────────────────────────────────────────────┐
│                   DATABASE & STORAGE                   │
│   MongoDB Atlas Cloud Database                         │
│   ImageKit CDN (Media & Screenshots)                   │
└────────────────────────────────────────────────────────┘
```

### Detailed Tech Stack Matrix

| Layer | Technologies | Key Libraries / Roles |
|---|---|---|
| **Frontend UI** | React 19, TypeScript, HTML5 | Component-driven modern reactive architecture |
| **Styling & Design** | Tailwind CSS v4, Vanilla CSS | Neo-brutalist theme, crisp borders, retro-tech monospace accents, glassmorphic modals |
| **Animations** | Framer Motion 12 | Fluid page transitions, animated statistics counters, floating particles |
| **Icons & Media** | Lucide React, React Icons | High-definition SVG icons across all modules |
| **Routing & State** | React Router DOM v7, React Context | `AuthContext` for admin auth state, protected route guards |
| **Backend Runtime** | Node.js, Express.js | High-throughput REST API with 10MB payload support (Base64 file handling) |
| **Database** | MongoDB Atlas (Mongoose 8) | Auto-retry connection with custom DNS resolver fallback |
| **Authentication** | JWT (JSON Web Tokens) | Stateless bearer token auth with role enforcement |
| **Media Hosting** | ImageKit.io CDN | Cloud CDN for high-resolution software demo screenshots |
| **Email Service** | Nodemailer (Gmail SMTP) | Instant email notifications dispatched on new client enquiries |

---

## 📂 Repository & Folder Structure

```
wncwebsite/
└── webncode.web/
    ├── backend/                      # Node.js + Express REST API Server
    │   ├── config/                   # Config files & database connectors
    │   ├── controllers/              # Controller business logic
    │   │   ├── authController.js     # Admin login, token issuance, verification
    │   │   ├── careerController.js   # Job applications submission & management
    │   │   ├── categoryController.js # Dynamic product categories CRUD
    │   │   ├── contactController.js  # Client lead enquiries & mail alerts
    │   │   ├── developerController.js# Team members profile CRUD
    │   │   ├── projectController.js  # Products / Projects portfolio CRUD
    │   │   └── updateController.js   # Company news & announcements CRUD
    │   ├── middleware/
    │   │   └── authMiddleware.js     # JWT verification & route protection
    │   ├── models/                   # Mongoose Database Schemas
    │   │   ├── Application.js        # Job candidate applications
    │   │   ├── Category.js           # Product category schema
    │   │   ├── Contact.js            # Client lead submissions
    │   │   ├── Developer.js          # Team / Developer profiles
    │   │   ├── Project.js            # Software products catalog
    │   │   ├── Setting.js            # Global website toggles & config
    │   │   ├── Update.js             # Announcements & updates
    │   │   └── User.js               # Admin authentication users
    │   ├── routes/                   # Express router endpoints
    │   ├── seedNew.js                # Database seeder for enterprise ERP products
    │   ├── seedProjects.js           # Database seeder & ImageKit uploader
    │   ├── server.js                 # Express server bootstrap & MongoDB connection
    │   └── package.json
    │
    ├── src/                          # Frontend Application Source
    │   ├── assets/                   # Logos, team photos, project previews
    │   ├── components/
    │   │   ├── careers/              # ApplicationForm.tsx (Base64 resume uploader)
    │   │   ├── home/                 # Hero, Stats, Featured, Process, TechStack, Testimonials
    │   │   ├── layout/               # Navbar, Footer, Public Layout wrapper
    │   │   └── ui/                   # Reusable UI tokens, Buttons, ProductCard, Toast, Icons
    │   ├── contexts/
    │   │   └── AuthContext.tsx       # Auth provider, token storage, user state
    │   ├── data/                     # Static fallback datasets (products, careers, company)
    │   ├── pages/                    # Route Views
    │   │   ├── Home.tsx              # Main landing page
    │   │   ├── Products.tsx          # Filterable & searchable product directory
    │   │   ├── ProductDetail.tsx     # Deep-dive view of individual software solutions
    │   │   ├── Solutions.tsx         # Industry-specific software solution bundles
    │   │   ├── About.tsx             # Company story, roadmap, dynamic team showcase
    │   │   ├── Careers.tsx           # Job listings & open application form
    │   │   ├── Updates.tsx           # Company & product newsfeed with popup viewer
    │   │   ├── Contact.tsx           # Client enquiry form & Google Maps office view
    │   │   ├── Login.tsx             # SuperAdmin login with interactive floating logos
    │   │   └── admin/                # SuperAdmin Control Panel
    │   │       ├── AdminLayout.tsx   # Dashboard layout, navigation sidebar & global settings
    │   │       ├── LeadsTab.tsx      # Inbound client inquiries & status tracking
    │   │       ├── CareersTab.tsx    # Job applications & Base64 resume downloader
    │   │       ├── DevelopersTab.tsx # Team management CRUD with modal editor
    │   │       ├── ProjectsTab.tsx   # Product catalog CRUD & category manager
    │   │       ├── ProjectForm.tsx   # Add/Edit product form with image management
    │   │       └── UpdatesTab.tsx    # News & announcement editor
    │   ├── App.tsx                   # Main route configuration
    │   └── main.tsx                  # React DOM mount point
    │
    ├── package.json
    ├── tailwind.config.js / @tailwindcss/vite
    ├── vite.config.ts
    └── vercel.json
```

---

## 🌟 Key Application Features

### 1. Public Facing Website

- **High-Impact Landing Page (`/`)**:
  - Interactive hero section with animated CTA and dynamic value propositions.
  - Animated numerical statistics (`AnimatedCounter.tsx`).
  - Featured products gallery with live demo links.
  - Multi-industry solution breakdown (Schools, Colleges, Coaching, Enterprises).
  - 5-step transparent delivery lifecycle (Discover ➔ Design ➔ Develop ➔ Test ➔ Deploy).
  - Client testimonial carousel & interactive tech stack explorer.

- **Dynamic Products Catalog (`/products` & `/products/:slug`)**:
  - Automatically fetches live products from MongoDB with fallback to static configurations.
  - Live full-text search filter + dynamic category tabs.
  - Rich product detail pages featuring screenshot carousels, key modules list, architecture highlights, live demo links, and quick inquiry buttons.

- **Interactive Team & About Page (`/about`)**:
  - Company journey, mission, core values, and multi-year roadmap (2024–2026).
  - **Dynamic Team Grid**: Fetches developer profiles live from `/api/developers`. Hover interactions reveal alternative candid poses, full bios, and direct social links (LinkedIn, GitHub, Twitter, Instagram).

- **Careers & Application Hub (`/careers`)**:
  - List of active openings across Frontend, Backend, Fullstack, UI/UX, and QA.
  - **Smart Application Modal**: Accepts candidate contact info, portfolio URLs, and file uploads (PDF/Docx). Files are converted to Base64 in-browser and submitted to the backend.
  - "Open Application" mode allows spontaneous talent submissions.

- **News & Announcements Feed (`/updates`)**:
  - Categorized news stream (Product Releases, Company Announcements, Hiring).
  - Modal view for reading complete change logs and press releases.

- **Contact & Office Map (`/contact`)**:
  - Validation-backed contact form connected to backend email alerts.
  - Embedded Google Maps location for the Jaipur head office.
  - Direct email, phone, and social connections.

---

### 2. SuperAdmin Control Panel (`/admin`)

Accessed via secure login (`/login`), the SuperAdmin suite provides non-technical staff full administrative autonomy:

| Tab | Functionality | Key Capabilities |
|---|---|---|
| **📬 Client Leads** | Inbound sales enquiries | Read client requests, filter by status, track contact dates, delete spam |
| **💼 Careers & Resumes** | Job applications | Review applicant details, filter by role, download or preview submitted PDF resumes |
| **👨‍💻 Developers Team** | Team showcase manager | Add/Edit/Delete team members displayed on the About page. Manage avatars, bios, and social handles |
| **📁 Projects Directory** | Products catalog manager | Full CRUD on products. Edit titles, slugs, descriptions, bullet features, and preview images |
| **🏷️ Categories Modal** | Dynamic categories | Add, edit, or delete categories that power the product filter system |
| **📢 Updates & News** | Changelog & news publisher | Publish and edit company announcements, changelogs, and hiring alerts |
| **⚙️ Global Settings** | Site-wide toggles | Global switch in header to enable/disable floating `<w>` logos on the login page in real-time |

---

## 🗄️ Database Schemas (MongoDB / Mongoose)

### 1. `Contact` (`Contact.js`)
Stores lead inquiries submitted through the contact page:
- `name` (String, Required)
- `email` (String, Required, Lowercase)
- `phone` (String, Required)
- `message` (String, Required)
- `status` (Enum: `New`, `Contacted`, `In Progress`, `Closed`)
- `createdAt` (Timestamp)

### 2. `Application` (`Application.js`)
Stores candidate job applications:
- `name`, `email`, `phone` (Strings, Required)
- `position` (String, Required)
- `experience`, `portfolio`, `notes` (Strings)
- `resume` (Object: `filename`, `fileType`, `fileSize`, `base64Data`)
- `status` (Enum: `Pending`, `Reviewed`, `Shortlisted`, `Rejected`)
- `appliedAt` (Timestamp)

### 3. `Project` (`Project.js`)
Stores products shown in the portfolio:
- `title` (String, Required)
- `slug` (String, Unique, Required)
- `shortDescription`, `description` (Strings)
- `category` (String, e.g., 'Education', 'Management')
- `features` (Array of Strings)
- `demoUrl` (String)
- `images` (Array of image URLs)
- `color`, `accentColor` (Hex code strings for theme accents)
- `createdAt` (Timestamp)

### 4. `Developer` (`Developer.js`)
Team members listed on the About page:
- `name`, `role`, `bio` (Strings)
- `image`, `hoverImage` (Image URLs)
- `location`, `flag`, `team` (Strings)
- `linkedin`, `github`, `twitter`, `instagram`, `email` (Social URLs)

### 5. `Update` (`Update.js`)
News and product release logs:
- `title`, `content` (Strings, Required)
- `category` (Enum: `Product`, `Company`, `Careers`)
- `date` (Date, default `Date.now`)

### 6. `Setting` (`Setting.js`)
Key-value storage for global website configuration (e.g. `floating_logos_enabled`).

---

## 🔌 API Endpoints Reference

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health check & server status |
| `POST` | `/api/contact` | Submit a new contact lead enquiry |
| `POST` | `/api/careers/apply` | Submit a candidate job application with resume |
| `GET` | `/api/projects` | Get all published software products |
| `GET` | `/api/projects/:slug` | Get specific product details by slug |
| `GET` | `/api/categories` | Get all active product categories |
| `GET` | `/api/developers` | Get all active team members |
| `GET` | `/api/updates` | Get all published company announcements |
| `GET` | `/api/settings/floating-logos` | Get current status of login floating logos |
| `POST` | `/api/auth/login` | SuperAdmin login (returns JWT token) |

### Protected Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/me` | Verify token & return admin user profile |
| `GET` | `/api/contact` | Retrieve all submitted leads |
| `DELETE` | `/api/contact/:id` | Delete a lead |
| `GET` | `/api/careers` | Retrieve all job applications |
| `DELETE` | `/api/careers/:id` | Delete an application |
| `POST` | `/api/projects` | Create a new product entry |
| `PUT` | `/api/projects/:id` | Update an existing product |
| `DELETE` | `/api/projects/:id` | Delete a product entry |
| `POST` | `/api/categories` | Add a new product category |
| `DELETE` | `/api/categories/:id` | Delete a product category |
| `POST` | `/api/developers` | Add a new team member |
| `PUT` | `/api/developers/:id` | Update a team member profile |
| `DELETE` | `/api/developers/:id` | Delete a team member |
| `POST` | `/api/updates` | Create an announcement |
| `PUT` | `/api/updates/:id` | Edit an announcement |
| `DELETE` | `/api/updates/:id` | Delete an announcement |
| `PUT` | `/api/settings/floating-logos` | Update global floating logo setting |

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm**
- **MongoDB Atlas** account (or local MongoDB daemon)

### 2. Frontend Setup
```bash
# Navigate to web directory
cd webncode.web

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The website will start at: `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd webncode.web/backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev
```
The API server will run at: `http://localhost:5000`

---

## ⚙️ Environment Variables Configuration

### Backend `.env` (`webncode.web/backend/.env`)
```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Official Company SMTP Configuration (mail.webncode.in)
SMTP_HOST=mail.webncode.in
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=business@webncode.in
SMTP_PASS=your_smtp_password_here
EMAIL_USER=business@webncode.in
EMAIL_PASS=your_smtp_password_here
COMPANY_EMAIL=webncodetechnologies@gmail.com
EMAIL_FROM_NAME="Web n Code Technologies"

# Server Port & Mode
PORT=5000
NODE_ENV=development

# Frontend Origins (CORS)
FRONTEND_URL=http://localhost:5173

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# SuperAdmin Default Credentials
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_secure_password

# ImageKit Configuration (Optional for CDN seeding)
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
```

### Frontend `.env` (`webncode.web/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Frontend Production `.env.production`
```env
VITE_API_URL=https://webncode.in
VITE_API_BASE=https://webncode.in
```

---

## 📦 Production Build & Deployment

### Building Frontend:
```bash
cd webncode.web
npm run build
```
Creates an optimized static bundle in `webncode.web/dist`. Can be deployed directly to **Vercel**, **Netlify**, or served via **Nginx**.

### Deploying Backend:
Run the Node.js Express server using PM2 or Docker on any Linux VPS (Ubuntu/Debian):
```bash
cd backend
npm install --production
pm2 start server.js --name "webncode-api"
```

---

## 🛡️ Security & Best Practices Implemented

1. **Password Hashing**: Admin credentials stored with salted `bcryptjs` encryption.
2. **Stateless JWT Guard**: Admin APIs reject unauthorized requests with standard HTTP 401/403 status codes.
3. **Resilient DNS Resolution**: Backend includes Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) fallback DNS servers to resolve MongoDB SRV cluster records reliably across any hosting network.
4. **CORS Whitelisting**: Granular origin matching prevents cross-site request hijacking.
5. **Base64 Payload Handling**: Express JSON limit tuned to 10MB to accommodate candidate PDF resumes without requiring third-party storage bloat.
6. **Graceful Fallbacks**: The frontend safely falls back to rich static assets if the database is unreachable, guaranteeing high availability for visitors.

---

*Documentation maintained by Web n Code Technologies Core Engineering Team.*
