const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/(tabs)/index.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Replace the static `const styles = StyleSheet.create({` with `const createStyles = (theme: any) => StyleSheet.create({`
code = code.replace(
  /const styles = StyleSheet\.create\(\{/,
  `const createStyles = (theme: any) => StyleSheet.create({`
);

// 2. Inject `const styles = React.useMemo(() => createStyles(theme), [theme]);` inside the component
code = code.replace(
  /const theme = useThemeColors\(\);/,
  `const theme = useThemeColors();\n  const styles = React.useMemo(() => createStyles(theme), [theme]);`
);

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully applied createStyles pattern');
