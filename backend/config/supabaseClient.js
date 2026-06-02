const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// For admin writes, SUPABASE_KEY should normally be a service_role key.
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase is not configured. Public API routes will use local fallback data where available.');

    module.exports = {
        isConfigured: false,
        from() {
            throw new Error('Supabase is not configured. Copy backend/.env.example to backend/.env and set SUPABASE_URL and SUPABASE_KEY.');
        },
        storage: {
            from() {
                throw new Error('Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_KEY.');
            }
        }
    };
    return;
}

const supabase = createClient(supabaseUrl, supabaseKey);
supabase.isConfigured = true;

module.exports = supabase;
