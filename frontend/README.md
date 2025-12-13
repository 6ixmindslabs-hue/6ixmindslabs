# 6ixminds Labs - Official Website

> A modern, premium web application for 6ixminds Labs - showcasing internship programs, projects, services, and company information.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.19-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12.23.26-FF0055?logo=framer)](https://www.framer.com/motion/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages Overview](#pages-overview)
- [Components](#components)
- [Data Structure](#data-structure)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

**6ixminds Labs** is a technology company based in Erode, Tamil Nadu, founded in 2025. This website serves as the digital presence for the company, offering:

- 📚 **Internship Programs** in Web Development and IoT/Embedded Systems
- 💼 **Project Showcase** featuring real-world applications
- 🛠️ **Services** including web development, IoT solutions, and mobile app development
- ✅ **Certificate Verification** system for internship completions
- 📞 **Contact Form** with EmailJS integration

## ✨ Features

### Design & User Experience
- ✅ Premium, modern UI with gradient themes (purple/pink)
- ✅ Smooth animations using Framer Motion
- ✅ Fully responsive design for all devices
- ✅ Glassmorphism effects and premium shadows
- ✅ Interactive hover effects and micro-animations
- ✅ Optimized scroll behavior and section navigation

### Functional Features
- ✅ Dynamic routing with React Router
- ✅ Contact form with EmailJS integration
- ✅ Certificate verification system
- ✅ Project filtering by category
- ✅ Internship duration selection (2 Weeks / 1 Month)
- ✅ Team member profiles with modals
- ✅ WhatsApp integration for quick contact

### Technical Highlights
- ✅ Vite for fast development and builds
- ✅ ESLint for code quality
- ✅ TailwindCSS with custom design tokens
- ✅ Environment variable support
- ✅ Modular component architecture

## 🛠️ Tech Stack

### Core Technologies
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.10.1** - Client-side routing

### Styling
- **TailwindCSS 3.4.19** - Utility-first CSS framework
- **Framer Motion 12.23.26** - Animation library
- **PostCSS 8.5.6** & **Autoprefixer 10.4.22** - CSS processing

### Form Handling
- **EmailJS Browser 4.4.1** - Email sending service

### Development Tools
- **ESLint 9.39.1** - Linting and code quality
- **@vitejs/plugin-react 5.1.1** - React support for Vite

## 📁 Project Structure

```
6ixmindslabs/
├── public/                      # Static assets
│   ├── logo.jpg                 # Company logo
│   ├── logo2.png               # Alternative logo
│   ├── bus-tracker.png         # Project image
│   ├── Dhinesh.jpg             # Team member photo
│   ├── Dileep.jpg              # Team member photo
│   ├── NithishKumar.jpg        # Team member photo
│   ├── Prabhakaran.jpg         # Team member photo
│   ├── Sathish.jpg             # Team member photo
│   └── images/                 # Additional images
│
├── src/
│   ├── components/             # Reusable components
│   │   ├── AnimatedText.jsx    # Text animation component
│   │   ├── Button.jsx          # Custom button component
│   │   ├── Card.jsx            # Card component
│   │   ├── Footer.jsx          # Site footer
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── ScrollToTop.jsx     # Scroll restoration utility
│   │
│   ├── pages/                  # Page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── About.jsx           # About us page
│   │   ├── Services.jsx        # Services overview
│   │   ├── Projects.jsx        # Project showcase
│   │   ├── Internships.jsx     # Internship programs
│   │   ├── Contact.jsx         # Contact form
│   │   ├── Verify.jsx          # Certificate verification
│   │   ├── WebIntern.jsx       # Web internship details
│   │   └── IotIntern.jsx       # IoT internship details
│   │
│   ├── data/                   # JSON data files
│   │   ├── internships.json    # Internship program data
│   │   ├── projects.json       # Project portfolio data
│   │   └── certificates.json   # Certificate records
│   │
│   ├── utils/                  # Utility functions
│   │   ├── api.js              # API utilities (placeholder)
│   │   └── cert.js             # Certificate utilities (placeholder)
│   │
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
└── vite.config.js              # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhinesh71/6ixmindslabs.git
   cd 6ixmindslabs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID | Yes |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID | Yes |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | Yes |

### Setting up EmailJS

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a new service (e.g., Gmail)
3. Create an email template with parameters: `name`, `email`, `phone`, `message`
4. Copy your service ID, template ID, and public key to `.env`

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 📄 Pages Overview

### 🏠 Home (`/`)
- Hero section with call-to-action
- Featured projects showcase
- Internship program highlights
- Statistics and achievements
- Call-to-action sections

### ℹ️ About (`/about`)
- Company overview and mission
- Services offered
- Timeline of company journey
- Team member profiles with interactive modals
- Why choose us section

### 🛠️ Services (`/services`)
- Service categories
- Detailed service descriptions
- How we work process
- Technology stack showcase

### 💼 Projects (`/projects`)
- Project portfolio with filtering
- Categories: Web, IoT, AI
- Live demo and GitHub links
- Project details and tech stack

### 🎓 Internships (`/internships`)
- Web Development Internship
- IoT & Embedded Systems Internship
- Duration options (2 Weeks / 1 Month)
- Learning outcomes and project examples
- Pricing and application process

### 📞 Contact (`/contact`)
- Contact form with validation
- EmailJS integration
- Business hours
- Location and contact information
- WhatsApp quick contact

### ✅ Verify (`/verify`)
- Certificate ID verification
- Certificate details display
- QR code support

## 🧩 Components

### `<Navbar />`
- Sticky navigation with glassmorphism
- Responsive mobile menu
- Active link highlighting with smooth animations
- Logo and brand identity

### `<Footer />`
- Company information
- Quick links to all pages
- Social media links
- Newsletter signup (optional)

### `<Card />`
- Reusable card component
- Premium hover effects
- Gradient borders option
- Glassmorphism variants

### `<Button />`
- Multiple variants (primary, secondary, outline)
- Ripple effect on click
- Loading states
- Icon support

### `<AnimatedText />`
- Text reveal animations
- Character-by-character animation
- Customizable timing

### `<ScrollToTop />`
- Automatic scroll restoration on route change
- Smooth scroll behavior

## 📊 Data Structure

### Internships Data (`internships.json`)
```json
{
  "id": 1,
  "slug": "web-development",
  "title": "Web Development Internship",
  "domain": "Web & App Development",
  "duration": "2 Weeks / 1 Month",
  "price": 2000,
  "description": "...",
  "skills": ["React", "Node.js", "MongoDB"],
  "projects": ["E-commerce website"],
  "durationOptions": {
    "2Weeks": {
      "price": 2000,
      "learningOutcome": "...",
      "whatTheyCanLearn": [],
      "exampleProjects": []
    },
    "1Month": {
      "price": 4000,
      "learningOutcome": "...",
      "whatTheyCanLearn": [],
      "exampleProjects": []
    }
  }
}
```

### Projects Data (`projects.json`)
```json
{
  "id": 1,
  "slug": "project-name",
  "title": "Project Title",
  "category": "Web",
  "description": "...",
  "image": "/path/to/image.png",
  "tags": ["Technology", "Stack"],
  "github": "https://github.com/...",
  "liveDemo": "https://demo.com",
  "featured": true
}
```

### Certificates Data (`certificates.json`)
```json
{
  "cert_id": "6ML-IN-2025-00001",
  "student_name": "Student Name",
  "internship_title": "Web Development Internship",
  "project_title": "E-commerce Platform",
  "issue_date": "2025-01-15",
  "skills": ["React", "Node.js"],
  "qr_code": "https://verify.6ixmindslabs.com/..."
}
```

## 🎨 Styling

### Custom Tailwind Configuration

The project uses an extended Tailwind configuration with:

#### Brand Colors
- **Purple**: `#6C4BFF` (primary)
- **Pink**: `#FF6BCE` (secondary)
- **Purple Light**: `#9B7BFF`
- **Pink Light**: `#FF8FDC`

#### Custom Animations
- `gradient-x` - Gradient animation
- `gradient-shimmer` - Shimmer effect
- `float` / `float-slow` - Floating animations
- `pulse-glow` - Glowing pulse effect
- `slide-up` / `slide-down` - Slide transitions
- `fade-in` - Fade in animation
- `scale-in` - Scale up animation

#### Utility Classes
```css
.gradient-text          /* Gradient text color */
.gradient-text-shimmer  /* Animated gradient text */
.gradient-bg            /* Gradient background */
.gradient-bg-animated   /* Animated gradient background */
.glass-card             /* Glassmorphism card */
.premium-card           /* Premium card with shadow */
.gradient-border        /* Gradient border effect */
```

### Custom CSS Variables
```css
:root {
  --header-height: 5rem; /* Dynamically updated */
}
```

## 🌐 Deployment

### Prerequisites for Production
- MongoDB Atlas account (free tier available)
- Vercel account (or alternative hosting)
- Environment variables configured

### Backend Setup

#### 1. MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier)
3. Create database user with password
4. Whitelist IP: `0.0.0.0/0` (or specific IPs)
5. Get connection string

#### 2. Environment Variables

**Backend (.env in backend/ directory):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/6ixmindslabs
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NODE_ENV=production
PORT=3000
```

**Frontend (.env in root directory):**
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_API_URL=https://your-backend-url.com
```

### Build for Production
```bash
# Frontend build
npm run build

# Backend (runs on server)
cd backend
npm install --production
npm run server
```

This creates an optimized production build in the `dist/` folder.

### Deployment Platforms

#### Vercel (Full Stack - Recommended)

The project is configured for Vercel serverless deployment with both frontend and backend.

**Steps:**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
4. Deploy

**Vercel Configuration:**
- Frontend: Automatic (Vite build)
- Backend: Serverless functions in `/api` directory
- API routes: `/api/*` → `/api/index.js`

#### Alternative: Separate Backend Deployment

**Backend Options:**
- Railway.app (Free tier)
- Render.com (Free tier)
- Heroku (Paid)
- DigitalOcean App Platform

**Frontend Options:**
- Vercel
- Netlify
- GitHub Pages (static only)

**If deploying separately:**
1. Deploy backend to Railway/Render
2. Get backend URL (e.g., `https://api.your-app.com`)
3. Set `VITE_API_URL` in frontend environment
4. Deploy frontend to Vercel/Netlify

### Post-Deployment Steps

1. **Seed Team Data:**
   - Visit `/admin` on your deployed site
   - Login with: `6ixmindslabs` / `6@Minds^Labs`
   - Go to Team Management
   - Click "📥 Initialize Default Data"

2. **Verify:**
   - Check `/api/team` endpoint returns data
   - Visit `/about` page - team section should load
   - Test admin panel CRUD operations

### Environment Variables in Production
Make sure to set the following environment variables in your deployment platform:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_API_URL` (if backend is separate)
- `MONGODB_URI` (backend)
- `JWT_SECRET` (backend)

### Troubleshooting Deployment

See [DEPLOYMENT_FIX.md](./DEPLOYMENT_FIX.md) for detailed troubleshooting guide.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow the existing ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📞 Contact

**6ixminds Labs**
- **Email**: 6ixmindslabs@gmail.com
- **Phone**: +91 90258 73422, +91 90805 34488
- **Location**: Erode, Tamil Nadu, India
- **WhatsApp**: [Chat with us](https://wa.me/919080534488)

## 👥 Team

- **Dhinesh** - Founder & Lead Developer
- **Dileep** - Co-Founder
- **Nithish Kumar** - Senior Developer
- **Prabhakaran** - IoT Specialist
- **Sathish** - Full Stack Developer

## 📝 License

This project is proprietary and confidential. All rights reserved © 2025 6ixminds Labs.

---

**Built with ❤️ by the 6ixminds Labs Team**

🌟 If you find this project useful, please consider giving it a star on GitHub!
