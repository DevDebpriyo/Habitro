/**
 * GrowthPlant — Corrected growth logic with distinct stages.
 * Progression: Seed -> Sprout -> Sapling -> Herb -> Shrub -> Tree.
 * Each stage is a separate component managed by View-based opacity.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

interface Props {
    completionPercentage: number; // 0 to 1
}

// Stage Components
const Pot = () => (
    <Svg width={100} height={40} viewBox="0 0 100 40">
        <Defs>
            <LinearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#8D6E63" />
                <Stop offset="1" stopColor="#6D4C41" />
            </LinearGradient>
            <LinearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#5D4037" />
                <Stop offset="1" stopColor="#3E2723" />
            </LinearGradient>
        </Defs>
        <G>
            <Path d="M30,10 L35,35 L65,35 L70,10 Z" fill="url(#potGrad)" />
            <Path d="M28,6 L72,6 L72,10 L28,10 Z" fill="#5D4037" />
            <Ellipse cx="50" cy="10" rx="18" ry="3" fill="url(#soilGrad)" />
        </G>
    </Svg>
);

const Seed = () => (
    <Svg width={20} height={20} viewBox="0 0 20 20">
        <Ellipse cx="10" cy="15" rx="4" ry="3" fill="#A1887F" />
    </Svg>
);

const Sprout = () => (
    <Svg width={40} height={40} viewBox="0 0 40 40">
        <Path d="M20,40 Q20,30 20,20" stroke="#81C784" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M20,20 Q15,15 15,22" stroke="#81C784" strokeWidth="2" fill="none" />
    </Svg>
);

const Sapling = () => (
    <Svg width={40} height={50} viewBox="0 0 40 50">
        <Path d="M20,50 Q22,35 20,20" stroke="#66BB6A" strokeWidth="3" fill="none" />
        <Path d="M20,20 Q5,10 5,25" fill="#66BB6A" />
        <Path d="M20,20 Q35,10 35,25" fill="#66BB6A" />
    </Svg>
);

const Herb = () => (
    <Svg width={50} height={60} viewBox="0 0 50 60">
        <Path d="M25,60 Q30,40 25,15" stroke="#43A047" strokeWidth="3" fill="none" />
        <Path d="M25,35 Q5,30 10,45" fill="#4CAF50" />
        <Path d="M25,25 Q45,20 40,35" fill="#4CAF50" />
        <Path d="M25,15 Q15,5 20,20" fill="#4CAF50" />
    </Svg>
);

const Shrub = () => (
    <Svg width={60} height={70} viewBox="0 0 60 70">
        <Path d="M30,70 Q30,45 30,20" stroke="#388E3C" strokeWidth="4" fill="none" />
        <Path d="M30,45 Q5,35 10,55" fill="#388E3C" />
        <Path d="M30,30 Q55,20 50,40" fill="#388E3C" />
        <Path d="M30,20 Q15,10 30,30 Q45,10 30,20" fill="#388E3C" />
    </Svg>
);

const Tree = () => (
    <Svg width={100} height={100} viewBox="0 0 100 100">
        <Path d="M50,100 Q55,70 50,40" stroke="#3E2723" strokeWidth="6" fill="none" />
        <Path d="M50,70 Q70,60 75,45" stroke="#3E2723" strokeWidth="3" fill="none" />
        <Path d="M50,60 Q30,50 25,35" stroke="#3E2723" strokeWidth="3" fill="none" />
        <Circle cx="50" cy="30" r="20" fill="#2E7D32" />
        <Circle cx="32" cy="45" r="15" fill="#388E3C" />
        <Circle cx="68" cy="45" r="15" fill="#43A047" />
        <Circle cx="50" cy="50" r="15" fill="#4CAF50" />
    </Svg>
);


export default function GrowthPlant({ completionPercentage }: Props) {
    const growAnim = useRef(new Animated.Value(0)).current;

    // Ensure p is clamped 0-1
    const p = Math.min(Math.max(completionPercentage, 0), 1);

    useEffect(() => {
        Animated.timing(growAnim, {
            toValue: p,
            duration: 1000,
            easing: Easing.bezier(0.25, 1, 0.5, 1),
            useNativeDriver: true,
        }).start();
    }, [p]);

    return (
        <View style={styles.container}>
            {/* Pot Layer */}
            <View style={styles.potContainer}>
                <Pot />
            </View>

            {/* Stage Layers (Absolute on top of pot) */}

            {/* Seed: 0% -> Fade Out at 5% */}
            <Animated.View style={[styles.stage, { opacity: growAnim.interpolate({ inputRange: [0, 0.05], outputRange: [1, 0] }) }]}>
                <Seed />
            </Animated.View>

            {/* Sprout: 5% -> 15% -> 25% -> 30% */}
            <Animated.View style={[styles.stage, { bottom: 35, opacity: growAnim.interpolate({ inputRange: [0.05, 0.15, 0.25, 0.30], outputRange: [0, 1, 1, 0] }) }]}>
                <Sprout />
            </Animated.View>

            {/* Sapling: 25% -> 35% -> 45% -> 50% */}
            <Animated.View style={[styles.stage, { bottom: 35, opacity: growAnim.interpolate({ inputRange: [0.25, 0.35, 0.45, 0.50], outputRange: [0, 1, 1, 0] }) }]}>
                <Sapling />
            </Animated.View>

            {/* Herb: 45% -> 55% -> 65% -> 70% */}
            <Animated.View style={[styles.stage, { bottom: 35, opacity: growAnim.interpolate({ inputRange: [0.45, 0.55, 0.65, 0.70], outputRange: [0, 1, 1, 0] }) }]}>
                <Herb />
            </Animated.View>

            {/* Shrub: 65% -> 75% -> 85% -> 90% */}
            <Animated.View style={[styles.stage, { bottom: 35, opacity: growAnim.interpolate({ inputRange: [0.65, 0.75, 0.85, 0.90], outputRange: [0, 1, 1, 0] }) }]}>
                <Shrub />
            </Animated.View>

            {/* Tree: 85% -> 95% -> 100% */}
            <Animated.View style={[styles.stage, { bottom: 35, opacity: growAnim.interpolate({ inputRange: [0.85, 0.95, 1], outputRange: [0, 1, 1] }) }]}>
                <Tree />
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 140,
        width: 140,
        position: 'relative',
    },
    potContainer: {
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
    },
    stage: {
        position: 'absolute',
        bottom: 28, // Rooted in soil (Rim is at ~30)
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 0, // Behind pot rim if needed, but pot SVG is flat.
    },
});
