/**
 * Home Screen — Main focus screen.
 * Shows greeting, progress ring, today's tasks.
 * Reactive: subscribes to routines + completions so any change
 * from the editor or checkbox toggle re-renders instantly.
 */
import React, { useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRoutineStore } from '../../src/store/useRoutineStore';
import ProgressRing from '../../src/components/ProgressRing';
import RoutineItemCard from '../../src/components/RoutineItemCard';
import SectionHeader from '../../src/components/SectionHeader';
import { darkTheme, spacing, fontSize, radii, shadows } from '../../src/theme';
import { formatDateDisplay, getGreeting, getToday } from '../../src/utils/dateHelpers';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;

export default function HomeScreen() {
  const router = useRouter();

  // ✅ Subscribe to primitive state — triggers re-render on any change
  const routines = useRoutineStore(s => s.routines);
  const completions = useRoutineStore(s => s.completions);
  const toggleTask = useRoutineStore(s => s.toggleTask);
  const fetchAll = useRoutineStore(s => s.fetchAll);
  const isLoading = useRoutineStore(s => s.isLoading);

  // ✅ Fetch from MongoDB on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ Compute today's data reactively, SORTED by startTime
  const today = getToday();
  const todayData = useMemo(() => {
    const todayRecords = completions.filter(c => c.date === today);
    const items = routines
      .map(r => ({
        ...r,
        isCompleted: todayRecords.find(c => c.routineId === r.id)?.completed ?? false,
      }))
      .sort((a, b) => {
        // Sort by startTime ascending ("06:00" < "09:00")
        const timeA = a.startTime.replace(':', '');
        const timeB = b.startTime.replace(':', '');
        return timeA.localeCompare(timeB);
      });
    const completed = items.filter(i => i.isCompleted).length;
    return { completed, total: routines.length, items };
  }, [routines, completions, today]);

  const { completed, total, items } = todayData;

  const greeting = getGreeting();
  const dateStr = formatDateDisplay(new Date());

  const handleToggle = useCallback((id: string) => {
    toggleTask(id);
  }, [toggleTask]);

  const handleAddPress = useCallback(() => {
    router.push('/(tabs)/editor');
  }, [router]);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={24} color={darkTheme.onSurface} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={24} color={darkTheme.onSurfaceVariant} />
          </View>
        </View>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        extraData={completions}
        ListHeaderComponent={
          <>
            {/* Progress Ring Card */}
            <View style={styles.progressCard}>
              <View style={styles.glowTopRight} />
              <View style={styles.glowBottomLeft} />
              <ProgressRing completed={completed} total={total} />
            </View>

            {/* Section Header */}
            <SectionHeader title="Today's Tasks" actionText="View All" />
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <RoutineItemCard
              title={item.title}
              startTime={item.startTime}
              endTime={item.endTime}
              category={item.category}
              isCompleted={item.isCompleted}
              onToggle={() => handleToggle(item.id)}
            />
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* FAB — navigates to editor */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={handleAddPress}>
        <MaterialCommunityIcons name="plus" size={24} color={darkTheme.surfaceContainer} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.surface,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  menuBtn: {
    padding: spacing.sm,
    borderRadius: 9999,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: darkTheme.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(142,145,143,0.2)',
  },
  greetingWrap: {
    paddingHorizontal: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.display,
    fontWeight: '400',
    color: darkTheme.onSurface,
    lineHeight: 40,
  },
  dateText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '400',
    color: darkTheme.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  progressCard: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: radii.xxl,
    backgroundColor: darkTheme.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...shadows.elevation1,
  },
  glowTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(172,199,166,0.05)',
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(172,199,166,0.05)',
  },
  cardWrap: {
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    right: spacing.base,
    bottom: 96,
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: darkTheme.sageGreen,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.elevation3,
  },
});
