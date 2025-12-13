# Vercel Environment Variables Setup Guide

## 🚀 Quick Setup for Vercel Deployment

### Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **6ixmindslabs**
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add Environment Variables

Add the following variables one by one:

---

#### Variable 1: MONGODB_URI
- **Key**: `MONGODB_URI`
- **Value**: 
  ```
  mongodb+srv://6ixmindslabs_2025_db_user:MPynoRukomEn8Q93@cluster0.vstm657.mongodb.net/6ixmindslabs?retryWrites=true&w=majority&appName=Cluster0
  ```
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

---

#### Variable 2: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: 
  ```
  6ixminds-labs-2025-super-secret-jwt-key-production-change-this-in-prod
  ```
- **Environment**: Select all (Production, Preview, Development)
- Click **Save**

---

#### Variable 3: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production only
- Click **Save**

---

#### Variable 4: VITE_EMAILJS_SERVICE_ID
- **Key**: `VITE_EMAILJS_SERVICE_ID`
- **Value**: `your_emailjs_service_id` (from your EmailJS account)
- **Environment**: Select all
- Click **Save**

---

#### Variable 5: VITE_EMAILJS_TEMPLATE_ID
- **Key**: `VITE_EMAILJS_TEMPLATE_ID`
- **Value**: `your_emailjs_template_id` (from your EmailJS account)
- **Environment**: Select all
- Click **Save**

---

#### Variable 6: VITE_EMAILJS_PUBLIC_KEY
- **Key**: `VITE_EMAILJS_PUBLIC_KEY`
- **Value**: `your_emailjs_public_key` (from your EmailJS account)
- **Environment**: Select all
- Click **Save**

---

### Step 3: Redeploy

After adding all variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots menu)
4. Click **Redeploy**
5. Confirm the redeployment

**OR** simply push a new commit:
```bash
git add .
git commit -m "Update environment configuration"
git push origin main
```

Vercel will automatically redeploy with the new environment variables.

---

## 📋 Complete Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - JWT secret key for authentication
- [ ] `NODE_ENV` - Set to `production`
- [ ] `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID
- [ ] `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID
- [ ] `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key

---

## 🧪 Verify Deployment

After redeployment, verify everything works:

### 1. Test API Endpoint
```bash
curl https://your-site.vercel.app/api/team
```
Should return:
```json
{"success":true,"count":0,"data":[]}
```

### 2. Test Health Endpoint
```bash
curl https://your-site.vercel.app/health
```
Should return:
```json
{"success":true,"message":"6ixminds Labs API is running",...}
```

### 3. Check Frontend
- Visit `https://your-site.vercel.app/about`
- Team section should be empty (needs seeding)

### 4. Seed Team Data
1. Visit `https://your-site.vercel.app/admin`
2. Login: `6ixmindslabs` / `6@Minds^Labs`
3. Go to **Team Management**
4. Click **"📥 Initialize Default Data"**
5. Confirm

### 5. Verify Team Section
- Visit `https://your-site.vercel.app/about`
- Should now show 6 team members! ✅

---

## 🎯 Visual Guide

```
┌─────────────────────────────────────────────────┐
│           Vercel Dashboard                      │
│                                                 │
│  Project: 6ixmindslabs                         │
│  ├── Settings                                   │
│  │   └── Environment Variables                 │
│  │       ├── MONGODB_URI          ✅           │
│  │       ├── JWT_SECRET            ✅           │
│  │       ├── NODE_ENV              ✅           │
│  │       ├── VITE_EMAILJS_SERVICE_ID ✅        │
│  │       ├── VITE_EMAILJS_TEMPLATE_ID ✅       │
│  │       └── VITE_EMAILJS_PUBLIC_KEY ✅        │
│  │                                              │
│  └── Deployments                                │
│      └── Redeploy → Apply new env vars         │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Security Best Practices

1. ✅ **Never commit** `.env` files to Git (already in `.gitignore`)
2. ✅ **Use different secrets** for production vs development
3. ✅ **Rotate JWT_SECRET** every 90 days
4. ✅ **Use strong passwords** for MongoDB users
5. ⚠️ **Limit MongoDB IP whitelist** (currently set to `0.0.0.0/0` for ease)

---

## 🐛 Troubleshooting

### Issue: "Environment variables not working"
**Solution**: 
- Make sure you clicked "Save" for each variable
- Redeploy after adding variables
- Check variable names (case-sensitive)

### Issue: "MongoDB connection failed"
**Solution**:
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Issue: "Team section still empty"
**Solution**:
- Check `/api/team` endpoint returns data
- Seed data via admin panel
- Check browser console for errors

---

## 📞 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **EmailJS**: https://www.emailjs.com/

---

## ⏱️ Estimated Time: 5 minutes

1. Add 6 environment variables (3 min)
2. Redeploy (1 min)
3. Seed data (1 min)

**Total: ~5 minutes** ⚡

---

**Last Updated**: December 13, 2025
**Status**: Ready for deployment 🚀
