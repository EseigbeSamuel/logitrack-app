const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/(tabs)/index.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

if (!code.includes('useThemeColors')) {
  // Insert import
  code = code.replace(
    /import \{ IconSymbol \} from '@\/components\/ui\/icon-symbol';/,
    `import { IconSymbol } from '@/components/ui/icon-symbol';\nimport { useThemeColors } from '@/hooks/use-theme-colors';`
  );

  // Insert hook call
  code = code.replace(
    /const \{ activeRole, shipments, riderStats, toggleOnline, updateShipmentStatus \} = useLogiTrack\(\);/,
    `const { activeRole, shipments, riderStats, toggleOnline, updateShipmentStatus } = useLogiTrack();\n  const theme = useThemeColors();`
  );

  // Replace colors
  code = code.replace(/backgroundColor: '#18181B'/g, 'backgroundColor: theme.background');
  code = code.replace(/backgroundColor: '#27272A'/g, 'backgroundColor: theme.card');
  code = code.replace(/backgroundColor: '#CCFF00'/g, 'backgroundColor: theme.primary');
  code = code.replace(/color: '#CCFF00'/g, 'color: theme.primary');
  code = code.replace(/color: '#18181B'/g, 'color: theme.text');
  code = code.replace(/color: '#FAFAFA'/g, 'color: theme.text');
  code = code.replace(/color: '#A1A1AA'/g, 'color: theme.muted');
  code = code.replace(/color: '#71717A'/g, 'color: theme.muted');
  code = code.replace(/borderColor: '#3F3F46'/g, 'borderColor: theme.border');
  code = code.replace(/borderColor: '#CCFF0044'/g, 'borderColor: theme.primary + "44"');
  code = code.replace(/backgroundColor: '#10B98122'/g, 'backgroundColor: theme.successBg');
  code = code.replace(/color: '#10B981'/g, 'color: theme.success');
  code = code.replace(/backgroundColor: '#3F3F46'/g, 'backgroundColor: theme.border');
  
  // Specific replacements for placeholder text color
  code = code.replace(/placeholderTextColor="#71717A"/g, 'placeholderTextColor={theme.muted}');

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log('Successfully patched index.tsx');
} else {
  console.log('Already patched');
}
