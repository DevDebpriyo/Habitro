/**
 * HeatmapGrid — GitHub-style activity grid.
 * 7 columns × 4 rows = 28 cells for 4 weeks of data.
 * Color intensity maps to completion percentage.
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { darkTheme, spacing, radii, fontSize } from '../theme';

interface Props {
    data: number[]; // 28 values between 0 and 1
}

/** Map a 0-1 value to a heatmap color */
function getHeatmapColor(value: number): string {
    const colors = darkTheme.heatmap;
    if (value <= 0) return colors[0];
    if (value < 0.2) return colors[1];
    if (value < 0.4) return colors[2];
    if (value < 0.6) return colors[3];
    if (value < 0.8) return colors[4];
    if (value < 0.95) return colors[5];
    return colors[6];
}

export default function HeatmapGrid({ data }: Props) {
    const screenWidth = Dimensions.get('window').width;
    const gridPadding = spacing.xl * 2 + spacing.base * 2;
    const gap = spacing.sm;
    const cellSize = Math.floor((screenWidth - gridPadding - gap * 6) / 7);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.description}>
                    Consistency over the last 30 days.{'\n'}
                    <Text style={styles.subDescription}>Darker green indicates higher activity.</Text>
                </Text>
            </View>
            <View style={styles.grid}>
                {data.map((value, index) => (
                    <View
                        key={index}
                        style={[
                            styles.cell,
                            {
                                width: cellSize,
                                height: cellSize,
                                backgroundColor: getHeatmapColor(value),
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: darkTheme.surfaceDark2,
        padding: spacing.xl,
        borderRadius: radii.xl,
        gap: spacing.lg,
    },
    header: {},
    description: {
        fontSize: fontSize.body,
        color: '#94a3b8',
        lineHeight: 20,
    },
    subDescription: {
        fontSize: fontSize.small,
        color: '#64748b',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    cell: {
        borderRadius: 6,
        aspectRatio: 1,
    },
});
