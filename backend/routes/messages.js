const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/messages
// @desc    Submit a new contact message (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Attempt to insert with phone number
        let { data, error } = await supabase
            .from('messages')
            .insert([{ name, email, phone, subject, message, status: 'new' }])
            .select()
            .single();

        // If error is related to missing column 'phone', retry without it
        if (error && error.message && error.message.includes('phone')) {
            console.warn('Phone column missing in messages table, checking legacy schema...');
            const retry = await supabase
                .from('messages')
                .insert([{ name, email, subject, message, status: 'new' }])
                .select()
                .single();
            data = retry.data;
            error = retry.error;
        }

        if (error) throw error;
        res.status(201).json({ success: true, message: 'Message sent successfully', data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   GET /api/messages
// @desc    Get all messages
// @access  Private (Admin)
router.get('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/messages/:id/status
// @desc    Update message status (e.g. read/replied)
router.put('/:id/status', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const { data, error } = await supabase
            .from('messages')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;
