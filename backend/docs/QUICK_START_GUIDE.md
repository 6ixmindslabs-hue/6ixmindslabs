# Admin Panel - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Access the Admin Panel

1. Open your browser
2. Navigate to: **http://localhost:5173/admin/login**
3. You'll see a beautiful login screen with a purple-pink gradient

### Step 2: Login

**Demo Credentials** (displayed on login page):
- **Username:** `6ixmindslabs`
- **Password:** `6@Minds^Labs`

⚠️ **Important:** Change this password immediately after first login!

### Step 3: Explore the Dashboard

After login, you'll see:
- 📊 **KPI Cards** - Quick stats (Internships, Projects, Certificates, Messages)
- 🎯 **Quick Actions** - Shortcut buttons for common tasks
- 📰 **Recent Activity** - Latest changes and updates
- 💻 **System Status** - Health monitoring

---

## 🎯 Common Tasks

### Add a New Internship

1. Click **"Internships"** in the sidebar
2. Click **"Add Internship"** button (top right)
3. Fill in the form:
   - Title (e.g., "AI/ML Internship")
   - Domain (e.g., "Artificial Intelligence")
   - Duration (e.g., "2 Weeks / 1 Month")
   - Price (e.g., 2000)
   - Description
   - Skills (comma-separated: Python, TensorFlow)
   - Check "Featured" if desired
4. Click **"Create Internship"**
5. ✅ Done! The internship appears in the table

### Add a New Project

1. Click **"Projects"** in the sidebar
2. Click **"Add Project"**
3. Fill in details:
   - Upload an image (optional)
   - Title, Category, Description
   - GitHub and Live Demo URLs
   - Tags (comma-separated)
4. Click **"Create Project"**
5. ✅ Project card appears in the grid

### Issue a Certificate

1. Click **"Certificates"** in the sidebar
2. Click **"Issue Certificate"**
3. The Certificate ID is auto-generated (e.g., 6ML-IN-2025-00003)
4. Fill in:
   - Student Name
   - Internship Title
   - Project Title
   - Issue Date
   - Skills (comma-separated)
5. Click **"Issue Certificate"**
6. ✅ Certificate is created and can be verified!

### Verify a Certificate

1. Go to **Certificates** page
2. Use the blue **"Verify Certificate"** section at the top
3. Enter Certificate ID (e.g., `6ML-IN-2025-00001`)
4. Click **"Verify"**
5. If valid, you'll see student details in a green box ✅
6. If invalid, you'll see a red error ❌

### Change Your Password

1. Click **"Settings"** in sidebar
2. Click **"Security"** tab
3. Fill in:
   - Current Password
   - New Password (minimum 8 characters)
   - Confirm New Password
4. Click **"Update Password"**
5. ✅ Password changed successfully!

---

## 📱 Navigation

**Sidebar Menu:**
- 📊 **Dashboard** - Overview and stats
- 🎓 **Internships** - Manage internship programs
- 💼 **Projects** - Manage portfolio projects
- 📜 **Certificates** - Issue and verify certificates
- 👥 **Team** - (Coming Soon)
- 📄 **Pages** - (Coming Soon)
- ✉️ **Messages** - (Coming Soon)
- 📋 **Audit Logs** - (Coming Soon)
- ⚙️ **Settings** - Account and security settings
- 🚪 **Logout** - Sign out (at bottom)

**Header:**
- 🔔 **Notifications** - Alert bell icon
- 🌐 **Visit Website** - Opens main website in new tab
- 🍔 **Sidebar Toggle** - Collapse/expand sidebar

---

## 🎨 UI Features

### Beautiful Design
- 💜 Purple to pink gradients
- 🌊 Animated blob backgrounds
- ✨ Smooth transitions and hover effects
- 📱 Fully responsive (works on mobile, tablet, desktop)

### Interactive Elements
- 🔍 **Search bars** - Real-time filtering
- 🗂️ **Filters** - Dropdown category/domain filters
- 📄 **Pagination** - Navigate through large lists
- 🎯 **Modals** - Create/Edit/View popups
- ⏱️ **Undo Delete** - 30-second grace period for deletions

### Smart Forms
- ✅ **Validation** - Required fields marked with *
- 👁️ **Password Toggle** - Show/hide password
- 📸 **Image Preview** - See uploaded images before saving
- 🏷️ **Tag Input** - Comma-separated arrays
- ☑️ **Checkboxes** - Featured toggles

---

## 🔐 Security Tips

### ✅ DO:
- ✅ Change default password immediately
- ✅ Use strong passwords (16+ characters)
- ✅ Logout when finished
- ✅ Keep browser updated
- ✅ Use HTTPS in production
- ✅ Review audit logs regularly

### ❌ DON'T:
- ❌ Share your credentials
- ❌ Use simple passwords
- ❌ Leave session open on shared computers
- ❌ Ignore security warnings
- ❌ Use HTTP in production

---

## 🆘 Troubleshooting

### Can't Login?
- ✅ Check username and password spelling
- ✅ Ensure CAPS LOCK is off
- ✅ Try clearing browser cache
- ✅ Check if backend server is running

### Changes Not Saving?
- ✅ Check internet connection
- ✅ Look for error messages
- ✅ Check browser console (F12)
- ✅ Verify all required fields are filled

### Page Not Loading?
- ✅ Refresh the page (F5)
- ✅ Clear cache and cookies
- ✅ Check if development server is running (`npm run dev`)
- ✅ Check browser console for errors

---

## 🎓 Video Tutorials (Coming Soon)

- 📹 Admin Panel Overview (5 min)
- 📹 Managing Internships (3 min)
- 📹 Issuing Certificates (2 min)
- 📹 Security Best Practices (4 min)

---

## 📞 Support

Need help?
- 📧 Email: admin@6ixmindslabs.com
- 📚 Full Documentation: `/docs/ADMIN_PANEL_README.md`
- 🔒 Security Checklist: `/docs/SECURITY_CHECKLIST.md`
- 🌐 API Docs: `/docs/API_DOCUMENTATION.md`

---

## 🎯 What's Next?

Once you're comfortable with the basics:
1. Explore all sections (Team, Pages, Messages, Logs)
2. Configure API settings
3. Set up 2FA for extra security
4. Customize rate limits
5. Add more admin users (super-admin only)

---

**Happy Managing! 🚀**

*Made with ❤️ by 6ixminds Labs*
