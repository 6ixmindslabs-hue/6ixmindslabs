const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/auth');

// Helper to map DB columns (snake_case) to Frontend model (camelCase)
const mapToModel = (dbRow) => {
    if (!dbRow) return null;
    return {
        _id: dbRow.id, // Keep _id for compatibility with existing frontend using Mongoose
        id: dbRow.id,
        name: dbRow.name,
        role: dbRow.role,
        title: dbRow.title,
        bio: dbRow.bio, // legacy
        microBio: dbRow.micro_bio,
        fullBio: dbRow.full_bio,
        photo: dbRow.photo,
        email: dbRow.email,
        phone: dbRow.phone,
        linkedin: dbRow.linkedin,
        github: dbRow.github,
        twitter: dbRow.twitter,
        responsibilities: dbRow.responsibilities || [],
        techStack: dbRow.tech_stack || [],
        projects: dbRow.projects || [],
        order: dbRow.display_order,
        active: dbRow.active,
        createdAt: dbRow.created_at,
        updatedAt: dbRow.updated_at
    };
};

// Helper to map Frontend model to DB columns
const mapToDB = (body) => {
    return {
        name: body.name,
        role: body.role,
        title: body.title,
        bio: body.bio,
        micro_bio: body.microBio,
        full_bio: body.fullBio,
        photo: body.photo,
        email: body.email,
        phone: body.phone,
        linkedin: body.linkedin,
        github: body.github,
        twitter: body.twitter,
        responsibilities: body.responsibilities,
        tech_stack: body.techStack,
        projects: body.projects,
        display_order: body.order,
        active: body.active
    };
};

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        const mappedData = data.map(mapToModel);
        res.json({ success: true, count: mappedData.length, data: mappedData });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/team/:id
// @desc    Get single team member
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // JSON object requested, multiple (or no) rows returned
                return res.status(404).json({ success: false, error: 'Team member not found' });
            }
            throw error;
        }

        res.json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/team
// @desc    Create new team member
// @access  Private (Admin)
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const payload = mapToDB(req.body);
        const { data, error } = await supabase
            .from('team_members')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/team/:id
// @desc    Update team member
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const payload = mapToDB(req.body);

        // Remove undefined fields to avoid overwriting with null if that's not intended, 
        // though mapToDB might send undefined. Supabase ignores undefined in JS client usually or we should clean it.
        // Actually, let's keep it simple.

        const { data, error } = await supabase
            .from('team_members')
            .update(payload)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Check if it exists? Updates generally return nothing if no match but with .select() it might error differently?
                // Actually update returns empty array if no match with select.
                return res.status(404).json({ success: false, error: 'Team member not found' });
            }
            throw error;
        }

        res.json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/team/:id
// @desc    Delete team member
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/team/seed
// @desc    Seed team from JSON
// @access  Private (Admin)
router.post('/seed', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const teamData = req.body.data;
        if (!Array.isArray(teamData)) {
            return res.status(400).json({ success: false, error: 'Please provide an array of team members in "data" field' });
        }

        // 1. Delete all existing (optional, but requested for seed behavior)
        // Note: Supabase doesn't have a simple truncate via client, have to use delete (neq 0 is a hack for all)
        await supabase.from('team_members').delete().neq('id', 0);

        // 2. Map and Insert
        const dbData = teamData.map(mapToDB);

        const { data, error } = await supabase
            .from('team_members')
            .insert(dbData)
            .select();

        if (error) throw error;

        res.json({ success: true, count: data.length, data: data.map(mapToModel) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
