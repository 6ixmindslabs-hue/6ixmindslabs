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

const upload = multerUpload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'certificateFile', maxCount: 1 }
]);

/**
 * Generate a unique Certificate ID
 * Format: 6ML-IN-YYYY-XXXXX
 * 
 * Logic:
 * 1. Fetch latest certificate by Primary Key (id) to ensure correct latest record.
 * 2. Extract numeric part from 'certificate_number' or 'certificate_id'.
 * 3. Increment and Pad to 5 digits (e.g. 9 -> 00009, 10 -> 00010).
 */
async function generateCertificateId() {
    const year = new Date().getFullYear();
    const prefix = `6ML-IN-${year}-`;

    try {
        // STEP 1: Get the last certificate from the database
        // Order by 'id' (PK) DESC to get the absolutely latest entry
        const { data, error } = await supabase
            .from('certificates')
            .select('certificate_id, certificate_number')
            .order('id', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching last certificate:', error);
            throw new Error('Failed to generate certificate ID');
        }

        // STEP 2: Determine the next certificate number
        let lastNum = 0;

        if (data && data.length > 0) {
            const lastCert = data[0];

            // Priority: Use certificate_number column if available
            if (lastCert.certificate_number) {
                lastNum = parseInt(lastCert.certificate_number, 10); // "00009" -> 9
            }
            // Fallback: Extract from certificate_id string
            else if (lastCert.certificate_id) {
                const parts = lastCert.certificate_id.split('-'); // ["6ML", "IN", "2025", "00009"]
                const numericPart = parts[parts.length - 1]; // "00009"
                lastNum = parseInt(numericPart, 10);
            }
        }

        if (isNaN(lastNum)) lastNum = 0;

        const nextNum = lastNum + 1;

        // STEP 3: Format the certificate number with zero-padding (Length 5)
        // 1 -> 00001, 9 -> 00009, 10 -> 00010
        const paddedNum = String(nextNum).padStart(5, '0');
        const certificateId = `${prefix}${paddedNum}`;

        console.log(`Generated Certificate ID: ${certificateId} (Number: ${paddedNum})`);

        return {
            certificateId,
            certificateNumber: paddedNum
        };

    } catch (error) {
        console.error('Certificate ID Generation Error:', error);
        throw new Error('Unable to generate certificate ID. Please try again.');
    }
}


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

// @route   GET /api/certificates
// @desc    Get all certificates
// @access  Private (Admin only)
router.get('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false });

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

        if (error || !data) {
            return res.status(404).json({ success: false, error: 'Invalid or Unverified Certificate ❌' });
        }
        res.json({ success: true, valid: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/certificates
// @desc    Create/Issue certificate (with file uploads)
// @access  Private (Admin only)
router.post('/', protect, authorize('admin', 'super-admin'), upload, async (req, res) => {
    try {
        const { studentName, internshipTitle, issueDate, skills, internshipDuration, startDate, endDate } = req.body;

        if (!studentName || !internshipTitle || !issueDate) {
            return res.status(400).json({ success: false, error: 'Student Name, Internship Title, and Issue Date are required.' });
        }

        // Validate required files
        if (!req.files['profilePhoto'] || !req.files['certificateFile']) {
            return res.status(400).json({
                success: false,
                error: 'Both Profile Photo and Certificate File are required to issue a certificate.'
            });
        }

        // Validate internship duration
        if (!internshipDuration) {
            return res.status(400).json({
                success: false,
                error: 'Internship Duration is required.'
            });
        }

        // Validate custom duration dates
        if (internshipDuration === 'Custom') {
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    error: 'Start Date and End Date are required for custom duration.'
                });
            }
        }

        // 1. Generate Backend-only Certificate ID
        const { certificateId, certificateNumber } = await generateCertificateId();

        let profilePhotoUrl = '';
        let certificateFileUrl = '';

        // 2. Upload Profile Photo
        const profileFile = req.files['profilePhoto'][0];
        const profileExt = profileFile.originalname.split('.').pop();
        const profileFileName = `${certificateId}-profile.${profileExt}`;
        profilePhotoUrl = await uploadToSupabase(profileFile, 'student-profiles', profileFileName);

        // 3. Upload Certificate File
        const certFile = req.files['certificateFile'][0];
        const certExt = certFile.originalname.split('.').pop();
        const certFileName = `${certificateId}-cert.${certExt}`;
        certificateFileUrl = await uploadToSupabase(certFile, 'certificates', certFileName);

        const payload = {
            student_name: studentName,
            internship_title: internshipTitle,
            issue_date: issueDate,
            certificate_id: certificateId,
            certificate_number: certificateNumber, // Explicitly storing the number string
            profile_photo_url: profilePhotoUrl,
            certificate_file_url: certificateFileUrl,
            internship_duration: internshipDuration,
            start_date: startDate || null,
            end_date: endDate || null,
            skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : []
        };

        const { data, error } = await supabase.from('certificates').insert(payload).select().single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data,
            verificationUrl: `https://6ixmindslabs.vercel.app/verify/${certificateId}`
        });
    } catch (error) {
        console.error('Issue Certificate Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/certificates/:id
// @desc    Update certificate
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), upload, async (req, res) => {
    try {
        const { studentName, internshipTitle, issueDate, skills, internshipDuration, startDate, endDate } = req.body;
        const certificateId = req.params.id;

        // Get existing certificate
        const { data: existingCert, error: fetchError } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_id', certificateId)
            .single();

        if (fetchError || !existingCert) {
            return res.status(404).json({ success: false, error: 'Certificate not found' });
        }

        // Prepare update payload with existing values as defaults
        let profilePhotoUrl = existingCert.profile_photo_url;
        let certificateFileUrl = existingCert.certificate_file_url;

        // Upload new profile photo if provided
        if (req.files && req.files['profilePhoto']) {
            const profileFile = req.files['profilePhoto'][0];
            const profileExt = profileFile.originalname.split('.').pop();
            const profileFileName = `${certificateId}-profile.${profileExt}`;
            profilePhotoUrl = await uploadToSupabase(profileFile, 'student-profiles', profileFileName);
        }

        // Upload new certificate file if provided
        if (req.files && req.files['certificateFile']) {
            const certFile = req.files['certificateFile'][0];
            const certExt = certFile.originalname.split('.').pop();
            const certFileName = `${certificateId}-cert.${certExt}`;
            certificateFileUrl = await uploadToSupabase(certFile, 'certificates', certFileName);
        }

        const payload = {
            student_name: studentName || existingCert.student_name,
            internship_title: internshipTitle || existingCert.internship_title,
            issue_date: issueDate || existingCert.issue_date,
            profile_photo_url: profilePhotoUrl,
            certificate_file_url: certificateFileUrl,
            internship_duration: internshipDuration || existingCert.internship_duration,
            start_date: startDate || existingCert.start_date,
            end_date: endDate || existingCert.end_date,
            skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : existingCert.skills
        };

        const { data, error } = await supabase
            .from('certificates')
            .update(payload)
            .eq('certificate_id', certificateId)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data,
            message: 'Certificate updated successfully'
        });
    } catch (error) {
        console.error('Update Certificate Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/certificates/:id
// @desc    Revoke/Delete certificate
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
    try {
        const { error } = await supabase.from('certificates').delete().eq('certificate_id', req.params.id);
        if (error) throw error;
        res.json({ success: true, message: 'Certificate revoked successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

