
# 6ixminds Labs Internal Tracker - Setup Guide

## ⚠️ Critical: Database Setup Required
Before the Tracker Dashboard will work, you **MUST** run the database schema.

### Step 1: Execute SQL Schema
1. Login to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Go to the **SQL Editor** (sidebar icon).
4. Click **+ New Query**.
5. Copy/Paste the contents of the file: `backend/TRACKER_SCHEMA.sql` (located in your project folder).
6. Click **Run**.

### Step 2: Create Admin User
1. Go to **Authentication** -> **Users** in Supabase.
2. Click **Add User**.
3. Create a new user with:
   - **Email**: `admin@6ixmindslabs.com`
   - **Password**: `6@Minds^Labs`
   - **Auto Confirm**: Yes (if available) or manually confirm the email.

### Step 3: Verify Connection
1. Start the app: `npm run dev`.
2. Go to `http://localhost:5173/tracker`.
3. Login with `6ixmindslabs` / `6@Minds^Labs`.

The dashboard should now load (showing 0s initially) without errors.
