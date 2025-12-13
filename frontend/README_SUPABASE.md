# Supabase Setup Instructions

## 1. Create the Database Table
1. Go to your Supabase Dashboard.
2. Open the **SQL Editor**.
3. Copy and paste the content of `backend/SUPABASE_SCHEMA.sql` into the editor.
4. Click **Run**.

## 2. Seed the Data
Once the table is created, you can seed the team data in two ways:

**Option A: Run the seed script directly**
Open a terminal in the `backend` folder and run:
```bash
node scripts/seedSupabase.js
```

**Option B: Use the Admin Panel**
1. Start your backend and frontend servers.
2. Go to the Admin Panel > Team Management.
3. Click the **"Initialize Default Data"** button.

## 3. Verify
Check the "About Us" page on your website to see the team members displayed.
