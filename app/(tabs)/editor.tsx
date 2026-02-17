/**
 * Routine Editor Screen — Manage routine items.
 * Shows drag handles, category chips, toggle switches, FAB.
 * Matches the manage_routine_items design prototype.
 */
import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Switch,
    StyleSheet, StatusBar, Modal, TextInput,
    KeyboardAvoidingView, Platform, Alert,
} from 'react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoutineStore } from '../../src/store/useRoutineStore';
import { darkTheme, spacing, fontSize, radii, CategoryColors } from '../../src/theme';
import { Category, RoutineItem } from '../../src/types';

/** Category chip colors for the editor (uses brighter palette) */
const editorChipColors: Record<string, { bg: string; text: string }> = {
    Mindfulness: { bg: '#E1BEE7', text: '#4A148C' },
    Work: { bg: '#CFD8DC', text: '#263238' },
    Fitness: { bg: '#FFCCBC', text: '#BF360C' },
    Wellness: { bg: '#C8E6C9', text: '#1B5E20' },
    Health: { bg: '#FFECB3', text: '#E65100' },
    Growth: { bg: '#C8E6C9', text: '#1B5E20' },
    Mind: { bg: '#E1BEE7', text: '#4A148C' },
};

const CATEGORIES: Category[] = ['Mindfulness', 'Work', 'Fitness', 'Wellness', 'Health', 'Growth', 'Mind'];

