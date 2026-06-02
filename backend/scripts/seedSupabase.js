const teamData = require('../../frontend/src/data/team.json');
const supabase = require('../config/supabaseClient');

const seedTeam = async () => {
    if (!supabase.isConfigured) {
        console.error('Supabase is not configured. Copy backend/.env.example to backend/.env and set SUPABASE_URL and SUPABASE_KEY before seeding.');
        return;
    }

    console.log('🌱 Seeding team members to Supabase from src/data/team.json...');
    console.log(`Found ${teamData.length} members to seed.`);

    try {
        // Check if table exists/is accessible
        const { error: checkError } = await supabase.from('team_members').select('id').limit(1);

        if (checkError) {
            console.error('❌ Error accessing team_members table. Make sure you have created the table using the SQL schema provided in backend/SUPABASE_SCHEMA.sql');
            console.error('Error details:', checkError);
            return;
        }

        // Map JSON data to DB columns
        const dbData = teamData.map(m => ({
            name: m.name,
            role: m.role,
            title: m.title,
            bio: m.bio,
            micro_bio: m.microBio,
            full_bio: m.fullBio,
            photo: m.photo,
            email: m.email,
            phone: m.phone,
            linkedin: m.linkedin,
            github: m.github,
            twitter: m.twitter,
            responsibilities: m.responsibilities || [],
            tech_stack: m.techStack || [],
            projects: m.projects || [],
            display_order: m.order,
            active: m.active
            // timestamps handled by default
        }));

        // Clear existing data (optional, but good for seed)
        // Deleting all rows where id != 0 (which is all of them usually)
        await supabase.from('team_members').delete().neq('id', 0);

        // Insert data
        const { data, error } = await supabase
            .from('team_members')
            .insert(dbData)
            .select();

        if (error) {
            console.error('❌ Error inserting data:', error);
        } else {
            console.log(`✅ Successfully seeded ${data.length} team members!`);
            console.log('Use the "About Us" page or Admin Panel to view them.');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
};

seedTeam();
