/**
 * Settings Screen — App settings and data management.
 * Matches the app_settings design prototype.
 */
import React, { useEffect } from 'react';
import {
    View, Text, TouchableOpacity, Switch,
    StyleSheet, StatusBar, Alert, ScrollView, Platform,
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRoutineStore } from '../../src/store/useRoutineStore';
import { useAuthStore } from '../../src/store/authStore';
import { darkTheme, spacing, fontSize, radii } from '../../src/theme';

export default function SettingsScreen() {
    const router = useRouter();
    const isDarkMode = useRoutineStore(s => s.isDarkMode);
    const toggleDarkMode = useRoutineStore(s => s.toggleDarkMode);
    const resetRoutines = useRoutineStore(s => s.resetRoutines);
    const clearHistory = useRoutineStore(s => s.clearHistory);
    const fetchAll = useRoutineStore(s => s.fetchAll);
    const clearAllRoutineData = useRoutineStore(s => s.clearAll);

    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);

    useEffect(() => {
        fetchAll();
    }, []);

    const handleReset = () => {
        Alert.alert(
            'Reset Routine',
            'This will restore the default routine items. Your completion history will be kept.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: resetRoutines },
            ]
        );
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear History',
            'This will permanently delete all completion logs. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: clearHistory },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        clearAllRoutineData();
                        router.replace('/login');
                    }
                },
            ]
        );
    };

    const handleExport = () => {
        Alert.alert('Export Data', 'Data export will be available in a future update.');
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={darkTheme.surfaceDark1} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={darkTheme.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* User Profile Card */}
                {user && (
                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user.name}</Text>
                            <Text style={styles.profileEmail}>{user.email}</Text>
                        </View>
                    </View>
                )}

                {/* Dark Mode Toggle */}
                <View style={styles.card}>
                    <View style={styles.darkModeRow}>
                        <View style={styles.darkModeTextWrap}>
                            <Text style={styles.settingTitle}>Dark Mode</Text>
                            <Text style={styles.settingSubtitle}>Adjust app appearance</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleDarkMode}
                            trackColor={{
                                false: '#36343B',
                                true: darkTheme.primaryLight,
                            }}
                            thumbColor={isDarkMode ? '#381E72' : '#938F99'}
                        />
                    </View>
                </View>

                {/* Data Management section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Data Management</Text>
                </View>

                <View style={styles.dataActions}>
                    {/* Export Data */}
                    <TouchableOpacity style={styles.exportBtn} onPress={handleExport} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="download" size={24} color={darkTheme.onSurface} />
                        <Text style={styles.exportText}>Export Data</Text>
                    </TouchableOpacity>

                    {/* Reset Routine */}
                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="restart" size={24} color={darkTheme.onSurface} />
                        <Text style={styles.resetText}>Reset Routine</Text>
                    </TouchableOpacity>

                    {/* Clear History */}
                    <TouchableOpacity style={styles.clearBtn} onPress={handleClearHistory} activeOpacity={0.8}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color={darkTheme.error} />
                        <View style={styles.clearTextWrap}>
                            <Text style={styles.clearTitle}>Clear History</Text>
                            <Text style={styles.clearSubtitle}>Permanently delete all logs</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Account Actions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Account</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="logout" size={24} color={darkTheme.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Info section */}
                <View style={styles.card}>
                    {/* App Info */}
                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <MaterialCommunityIcons name="information-outline" size={24} color={darkTheme.outline} />
                            <Text style={styles.infoText}>App Info</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={darkTheme.outline} />
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Support */}
                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <MaterialCommunityIcons name="help-circle-outline" size={24} color={darkTheme.outline} />
                            <Text style={styles.infoText}>Support</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={darkTheme.outline} />
                    </TouchableOpacity>
                </View>

                {/* Version footer */}
                <View style={styles.footer}>
                    <View style={styles.footerIcon}>
                        <MaterialCommunityIcons name="check-circle" size={24} color={darkTheme.primaryLight} />
                    </View>
                    <Text style={styles.versionText}>Version 1.0.4</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: darkTheme.surfaceDark1,
        paddingTop: STATUSBAR_HEIGHT,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.base,
    },
    backBtn: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
    },
    headerTitle: {
        fontSize: fontSize.titleLarge,
        fontWeight: '400',
        color: darkTheme.onSurface,
    },
    scrollContent: {
        paddingHorizontal: spacing.base,
        gap: spacing.xl,
        paddingTop: spacing.sm,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: darkTheme.surfaceDark2,
        padding: spacing.base,
        borderRadius: radii.md,
        gap: spacing.base,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: darkTheme.sageGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: darkTheme.surfaceContainer,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '600',
        color: darkTheme.onSurface,
    },
    profileEmail: {
        fontSize: fontSize.body,
        color: darkTheme.onSurfaceVariant,
    },
    card: {
        backgroundColor: darkTheme.surfaceDark2,
        borderRadius: radii.md,
        overflow: 'hidden',
    },
    darkModeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
        minHeight: 72,
    },
    darkModeTextWrap: {
        gap: 4,
    },
    settingTitle: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '400',
        color: darkTheme.onSurface,
    },
    settingSubtitle: {
        fontSize: fontSize.body,
        color: darkTheme.outline,
    },
    sectionHeader: {
        paddingHorizontal: spacing.sm,
    },
    sectionTitle: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: darkTheme.primaryLight,
    },
    dataActions: {
        gap: spacing.md,
    },
    exportBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
        padding: spacing.base,
        backgroundColor: darkTheme.secondaryContainer,
        borderRadius: radii.md,
    },
    exportText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.onSurface,
    },
    resetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
        padding: spacing.base,
        backgroundColor: darkTheme.surfaceDark3,
        borderRadius: radii.md,
    },
    resetText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.onSurface,
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
        padding: spacing.base,
        borderRadius: radii.md,
    },
    clearTextWrap: {
        gap: 2,
    },
    clearTitle: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.error,
    },
    clearSubtitle: {
        fontSize: fontSize.small,
        color: darkTheme.error,
        opacity: 0.7,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
        padding: spacing.base,
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderRadius: radii.md,
    },
    logoutText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '600',
        color: darkTheme.error,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
        minHeight: 56,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
    },
    infoText: {
        fontSize: fontSize.bodyLarge,
        color: darkTheme.onSurface,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(73,69,79,0.2)',
        marginHorizontal: spacing.base,
    },
    footer: {
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.xl,
        opacity: 0.6,
    },
    footerIcon: {
        width: 40,
        height: 40,
        borderRadius: radii.md,
        backgroundColor: darkTheme.surfaceDark3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    versionText: {
        fontSize: fontSize.small,
        color: darkTheme.onSurface,
    },
});