export default function EditorScreen() {
    const routines = useRoutineStore(s => s.routines);
    const toggleRequired = useRoutineStore(s => s.toggleRequired);
    const addRoutine = useRoutineStore(s => s.addRoutine);
    const deleteRoutine = useRoutineStore(s => s.deleteRoutine);
    const updateRoutine = useRoutineStore(s => s.updateRoutine);
    const fetchAll = useRoutineStore(s => s.fetchAll);

    // Fetch from MongoDB on mount
    useEffect(() => {
        fetchAll();
    }, []);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [formStartTime, setFormStartTime] = useState('');
    const [formEndTime, setFormEndTime] = useState('');
    const [formCategory, setFormCategory] = useState<Category>('Work');

    // Calculate total duration
    const totalMinutes = routines.reduce((acc, r) => {
        if (r.startTime === 'All Day' || !r.endTime) return acc;
        const [sh, sm] = r.startTime.split(':').map(Number);
        const [eh, em] = r.endTime.split(':').map(Number);
        return acc + (eh * 60 + em) - (sh * 60 + sm);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    const openAdd = () => {
        setEditingId(null);
        setFormTitle('');
        setFormStartTime('');
        setFormEndTime('');
        setFormCategory('Work');
        setModalVisible(true);
    };

    const openEdit = (item: RoutineItem) => {
        setEditingId(item.id);
        setFormTitle(item.title);
        setFormStartTime(item.startTime);
        setFormEndTime(item.endTime);
        setFormCategory(item.category);
        setModalVisible(true);
    };

    const handleSave = () => {
        if (!formTitle.trim()) return;

        if (editingId) {
            updateRoutine(editingId, {
                title: formTitle.trim(),
                startTime: formStartTime || '00:00',
                endTime: formEndTime || '00:00',
                category: formCategory,
            });
        } else {
            addRoutine({
                id: Date.now().toString(),
                title: formTitle.trim(),
                startTime: formStartTime || '00:00',
                endTime: formEndTime || '00:00',
                category: formCategory,
                required: true,
            });
        }
        setModalVisible(false);
    };

    const handleDelete = (id: string, title: string) => {
        Alert.alert('Delete Routine', `Are you sure you want to delete "${title}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteRoutine(id) },
        ]);
    };

    const renderItem = ({ item }: { item: RoutineItem }) => {
        const chip = editorChipColors[item.category] ?? editorChipColors['Work'];
        const timeText = item.endTime ? `${item.startTime} - ${item.endTime}` : item.startTime;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => openEdit(item)}
                onLongPress={() => handleDelete(item.id, item.title)}
                style={[styles.routineCard, !item.required && styles.routineCardDisabled]}
            >
                {/* Drag handle */}
                <View style={styles.dragHandle}>
                    <MaterialCommunityIcons name="drag-horizontal-variant" size={24} color="#6b7280" />
                </View>

                {/* Content */}
                <View style={styles.routineContent}>
                    <View style={styles.routineTopRow}>
                        <Text style={[styles.routineTitle, !item.required && styles.routineTitleDisabled]}>
                            {item.title}
                        </Text>
                        <View style={[styles.categoryChip, { backgroundColor: chip.bg }]}>
                            <Text style={[styles.categoryChipText, { color: chip.text }]}>
                                {item.category}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.timeRow}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color="#9ca3af" />
                        <Text style={styles.timeText}>{timeText}</Text>
                    </View>
                </View>

                {/* Delete button */}
                <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.title)}
                    style={styles.deleteBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ef4444" />
                </TouchableOpacity>

                {/* Toggle switch */}
                <Switch
                    value={item.required}
                    onValueChange={() => toggleRequired(item.id)}
                    trackColor={{
                        false: '#36343B',
                        true: darkTheme.primaryLight,
                    }}
                    thumbColor={item.required ? darkTheme.primaryContainer : '#938F99'}
                    style={styles.switch}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={darkTheme.surfaceDark1} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={darkTheme.onSurface} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Routine</Text>
                <View style={styles.headerRight}>
                    <View style={styles.profileIcon}>
                        <MaterialCommunityIcons name="star-four-points" size={20} color="#FFAB91" />
                    </View>
                </View>
            </View>

            {/* Subheader */}
            <View style={styles.subheader}>
                <Text style={styles.subheaderTitle}>Morning Ritual</Text>
                <Text style={styles.subheaderMeta}>
                    {routines.length} items • {durationStr}
                </Text>
            </View>

            {/* Routine List */}
            <FlatList
                data={routines}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{ height: 120 }} />}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={openAdd} activeOpacity={0.8}>
                <MaterialCommunityIcons name="plus" size={24} color={darkTheme.onSurface} />
            </TouchableOpacity>

            {/* Add/Edit Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingId ? 'Edit Routine' : 'Add Routine'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            placeholderTextColor="#6b7280"
                            value={formTitle}
                            onChangeText={setFormTitle}
                        />

                        <View style={styles.timeInputRow}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Start (e.g. 07:00)"
                                placeholderTextColor="#6b7280"
                                value={formStartTime}
                                onChangeText={setFormStartTime}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="End (e.g. 07:15)"
                                placeholderTextColor="#6b7280"
                                value={formEndTime}
                                onChangeText={setFormEndTime}
                            />
                        </View>

                        {/* Category selector */}
                        <Text style={styles.categoryLabel}>Category</Text>
                        <View style={styles.categoryRow}>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setFormCategory(cat)}
                                    style={[
                                        styles.categoryOption,
                                        {
                                            backgroundColor: editorChipColors[cat]?.bg ?? '#CFD8DC',
                                            opacity: formCategory === cat ? 1 : 0.4,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryOptionText,
                                            { color: editorChipColors[cat]?.text ?? '#263238' },
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.cancelBtn}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                                <Text style={styles.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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
        paddingVertical: spacing.md,
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
    headerRight: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,171,145,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subheader: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.base,
    },
    subheaderTitle: {
        fontSize: 28,
        fontWeight: '400',
        color: darkTheme.onSurface,
        marginBottom: 4,
    },
    subheaderMeta: {
        fontSize: fontSize.bodyLarge,
        color: '#9ca3af',
    },
    listContent: {
        paddingHorizontal: spacing.base,
        gap: spacing.sm,
    },
    routineCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.base,
        padding: spacing.base,
        backgroundColor: darkTheme.surfaceDark3,
        borderRadius: radii.md,
    },
    routineCardDisabled: {
        opacity: 0.8,
    },
    dragHandle: {
        opacity: 0.5,
    },
    routineContent: {
        flex: 1,
        gap: 4,
    },
    routineTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    routineTitle: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.onSurface,
        letterSpacing: 0.3,
    },
    routineTitleDisabled: {
        fontWeight: '400',
    },
    categoryChip: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 8,
    },
    categoryChipText: {
        fontSize: fontSize.label,
        fontWeight: '500',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    timeText: {
        fontSize: fontSize.body,
        color: '#9ca3af',
    },
    deleteBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(239,68,68,0.1)',
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    fab: {
        position: 'absolute',
        right: spacing.base,
        bottom: 96,
        width: 64,
        height: 64,
        borderRadius: radii.lg,
        backgroundColor: darkTheme.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: darkTheme.surfaceDark2,
        borderTopLeftRadius: radii.xxl,
        borderTopRightRadius: radii.xxl,
        padding: spacing.xl,
        gap: spacing.base,
    },
    modalTitle: {
        fontSize: fontSize.titleLarge,
        fontWeight: '400',
        color: darkTheme.onSurface,
        marginBottom: spacing.sm,
    },
    input: {
        backgroundColor: darkTheme.surfaceDark3,
        borderRadius: radii.sm,
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        fontSize: fontSize.bodyLarge,
        color: darkTheme.onSurface,
    },
    timeInputRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    categoryLabel: {
        fontSize: fontSize.body,
        fontWeight: '500',
        color: '#94a3b8',
        marginTop: spacing.sm,
    },
    categoryRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    categoryOption: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
    categoryOptionText: {
        fontSize: fontSize.small,
        fontWeight: '500',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.md,
        marginTop: spacing.base,
    },
    cancelBtn: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 9999,
    },
    cancelText: {
        fontSize: fontSize.bodyLarge,
        color: '#94a3b8',
    },
    saveBtn: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 9999,
        backgroundColor: darkTheme.primaryContainer,
    },
    saveText: {
        fontSize: fontSize.bodyLarge,
        fontWeight: '500',
        color: darkTheme.onSurface,
    },
});
