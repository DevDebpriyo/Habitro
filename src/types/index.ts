/**
 * Core type definitions for the Daily Routine & Habit Tracker.
 * Separates template from daily completion for clean analytics.
 */

/** Category identifiers matching the M3 chip color system */
export type Category = 'Mindfulness' | 'Work' | 'Fitness' | 'Wellness' | 'Health' | 'Growth' | 'Mind';

/** Routine template — the blueprint for a recurring task */
export interface RoutineItem {
  id: string;
  title: string;
  startTime: string;   // "07:00"
  endTime: string;      // "07:15"  or "All Day"
  category: Category;
  required: boolean;     // whether the toggle is on/off in editor
}

/** Daily completion record — one per routine item per day */
export interface CompletionRecord {
  date: string;          // "YYYY-MM-DD"
  routineId: string;
  completed: boolean;
  timestamp: number;     // epoch ms when toggled
}

/** Streak data */
export interface StreakData {
  currentStreak: number;
  bestStreak: number;
}

/** Single day's stats */
export interface DayStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

/** Weekly overview for bar chart */
export interface WeeklyData {
  days: DayStats[];
}

/** Smart insight / suggestion */
export interface Insight {
  id: string;
  icon: string;          // Material icon name
  title: string;
  description: string;
  type: 'warning' | 'info';  // amber vs default card style
}
