/**
 * Home Screen — Main focus screen.
 * Fetches from MongoDB, shows tasks sorted by time in 12h format.
 * Uses real user name from auth store.
 */
import React, { useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Platform, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRoutineStore } from '../../src/store/useRoutineStore';
import { useAuthStore } from '../../src/store/authStore';
import ProgressRing from '../../src/components/ProgressRing';
import RoutineItemCard from '../../src/components/RoutineItemCard';
import SectionHeader from '../../src/components/SectionHeader';
import GrowthPlant from '../../src/components/GrowthPlant';
import { darkTheme, spacing, fontSize, radii, shadows } from '../../src/theme';
import { formatDateDisplay, getGreeting, getToday } from '../../src/utils/dateHelpers';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;

export default function HomeScreen() {
  const router = useRouter();

  const routines = useRoutineStore(s => s.routines);
  const completions = useRoutineStore(s => s.completions);
  const toggleTask = useRoutineStore(s => s.toggleTask);
  const fetchAll = useRoutineStore(s => s.fetchAll);
  const isLoading = useRoutineStore(s => s.isLoading);
  const user = useAuthStore(s => s.user);

  useEffect(() => { fetchAll(); }, []);

  const today = getToday();
  const todayData = useMemo(() => {
    const todayRecords = completions.filter(c => c.date === today);
    const items = routines
      .map(r => ({
        ...r,
        isCompleted: todayRecords.find(c => c.routineId === r.id)?.completed ?? false,
      }))
      .sort((a, b) => {
        const timeA = a.startTime.replace(':', '');
        const timeB = b.startTime.replace(':', '');
        return timeA.localeCompare(timeB);
      });
    const completed = items.filter(i => i.isCompleted).length;
    return { completed, total: routines.length, items };
  }, [routines, completions, today]);

  const { completed, total, items } = todayData;
  const userName = user?.name || 'there';
  const greeting = getGreeting();
  const dateStr = formatDateDisplay(new Date());

  const handleToggle = useCallback((id: string) => { toggleTask(id); }, [toggleTask]);
  const handleAddPress = useCallback(() => { router.push('/(tabs)/editor'); }, [router]);

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
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>{greeting}, {userName}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </View>

      {isLoading && routines.length === 0 ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={darkTheme.sageGreen} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          extraData={completions}
          ListHeaderComponent={
            <>
              <View style={styles.progressCard}>
                <View style={styles.glowTopRight} />
                <View style={styles.glowBottomLeft} />
                <View style={styles.progressRow}>
                  <GrowthPlant completionPercentage={total > 0 ? completed / total : 0} />
                  <ProgressRing completed={completed} total={total} />
                </View>
              </View>
              <SectionHeader title="Today's Tasks" actionText={`${completed}/${total}`} />
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
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="plus-circle-outline" size={48} color={darkTheme.onSurfaceVariant} />
              <Text style={styles.emptyText}>No tasks yet. Tap + to add your first routine!</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

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
    backgroundColor: darkTheme.sageGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.bodyLarge,
    fontWeight: '700',
    color: darkTheme.surfaceContainer,
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
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
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
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: spacing.base,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: darkTheme.onSurfaceVariant,
    textAlign: 'center',
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
