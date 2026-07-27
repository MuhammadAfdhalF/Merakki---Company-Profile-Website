# 🚀 Merakki – Company Profile Website

A full-stack company profile and digital agency website developed using **Next.js** for the frontend and **Laravel** for the backend REST API.

The platform provides a modern, responsive, and structured website for presenting company information, services, portfolios, clients, frequently asked questions, and other public content.

It also includes a protected administration panel that allows administrators to manage website content dynamically without modifying the source code directly.

---

## 📌 About the Project

**Merakki – Company Profile Website** was developed as a digital platform for presenting a company or creative agency professionally through the web.

The public website allows visitors to explore company information, portfolios, clients, services, pricing information, blog content, FAQs, documentation, and contact information.

The system separates the frontend and backend into two applications. The frontend is built using **Next.js, React, and TypeScript**, while the backend uses **Laravel REST API** to manage authentication, content data, file uploads, and database operations.

Administrators can log in to a protected dashboard and manage important website content such as homepage sections, company advantages, portfolios, clients, and FAQs.

---

## 🛠️ Technologies

### Frontend

- ⚡ **Next.js 15** → frontend framework and application routing
- ⚛️ **React 19** → component-based user interface
- 🔷 **TypeScript** → typed frontend development
- 🎨 **Tailwind CSS 4** → responsive user interface styling
- 🔗 **Axios** → communication with the Laravel REST API
- 🎬 **Framer Motion** → frontend animations and transitions
- ✨ **AOS** → scroll-based animations
- 🌓 **Next Themes** → theme management
- 🔔 **React Hot Toast** → user notifications
- 🎠 **React Slick** → portfolio and content sliders
- 📝 **Gray Matter and Remark** → Markdown content processing
- 🔐 **NextAuth** → frontend authentication support

### Backend

- ⚙️ **Laravel 10** → REST API backend framework
- 🐘 **PHP 8.1+** → server-side programming
- 🔐 **Laravel Sanctum** → API token authentication
- 🗄️ **MySQL** → relational database
- 🔄 **Eloquent ORM** → database management and model relationships
- 📤 **File Upload API** → image and content file management
- 📦 **Composer** → PHP dependency management

---

## 🌐 System Architecture

### Public Website

The public website is used by visitors to explore company information and available services.

Main pages:

- Homepage
- About page
- Portfolio page
- Portfolio detail page
- Client page
- Blog page
- Contact page
- FAQ page
- Pricing page
- Documentation page
- Authentication page
- Custom not-found page

---

### Next.js Frontend

The frontend is responsible for displaying public content and providing the administration user interface.

Main responsibilities:

- Render public company profile pages
- Display portfolios and portfolio details
- Display client information
- Display FAQ content
- Process Markdown blog content
- Communicate with the Laravel REST API
- Handle responsive layouts
- Display animations and interactive components
- Protect administration routes
- Provide content management forms

---

### Laravel REST API

The Laravel backend provides API services for the Next.js frontend.

Main responsibilities:

- Administrator authentication
- API token management
- Homepage content management
- Why Choose Us content management
- Portfolio management
- Client management
- FAQ management
- Image and file upload
- Public website data delivery
- Database processing
- Request validation
- Protected admin endpoints

---

### Administration Panel

The administration panel is used to manage dynamic website content.

Main features:

- Admin login
- Admin dashboard
- Homepage section management
- Why Choose Us management
- Portfolio management
- Client management
- FAQ management
- Image and file upload
- Password management
- Admin logout

---

## ⚙️ Main Features

- 🏠 **Dynamic Homepage**  
  Homepage content can be retrieved from the Laravel backend and managed through the administration panel.

- 🏢 **Company Profile Information**  
  Displays information about the company, services, advantages, clients, and business identity.

- 🎨 **Modern Responsive Design**  
  The website is optimized for desktop, tablet, and mobile devices using Tailwind CSS.

- 📁 **Portfolio Management**  
  Administrators can create, update, view, and delete portfolio content.

- 🔍 **Portfolio Detail Page**  
  Visitors can open individual portfolio pages using dynamic portfolio slugs.

