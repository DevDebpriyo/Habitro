/**
 * Unified M3 design tokens extracted from the design prototypes.
 * All colors, spacing, typography, and radii in one place.
 */

/** Category chip color mappings (dark mode) */
export const CategoryColors: Record<string, { bg: string; text: string; dot: string }> = {
    Mind: { bg: 'rgba(50,44,58,0.5)', text: '#C4C7C5', dot: '#C7B9E0' },
    Mindfulness: { bg: '#E1BEE7', text: '#4A148C', dot: '#C7B9E0' },
    Work: { bg: '#CFD8DC', text: '#263238', dot: '#B5C0D0' },
    Health: { bg: 'rgba(58,45,41,0.3)', text: '#C4C7C5', dot: '#D0A99C' },
    Growth: { bg: 'rgba(45,53,43,0.5)', text: '#C4C7C5', dot: '#ACC7A6' },
    Fitness: { bg: '#FFCCBC', text: '#BF360C', dot: '#FFCCBC' },
    Wellness: { bg: '#C8E6C9', text: '#1B5E20', dot: '#C8E6C9' },
};

/** Dark theme (primary — matches design prototypes) */
export const darkTheme = {
    // Surface hierarchy
    surface: '#121212',
    surfaceContainer: '#1E1E1E',
    surfaceContainerHigh: '#2C2C2C',
    surfaceDark1: '#141218',
    surfaceDark2: '#211F26',
    surfaceDark3: '#2B2930',

    // On-surface text
    onSurface: '#E3E3E3',
    onSurfaceVariant: '#C4C7C5',
    outline: '#8E918F',

    // Primary accents
    primary: '#6750A4',
    primaryLight: '#D0BCFF',
    primaryContainer: '#4F378B',
    secondaryContainer: '#4A4458',

    // Sage green (home screen accent)
    sageGreen: '#ACC7A6',
    sageContainer: '#2D352B',

    // Muted indigo (analytics accent)
    mutedIndigo: '#4f63ac',
    mutedIndigoLight: '#aabcff',

    // Teal (analytics best streak)
    tealMuted: '#386a68',
    tealLight: '#8cece7',

    // Warm clay
    warmClay: '#D0A99C',
    clayContainer: '#3A2D29',

    // Soft purple
    softPurple: '#C7B9E0',
    purpleContainer: '#322C3A',

    // Amber (insights)
    amberContainer: '#4a3600',
    amberContainerLight: '#684d00',
    amberText: '#ffdea7',
    amberSubtext: '#e6c489',

    // Error / destructive
    error: '#F2B8B5',
    errorDark: '#B3261E',

    // Heatmap gradient (dark)
    heatmap: [
        'rgba(30,30,30,0.5)',  // 0% — empty
        '#1a2c22',              // ~20%
        '#234231',              // ~40%
        '#2d5a41',              // ~60%
        '#387353',              // ~80%
        '#448d66',              // ~90%
        '#51a87b',              // 100%
    ],

    // Tab bar
    tabBar: '#2C2C2C',
    tabInactive: '#C4C7C5',
};

/** Light theme (kept minimal — app defaults to dark) */
export const lightTheme = {
    surface: '#FEF7FF',
    surfaceContainer: '#F3EDF7',
    surfaceContainerHigh: '#ECE6F0',
    surfaceDark1: '#FEF7FF',
    surfaceDark2: '#F7F2FA',
    surfaceDark3: '#EEE8F4',

    onSurface: '#1D1B20',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',

    primary: '#6750A4',
    primaryLight: '#6750A4',
    primaryContainer: '#EADDFF',
    secondaryContainer: '#E8DEF8',

    sageGreen: '#ACC7A6',
    sageContainer: '#E8F5E5',

    mutedIndigo: '#4f63ac',
    mutedIndigoLight: '#4f63ac',

    tealMuted: '#386a68',
    tealLight: '#386a68',

    warmClay: '#D0A99C',
    clayContainer: '#FDE8E2',

    softPurple: '#C7B9E0',
    purpleContainer: '#F3EEFA',

    amberContainer: '#ffdea7',
    amberContainerLight: '#ffdea7',
    amberText: '#271900',
    amberSubtext: '#271900',

    error: '#B3261E',
    errorDark: '#B3261E',

    heatmap: [
        '#f0f0f0',
        '#e6f6eb',
        '#ccebc4',
        '#a8ddb5',
        '#7bccc4',
        '#4eb3d3',
        '#2b8cbe',
    ],

    tabBar: '#F3EDF7',
    tabInactive: '#49454F',
};

/** Spacing scale (8px base) */
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
};

/** Font sizes */
export const fontSize = {
    caption: 10,
    label: 11,
    small: 12,
    body: 14,
    bodyLarge: 16,
    title: 18,
    titleLarge: 22,
    headline: 28,
    display: 32,
    displayLarge: 48,
};

/** Border radius */
export const radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 28,
    full: 9999,
};

/** M3 elevation shadows */
export const shadows = {
    elevation1: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    elevation2: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    elevation3: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
};
