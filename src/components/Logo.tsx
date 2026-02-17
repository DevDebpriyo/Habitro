/**
 * Logo — Custom Habitro branding.
 * Leaf icon + Modern Typography.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { darkTheme, fontSize } from '../theme';

export default function Logo() {
    return (
        <View style={styles.container}>
            <Svg width={28} height={28} viewBox="0 0 24 24" style={styles.icon}>
                <Path
                    d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"
                    fill={darkTheme.sageGreen}
                />
            </Svg>
            <Text style={styles.text}>Habitro</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        marginTop: 2,
    },
    text: {
        fontSize: 22,
        fontWeight: '700',
        color: darkTheme.onSurface,
        letterSpacing: 0.5,
    },
});
