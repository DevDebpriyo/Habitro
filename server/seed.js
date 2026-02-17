/**
 * Seed script — creates a demo user and populates their routines + 30 days of completions.
 *
 * Usage:  node server/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Routine, Completion } = require('./models');

const MONGO_URI = process.env.DATABASE_URL;

// ── Demo User ──
const DEMO_EMAIL = 'demo@habittracker.app';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME = 'Alex';

// ── Demo Routines ──
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

function seededRandom(seed) {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function generateCompletions(userId) {
    const rng = seededRandom(42);
    const completions = [];
    const today = new Date();
    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
        const d = new Date(today);
        d.setDate(d.getDate() - dayOffset);
        const dateStr = d.toISOString().split('T')[0];
        for (const routine of demoRoutines) {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            const threshold = isWeekend ? 0.50 : 0.70;
            completions.push({
                userId,
                date: dateStr,
                routineId: routine.routineId,
                completed: rng() < threshold,
                timestamp: d.getTime() + Math.floor(rng() * 86400000),
            });
        }
    }
    return completions;
}

async function seed() {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected!\n');

        // Drop old indexes that don't have userId
        try {
            await Routine.collection.dropIndexes();
            await Completion.collection.dropIndexes();
            console.log('🔧 Dropped old indexes.');
        } catch (e) { /* ignore if no indexes */ }

        // Clear existing data
        await User.deleteMany({});
        await Routine.deleteMany({});
        await Completion.deleteMany({});
        console.log('🧹 Cleared existing data.');

        // Create demo user
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(DEMO_PASSWORD, salt);
        const user = await User.create({ name: DEMO_NAME, email: DEMO_EMAIL, password: hashed });
        console.log(`👤 Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

        // Insert routines
        const routinesWithUser = demoRoutines.map(r => ({ ...r, userId: user._id }));
        await Routine.insertMany(routinesWithUser);
        console.log(`📋 Inserted ${demoRoutines.length} demo routines.`);

        // Insert completions
        const completions = generateCompletions(user._id);
        await Completion.insertMany(completions);
        console.log(`📊 Inserted ${completions.length} completion records.\n`);

        console.log('🎉 Seed complete!');
        console.log(`   Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
