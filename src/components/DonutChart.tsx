/**
 * DonutChart — SVG donut/pie chart for the analytics "Today's Focus" section.
 * Shows completion percentage in the center.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { darkTheme, fontSize } from '../theme';

interface Props {
    percentage: number; // 0-100
    size?: number;
    strokeWidth?: number;
}

export default function DonutChart({ percentage, size = 140, strokeWidth = 14 }: Props) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(percentage, 100) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                {/* Background track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(100,116,139,0.2)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress arc */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={darkTheme.mutedIndigo}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                />
            </Svg>
            <View style={styles.centerText}>
                <Text style={styles.percentage}>
                    {Math.round(percentage)}
                    <Text style={styles.percentSign}>%</Text>
                </Text>
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
    percentage: {
        fontSize: 28,
        fontWeight: '400',
        color: '#f1f5f9',
    },
    percentSign: {
        fontSize: fontSize.title,
    },
});
