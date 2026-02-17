/**
 * GrowthPlant — A plant that grows based on task completion %.
 * 5 Stages: Seed -> Sprout -> Seedling -> Growing -> Bloom.
 * Uses SVG for crisp rendering and Animated for smooth scale/opacity transitions.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { darkTheme } from '../theme';

interface Props {
    completionPercentage: number; // 0 to 1
}

const STAGES = {
    SEED: 0,
    SPROUT: 0.25,
    SEEDLING: 0.50,
    GROWING: 0.75,
    BLOOM: 1.0,
};

export default function GrowthPlant({ completionPercentage }: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Determine current stage based on percentage
    let stage = 'seed';
    if (completionPercentage >= 1.0) stage = 'bloom';
    else if (completionPercentage >= 0.75) stage = 'growing';
    else if (completionPercentage >= 0.50) stage = 'seedling';
    else if (completionPercentage >= 0.25) stage = 'sprout';

    useEffect(() => {
        // Pulse animation on stage change
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();
    }, [stage]);

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Svg width={120} height={120} viewBox="0 0 100 100">
                    <Defs>
                        <LinearGradient id="stemGrad" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#4CAF50" />
                            <Stop offset="1" stopColor="#81C784" />
                        </LinearGradient>
                        <LinearGradient id="flowerGrad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor="#FF7043" />
                            <Stop offset="1" stopColor="#FFAB91" />
                        </LinearGradient>
                    </Defs>

                    {/* Ground (always visible) */}
                    <Path
                        d="M20,90 Q50,95 80,90"
                        stroke={darkTheme.outline}
                        strokeWidth="2"
                        fill="none"
                        opacity={0.5}
                    />

                    {/* Stage 1: Seed */}
                    {stage === 'seed' && (
                        <G>
                            <Circle cx="50" cy="90" r="4" fill="#8D6E63" />
                        </G>
                    )}

                    {/* Stage 2: Sprout */}
                    {(stage === 'sprout' || stage === 'seedling' || stage === 'growing' || stage === 'bloom') && (
                        <Path
                            d="M50,90 C50,80 50,70 50,65"
                            stroke="url(#stemGrad)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    )}
                    {stage === 'sprout' && (
                        <Path
                            d="M50,65 Q60,60 65,65 Q60,70 50,65"
                            fill="#81C784"
                        />
                    )}

                    {/* Stage 3: Seedling (Taller + 2 leaves) */}
                    {(stage === 'seedling' || stage === 'growing' || stage === 'bloom') && (
                        <G>
                            <Path
                                d="M50,65 C50,55 52,45 50,40"
                                stroke="url(#stemGrad)"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                            />
                            {/* Left Leaf */}
                            <Path d="M50,60 Q35,55 35,65 Q40,70 50,60" fill="#66BB6A" />
                            {/* Right Leaf */}
                            <Path d="M50,50 Q65,45 65,55 Q60,60 50,50" fill="#81C784" />
                        </G>
                    )}

                    {/* Stage 4: Growing (Bushier) */}
                    {(stage === 'growing' || stage === 'bloom') && (
                        <G>
                            {/* Extra Leaves */}
                            <Path d="M50,40 Q30,30 30,45 Q40,50 50,40" fill="#4CAF50" />
                            <Path d="M50,45 Q70,35 70,50 Q60,55 50,45" fill="#66BB6A" />
                        </G>
                    )}

                    {/* Stage 5: Bloom (Flower) */}
                    {stage === 'bloom' && (
                        <G>
                            {/* Flower Petals */}
                            <Circle cx="50" cy="30" r="8" fill="url(#flowerGrad)" />
                            <Circle cx="40" cy="30" r="6" fill="url(#flowerGrad)" opacity={0.8} />
                            <Circle cx="60" cy="30" r="6" fill="url(#flowerGrad)" opacity={0.8} />
                            <Circle cx="50" cy="20" r="6" fill="url(#flowerGrad)" opacity={0.8} />
                            <Circle cx="50" cy="40" r="6" fill="url(#flowerGrad)" opacity={0.8} />
                            {/* Center */}
                            <Circle cx="50" cy="30" r="3" fill="#FFEB3B" />
                        </G>
                    )}
                </Svg>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 140,
        width: 140,
    },
});
