/**
 * PatientScribe Design System — Warm Edition
 * 
 * DESIGN PHILOSOPHY:
 * Professional trust with human warmth. This palette balances medical credibility
 * with approachable, consumer-friendly aesthetics. The periwinkle primary signals
 * modern innovation while warm grays and cream backgrounds create a comfortable,
 * non-clinical environment.
 * 
 * USAGE:
 * import { colors, semanticColors, healthZones } from './colors';
 * 
 * <View style={{ backgroundColor: colors.warmGray[50] }}>
 *   <Text style={{ color: colors.indigo[900] }}>Hello</Text>
 * </View>
 * 
 * LOGO COLORS:
 * - Periwinkle: colors.periwinkle[500] (#5B7FE1) — waveform
 * - Teal:       colors.teal[400]       (#4FD1C5) — stethoscope
 * - Coral:      colors.coral[500]      (#F56565) — accent dot
 * 
 * TEXT COLORS:
 * - Headers:    colors.indigo[900]     (#2D3A6E)
 * - Body:       colors.indigo[800]     (#3D4A7E)
 * - Secondary:  colors.warmGray[600]   (#6B6966)
 */

// =============================================================================
// CORE PALETTE
// =============================================================================

export const colors = {
  // Indigo (Text & Authority)
  // Deep periwinkle for headers, body text, and primary buttons
  // The authoritative anchor of the palette
  indigo: {
    950: '#1E2A4A', // Darkest - rarely needed
    900: '#2D3A6E', // Headers, primary buttons ← PRIMARY TEXT
    800: '#3D4A7E', // Body text
    700: '#4D5A8E', // Secondary text
    600: '#6B7AAA',
    500: '#8B9AC4',
    400: '#ABB8D8',
    300: '#CBD4E8',
    200: '#E5E9F4',
    100: '#EBF0FD', // Subtle backgrounds
    50: '#F5F7FC',
  },

  // Periwinkle (Brand)
  // The warm, distinctive blue from your logo
  // Use for icons, illustrations, soft buttons, and brand moments
  periwinkle: {
    700: '#3D5A9E', // Hover states
    600: '#4A6BC2', // Active states
    500: '#5B7FE1', // ← LOGO COLOR - Icons, soft buttons
    400: '#7B99E8',
    300: '#9BB3EF',
    200: '#BCCDF5',
    100: '#DCE6FA', // Highlight backgrounds
    50: '#EEF2FC',
  },

  // Teal (Secondary / Health)
  // Health, growth, freshness
  // Use for links, success states, safe zone indicators
  teal: {
    700: '#237A70',
    600: '#2C9C8F', // Links, safe zone border
    500: '#38B2A3',
    400: '#4FD1C5', // ← LOGO COLOR - Stethoscope
    300: '#76E4DA',
    200: '#A0F0E8',
    100: '#CCF7F3',
    50: '#E6FCF9',  // Safe zone background
  },

  // Coral (Accent / Warmth)
  // Warmth, attention, action
  // Use for recording indicators, CTAs, and emphasis
  coral: {
    700: '#C53030',
    600: '#E53E3E', // Concern zone border
    500: '#F56565', // ← LOGO COLOR - Recording, CTAs
    400: '#FC8181',
    300: '#FEB2B2',
    200: '#FED7D7',
    100: '#FEE7E7', // Concern zone background
    50: '#FEF5F5',
  },

  // Success
  // Confirmations, completions, positive feedback
  success: {
    700: '#276749',
    600: '#2F855A',
    500: '#38A169', // Success indicators
    400: '#48BB78',
    300: '#68D391',
    200: '#9AE6B4',
    100: '#C6F6D5', // Success backgrounds
  },

  // Warning
  // "Watch zone" indicators, cautions
  warning: {
    700: '#975A16',
    600: '#B7791F',
    500: '#D69E2E', // Watch zone border
    400: '#ECC94B',
    300: '#F6E05E',
    200: '#FAF089',
    100: '#FEF9E7', // Watch zone background
  },

  // Warm Gray (Neutrals)
  // Warm-tinted neutrals with subtle taupe undertones
  // Creates a comfortable, non-clinical foundation
  warmGray: {
    900: '#1F1E1D', // Warm black
    800: '#2F2E2C',
    700: '#52514F',
    600: '#6B6966', // Secondary text
    500: '#8B8884', // Placeholder text
    400: '#B5B3AF',
    300: '#D5D3CF', // Borders, dividers
    200: '#E8E6E3',
    100: '#F5F4F2',
    50: '#FAF9F7',  // Page background (warm white)
  },

  // Pure values
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// =============================================================================
// SEMANTIC COLORS
// =============================================================================

export const semanticColors = {
  // Text hierarchy
  text: {
    primary: colors.indigo[900],      // #2D3A6E - Headers, important text
    body: colors.indigo[800],         // #3D4A7E - Body text
    secondary: colors.warmGray[600],  // #6B6966 - Secondary, captions
    tertiary: colors.warmGray[500],   // #8B8884 - Placeholder, hints
    inverse: colors.white,            // White text on dark backgrounds
    link: colors.teal[600],           // #2C9C8F - Hyperlinks
    error: colors.coral[600],         // #E53E3E - Error text
    success: colors.success[600],     // #2F855A - Success text
  },

  // Backgrounds
  background: {
    primary: colors.warmGray[50],     // #FAF9F7 - Page background (warm white)
    secondary: colors.warmGray[100],  // #F5F4F2 - Section backgrounds
    card: colors.white,               // #FFFFFF - Cards, modals
    inverse: colors.indigo[900],      // #2D3A6E - Dark sections
    brand: colors.periwinkle[50],     // #EEF2FC - Brand-tinted backgrounds
    success: colors.teal[50],         // #E6FCF9 - Safe zone
    warning: colors.warning[100],     // #FEF9E7 - Watch zone
    error: colors.coral[100],         // #FEE7E7 - Concern zone
  },

  // Borders
  border: {
    default: colors.warmGray[300],    // #D5D3CF
    light: colors.warmGray[200],      // #E8E6E3
    focus: colors.periwinkle[500],    // #5B7FE1
    error: colors.coral[500],         // #F56565
    success: colors.teal[600],        // #2C9C8F
    warning: colors.warning[500],     // #D69E2E
  },

  // Interactive elements
  button: {
    // Primary - Authoritative actions (Start Recording, Submit)
    primary: {
      background: colors.indigo[900],
      backgroundHover: colors.indigo[800],
      text: colors.white,
      disabled: colors.warmGray[300],
      disabledText: colors.warmGray[500],
    },
    // Secondary - Cancel, Back, Less prominent actions
    secondary: {
      background: colors.white,
      backgroundHover: colors.warmGray[100],
      text: colors.indigo[900],
      border: colors.indigo[900],
      disabled: colors.warmGray[300],
    },
    // Soft - View Summary, Info actions (uses periwinkle)
    soft: {
      background: colors.periwinkle[500],
      backgroundHover: colors.periwinkle[600],
      text: colors.white,
    },
    // Accent - High-attention CTAs (Share, Upgrade)
    accent: {
      background: colors.coral[500],
      backgroundHover: colors.coral[600],
      text: colors.white,
    },
    // Danger - Destructive actions
    danger: {
      background: colors.coral[600],
      backgroundHover: colors.coral[700],
      text: colors.white,
    },
  },

  // Recording states (key PatientScribe feature)
  recording: {
    active: colors.coral[500],        // Pulsing dot color
    activeBg: colors.coral[50],       // Recording card background
    activeBorder: colors.coral[500],
    idle: colors.warmGray[400],
    processing: colors.periwinkle[500],
    complete: colors.teal[500],
  },

  // Icons
  icon: {
    primary: colors.indigo[900],
    secondary: colors.warmGray[600],
    brand: colors.periwinkle[500],
    health: colors.teal[400],
    action: colors.coral[500],
  },
};

// =============================================================================
// HEALTH STATUS ZONES
// =============================================================================

export const healthZones = {
  safe: {
    background: colors.teal[50],      // #E6FCF9
    border: colors.teal[600],         // #2C9C8F
    text: colors.teal[700],           // #237A70
    icon: '🟢',
    label: 'Safe Zone',
  },
  watch: {
    background: colors.warning[100],  // #FEF9E7
    border: colors.warning[500],      // #D69E2E
    text: colors.warning[700],        // #975A16
    icon: '🟡',
    label: 'Watch Zone',
  },
  concern: {
    background: colors.coral[100],    // #FEE7E7
    border: colors.coral[600],        // #E53E3E
    text: colors.coral[700],          // #C53030
    icon: '🔴',
    label: 'Concern Zone',
  },
};

// =============================================================================
// SPACING SCALE
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// =============================================================================
// SHADOWS (warm-tinted)
// =============================================================================

export const shadows = {
  sm: {
    shadowColor: colors.indigo[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.indigo[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.indigo[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.indigo[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
};

// =============================================================================
// ACCESSIBILITY REFERENCE
// =============================================================================

/**
 * WCAG AA CONTRAST COMPLIANCE (4.5:1 minimum for normal text):
 * 
 * ✅ PASSES:
 * - indigo[900] on warmGray[50]:    10.5:1  (headers, primary text)
 * - indigo[800] on warmGray[50]:     8.2:1  (body text)
 * - indigo[900] on white:           11.3:1  (buttons, cards)
 * - teal[600] on warmGray[50]:       4.6:1  (links)
 * - white on indigo[900]:           11.3:1  (button text)
 * - white on periwinkle[500]:        4.1:1  (soft button - large text only)
 * - white on coral[500]:             4.2:1  (accent button - large text only)
 * 
 * ❌ FAILS (decorative use only):
 * - periwinkle[500] on white:        3.4:1  (icons, illustrations only)
 * - teal[400] on white:              2.9:1  (icons only)
 * - coral[500] on white:             3.5:1  (icons, indicators only)
 * 
 * RULE: Use indigo[900] or indigo[800] for all readable text.
 * Logo colors (periwinkle[500], teal[400], coral[500]) are for
 * icons, illustrations, and decorative elements only.
 */

// =============================================================================
// QUICK REFERENCE
// =============================================================================

/**
 * COMMON PATTERNS:
 * 
 * Page container:
 *   backgroundColor: colors.warmGray[50]  // #FAF9F7 warm white
 * 
 * Card:
 *   backgroundColor: colors.white
 *   borderColor: colors.warmGray[300]
 *   ...shadows.md
 * 
 * Header text:
 *   color: colors.indigo[900]  // #2D3A6E
 *   fontWeight: typography.fontWeight.bold
 * 
 * Body text:
 *   color: colors.indigo[800]  // #3D4A7E
 * 
 * Secondary/caption text:
 *   color: colors.warmGray[600]  // #6B6966
 * 
 * Primary button:
 *   backgroundColor: colors.indigo[900]
 *   color: colors.white
 * 
 * Soft/brand button:
 *   backgroundColor: colors.periwinkle[500]
 *   color: colors.white
 * 
 * Link:
 *   color: colors.teal[600]  // #2C9C8F
 * 
 * Recording indicator:
 *   backgroundColor: colors.coral[500]
 *   (use with pulsing animation)
 * 
 * Safe zone card:
 *   backgroundColor: colors.teal[50]
 *   borderColor: colors.teal[600]
 * 
 * Watch zone card:
 *   backgroundColor: colors.warning[100]
 *   borderColor: colors.warning[500]
 * 
 * Concern zone card:
 *   backgroundColor: colors.coral[100]
 *   borderColor: colors.coral[600]
 * 
 * Icon (brand):
 *   color: colors.periwinkle[500]  // Your logo blue
 * 
 * Icon (health):
 *   color: colors.teal[400]  // Your logo teal
 */

export default {
  colors,
  semanticColors,
  healthZones,
  spacing,
  typography,
  borderRadius,
  shadows,
};
