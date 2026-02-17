/**
 * Mongoose models for the Habit Tracker.
 * Includes User (auth), Routine, and Completion schemas.
 */
const mongoose = require('mongoose');

// ── User Schema ──
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

// ── Routine Schema ──
const routineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    routineId: { type: String, required: true },
    title: { type: String, required: true },
    startTime: { type: String, required: true },   // stored as "HH:mm" (24h)
    endTime: { type: String, default: '' },
    category: { type: String, required: true },
    required: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

// Unique per user
routineSchema.index({ userId: 1, routineId: 1 }, { unique: true });

// ── Completion Schema ──
const completionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },   // YYYY-MM-DD
    routineId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timestamp: { type: Number, default: Date.now },
}, { timestamps: true });

// Unique per user + date + routine
completionSchema.index({ userId: 1, date: 1, routineId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Routine = mongoose.model('Routine', routineSchema);
const Completion = mongoose.model('Completion', completionSchema);

module.exports = { User, Routine, Completion };
