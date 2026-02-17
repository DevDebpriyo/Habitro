/**
 * Login Screen — Premium dark design matching the app theme.
 */
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, StatusBar, Platform, ActivityIndicator,
    KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { darkTheme, spacing, fontSize, radii } from '../src/theme';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;

export default function LoginScreen() {
    const router = useRouter();
    const login = useAuthStore(s => s.login);
    const isLoading = useAuthStore(s => s.isLoading);
    const error = useAuthStore(s => s.error);
    const clearError = useAuthStore(s => s.clearError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password) return;
        const success = await login(email.trim(), password);
        if (success) {
            router.replace('/(tabs)');
        }
    };

    const goToRegister = () => {
        clearError();
        router.push('/register');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={darkTheme.surface} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo / Brand */}
                    <View style={styles.brandWrap}>
                        <View style={styles.logoCircle}>
                            <MaterialCommunityIcons name="check-circle" size={48} color={darkTheme.sageGreen} />
                        </View>
                        <Text style={styles.brandTitle}>Habit Tracker</Text>
                        <Text style={styles.brandSubtitle}>Build better routines, one day at a time</Text>
                    </View>

                    {/* Error */}
                    {error ? (
                        <View style={styles.errorBox}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ef4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Form */}
                    <View style={styles.formWrap}>
                        <Text style={styles.welcomeText}>Welcome back</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputRow}>
                                <MaterialCommunityIcons name="email-outline" size={20} color={darkTheme.onSurfaceVariant} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor={darkTheme.outline}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputRow}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color={darkTheme.onSurfaceVariant} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextColor={darkTheme.outline}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={darkTheme.onSurfaceVariant}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.loginBtn, (!email.trim() || !password) && styles.btnDisabled]}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={isLoading || !email.trim() || !password}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={darkTheme.surfaceContainer} />
                            ) : (
                                <Text style={styles.loginBtnText}>Sign In</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={goToRegister}>
                            <Text style={styles.footerLink}>Create one</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: darkTheme.surface,
        paddingTop: STATUSBAR_HEIGHT,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xl,
    },
    brandWrap: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: darkTheme.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.base,
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: darkTheme.onSurface,
        marginBottom: spacing.xs,
    },
    brandSubtitle: {
        fontSize: fontSize.body,
        color: darkTheme.onSurfaceVariant,
        textAlign: 'center',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: 'rgba(239,68,68,0.1)',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        borderRadius: radii.md,
        marginBottom: spacing.base,
    },
    errorText: {
        color: '#ef4444',
        fontSize: fontSize.body,
        flex: 1,
    },
    formWrap: {
        gap: spacing.lg,
    },
    welcomeText: {
        fontSize: fontSize.titleLarge,
        fontWeight: '400',
        color: darkTheme.onSurface,
        marginBottom: spacing.sm,
    },
    inputGroup: {
        gap: spacing.sm,
    },
    label: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: darkTheme.onSurfaceVariant,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: darkTheme.surfaceContainer,
        paddingHorizontal: spacing.base,
        paddingVertical: 14,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: 'rgba(142,145,143,0.15)',
    },
    input: {
        flex: 1,
        fontSize: fontSize.bodyLarge,
        color: darkTheme.onSurface,
        padding: 0,
    },
    loginBtn: {
        backgroundColor: darkTheme.sageGreen,
        paddingVertical: 16,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    btnDisabled: {
        opacity: 0.5,
    },
    loginBtnText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '600',
        color: darkTheme.surfaceContainer,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: fontSize.body,
        color: darkTheme.onSurfaceVariant,
    },
    footerLink: {
        fontSize: fontSize.body,
        fontWeight: '600',
        color: darkTheme.sageGreen,
    },
});
