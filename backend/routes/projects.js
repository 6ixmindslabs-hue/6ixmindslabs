const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/auth');

// Map DB snake_case to Frontend camelCase
const mapToModel = (row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    image: row.image,
    tags: row.tags || [],
    github: row.github,
    liveDemo: row.live_demo,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

// Map Frontend camelCase to DB snake_case
const mapToDB = (body) => ({
    title: body.title,
    slug: body.slug,
    category: body.category,
    description: body.description,
    image: body.image,
    tags: body.tags,
    github: body.github,
    live_demo: body.liveDemo,
    featured: body.featured
});

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, count: data.length, data: data.map(mapToModel) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/projects
// @desc    Create project
// @access  Private
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const payload = mapToDB(req.body);
        const { data, error } = await supabase.from('projects').insert(payload).select().single();
        if (error) throw error;
        res.status(201).json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const payload = mapToDB(req.body);
        const { data, error } = await supabase
            .from('projects')
            .update(payload)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) return res.status(404).json({ success: false, error: 'Project not found' });
        res.json({ success: true, data: mapToModel(data) });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/projects/seed
// @desc    Seed projects from JSON
router.post('/seed', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const projectData = req.body.data;
        if (!Array.isArray(projectData)) return res.status(400).json({ error: 'Data must be an array' });

        await supabase.from('projects').delete().neq('id', 0); // Clear all

        const dbData = projectData.map(mapToDB);
        const { data, error } = await supabase.from('projects').insert(dbData).select();

        if (error) throw error;
        res.json({ success: true, count: data.length, data: data.map(mapToModel) });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
