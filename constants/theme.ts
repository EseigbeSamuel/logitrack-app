/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#18181B',
    background: '#F4F4F5', // Slightly off-white for depth
    card: '#FFFFFF',
    border: '#E4E4E7',
    primary: '#CCFF00', // Neon yellow accent
    primaryText: '#18181B', // Dark text on primary
    muted: '#71717A',
    mutedBg: '#F4F4F5',
    danger: '#EF4444',
    dangerBg: '#FEE2E2',
    success: '#10B981',
    successBg: '#D1FAE5',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    info: '#3B82F6',
    infoBg: '#DBEAFE',
  },
  dark: {
    text: '#FAFAFA',
    background: '#18181B',
    card: '#27272A',
    border: '#3F3F46',
    primary: '#CCFF00',
    primaryText: '#18181B', // Dark text on primary
    muted: '#A1A1AA',
    mutedBg: '#18181B',
    danger: '#EF4444',
    dangerBg: '#EF44441F',
    success: '#10B981',
    successBg: '#10B9811F',
    warning: '#EAB308',
    warningBg: '#F59E0B1A',
    info: '#60A5FA',
    infoBg: '#3B82F61F',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
