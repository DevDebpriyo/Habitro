/**
 * Analytics Screen — Habit analytics dashboard.
 * Reactive: subscribes to routines + completions directly.
 */
import React, { useMemo, useEffect } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, StatusBar, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutineStore } from '../../src/store/useRoutineStore';
import DonutChart from '../../src/components/DonutChart';
import WeeklyBarChart from '../../src/components/WeeklyBarChart';
import HeatmapGrid from '../../src/components/HeatmapGrid';
import InsightCard from '../../src/components/InsightCard';
import { darkTheme, spacing, fontSize, radii, shadows } from '../../src/theme';
import { getToday, getLastNDays, getDayAbbr } from '../../src/utils/dateHelpers';
import { calculateCurrentStreak, calculateBestStreak } from '../../src/utils/streaks';
import { generateInsights } from '../../src/analytics/insights';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;

export default function AnalyticsScreen() {
    // ✅ Subscribe to primitive state for reactivity
    const routines = useRoutineStore(s => s.routines);
    const completions = useRoutineStore(s => s.completions);
    const fetchAll = useRoutineStore(s => s.fetchAll);

    useEffect(() => {
        fetchAll();
    }, []);

    const today = getToday();

    // ✅ All computed data is reactive via useMemo
    const { completed, total, percentage, statusText } = useMemo(() => {
        const todayRecords = completions.filter(c => c.date === today);
        const items = routines.map(r => ({
            ...r,
            isCompleted: todayRecords.find(c => c.routineId === r.id)?.completed ?? false,
        }));
        const comp = items.filter(i => i.isCompleted).length;
        const tot = routines.length;
        const pct = tot > 0 ? Math.round((comp / tot) * 100) : 0;
        let status = 'Keep going!';
        if (pct >= 80) status = 'Great work!';
        else if (pct >= 50) status = 'Almost there';
        else if (pct >= 25) status = 'Good start';
        return { completed: comp, total: tot, percentage: pct, statusText: status };
    }, [routines, completions, today]);

    const weeklyData = useMemo(() => {
        const last7 = getLastNDays(7);
        return last7.map(date => {
            const dayRecords = completions.filter(c => c.date === date);
            const completedCount = dayRecords.filter(c => c.completed).length;
            const tot = routines.length;
            return { date, completed: completedCount, total: tot, percentage: tot > 0 ? completedCount / tot : 0 };
        });
    }, [routines, completions]);

    const streaks = useMemo(() => ({
        currentStreak: calculateCurrentStreak(completions, routines),
        bestStreak: calculateBestStreak(completions, routines),
    }), [routines, completions]);

    const insights = useMemo(() => generateInsights(completions, routines), [routines, completions]);

    const heatmapData = useMemo(() => {
        const last28 = getLastNDays(28);
        return last28.map(date => {
            const dayRecords = completions.filter(c => c.date === date);
            const completedCount = dayRecords.filter(c => c.completed).length;
            const tot = routines.length;
            return tot > 0 ? completedCount / tot : 0;
        });
    }, [routines, completions]);

    const todayDate = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateLabel = `${months[todayDate.getMonth()]} ${todayDate.getDate()}`;

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={darkTheme.surfaceDark1} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Analytics</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Text style={styles.filterText}>This Week</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* TODAY'S FOCUS section label */}
                <View style={styles.sectionLabelRow}>
                    <Text style={styles.sectionLabel}>TODAY'S FOCUS</Text>
                    <Text style={styles.sectionLabelRight}>{dateLabel}</Text>
                </View>

                {/* Today's Focus Card */}
                <View style={[styles.focusCard, shadows.elevation1]}>
                    <DonutChart percentage={percentage} />
                    <View style={styles.focusText}>
                        <Text style={styles.focusTitle}>{statusText}</Text>
                        <Text style={styles.focusSubtitle}>
                            You've completed{' '}
                            <Text style={styles.focusHighlight}>{completed} of {total}</Text>
                            {' '}habits today.
                        </Text>
                        <TouchableOpacity style={styles.viewDetailsBtn}>
                            <Text style={styles.viewDetailsText}>View Details</Text>
                            <MaterialCommunityIcons name="arrow-right" size={16} color={darkTheme.mutedIndigoLight} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Streak Cards */}
                <View style={styles.streakRow}>
                    {/* Current Streak */}
                    <View style={[styles.streakCard, shadows.elevation1]}>
                        <View style={styles.streakGlow} />
                        <View style={styles.streakLabelRow}>
                            <MaterialCommunityIcons
                                name="fire"
                                size={20}
                                color={darkTheme.primaryLight}
                            />
                            <Text style={[styles.streakLabel, { color: darkTheme.primaryLight }]}>CURRENT</Text>
                        </View>
                        <View style={styles.streakValue}>
                            <Text style={styles.streakNumber}>{streaks.currentStreak}</Text>
                            <Text style={styles.streakUnit}>Days</Text>
                        </View>
                    </View>

                    {/* Best Streak */}
                    <View style={[styles.streakCard, shadows.elevation1]}>
                        <View style={[styles.streakGlow, { backgroundColor: 'rgba(56,106,104,0.1)' }]} />
                        <View style={styles.streakLabelRow}>
                            <MaterialCommunityIcons
                                name="trophy"
                                size={20}
                                color={darkTheme.tealLight}
                            />
                            <Text style={[styles.streakLabel, { color: darkTheme.tealLight }]}>BEST</Text>
                        </View>
                        <View style={styles.streakValue}>
                            <Text style={styles.streakNumber}>{streaks.bestStreak}</Text>
                            <Text style={styles.streakUnit}>Days</Text>
                        </View>
                    </View>
                </View>

                {/* Weekly Completion Bar Chart */}
                <WeeklyBarChart data={weeklyData} />

                {/* Activity Log / Heatmap */}
                <View style={styles.sectionLabelRow}>
                    <Text style={styles.activityTitle}>Activity Log</Text>
                </View>
                <HeatmapGrid data={heatmapData} />

                {/* Smart Insights */}
                <View style={styles.sectionLabelRow}>
                    <Text style={styles.activityTitle}>Smart Insights</Text>
                </View>
                <View style={styles.insightsContainer}>
                    {insights.map(insight => (
                        <InsightCard key={insight.id} insight={insight} />
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: darkTheme.surfaceDark1,
        paddingTop: STATUSBAR_HEIGHT,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.base,
    },
    headerTitle: {
        fontSize: fontSize.titleLarge,
        fontWeight: '400',
        color: '#e2e8f0',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: 'rgba(100,116,139,0.2)',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: 9999,
    },
    filterText: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: '#cbd5e1',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.base,
        paddingTop: spacing.sm,
        gap: spacing.base,
    },
    sectionLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    sectionLabel: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    sectionLabelRight: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: '#94a3b8',
    },
    focusCard: {
        backgroundColor: darkTheme.surfaceDark2,
        padding: spacing.xl,
        borderRadius: radii.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
        overflow: 'hidden',
    },
    focusText: {
        flex: 1,
        gap: spacing.sm,
    },
    focusTitle: {
        fontSize: fontSize.title + 2,
        fontWeight: '500',
        color: '#f1f5f9',
    },
    focusSubtitle: {
        fontSize: fontSize.body,
        color: '#94a3b8',
        lineHeight: 20,
    },
    focusHighlight: {
        fontWeight: '700',
        color: darkTheme.mutedIndigoLight,
    },
    viewDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.sm,
        backgroundColor: 'rgba(79,99,172,0.2)',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        borderRadius: 9999,
        alignSelf: 'flex-start',
    },
    viewDetailsText: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: darkTheme.mutedIndigoLight,
    },
    streakRow: {
        flexDirection: 'row',
        gap: spacing.base,
    },
    streakCard: {
        flex: 1,
        backgroundColor: darkTheme.surfaceDark2,
        padding: spacing.lg,
        borderRadius: radii.xl,
        justifyContent: 'space-between',
        height: 128,
        position: 'relative',
        overflow: 'hidden',
    },
    streakGlow: {
        position: 'absolute',
        right: -16,
        top: -16,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(114,84,125,0.1)',
    },
    streakLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    streakLabel: {
        fontSize: fontSize.small,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        opacity: 0.8,
    },
    streakValue: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    streakNumber: {
        fontSize: 36,
        fontWeight: '400',
        color: '#f1f5f9',
    },
    streakUnit: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: '#94a3b8',
    },
    activityTitle: {
        fontSize: fontSize.title,
        fontWeight: '400',
        color: '#e2e8f0',
    },
    insightsContainer: {
        gap: spacing.base,
    },
});