- 🤝 **Client Management**  
  Administrators can manage client information displayed on the website.

- ⭐ **Why Choose Us Management**  
  Company advantages and value propositions can be managed through the admin panel.

- ❓ **FAQ Management**  
  Administrators can manage frequently asked questions and answers.

- 📤 **Image and File Upload**  
  The Laravel backend provides an upload endpoint for website assets.

- 🔐 **Administrator Authentication**  
  Protected administration endpoints use Laravel Sanctum authentication.

- 🔑 **Password Management**  
  Administrators can update their account password through the authenticated API.

- 📝 **Markdown Blog Support**  
  Blog content can be managed using Markdown files and rendered through the Next.js frontend.

- 🎬 **Frontend Animations**  
  Framer Motion and AOS are used to provide interactive animations and smooth transitions.

- 🔔 **User Feedback Notifications**  
  React Hot Toast is used to display success, warning, and error messages.

- 🌓 **Theme Support**  
  The frontend includes theme management support through Next Themes.

- 🔗 **RESTful API Integration**  
  Next.js communicates with the Laravel backend using Axios and JSON responses.

---

## 🔄 Main Application Flow

```text
Visitor opens the Merakki website
↓
Next.js requests public content from the Laravel REST API
↓
Laravel retrieves website content from the database
↓
The content is returned to Next.js as JSON
↓
Next.js displays the content on the public website
↓
Visitor explores company information and portfolios
```

### Administration Flow

```text
Administrator opens the login page
↓
Administrator enters login credentials
↓
Laravel validates the credentials
↓
Laravel generates an authentication token
↓
Administrator enters the protected dashboard
↓
Administrator manages website content
↓
Next.js sends the changes to the Laravel REST API
↓
Laravel validates and stores the changes
↓
Updated content appears on the public website
```

---

## 👥 User Roles

### 👤 Visitor

Visitors can:

- View the homepage
- Read company information
- View available services
- Explore company portfolios
- Open portfolio details
- View company clients
- Read blog content
- View pricing information
- Read frequently asked questions
- Access documentation
- View contact information

---

### 👨‍💼 Administrator

Administrators can:

- Log in to the administration panel
- View the admin dashboard
- Manage homepage sections
- Manage Why Choose Us content
- Create and update portfolios
- Delete portfolio content
- Manage client information
- Manage frequently asked questions
- Upload images and files
- Change their password
- Log out securely

---

## 🔌 API Overview

The backend API uses the `/api` prefix.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate an administrator |
| GET | `/api/auth/me` | Retrieve authenticated administrator data |
| POST | `/api/auth/logout` | Log out and revoke authentication |
| POST | `/api/auth/change-password` | Update administrator password |

### Content Management

| Method | Endpoint | Description |
|---|---|---|
| GET, POST, PUT, DELETE | `/api/home-sections` | Manage homepage sections |
| GET, POST, PUT, DELETE | `/api/why-chooses` | Manage Why Choose Us content |
| GET, POST, PUT, DELETE | `/api/portfolios` | Manage portfolio content |
| GET, POST, PUT, DELETE | `/api/clients` | Manage client information |
| GET, POST, PUT, DELETE | `/api/faqs` | Manage FAQ content |
| POST | `/api/upload` | Upload images or files |

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/home` | Retrieve public homepage content |
| GET | `/api/public/portfolios` | Retrieve public portfolio list |
| GET | `/api/public/portfolios/{slug}` | Retrieve portfolio details by slug |

Protected endpoints require a Laravel Sanctum authentication token.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

---

## 🗂️ Repository Structure

```text
Merakki---Company-Profile-Website/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Models/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── public/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── storage/
│   ├── composer.json
│   └── artisan
│
├── frontend/
│   ├── markdown/
│   │   └── Blog/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/
│   │   │   ├── (site)/
│   │   │   ├── api/
│   │   │   └── context/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── utils/
│   │   └── middleware.ts
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following software is installed:

