/**
 * Mongoose models for the Habit Tracker.
 */
const mongoose = require('mongoose');

// ── Routine Schema ──
const routineSchema = new mongoose.Schema({
    routineId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, default: '' },
    category: { type: String, required: true },
    required: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

// ── Completion Schema ──
const completionSchema = new mongoose.Schema({
    date: { type: String, required: true },   // YYYY-MM-DD
    routineId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    timestamp: { type: Number, default: Date.now },
}, { timestamps: true });

// Compound index for fast lookups
completionSchema.index({ date: 1, routineId: 1 }, { unique: true });

const Routine = mongoose.model('Routine', routineSchema);
const Completion = mongoose.model('Completion', completionSchema);

module.exports = { Routine, Completion };
