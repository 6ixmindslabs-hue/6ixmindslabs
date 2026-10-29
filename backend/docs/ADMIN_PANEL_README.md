# 🎛️ 6ixminds Labs Admin Panel

A secure, feature-rich admin panel for managing the 6ixminds Labs website content, including internships, projects, certificates, team members, and contact messages.

![Admin Panel](https://img.shields.io/badge/Admin-Panel-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Security](https://img.shields.io/badge/Security-JWT-orange?style=for-the-badge)

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Security
- **Secure JWT-based authentication** with refresh tokens
- **Role-based access control** (Super Admin, Admin, Editor)
- **Password encryption** using bcrypt (12 rounds)
- **Rate limiting** on login attempts (5 per 15 minutes)
- **Session management** with auto-logout
- **Password change** functionality with validation
- **2FA ready** (UI implemented, backend integration pending)
- **IP whitelisting** option for enhanced security

### 📊 Dashboard
- **Real-time KPI cards** showing statistics
  - Total Internships
  - Total Projects
  - Certificates Issued
  - Unread Messages
- **Recent activity feed** with action logging
- **System status monitoring** (API, Database, Storage)
- **Quick actions** for common tasks
- **Analytics overview** (chart integration ready)

### 🎓 Internship Management
- **Full CRUD operations** (Create, Read, Update, Delete)
- **Search and filter** by domain, skills, or keywords
- **Pagination** for large datasets
- **30-second undo delete** feature
- **Featured internships** toggle
- **Duration options** with pricing (2 weeks / 1 month)
- **Skills and projects** array management
- **Bulk export** functionality (coming soon)

### 💼 Projects Management
- **Card-based grid layout** with image previews
- **Image upload** with preview
- **Category filtering** (Web, IoT, Mobile, etc.)
- **GitHub and live demo links**
- **Tag management** for technologies used
- **Featured projects** highlight
- **Responsive design** for mobile editing

### 📜 Certificate Management
- **Certificate issuance** with auto-generated IDs
- **Certificate verification** system
- **QR code generation** for certificates
- **Search by certificate ID** or student name
- **Bulk certificate** generation (coming soon)
- **PDF export** functionality (coming soon)
- **Email delivery** to students (coming soon)

### 👥 Team Management (Coming Soon)
- Add/edit/delete team members
- Upload profile photos
- Social media links
- Role and bio management
- Team member ordering

### 📄 Page Content Editor (Coming Soon)
- Edit website pages (About, Services, Hero, Mission/Vision)
- Rich text WYSIWYG editor
- Image upload and management
- Preview before publish
- Version history

### ✉️ Contact Messages (Coming Soon)
- View all inbound messages
- Mark as read/unread
- Archive messages
- Reply via EmailJS integration
- Export messages to CSV

### ⚙️ Settings
- **Profile management** with avatar
- **Security settings** (password change, 2FA, IP lock)
- **API configuration** (base URL, JWT expiry)
- **Rate limiting** controls
- **Admin user management** (super-admin only)

### 📋 Audit Logs (Coming Soon)
- Complete activity history
- User action tracking
- IP address logging
- Timestamp and resource tracking
- Filter by date, user, or action type

---

## 🎨 Screenshots

### Login Page
Beautiful gradient-animated login screen with demo credentials display.

### Dashboard
Comprehensive overview with KPI cards, recent activity, and system status.

### Internships Management
Table view with search, filters, and inline actions.

### Certificate Issuance
Form-based certificate creation with auto-generated IDs.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM 7** - Routing
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 12** - Animations
- **Axios** - HTTP client (for API calls)

### Backend (Expected)
- **Node.js** with **Express.js**
- **Supabase** (PostgreSQL)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File uploads
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers
- **cors** - CORS configuration

### Additional Tools
- **QRCode** - QR code generation
- **EmailJS** - Email sending (optional)
- **AWS S3 / Cloudinary** - Image storage (recommended)

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Supabase project (URL & Keys)

### Frontend Setup

1. **Clone the repository**
   ```bash
   cd 6ixmindslabs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the admin panel**
   - Open browser: `http://localhost:5173/admin/login`
   - Default credentials (CHANGE IMMEDIATELY):
     - Username: `6ixmindslabs`
     - Password: `6@Minds^Labs`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Seed the admin user**
   ```bash
   node scripts/seedAdminUser.js
   ```

5. **Start backend server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

---

## 🚀 Usage

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter credentials
3. You'll be redirected to `/admin` (dashboard)

### Managing Content

#### Internships
- Click "Internships" in sidebar
- Use "Add Internship" button to create new
- Click edit icon to modify
- Click delete icon (30-second undo available)

#### Projects
- Click "Projects" in sidebar
- Use "Add Project" button
- Upload project images
- Add GitHub and live demo URLs

#### Certificates
- Click "Certificates" in sidebar
- Use "Issue Certificate" button
- Fill in student and internship details
- Certificate ID is auto-generated
- Use "Verify Certificate" at top to validate

### Changing Password

1. Go to Settings → Security
2. Enter current password
3. Enter new password (min 8 characters)
4. Confirm new password
5. Click "Update Password"

---

## 📚 API Documentation

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for complete API reference.

### Quick Example

**Login:**
```javascript
POST /api/admin/login
Content-Type: application/json

{
  "username": "6ixmindslabs",
  "password": "your_password"
}
```

**Create Internship:**
```javascript
POST /api/admin/internships
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "AI/ML Internship",
  "domain": "Artificial Intelligence",
  "duration": "1 Month",
  "price": 4000,
  "description": "Hands-on AI/ML training...",
  "skills": ["Python", "TensorFlow", "Keras"],
  "featured": true
}
```

---

## 🔒 Security

### Best Practices Implemented

✅ JWT authentication with refresh tokens  
✅ bcrypt password hashing (12 rounds)  
✅ Rate limiting on login (5 attempts/15 min)  
✅ Protected routes with authentication check  
✅ Environment variables for secrets  
✅ HTTPS enforcement (production)  
✅ CORS configuration  
✅ Input validation  
✅ XSS protection  
✅ Audit logging  

### Security Checklist

See [SECURITY_CHECKLIST.md](./docs/SECURITY_CHECKLIST.md) for complete pre-deployment checklist.

**Critical Actions:**
1. ✅ Change default admin password immediately
2. ✅ Set strong JWT secrets in `.env`
3. ✅ Enable HTTPS in production
4. ✅ Configure CORS to allow only your domain
5. ✅ Set up database backups
6. ✅ Enable rate limiting
7. ✅ Review and apply all items in security checklist

---

## 🌐 Deployment

### Option 1: Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure environment variables** in Vercel dashboard

### Option 2: Docker

1. **Build Docker image**
   ```bash
   docker build -t 6ixmindslabs-admin .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 --env-file .env 6ixmindslabs-admin
   ```

### Backend Deployment (Node.js)

**Recommended:** Use a managed service
- **Heroku** - Easy deployment
- **Railway** - Modern platform
- **DigitalOcean App Platform** - Scalable
- **AWS EC2** - Full control

**Steps:**
1. Set environment variables on platform
2. Configure Supabase (SUPABASE_URL and SUPABASE_KEY)
3. Deploy from git repository
4. Run seed script to create admin user
5. Test login and functionality

---

## 🎯 Extra Features Added

Beyond the requirements, we've added:

1. **🎨 Beautiful UI/UX**
   - Gradient backgrounds and animations
   - Smooth transitions and micro-interactions
   - Responsive design for all screen sizes
   - Dark mode ready (toggle coming soon)

2. **⚡ Performance Optimizations**
   - Lazy loading for images
   - Pagination for large datasets
   - Debounced search inputs
   - Optimized re-renders with React hooks

3. **♿ Accessibility**
   - ARIA labels on interactive elements
   - Keyboard navigation support
   - Screen reader friendly
   - High contrast mode compatible

4. **🔔 User Feedback**
   - Toast notifications for actions
   - Loading states for async operations
   - Confirmation modals for destructive actions
   - 30-second undo for deletions

5. **📱 Mobile Responsive**
   - Collapsible sidebar on mobile
   - Touch-friendly buttons and inputs
   - Swipe gestures (coming soon)

---

## 🐛 Known Issues & Roadmap

### Known Issues
- React-quill has peer dependency warnings (doesn't affect functionality)
- File upload currently uses base64 (migrate to S3/Cloudinary recommended)

### Roadmap Q1 2025
- [ ] Team management CRUD
- [ ] Page content editor with WYSIWYG
- [ ] Contact messages inbox
- [ ] Audit logs viewer
- [ ] Bulk operations (import/export CSV)
- [ ] 2FA implementation
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Code Standards:**
- Use ESLint and Prettier
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting

---

## 📄 License

This project is proprietary software owned by **6ixminds Labs**.  
Unauthorized copying, distribution, or modification is prohibited.

---

## 👨‍💻 Developer

**Developed by:** 6ixminds Labs Development Team  
**Contact:** admin@6ixmindslabs.com  
**Website:** [6ixmindslabs.com](https://6ixmindslabs.com)  

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Framer Motion for smooth animations
- Supabase team for the robust database platform
- All open-source contributors

---

**⭐ Star this repository if you found it helpful!**

**Made with ❤️ by 6ixminds Labs**
