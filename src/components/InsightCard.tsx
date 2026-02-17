/**
 * InsightCard — Displays a smart suggestion/insight.
 * Two variants: 'warning' (amber) and 'info' (default surface).
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkTheme, spacing, radii, fontSize } from '../theme';
import { Insight } from '../types';

interface Props {
    insight: Insight;
}

/** Map our icon names to MaterialCommunityIcons */
const iconMap: Record<string, string> = {
    lightbulb: 'lightbulb-on',
    calendar_month: 'calendar-month',
    schedule: 'clock-outline',
    trending_down: 'trending-down',
    emoji_events: 'trophy',
};

export default function InsightCard({ insight }: Props) {
    const isWarning = insight.type === 'warning';
    const iconName = iconMap[insight.icon] ?? 'lightbulb-on';

    return (
        <View style={[styles.container, isWarning ? styles.warningContainer : styles.defaultContainer]}>
            {/* Icon */}
            <View style={[styles.iconWrap, isWarning ? styles.warningIcon : styles.defaultIcon]}>
                <MaterialCommunityIcons
                    name={iconName as any}
                    size={24}
                    color={isWarning ? darkTheme.amberText : '#94a3b8'}
                />
            </View>

            {/* Text */}
            <View style={styles.textWrap}>
                <Text style={[styles.title, isWarning && styles.warningTitle]}>
                    {insight.title}
                </Text>
                <Text style={[styles.description, isWarning && styles.warningDescription]}>
                    {insight.description}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.base,
        padding: spacing.lg,
        borderRadius: radii.xl,
    },
    warningContainer: {
        backgroundColor: darkTheme.amberContainer,
    },
    defaultContainer: {
        backgroundColor: darkTheme.surfaceDark2,
    },
    iconWrap: {
        padding: 10,
        borderRadius: radii.md,
    },
    warningIcon: {
        backgroundColor: darkTheme.amberContainerLight,
    },
    defaultIcon: {
        backgroundColor: 'rgba(100,116,139,0.2)',
    },
    textWrap: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: fontSize.body,
        fontWeight: '700',
        color: '#e2e8f0',
    },
    warningTitle: {
        color: darkTheme.amberText,
    },
    description: {
        fontSize: fontSize.body,
        color: '#94a3b8',
        lineHeight: 20,
    },
    warningDescription: {
        color: darkTheme.amberSubtext,
    },
});
