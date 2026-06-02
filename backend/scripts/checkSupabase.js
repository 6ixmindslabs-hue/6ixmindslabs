const supabase = require('../config/supabaseClient');

const tables = ['team_members', 'projects', 'internships', 'certificates', 'messages', 'showcase_items'];

const checkSupabase = async () => {
    if (!supabase.isConfigured) {
        console.log('Supabase is not configured.');
        console.log('Copy backend/.env.example to backend/.env and set SUPABASE_URL and SUPABASE_KEY.');
        return;
    }

    for (const table of tables) {
        const { error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`${table}: unavailable (${error.message})`);
        } else {
            console.log(`${table}: ok (${count ?? 0} rows)`);
        }
    }
};

checkSupabase().catch(error => {
    console.error('Supabase check failed:', error.message);
    process.exitCode = 1;
});
