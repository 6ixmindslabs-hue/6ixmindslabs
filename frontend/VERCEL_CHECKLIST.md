# ✅ Vercel Deployment Checklist

## 🎯 Environment Variables to Add in Vercel

Copy and paste these into Vercel Dashboard → Settings → Environment Variables:

---

### 1️⃣ MONGODB_URI
```
mongodb+srv://6ixmindslabs_2025_db_user:MPynoRukomEn8Q93@cluster0.vstm657.mongodb.net/6ixmindslabs?retryWrites=true&w=majority&appName=Cluster0
```
✅ Select: Production, Preview, Development

---

### 2️⃣ JWT_SECRET
```
6ixminds-labs-2025-super-secret-jwt-key-production-change-this-in-prod
```
✅ Select: Production, Preview, Development

---

### 3️⃣ NODE_ENV
```
production
```
✅ Select: Production only

---

### 4️⃣ VITE_EMAILJS_SERVICE_ID
```
your_emailjs_service_id
```
✅ Select: Production, Preview, Development
⚠️ Replace with your actual EmailJS Service ID

---

### 5️⃣ VITE_EMAILJS_TEMPLATE_ID
```
your_emailjs_template_id
```
✅ Select: Production, Preview, Development
⚠️ Replace with your actual EmailJS Template ID

---

### 6️⃣ VITE_EMAILJS_PUBLIC_KEY
```
your_emailjs_public_key
```
✅ Select: Production, Preview, Development
⚠️ Replace with your actual EmailJS Public Key

---

## 📝 Deployment Steps

- [ ] 1. Add all 6 environment variables in Vercel
- [ ] 2. Push code to GitHub (or click Redeploy in Vercel)
- [ ] 3. Wait for deployment to complete (~2 minutes)
- [ ] 4. Visit your deployed site
- [ ] 5. Go to `/admin` and login
- [ ] 6. Navigate to Team Management
- [ ] 7. Click "📥 Initialize Default Data"
- [ ] 8. Visit `/about` to verify team section loads

---

## 🧪 Verification Commands

Test your deployment:

```bash
# Test API endpoint
curl https://your-site.vercel.app/api/team

# Test health endpoint
curl https://your-site.vercel.app/health
```

---

## 🎉 Success Criteria

- [ ] `/api/team` returns JSON data
- [ ] `/health` returns success message
- [ ] About page shows 6 team members
- [ ] Admin panel Team Management works
- [ ] Can create/edit/delete team members
- [ ] Contact form sends emails

---

**Time Required**: ~5 minutes
**Status**: Ready to deploy! 🚀
