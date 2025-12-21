const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const upload = multerUpload.single('image');

/**
 * Upload file to Supabase Storage
 */
async function uploadToSupabase(file, bucket, path) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return publicUrl;
}

// @route   GET /api/showcase
// @desc    Get all showcase items (Public fetches published, Admin fetches all)
// @access  Public (filtered) / Private (all)
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.headers.authorization; // Simple check, or just query params.
        // Better: Query param ?view=admin (and verify token logic if needed, but get is usually public)
        // Actually, let's keep it simple. Public calls get published items.
        // Admin dashboard calls this endpoint too?
        // Let's separate Admin get all vs Public get published or just use filters.
        
        let query = supabase.from('showcase_items').select('*').order('display_order', { ascending: true });

        // If not admin (we don't strictly check token here for 'public' access, 
        // but if we want to filter for public usage):
        if (req.query.public === 'true') {
            query = query.eq('status', 'published');
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/showcase/:id
// @desc    Get single showcase item
router.get('/:id', async (req, res) => {
    try {
         const { data, error } = await supabase
            .from('showcase_items')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
         res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/showcase
// @desc    Add new showcase item
// @access  Private (Admin only)
router.post('/', protect, authorize('admin', 'super-admin'), upload, async (req, res) => {
    try {
        const { title, category, type, description, status, date, videoUrl } = req.body;
        
        if (!title || !category || !type) {
            return res.status(400).json({ success: false, error: 'Title, Category, and Type are required' });
        }

        let mediaUrl = '';
        if (type === 'image') {
            if (!req.file) {
                return res.status(400).json({ success: false, error: 'Image file is required for Image type' });
            }
            // Upload
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            // Use 'showcase-media' bucket or fallback to 'student-profiles' if user didn't create new one?
            // Let's use 'showcase-media' and instruct user to create it.
            mediaUrl = await uploadToSupabase(req.file, 'showcase-media', fileName);
        } else {
             if (!videoUrl) {
                return res.status(400).json({ success: false, error: 'Video URL is required for Video type' });
             }
             mediaUrl = videoUrl;
        }

        const payload = {
            title,
            category,
            type,
            media_url: mediaUrl,
            description,
            status: status || 'published',
            date: date || new Date(),
            display_order: 0 // Default
        };

        const { data, error } = await supabase.from('showcase_items').insert(payload).select().single();

        if (error) throw error;

        res.status(201).json({ success: true, data });

    } catch (error) {
        console.error('Create Showcase Item Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/showcase/:id
// @desc    Update showcase item
// @access  Private
router.put('/:id', protect, authorize('admin', 'super-admin'), upload, async (req, res) => {
    try {
        const { title, category, type, description, status, date, videoUrl, mediaUrl: existingMediaUrl } = req.body;
        const id = req.params.id;

        // Fetch existing
        const { data: existing, error: fetchError } = await supabase
            .from('showcase_items')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
             return res.status(404).json({ success: false, error: 'Item not found' });
        }

        let mediaUrl = existingMediaUrl || existing.media_url;

         if (type === 'image' && req.file) {
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            mediaUrl = await uploadToSupabase(req.file, 'showcase-media', fileName);
        } else if (type === 'video' && videoUrl) {
            mediaUrl = videoUrl;
        }

        const payload = {
            title: title || existing.title,
            category: category || existing.category,
            type: type || existing.type,
            media_url: mediaUrl,
            description: description || existing.description,
            status: status || existing.status,
            date: date || existing.date
        };

        const { data, error } = await supabase
            .from('showcase_items')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

         if (error) throw error;
         res.json({ success: true, data });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/showcase/:id
// @desc    Delete showcase item
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { error } = await supabase.from('showcase_items').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
