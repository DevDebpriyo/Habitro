/**
 * SectionHeader — Styled section title with optional right-side action.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { darkTheme, spacing, fontSize } from '../theme';

interface Props {
    title: string;
    actionText?: string;
    onAction?: () => void;
    variant?: 'default' | 'uppercase';
}

export default function SectionHeader({ title, actionText, onAction, variant = 'default' }: Props) {
    return (
        <View style={styles.container}>
            <Text style={[styles.title, variant === 'uppercase' && styles.uppercase]}>
                {title}
            </Text>
            {actionText && (
                <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.sm,
    },
    title: {
        fontSize: fontSize.title + 2,
        fontWeight: '400',
        color: darkTheme.onSurface,
    },
    uppercase: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: darkTheme.onSurfaceVariant,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    actionBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 9999,
    },
    actionText: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: darkTheme.sageGreen,
    },
});
