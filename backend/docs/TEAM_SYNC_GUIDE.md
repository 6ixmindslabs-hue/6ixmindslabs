# 🔄 Real-Time Team Data Sync - Admin Panel to Website

## 🎯 How It Works

Your team data now syncs **instantly** between the admin panel and your website!

### **Data Flow:**
```
Admin Panel (CRUD) → localStorage → Website (Display)
         ↓                              ↑
    Auto-saves                    Auto-updates
```

---

## ✅ What's Been Set Up

### 1️⃣ **Data Source (`/src/data/team.json`)**
- Contains initial team member data
-  4 sample team members included
- Fields: name, role, bio, photo, email, phone, social links, order, active status

### 2️⃣ **Admin Panel (`/admin/team`)**
- ✅ Loads data from `team.json` on first visit
- ✅ Saves all changes to `localStorage`
- ✅ Dispatches `teamDataUpdated` event on every change
- ✅ Full CRUD operations
- ✅ Photo upload
- ✅ Search & pagination
- ✅ Active/Inactive toggle

### 3️⃣ **Website Component (`TeamSection.jsx`)**
- ✅ Reads data from `localStorage`
- ✅ Listens for `teamDataUpdated` events
- ✅ Auto-refreshes when admin makes changes
- ✅ Only shows **active** members
- ✅ Sorts by display order
- ✅ Beautiful grid layout with animations

---

## 🚀 Usage Instructions

### **Step 1: Add to Your Website**

Open your About page (or any page where you want to show the team):

```jsx
// src/pages/About.jsx
import TeamSection from '../components/TeamSection';

export default function About() {
  return (
    <div>
      {/* Your existing About content */}
      
      {/* Add the Team Section */}
      <TeamSection />
      
      {/* Rest of your page */}
    </div>
  );
}
```

### **Step 2: Manage Team Members**

1. **Login to Admin Panel:**
   - Go to: `http://localhost:5173/admin/login`
   - Click **"Team"** in sidebar

2. **Add New Member:**
   - Click "Add Team Member"
   - Fill in details
   - Upload photo
   - Click "Add Member"

3. **Edit Existing:**
   - Click "Edit" on any card
   - Update details
   - Click "Update Member"

4. **Delete Member:**
   - Click "Delete"
   - Confirm

5. **Toggle Visibility:**
   - When editing, uncheck "Active" to hide from website
   - Check "Active" to show on website

### **Step 3: See Changes Live**

- Open your website in one tab
- Open admin panel in another tab
- Make changes in admin panel
- **Website updates automatically!** ✨

---

## 📊 Data Structure

Each team member has:

```json
{
  "id": 1,
  "name": "Dhinesh Kumar",
  "role": "Founder & CEO",
  "bio": "Passionate about technology...",
  "photo": "https://...",
  "email": "dhinesh@6ixmindslabs.com",
  "phone": "+91 9025873422",
  "linkedin": "https://linkedin.com/...",
  "github": "https://github.com/...",
  "twitter": "https://twitter.com/...",
  "order": 1,
  "active": true
}
```

---

## 🎨 Features

### **Admin Panel:**
- ✅ Beautiful card grid
- ✅ Real-time search
- ✅ Pagination (9 per page)
- ✅ Photo upload with preview
- ✅ Social media links
- ✅ Display order
- ✅ Active/Inactive status
- ✅ View/Edit/Delete actions

### **Website Display:**
- ✅ Responsive grid (1/2/4 columns)
- ✅ Smooth animations
- ✅ Hover effects
- ✅ Social media icons
- ✅ Professional card design
- ✅ Auto-updates from admin

---

## 🔧 Customization

### **Change Grid Layout:**

Edit `TeamSection.jsx`:

```jsx
// Current: 4 columns on large screens
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

// 3 columns:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// 2 columns:
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
```

### **Change Colors:**

The component uses your website's purple-pink gradient theme. To customize:

```jsx
// Section background
className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50"

// Header gradient
className="bg-gradient-to-r from-purple-600 to-pink-600"

// Card hover
className="hover:shadow-2xl"
```

### **Add More Fields:**

1. Update `team.json` with new field
2. Add field to AdminTeam form
3. Display field in TeamSection

---

## 💡 Pro Tips

### **1. Photo Sizes:**
- Recommended: 400x400px or larger
- Format: JPG, PNG, WebP
- Keep under 500KB for best performance

### **2. Display Order:**
- Lower numbers appear first
- Use: 1, 2, 3, 4... for ordering

### **3. Bio Length:**
- Keep under 150 characters for best display
- Website shows first 3 lines only

### **4. Social Links:**
- All optional
- Leave blank if member doesn't have account
- Must be full URLs (https://...)

### **5. Active Status:**
- Uncheck to hide from website
- Member still visible in admin panel
- Perfect for temporary removal

---

## 🔄 How Real-Time Sync Works

```javascript
// Admin Panel saves to localStorage
localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

// Admin Panel dispatches event
window.dispatchEvent(new CustomEvent('teamDataUpdated', { 
  detail: teamMembers 
}));

// Website listens for event
window.addEventListener('teamDataUpdated', (event) => {
  setTeamMembers(event.detail);
});
```

**Result:** Changes appear **instantly** without page refresh!

---

## 📱 Responsive Design

The team section is **fully responsive**:

- **Mobile (< 768px):** 1 column
- **Tablet (768px - 1024px):** 2 columns
- **Desktop (> 1024px):** 4 columns

---

## ✅ Testing Checklist

- [ ] Add a new team member in admin
- [ ] Check if it appears on website
- [ ] Edit a team member
- [ ] Verify changes on website
- [ ] Toggle "Active" status
- [ ] Confirm member hides/shows on website
- [ ] Delete a member
- [ ] Verify removal from website
- [ ] Upload different photo
- [ ] Check photo displays correctly

---

## 🎉 You're All Set!

Your team section is now:
- ✅ **Fully functional**
- ✅ **Real-time synced**
- ✅ **Easy to manage**
- ✅ **Beautiful design**
- ✅ **Production-ready**

Just add `<TeamSection />` to any page and start managing your team!

---

**Files Created:**
- `/src/data/team.json` - Team data
- `/src/pages/admin/AdminTeam.jsx` - Admin CRUD (updated)
- `/src/components/TeamSection.jsx` - Website display

**Made with ❤️ for 6ixminds Labs**
