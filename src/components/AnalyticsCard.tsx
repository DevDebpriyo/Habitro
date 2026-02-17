/**
 * AnalyticsCard — Generic card wrapper for analytics sections.
 * Matches the dark surface container + rounded 3xl style.
 */
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { darkTheme, spacing, radii, shadows } from '../theme';

interface Props {
    children: ReactNode;
    style?: ViewStyle;
}

export default function AnalyticsCard({ children, style }: Props) {
    return (
        <View style={[styles.card, shadows.elevation1, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: darkTheme.surfaceDark2,
        padding: spacing.xl,
        borderRadius: radii.xl,
    },
});
