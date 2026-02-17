/**
 * GrowthPlant — Professional plant animation with soil and smooth growth.
 * Stages: Seed -> Sprout -> Sapling -> Tree -> Bloom.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

interface Props {
    completionPercentage: number; // 0 to 1
}

export default function GrowthPlant({ completionPercentage }: Props) {
    const growAnim = useRef(new Animated.Value(0)).current;

    const p = Math.min(Math.max(completionPercentage, 0), 1);

    useEffect(() => {
        Animated.timing(growAnim, {
            toValue: p,
            duration: 800,
            easing: Easing.bezier(0.25, 1, 0.5, 1),
            useNativeDriver: true,
        }).start();
    }, [p]);

    // Container Interpolations
    const scale = growAnim.interpolate({
        inputRange: [0, 0.2, 0.5, 0.8, 1],
        outputRange: [0.8, 1, 1.1, 1.2, 1.3],
    });

    const plantY = growAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [10, -5], // Rising from soil
    });

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale }, { translateY: plantY }] }}>
                <Svg width={140} height={140} viewBox="0 0 100 100">
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

                    {/* Pot / Soil (Always visible) */}
                    <G transform="translate(0, 10)">
                        <Path
                            d="M30,70 L35,95 L65,95 L70,70 Z"
                            fill="url(#potGrad)"
                        />
                        <Path
                            d="M28,66 L72,66 L72,70 L28,70 Z"
                            fill="#5D4037"
                        />
                        <Ellipse cx="50" cy="70" rx="18" ry="3" fill="url(#soilGrad)" />
                    </G>

                    {/* GROWTH STAGES */}
                    <G transform="translate(50, 70)">

                        {/* Stage 0: Seed (Visible at 0%, fades out by 10%) */}
                        <AnimatedG style={{ opacity: growAnim.interpolate({ inputRange: [0, 0.1], outputRange: [1, 0] }) }}>
                            <Circle cx="0" cy="5" r="4" fill="#A1887F" />
                        </AnimatedG>

                        {/* Stage 1: Sprout (Appears 5%, Visible 15-35%, Fades 45%) */}
                        <AnimatedG style={{ opacity: growAnim.interpolate({ inputRange: [0.05, 0.15, 0.35, 0.45], outputRange: [0, 1, 1, 0] }) }}>
                            <Path d="M0,0 Q0,-10 0,-20" stroke="#66BB6A" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <Path d="M0,-20 Q-10,-25 -10,-15" fill="#66BB6A" />
                        </AnimatedG>

                        {/* Stage 2: Sapling (Appears 35%, Visible 45-65%, Fades 75%) */}
                        <AnimatedG style={{ opacity: growAnim.interpolate({ inputRange: [0.35, 0.45, 0.65, 0.75], outputRange: [0, 1, 1, 0] }) }}>
                            <Path d="M0,0 Q2,-15 0,-35" stroke="#43A047" strokeWidth="3" fill="none" />
                            <Path d="M0,-35 Q-15,-45 -15,-30" fill="#4CAF50" />
                            <Path d="M0,-35 Q15,-45 15,-30" fill="#4CAF50" />
                        </AnimatedG>

                        {/* Stage 3: Tree (Appears 65%, stays visible to End) */}
                        <AnimatedG style={{ opacity: growAnim.interpolate({ inputRange: [0.65, 0.75, 1], outputRange: [0, 1, 1] }) }}>
                            {/* Trunk */}
                            <Path d="M0,0 Q5,-25 0,-55" stroke="#3E2723" strokeWidth="5" fill="none" />
                            {/* Branches */}
                            <Path d="M0,-25 Q15,-30 20,-45" stroke="#3E2723" strokeWidth="3" fill="none" />
                            <Path d="M0,-40 Q-15,-45 -20,-60" stroke="#3E2723" strokeWidth="3" fill="none" />
                            {/* Foliage (Bushy Tree) */}
                            <Circle cx="0" cy="-60" r="15" fill="#2E7D32" opacity={0.9} />
                            <Circle cx="-15" cy="-50" r="12" fill="#388E3C" opacity={0.9} />
                            <Circle cx="15" cy="-50" r="12" fill="#4CAF50" opacity={0.9} />
                            <Circle cx="0" cy="-45" r="12" fill="#66BB6A" opacity={0.8} />
                        </AnimatedG>

                        {/* Stage 4: Bloom (Flowers Overlay on Tree at 95-100%) */}
                        <AnimatedG style={{
                            opacity: growAnim.interpolate({ inputRange: [0.95, 1], outputRange: [0, 1] }),
                            transform: [{ translateY: -55 }]
                        }}>
                            <Circle cx="-5" cy="-5" r="3" fill="#FFEB3B" />
                            <Circle cx="10" cy="5" r="3" fill="#FFEB3B" />
                            <Circle cx="-10" cy="10" r="3" fill="#FFEB3B" />
                        </AnimatedG>

                    </G>
                </Svg>
            </Animated.View>
        </View>
    );
}

const AnimatedG = Animated.createAnimatedComponent(G);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 140,
        width: 140,
    },
});
