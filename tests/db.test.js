const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue;
    const match = line.match(/^([^=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  log('❌ DATABASE_URL manquante dans .env.local', 'red');
  process.exit(1);
}

async function testConnection() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Test basique de connexion
    log('\n📋 Test 1: Connexion basique', 'blue');
    const result = await sql`SELECT 1 as test`;
    if (result[0]?.test === 1) {
      log('✅ Connexion Neon OK\n', 'green');
    } else {
      throw new Error('Connexion test échouée');
    }

    // Test d'insertion dans sleep_logs
    log('📋 Test 2: Insertion dans sleep_logs', 'blue');
    const testUserId = '00000000-0000-0000-0000-000000000001';
    const testDate = new Date().toISOString().split('T')[0];
    
    const insertResult = await sql`
      INSERT INTO sleep_logs (user_id, sleep_date, bedtime, wake_time, duration_hours, notes)
      VALUES (
        ${testUserId}::uuid,
        ${testDate}::date,
        '22:30'::time,
        '07:30'::time,
        9.0,
        'Test insertion'
      )
      RETURNING id, user_id, sleep_date, duration_hours
    `;
    
    if (insertResult.length > 0) {
      const row = insertResult[0];
      log('✅ Insertion réussie', 'green');
      log(`   ID: ${row.id}`);
      log(`   User ID: ${row.user_id}`);
      log(`   Date: ${row.sleep_date}`);
      log(`   Durée: ${row.duration_hours}h\n`);
      
      // Nettoyer le test
      const deleteResult = await sql`
        DELETE FROM sleep_logs 
        WHERE id = ${row.id}::uuid
      `;
      
      log('📋 Test 3: Suppression du test', 'blue');
      log('✅ Nettoyage effectué\n', 'green');
    }

    log('✅ Tous les tests sont passés!', 'green');
    process.exit(0);
  } catch (error) {
    log('❌ Erreur:', error.message, 'red');
    process.exit(1);
  }
}

testConnection();
