# MongoDB Setup Guide for 6ixminds Labs Backend

## ⚡ Quick Setup Steps

### Step 1: Edit Your `.env` File

1. **Navigate to:** `backend/.env.example`
2. **Copy it to create `.env`:**
   ```bash
   # In the backend directory
   copy .env.example .env
   ```

### Step 2: Update MongoDB Connection String

Open `backend/.env` and replace this line:

```env
MONGODB_URI=mongodb://localhost:27017/6ixmindslabs
```

With your **MongoDB Atlas connection string**:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/6ixmindslabs?retryWrites=true&w=majority
```

**⚠️ IMPORTANT REPLACEMENTS:**
- Replace `YOUR_USERNAME` with your MongoDB Atlas username
- Replace `YOUR_PASSWORD` with your MongoDB Atlas password
- Replace `cluster0.xxxxx` with your actual cluster address
- Keep `6ixmindslabs` as the database name

**Example with real values:**
```env
MONGODB_URI=mongodb+srv://6ixminds_admin:SecurePass%40123@cluster0.abc123.mongodb.net/6ixmindslabs?retryWrites=true&w=majority
```

**Note:** If your password has special characters, encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`

### Step 3: Generate Secure JWT Secrets

Replace the JWT secrets with your own random strings:

**Option A - Using Node.js (Recommended):**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this twice to get two different secrets, then update:

```env
JWT_SECRET=paste_first_secret_here
JWT_REFRESH_SECRET=paste_second_secret_here
```

**Option B - Use a password generator:**
- Visit: https://passwordsgenerator.net/
- Generate 64-character random string
- Use different values for JWT_SECRET and JWT_REFRESH_SECRET

### Step 4: Verify Your `.env` File

Your `.env` should look like this:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://6ixminds_admin:SecurePass%40123@cluster0.abc123.mongodb.net/6ixmindslabs?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_64_character_random_string_here
JWT_REFRESH_SECRET=your_different_64_character_random_string_here
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Admin Seed Data
SEED_ADMIN_USERNAME=6ixmindslabs
SEED_ADMIN_EMAIL=admin@6ixmindslabs.com
SEED_ADMIN_PASSWORD=6@Minds^Labs

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5

# Bcrypt
BCRYPT_ROUNDS=12
```

---

## 🚀 Step 5: Test the Connection

After setting up your `.env` file:

1. **Start the backend server:**
   ```bash
   npm run dev
   ```

2. **You should see:**
   ```
   ✅ Connected to MongoDB
   🚀 6ixminds Labs Backend Server
   📡 Server running on port 3000
   ```

3. **If you see connection error:**
   - ❌ Check username/password
   - ❌ Check if IP is whitelisted (try 0.0.0.0/0)
   - ❌ Check password encoding for special characters
   - ❌ Ensure connection string format is correct

---

## 🗄️ Step 6: Seed Admin User

Once MongoDB is connected, create your first admin user:

```bash
npm run seed
```

**You should see:**
```
✅ Connected to MongoDB
🔐 Hashing password...
✅ Password hashed successfully
👤 Creating admin user...
✅ Admin user created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ADMIN CREDENTIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: 6ixmindslabs
Email:    admin@6ixmindslabs.com
Password: 6@Minds^Labs
Role:     super-admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Change this password immediately after first login!
```

---

## ✅ Step 7: Verify Everything Works

1. **Backend running:** `http://localhost:3000`
2. **Frontend running:** `http://localhost:5173`
3. **MongoDB connected:** ✅
4. **Admin user created:** ✅

Now you can:
- Login to admin panel at `http://localhost:5173/admin/login`
- Backend will handle authentication (once endpoints are connected)

---

## 🌐 MongoDB Atlas Dashboard

After setup, you can manage your database at:
- **URL:** https://cloud.mongodb.com
- **View Collections:** Browse Data → View your database
- **Monitor Performance:** Metrics tab
- **Backup:** Automatically handled by Atlas

---

## 🔧 Troubleshooting

### Error: "Authentication failed"
**Solution:** Check username and password in connection string

### Error: "Connection timeout"
**Solution:** 
1. Whitelist your IP in MongoDB Atlas
2. Or use `0.0.0.0/0` to allow all IPs (testing only)

### Error: "Network error"
**Solution:** Check internet connection and firewall

### Error: "Bad auth"
**Solution:** URL-encode special characters in password
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`

---

## 📚 What's Next?

After MongoDB is connected:

1. ✅ Seed admin user (`npm run seed`)
2. ✅ Connect frontend to backend API
3. ✅ Test login functionality
4. ✅ Implement remaining CRUD endpoints
5. ✅ Deploy to production

---

## 💡 Alternative: Local MongoDB

If you prefer local installation:

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs on `mongodb://localhost:27017`
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/6ixmindslabs
   ```

### Verify local installation:
```bash
mongo --version
```

---

**Need Help?** 
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Node.js Driver: https://mongodb.github.io/node-mongodb-native/
