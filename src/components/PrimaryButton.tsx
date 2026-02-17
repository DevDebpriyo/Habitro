/**
 * PrimaryButton — Themed pressable button.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { darkTheme, spacing, radii, fontSize } from '../theme';

interface Props {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    style?: ViewStyle;
}

export default function PrimaryButton({ title, onPress, variant = 'primary', style }: Props) {
    const bgStyle = variant === 'primary'
        ? styles.primaryBg
        : variant === 'danger'
            ? styles.dangerBg
            : styles.secondaryBg;

    const textStyle = variant === 'danger' ? styles.dangerText : styles.buttonText;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.button, bgStyle, style]}
        >
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.xl,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBg: {
        backgroundColor: darkTheme.secondaryContainer,
    },
    secondaryBg: {
        backgroundColor: darkTheme.surfaceDark3,
    },
    dangerBg: {
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.onSurface,
    },
    dangerText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.error,
    },
});
