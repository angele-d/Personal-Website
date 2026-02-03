/**
 * tests/verification.test.js
 * Tests de vérification du projet - 3 février 2026
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTest(name, fn) {
  try {
    log(`\n📋 ${name}`, 'blue');
    fn();
    log(`✅ ${name} réussi`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${name} échoué`, 'red');
    log(error.message, 'red');
    return false;
  }
}

const results = [];

// Test 1: TypeScript compilation
results.push(
  runTest('Test 1: TypeScript Compilation', () => {
    try {
      execSync('npx tsc --noEmit', { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      throw new Error('TypeScript compilation failed');
    }
  })
);

// Test 2: Build Next.js
results.push(
  runTest('Test 2: Build Next.js', () => {
    try {
      const output = execSync('npm run build 2>&1', { cwd: process.cwd(), encoding: 'utf-8' });
      if (output.includes('error') || output.includes('Error')) {
        throw new Error('Build failed');
      }
      if (!output.includes('Compiled successfully')) {
        throw new Error('Build did not complete successfully');
      }
    } catch (e) {
      throw new Error(`Build failed: ${e.message}`);
    }
  })
);

// Test 3: File structure
results.push(
  runTest('Test 3: Structure des dossiers', () => {
    const requiredDirs = [
      'app',
      'app/(auth)',
      'app/(dashboard)',
      'lib/db',
      'lib/auth',
      'lib/utils',
      'tests',
      'public',
      'types',
    ];

    for (const dir of requiredDirs) {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Dossier manquant: ${dir}`);
      }
    }
  })
);

// Test 4: Files existence
results.push(
  runTest('Test 4: Fichiers essentiels', () => {
    const requiredFiles = [
      'app/layout.tsx',
      'app/page.tsx',
      'app/globals.scss',
      'app/(auth)/layout.tsx',
      'app/(auth)/login/page.tsx',
      'app/(dashboard)/layout.tsx',
      'app/(dashboard)/sleep/page.tsx',
      'app/(dashboard)/media/page.tsx',
      'lib/db/client.ts',
      'lib/db/sleeplog.ts',
      'lib/db/media.ts',
      'lib/db/user.ts',
      'lib/auth/session.ts',
      'lib/utils/date.ts',
      'lib/utils/format.ts',
      'package.json',
      'tsconfig.json',
      'tests/db.test.js',
    ];

    for (const file of requiredFiles) {
      const fullPath = path.join(process.cwd(), file);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Fichier manquant: ${file}`);
      }
    }
  })
);

// Test 5: Package.json scripts
results.push(
  runTest('Test 5: Scripts npm', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const requiredScripts = ['dev', 'build', 'start', 'lint'];
    for (const script of requiredScripts) {
      if (!pkg.scripts || !pkg.scripts[script]) {
        throw new Error(`Script manquant: ${script}`);
      }
    }
  })
);

// Test 6: Dependencies
results.push(
  runTest('Test 6: Dépendances installées', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      '@neondatabase/serverless',
      'server-only',
      'sass',
    ];

    for (const dep of requiredDeps) {
      if (!pkg.dependencies || !pkg.dependencies[dep]) {
        throw new Error(`Dépendance manquante: ${dep}`);
      }
    }
  })
);

// Test 7: Neon connection
results.push(
  runTest('Test 7: Connexion Neon', () => {
    try {
      const output = execSync('node tests/db.test.js 2>&1', {
        cwd: process.cwd(),
        encoding: 'utf-8',
      });
      if (!output.includes('✅ Connexion Neon OK')) {
        throw new Error('Neon connection test failed');
      }
      if (!output.includes('✅ Tous les tests sont passés')) {
        throw new Error('Database operations failed');
      }
    } catch (e) {
      throw new Error(`Neon test failed: ${e.message}`);
    }
  })
);

// Test 8: Utils functions
results.push(
  runTest('Test 8: Fonctions utilitaires', () => {
    const dateUtilsPath = path.join(process.cwd(), 'lib/utils/date.ts');
    const formatUtilsPath = path.join(process.cwd(), 'lib/utils/format.ts');

    const dateContent = fs.readFileSync(dateUtilsPath, 'utf-8');
    const formatContent = fs.readFileSync(formatUtilsPath, 'utf-8');

    const requiredFunctions = {
      'date.ts': ['formatDate', 'formatTime', 'calculateDuration', 'getDateRange'],
      'format.ts': ['formatDuration', 'validateEmail', 'validatePassword', 'slugify'],
    };

    for (const fn of requiredFunctions['date.ts']) {
      if (!dateContent.includes(`export function ${fn}`)) {
        throw new Error(`Fonction manquante dans date.ts: ${fn}`);
      }
    }

    for (const fn of requiredFunctions['format.ts']) {
      if (!formatContent.includes(`export function ${fn}`)) {
        throw new Error(`Fonction manquante dans format.ts: ${fn}`);
      }
    }
  })
);

// Résumé
log('\n\n' + '='.repeat(50), 'blue');
log('RÉSUMÉ DES TESTS', 'blue');
log('='.repeat(50), 'blue');

const passed = results.filter((r) => r).length;
const total = results.length;
const percentage = Math.round((passed / total) * 100);

log(`\nTests réussis: ${passed}/${total} (${percentage}%)`, passed === total ? 'green' : 'red');

if (passed === total) {
  log('\n✅ TOUS LES TESTS SONT PASSÉS!', 'green');
  log('Le projet est prêt pour le développement et le push! 🚀\n', 'green');
  process.exit(0);
} else {
  log('\n❌ CERTAINS TESTS ONT ÉCHOUÉ', 'red');
  log('Veuillez corriger les problèmes ci-dessus.\n', 'red');
  process.exit(1);
}
