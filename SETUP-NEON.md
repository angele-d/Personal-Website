# 🚀 Guide de démarrage - Connexion Neon

## Étape 1 : Créer un projet Neon

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte (gratuit)
3. Créez un nouveau projet
4. Notez votre **Connection String**

## Étape 2 : Configuration locale

### 2.1 Créer le fichier `.env.local`

```bash
cp .env.local.example .env.local
```

### 2.2 Ajouter votre connection string

Dans `.env.local`, remplacez par votre vraie URL :

```env
DATABASE_URL=postgres://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Format de l'URL :**
```
postgres://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require
```

### 2.3 Installer les dépendances

```bash
npm install @neondatabase/serverless server-only
```

## Étape 3 : Créer vos tables

### Option A : Depuis l'interface Neon

1. Dans votre projet Neon, allez dans **SQL Editor**
2. Copiez-collez le schéma de vos tables
3. Exécutez

### Option B : Depuis un script de migration

Créez `scripts/init-db.ts` :

```typescript
import { sql } from '@/lib/db/client';

async function initDatabase() {
  try {
    // Table users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Table media_logs
    await sql`
      CREATE TABLE IF NOT EXISTS media_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('movie', 'series', 'book', 'game')),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        notes TEXT,
        completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Table sleep_logs
    await sql`
      CREATE TABLE IF NOT EXISTS sleep_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sleep_date DATE NOT NULL,
        bedtime TIME NOT NULL,
        wake_time TIME NOT NULL,
        duration_hours DECIMAL(4,2) NOT NULL,
        quality INTEGER CHECK (quality >= 1 AND quality <= 5),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, sleep_date)
      )
    `;

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_media_logs_user_id ON media_logs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON sleep_logs(user_id)`;

    console.log('✅ Tables créées avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

initDatabase();
```

Exécutez :
```bash
npx tsx scripts/init-db.ts
```

## Étape 4 : Tester la connexion

Créez un fichier de test `test-db.ts` à la racine :

```typescript
import { testConnection } from '@/lib/db';

async function test() {
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('✅ Connexion Neon réussie !');
  } else {
    console.log('❌ Échec de connexion. Vérifiez votre DATABASE_URL');
  }
}

test();
```

Exécutez :
```bash
npx tsx test-db.ts
```

## Étape 5 : Utiliser dans votre code

### Dans un Server Component

```typescript
// app/dashboard/sleep/page.tsx
import { getSleepLogs } from '@/lib/db';

export default async function SleepPage() {
  const logs = await getSleepLogs('user-id', 30);
  
  return (
    <div>
      {logs.map(log => (
        <div key={log.id}>{log.sleep_date}</div>
      ))}
    </div>
  );
}
```

### Dans une Server Action

```typescript
// app/actions/sleep.ts
'use server'

import { createSleepLog } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addSleepLog(formData: FormData) {
  const userId = 'user-id'; // À récupérer depuis la session
  
  await createSleepLog(userId, {
    sleep_date: new Date(formData.get('date')),
    bedtime: formData.get('bedtime'),
    wake_time: formData.get('wake_time'),
    duration_hours: 8,
    quality: 4,
  });
  
  revalidatePath('/dashboard/sleep');
}
```

## Étape 6 : Déployer sur Vercel

### 6.1 Push votre code

```bash
git add .
git commit -m "Add Neon database integration"
git push
```

### 6.2 Ajouter la variable d'environnement

Dans Vercel Dashboard :
1. Allez dans **Settings > Environment Variables**
2. Ajoutez :
   - Name: `DATABASE_URL`
   - Value: Votre connection string Neon
   - Environments: Production, Preview, Development

### 6.3 Redéployer

```bash
vercel --prod
```

## ✅ Checklist finale

- [ ] Projet Neon créé
- [ ] `.env.local` configuré avec DATABASE_URL
- [ ] Dépendances installées (`@neondatabase/serverless`, `server-only`)
- [ ] Tables créées dans Neon
- [ ] Test de connexion réussi (`testConnection()`)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Code déployé

## 🔧 Troubleshooting

### Erreur : "DATABASE_URL is not defined"

**Solution :** Vérifiez que `.env.local` existe et contient DATABASE_URL

### Erreur : "Connection failed"

**Solutions :**
1. Vérifiez que l'URL est correcte
2. Vérifiez que `?sslmode=require` est présent
3. Vérifiez que le projet Neon est actif
4. Testez l'URL depuis l'interface Neon

### Erreur : "server-only module"

**Solution :** Vous essayez d'importer un fichier DB côté client. Utilisez une Server Action ou un Server Component.

### Performance lente

**Solutions :**
1. Utilisez des indexes sur les colonnes fréquemment requêtées
2. Limitez les requêtes avec `LIMIT`
3. Utilisez Neon Pooling (activé par défaut)

## 📚 Ressources utiles

- [Documentation Neon](https://neon.tech/docs/introduction)
- [Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Next.js + Neon Guide](https://neon.tech/docs/guides/nextjs)
- [Neon Serverless Driver](https://github.com/neondatabase/serverless)
