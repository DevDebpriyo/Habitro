/**
 * Express API server for the Habit Tracker.
 * Full auth (JWT + bcrypt) + per-user data isolation.
 *
 * Usage:  node server/server.js
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { User, Routine, Completion } = require('./models');
const { generateToken, authMiddleware } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.DATABASE_URL;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Connect to MongoDB ──
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ═══════════════════════════════════════════
//  AUTH ENDPOINTS (public)
// ═══════════════════════════════════════════

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check duplicate
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        // Hash & create
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
        });

        // Seed default routines for new user
        const defaultRoutines = [
            { routineId: `r_${Date.now()}_1`, title: 'Morning Meditation', startTime: '06:00', endTime: '06:15', category: 'Mindfulness', required: true, order: 0 },
            { routineId: `r_${Date.now()}_2`, title: 'Exercise Routine', startTime: '06:30', endTime: '07:15', category: 'Fitness', required: true, order: 1 },
            { routineId: `r_${Date.now()}_3`, title: 'Healthy Breakfast', startTime: '07:30', endTime: '08:00', category: 'Health', required: true, order: 2 },
            { routineId: `r_${Date.now()}_4`, title: 'Deep Work Block', startTime: '09:00', endTime: '11:00', category: 'Work', required: true, order: 3 },
        ];
        await Routine.insertMany(defaultRoutines.map(r => ({ ...r, userId: user._id })));

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me — get current user profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// ═══════════════════════════════════════════
//  ROUTINE ENDPOINTS (protected)
// ═══════════════════════════════════════════

// GET all routines for this user
app.get('/api/routines', authMiddleware, async (req, res) => {
    try {
        const routines = await Routine.find({ userId: req.userId }).sort({ order: 1 });
        res.json(routines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new routine
app.post('/api/routines', authMiddleware, async (req, res) => {
    try {
        const { routineId, title, startTime, endTime, category, required } = req.body;
        const count = await Routine.countDocuments({ userId: req.userId });
        const routine = await Routine.create({
            userId: req.userId,
            routineId: routineId || `r_${Date.now()}`,
            title,
            startTime: startTime || '00:00',
            endTime: endTime || '',
            category: category || 'Work',
            required: required !== undefined ? required : true,
            order: count,
        });
        res.status(201).json(routine);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a routine
app.put('/api/routines/:routineId', authMiddleware, async (req, res) => {
    try {
        const routine = await Routine.findOneAndUpdate(
            { routineId: req.params.routineId, userId: req.userId },
            { $set: req.body },
            { new: true }
        );
        if (!routine) return res.status(404).json({ error: 'Routine not found' });
        res.json(routine);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a routine (and its completions)
app.delete('/api/routines/:routineId', authMiddleware, async (req, res) => {
    try {
        await Routine.findOneAndDelete({ routineId: req.params.routineId, userId: req.userId });
        await Completion.deleteMany({ routineId: req.params.routineId, userId: req.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════
//  COMPLETION ENDPOINTS (protected)
// ═══════════════════════════════════════════

// GET completions for this user
app.get('/api/completions', authMiddleware, async (req, res) => {
    try {
        const filter = { userId: req.userId };
        if (req.query.date) filter.date = req.query.date;
        const completions = await Completion.find(filter);
        res.json(completions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST toggle a completion
app.post('/api/completions/toggle', authMiddleware, async (req, res) => {
    try {
        const { date, routineId } = req.body;
        const existing = await Completion.findOne({ date, routineId, userId: req.userId });

        if (existing) {
            existing.completed = !existing.completed;
            existing.timestamp = Date.now();
            await existing.save();
            res.json(existing);
        } else {
            const completion = await Completion.create({
                userId: req.userId,
                date,
                routineId,
                completed: true,
                timestamp: Date.now(),
            });
            res.status(201).json(completion);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE all completions for this user (clear history)
app.delete('/api/completions', authMiddleware, async (req, res) => {
    try {
        await Completion.deleteMany({ userId: req.userId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST reset routines to defaults for this user
app.post('/api/reset', authMiddleware, async (req, res) => {
    try {
        await Routine.deleteMany({ userId: req.userId });
        const now = Date.now();
        const demoRoutines = [
            { userId: req.userId, routineId: `r_${now}_1`, title: 'Morning Meditation', startTime: '06:00', endTime: '06:15', category: 'Mindfulness', required: true, order: 0 },
            { userId: req.userId, routineId: `r_${now}_2`, title: 'Exercise Routine', startTime: '06:30', endTime: '07:15', category: 'Fitness', required: true, order: 1 },
            { userId: req.userId, routineId: `r_${now}_3`, title: 'Healthy Breakfast', startTime: '07:30', endTime: '08:00', category: 'Health', required: true, order: 2 },
            { userId: req.userId, routineId: `r_${now}_4`, title: 'Deep Work Block', startTime: '09:00', endTime: '11:00', category: 'Work', required: true, order: 3 },
            { userId: req.userId, routineId: `r_${now}_5`, title: 'Reading', startTime: '12:00', endTime: '12:30', category: 'Growth', required: true, order: 4 },
            { userId: req.userId, routineId: `r_${now}_6`, title: 'Journaling', startTime: '20:00', endTime: '20:30', category: 'Mind', required: true, order: 5 },
            { userId: req.userId, routineId: `r_${now}_7`, title: 'Evening Walk', startTime: '18:00', endTime: '18:45', category: 'Wellness', required: true, order: 6 },
            { userId: req.userId, routineId: `r_${now}_8`, title: 'Skill Practice', startTime: '21:00', endTime: '22:00', category: 'Growth', required: false, order: 7 },
        ];
        await Routine.insertMany(demoRoutines);
        res.json({ success: true, count: demoRoutines.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Health check (public) ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ── Start (bind to 0.0.0.0 so physical devices on the same Wi-Fi can reach it) ──
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API server running on http://0.0.0.0:${PORT}`);
});