- PHP 8.1 or newer
- Composer
- Node.js 18 or newer
- npm
- MySQL or MariaDB
- Git

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadAfdhalF/Merakki---Company-Profile-Website.git
cd Merakki---Company-Profile-Website
```

---

## ⚙️ Backend Setup

Move into the backend directory:

```bash
cd backend
```

Install PHP dependencies:

```bash
composer install
```

Create the Laravel environment file:

```bash
cp .env.example .env
```

For Windows Command Prompt:

```bash
copy .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Create a MySQL database:

```sql
CREATE DATABASE merakki;
```

Update the database configuration inside `backend/.env`:

```env
APP_NAME=Merakki
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=merakki
DB_USERNAME=root
DB_PASSWORD=
```

Run the database migrations:

```bash
php artisan migrate
```

Run the database seeder when seed data is available:

```bash
php artisan db:seed
```

Create the public storage link:

```bash
php artisan storage:link
```

Start the Laravel development server:

```bash
php artisan serve
```

The Laravel API will normally run at:

```text
http://127.0.0.1:8000
```

---

## 🎨 Frontend Setup

Open a second terminal and move into the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Create or update the frontend environment configuration:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:3000
```

---

## ▶️ Running the Application

Run the backend and frontend in separate terminal windows.

### Terminal 1 — Laravel Backend

```bash
cd backend
php artisan serve
```

### Terminal 2 — Next.js Frontend

```bash
cd frontend
npm run dev
```

Open the application through:

```text
http://localhost:3000
```

---

## 🏗️ Production Build

### Next.js Frontend

Create an optimized production build:

```bash
cd frontend
npm run build
npm run start
```

### Laravel Backend

Install optimized production dependencies:

```bash
cd backend
composer install --no-dev --optimize-autoloader
```

Cache the Laravel configuration and routes:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔒 Security

The application includes:

- Laravel Sanctum API authentication
- Protected administration endpoints
- Admin authorization middleware
- Password management
- Request validation
- API token-based communication
- Route protection through Next.js middleware

Sensitive information such as database credentials and API configuration should always be stored inside `.env` files and must not be committed to the repository.

---

## 📈 Project Impact

✅ **Professional Online Presence**  
The platform provides a modern and structured company profile for presenting company information and services.

✅ **Centralized Content Management**  
Administrators can manage important website content through one administration panel.

✅ **Modern Frontend Experience**  
Next.js, React, Tailwind CSS, and frontend animations provide a fast and responsive user experience.

✅ **Separated Frontend and Backend**  
The system uses a modern architecture with Next.js as the frontend and Laravel as the REST API backend.

✅ **Reusable REST API**  
The backend can provide structured website data to different frontend clients through JSON endpoints.

✅ **Improved Portfolio Management**  
Company projects and portfolio details can be managed dynamically by administrators.

✅ **Secure Administration Access**  
Protected endpoints and token-based authentication help secure content management operations.

✅ **Scalable Application Structure**  
The separated application structure makes future feature development and maintenance easier.

---

## 🙋‍♂️ Author

**Muhammad Afdhal F**

📧 Email: [cuyafdal@gmail.com](mailto:cuyafdal@gmail.com)  
📷 Instagram: [@holla.cuy](https://instagram.com/holla.cuy)  
💼 LinkedIn: [Muhammad Afdhal F](https://www.linkedin.com/in/muhammadafdhalf/)  
💻 GitHub: [MuhammadAfdhalF](https://github.com/MuhammadAfdhalF)

🧠 Passionate about Web Development, Backend Development, Mobile Development, QA Automation, and Artificial Intelligence.

```text
Frontend       : Next.js 15, React 19, TypeScript
Backend        : Laravel 10, PHP 8.1+
Styling        : Tailwind CSS 4
Authentication : Laravel Sanctum
Database       : MySQL
API            : RESTful API
HTTP Client    : Axios
Animation      : Framer Motion and AOS
Content        : Markdown, Gray Matter, and Remark
```

---

Developed as a full-stack company profile and content management platform using **Next.js, React, TypeScript, Laravel, and RESTful API integration**.
