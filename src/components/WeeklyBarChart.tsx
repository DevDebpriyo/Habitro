/**
 * WeeklyBarChart — Bar chart showing 7-day completion rates.
 * Matches the analytics design with indigo bars on dark surface.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme, spacing, fontSize } from '../theme';
import { DayStats } from '../types';
import { getDayAbbr } from '../utils/dateHelpers';

interface Props {
    data: DayStats[];
}

export default function WeeklyBarChart({ data }: Props) {
    // Find today's index (last item)
    const todayIdx = data.length - 1;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Weekly Completion</Text>
                <View style={styles.trendBadge}>
                    <Text style={styles.trendText}>📈 +12%</Text>
                </View>
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
                {data.map((day, index) => {
                    const isToday = index === todayIdx;
                    const height = Math.max(day.percentage * 100, 2); // min visible height
                    const opacity = 0.15 + day.percentage * 0.85;

                    return (
                        <View key={day.date} style={styles.barColumn}>
                            <View style={styles.barTrack}>
                                <View
                                    style={[
                                        styles.barFill,
                                        {
                                            height: `${height}%`,
                                            opacity,
                                            backgroundColor: darkTheme.mutedIndigo,
                                        },
                                        isToday && styles.barFillToday,
                                    ]}
                                />
                            </View>
                            <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                                {getDayAbbr(day.date)}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: darkTheme.surfaceDark2,
        padding: spacing.xl,
        borderRadius: 24,
        gap: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: fontSize.title,
        fontWeight: '400',
        color: '#e2e8f0',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(140,236,231,0.1)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 9999,
    },
    trendText: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: darkTheme.tealLight,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 160,
        gap: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
        gap: spacing.md,
        height: '100%',
    },
    barTrack: {
        flex: 1,
        width: '100%',
        maxWidth: 28,
        backgroundColor: 'rgba(100,116,139,0.15)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    barFill: {
        width: '100%',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    barFillToday: {
        shadowColor: darkTheme.mutedIndigo,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
    },
    dayLabel: {
        fontSize: fontSize.small,
        fontWeight: '500',
        color: '#94a3b8',
    },
    dayLabelToday: {
        fontWeight: '700',
        color: darkTheme.mutedIndigoLight,
    },
});
