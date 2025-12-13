const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/auth');

// Map DB snake_case to Frontend camelCase
const mapToModel = (row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    domain: row.domain,
    duration: row.duration,
    price: row.price,
    description: row.description,
    skills: row.skills || [],
    projects: row.projects || [],
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

// Map Frontend camelCase to DB snake_case
const mapToDB = (body) => ({
    title: body.title,
    slug: body.slug,
    domain: body.domain,
    duration: body.duration,
    price: body.price,
    description: body.description,
    skills: body.skills,
    projects: body.projects,
    featured: body.featured
});

// @route   GET /api/internships
// @desc    Get all internships
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, count: data.length, data: data.map(mapToModel) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/internships/:id
// @desc    Get single internship
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(404).json({ success: false, error: 'Internship not found' });
        res.json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/internships
// @desc    Create internship
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const payload = mapToDB(req.body);
        const { data, error } = await supabase.from('internships').insert(payload).select().single();
        if (error) throw error;
        res.status(201).json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/internships/:id
// @desc    Update internship
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const payload = mapToDB(req.body);
        const { data, error } = await supabase
            .from('internships')
            .update(payload)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) return res.status(404).json({ success: false, error: 'Internship not found' });
        res.json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/internships/:id
// @desc    Delete internship
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { error } = await supabase.from('internships').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/internships/seed
// @desc    Seed from JSON
router.post('/seed', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const internshipData = req.body.data;
        if (!Array.isArray(internshipData)) return res.status(400).json({ error: 'Data must be an array' });

        await supabase.from('internships').delete().neq('id', 0); // Clear all

        const dbData = internshipData.map(mapToDB);
        const { data, error } = await supabase.from('internships').insert(dbData).select();

        if (error) throw error;
        res.json({ success: true, count: data.length, data: data.map(mapToModel) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
