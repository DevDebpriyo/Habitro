/**
 * ScreenTransition — Premium fade-up animation for tab switching.
 * Simulates content rising from the bottom smoothly.
 */
import React, { useRef, useCallback } from 'react';
import { Animated, ViewStyle, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';

interface Props {
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function ScreenTransition({ children, style }: Props) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(25)).current; // Start 25px lower

    useFocusEffect(
        useCallback(() => {
            // Reset to initial state immediately upon focus
            opacity.setValue(0);
            translateY.setValue(25);

            // Animate In strictly
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    mass: 0.8,
                    damping: 15,
                    stiffness: 100,
                    useNativeDriver: true,
                }),
            ]).start();

            return () => { }; // No cleanup needed
        }, [])
    );

    return (
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }, style]}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
