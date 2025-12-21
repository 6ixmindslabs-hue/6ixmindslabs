/**
 * 6ixminds Labs Backend Server
 * 
 * Express.js API server for admin panel and website
 */
// Restart trigger

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Mongoose removed for Supabase migration
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet());

app.use(cors()); // Allow all origins strictly for now to fix user issue

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Login rate limiting
const loginLimiter = rateLimit({
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 5,
    message: { success: false, error: 'Too many login attempts, please try again in 15 minutes.' },
    skipSuccessfulRequests: true,
});

// ============================================
// Database Connection
// ============================================

// ============================================
// Routes
// ============================================

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '6ixminds Labs Backend API is running. Access endpoints at /api/...',
        timestamp: new Date().toISOString(),
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '6ixminds Labs API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// API routes
app.use('/api/team', require('./routes/team'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/messages', require('./routes/messages'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/pages', require('./routes/pages'));

// Temporary mock routes for development
app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;

    // TODO: Replace with actual authentication
    if (username === '6ixmindslabs' && password === '6@Minds^Labs') {
        res.json({
            success: true,
            token: 'demo_jwt_token_' + Date.now(),
            refreshToken: 'demo_refresh_token_' + Date.now(),
            user: {
                id: 1,
                username: '6ixmindslabs',
                email: 'admin@6ixmindslabs.com',
                role: 'super-admin',
            },
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid credentials',
        });
    }
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Don't expose stack traces in production
    const error = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(err.status || 500).json({
        success: false,
        error,
    });
});

// Database Connection and Server Startup
const connectDB = async () => {
    try {
        const supabase = require('./config/supabaseClient');
        const { data, error } = await supabase.from('team_members').select('count', { count: 'exact', head: true });

        if (error && error.code !== '42P01') { // 42P01 is "undefined_table" which means connection worked but table missing
            throw error;
        }

        console.log('✅ Connected to Supabase');
        if (error && error.code === '42P01') {
            console.warn('⚠️  Warning: "team_members" table does not exist in Supabase.');
            console.warn('   Please run the SQL in backend/SUPABASE_SCHEMA.sql in your Supabase SQL Editor.');
        }
    } catch (err) {
        console.error('❌ Supabase connection error:', err.message);
        // We don't exit process here because Supabase is stateless, maybe network blip
    }
};

// Start server if running directly
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 6ixminds Labs Backend Server (Supabase Edition)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡 Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        });
    });
} else {
    // For Vercel/Serverless
    connectDB();
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
