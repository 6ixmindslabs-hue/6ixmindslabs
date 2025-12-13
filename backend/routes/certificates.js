const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/certificates
// @desc    Get all certificates
// @access  Public (or Private? Admin usually needs listing, public might verify)
router.get('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/certificates/verify/:id
// @desc    Verify certificate by ID
// @access  Public
router.get('/verify/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_id', req.params.id)
            .single();

        if (error) return res.status(404).json({ success: false, error: 'Certificate not found' });
        res.json({ success: true, valid: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/certificates
// @desc    Create/Issue certificate
// @access  Private
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { studentName, course, date, certificateId, downloadUrl } = req.body;

        const payload = {
            student_name: studentName,
            course,
            date,
            certificate_id: certificateId,
            download_url: downloadUrl
        };

        const { data, error } = await supabase.from('certificates').insert(payload).select().single();
        if (error) throw error;
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/certificates/:id
// @desc    Revoke/Delete certificate
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { error } = await supabase.from('certificates').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
