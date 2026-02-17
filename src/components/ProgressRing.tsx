/**
 * ProgressRing — Animated circular SVG progress indicator.
 * Matches the home screen design: sage green ring on dark surface.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { darkTheme, spacing, fontSize } from '../theme';

interface Props {
    completed: number;
    total: number;
    size?: number;
    strokeWidth?: number;
}

export default function ProgressRing({
    completed,
    total,
    size = 200,
    strokeWidth = 12,
}: Props) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = total > 0 ? completed / total : 0;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                {/* Background track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={darkTheme.surfaceContainerHigh}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                />
                {/* Progress arc */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={darkTheme.sageGreen}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                />
            </Svg>
            {/* Center text */}
            <View style={styles.centerText}>
                <Text style={styles.fraction}>
                    <Text style={styles.numerator}>{completed}</Text>
                    <Text style={styles.denominator}>/{total}</Text>
                </Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>DAILY GOAL</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerText: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fraction: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    numerator: {
        fontSize: fontSize.displayLarge,
        fontWeight: '300',
        color: darkTheme.onSurface,
    },
    denominator: {
        fontSize: 28,
        fontWeight: '300',
        color: darkTheme.onSurfaceVariant,
    },
    badge: {
        marginTop: spacing.sm,
        backgroundColor: 'rgba(172,199,166,0.1)',
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    badgeText: {
        fontSize: fontSize.caption,
        fontWeight: '500',
        color: darkTheme.sageGreen,
        letterSpacing: 1.5,
    },
});
