/**
 * RoutineItemCard — Task card for the home screen.
 * Shows checkbox, title, time range, and category badge.
 * Completed items get opacity + strikethrough styling.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkTheme, spacing, fontSize, radii, CategoryColors } from '../theme';

interface Props {
    title: string;
    startTime: string;
    endTime: string;
    category: string;
    isCompleted: boolean;
    onToggle: () => void;
}

export default function RoutineItemCard({
    title,
    startTime,
    endTime,
    category,
    isCompleted,
    onToggle,
}: Props) {
    const chipColor = CategoryColors[category] ?? CategoryColors['Mind'];
    const timeText = endTime ? `${startTime} - ${endTime}` : startTime;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            style={[
                styles.container,
                isCompleted && styles.containerCompleted,
            ]}
        >
            {/* Checkbox */}
            <View style={styles.checkboxWrap}>
                <View
                    style={[
                        styles.checkbox,
                        isCompleted && [styles.checkboxChecked, { backgroundColor: chipColor.dot, borderColor: chipColor.dot }],
                    ]}
                >
                    {isCompleted && (
                        <MaterialCommunityIcons name="check" size={14} color={darkTheme.surfaceContainer} />
                    )}
                </View>
            </View>

            {/* Content */}
            <View style={[styles.content, isCompleted && styles.contentCompleted]}>
                <View style={styles.topRow}>
                    <Text
                        style={[
                            styles.title,
                            isCompleted && styles.titleCompleted,
                        ]}
                    >
                        {title}
                    </Text>
                    {/* Category badge */}
                    <View style={[styles.categoryBadge, { backgroundColor: chipColor.bg }]}>
                        <View style={[styles.categoryDot, { backgroundColor: chipColor.dot }]} />
                        <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Time */}
                <View style={styles.timeRow}>
                    <MaterialCommunityIcons
                        name="clock-outline"
                        size={14}
                        color={darkTheme.onSurfaceVariant}
                    />
                    <Text style={styles.timeText}>{timeText}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.base,
        padding: spacing.base,
        backgroundColor: darkTheme.surfaceContainer,
        borderRadius: radii.lg,
    },
    containerCompleted: {
        backgroundColor: 'rgba(30,30,30,0.4)',
    },
    checkboxWrap: {
        paddingTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: darkTheme.outline,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        borderWidth: 0,
    },
    content: {
        flex: 1,
        gap: 4,
    },
    contentCompleted: {
        opacity: 0.5,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    title: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.onSurface,
        letterSpacing: 0.3,
        flex: 1,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        textDecorationColor: darkTheme.outline,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    categoryText: {
        fontSize: fontSize.caption,
        fontWeight: '500',
        color: darkTheme.onSurfaceVariant,
        letterSpacing: 1,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    timeText: {
        fontSize: fontSize.body,
        color: darkTheme.onSurfaceVariant,
    },
});
