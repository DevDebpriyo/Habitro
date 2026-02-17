/**
 * Express API server for the Habit Tracker.
 * Connects to MongoDB Atlas and exposes REST endpoints.
 *
 * Usage:  node server/server.js
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Routine, Completion } = require('./models');

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
//  ROUTINE ENDPOINTS
// ═══════════════════════════════════════════

// GET all routines (sorted by order)
app.get('/api/routines', async (req, res) => {
    try {
        const routines = await Routine.find().sort({ order: 1 });
        res.json(routines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new routine
app.post('/api/routines', async (req, res) => {
    try {
        const { routineId, title, startTime, endTime, category, required } = req.body;
        const count = await Routine.countDocuments();
        const routine = await Routine.create({
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
app.put('/api/routines/:routineId', async (req, res) => {
    try {
        const routine = await Routine.findOneAndUpdate(
            { routineId: req.params.routineId },
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
app.delete('/api/routines/:routineId', async (req, res) => {
    try {
        await Routine.findOneAndDelete({ routineId: req.params.routineId });
        await Completion.deleteMany({ routineId: req.params.routineId });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════
//  COMPLETION ENDPOINTS
// ═══════════════════════════════════════════

// GET completions (optional ?date= filter, or all)
app.get('/api/completions', async (req, res) => {
    try {
        const filter = {};
        if (req.query.date) filter.date = req.query.date;
        const completions = await Completion.find(filter);
        res.json(completions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST toggle a completion
app.post('/api/completions/toggle', async (req, res) => {
    try {
        const { date, routineId } = req.body;
        const existing = await Completion.findOne({ date, routineId });

        if (existing) {
            existing.completed = !existing.completed;
            existing.timestamp = Date.now();
            await existing.save();
            res.json(existing);
        } else {
            const completion = await Completion.create({
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

// DELETE all completions (clear history)
app.delete('/api/completions', async (req, res) => {
    try {
        await Completion.deleteMany({});
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST reset routines to defaults (re-seed)
app.post('/api/reset', async (req, res) => {
    try {
        const { Routine: R } = require('./models');
        await R.deleteMany({});
        const demoRoutines = [
            { routineId: 'r1', title: 'Morning Meditation', startTime: '06:00', endTime: '06:15', category: 'Mindfulness', required: true, order: 0 },
            { routineId: 'r2', title: 'Exercise Routine', startTime: '06:30', endTime: '07:15', category: 'Fitness', required: true, order: 1 },
            { routineId: 'r3', title: 'Healthy Breakfast', startTime: '07:30', endTime: '08:00', category: 'Health', required: true, order: 2 },
            { routineId: 'r4', title: 'Deep Work Block', startTime: '09:00', endTime: '11:00', category: 'Work', required: true, order: 3 },
            { routineId: 'r5', title: 'Reading', startTime: '12:00', endTime: '12:30', category: 'Growth', required: true, order: 4 },
            { routineId: 'r6', title: 'Journaling', startTime: '20:00', endTime: '20:30', category: 'Mind', required: true, order: 5 },
            { routineId: 'r7', title: 'Evening Walk', startTime: '18:00', endTime: '18:45', category: 'Wellness', required: true, order: 6 },
            { routineId: 'r8', title: 'Skill Practice', startTime: '21:00', endTime: '22:00', category: 'Growth', required: false, order: 7 },
        ];
        await R.insertMany(demoRoutines);
        res.json({ success: true, count: demoRoutines.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Health check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ── Start (bind to 0.0.0.0 so physical devices on the same Wi-Fi can reach it) ──
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API server running on http://0.0.0.0:${PORT}`);
});
