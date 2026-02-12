# 🗄️ Architecture Database - Neon PostgreSQL

## 📁 Structure

```
lib/db/
├── client.ts     # Client Neon singleton (connexion unique réutilisée)
├── index.ts      # Point d'entrée qui réexporte tout
├── sleeplog.ts   # Requêtes pour la table sleep_logs
├── media.ts      # Requêtes pour la table media_logs
└── user.ts       # Requêtes pour la table users
```

## 🔗 Comment ça marche ?

### 1️⃣ Configuration de la connexion

Le fichier `client.ts` crée une **connexion singleton** à Neon :

```typescript
import { sql } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);
```

**Avantages de Neon :**
- ✅ Connection pooling natif via HTTP (port 443)
- ✅ Pas de limite de connexions TCP
- ✅ Optimisé pour Vercel & environnements serverless
- ✅ Scale to zero automatique

### 2️⃣ Un fichier par table

Chaque table a son propre fichier avec :
- **Types TypeScript** spécifiques
- **Fonctions CRUD** (Create, Read, Update, Delete)
- **Requêtes métier** (stats, recherches, etc.)

### 3️⃣ Import simplifié

Grâce à `index.ts`, vous pouvez importer depuis `@/lib/db` :

```typescript
// ✅ Recommandé
import { getSleepLogs, createSleepLog } from '@/lib/db';

// ❌ Éviter (chemins spécifiques)
import { getSleepLogs } from '@/lib/db/sleeplog';
```

## 🚀 Utilisation

### Dans un Server Component

```typescript
import { getSleepLogs } from '@/lib/db';

export default async function SleepPage() {
  const logs = await getSleepLogs('user-id-123', 30);
  
  return <div>{/* Afficher les logs */}</div>;
}
```

### Dans une Server Action

```typescript
'use server'

import { createMediaEntry } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addMedia(formData: FormData) {
  const userId = 'user-id-123'; // Récupéré depuis la session
  
  await createMediaEntry(userId, {
    title: formData.get('title'),
    type: 'movie',
    rating: 4,
    completed_at: new Date(),
  });
  
  revalidatePath('/dashboard/media');
}
```

### Dans un API Route

```typescript
import { getMediaStatsByType } from '@/lib/db';

export async function GET() {
  const stats = await getMediaStatsByType('user-id-123');
  return Response.json(stats);
}
```

## 🔐 Sécurité

### Protection contre les injections SQL

Les **tagged template literals** de Neon protègent automatiquement :

```typescript
// ✅ SÉCURISÉ - Neon échappe automatiquement
const logs = await sql`
  SELECT * FROM sleep_logs WHERE user_id = ${userId}
`;

// ❌ DANGEREUX - Ne JAMAIS faire ça
const logs = await sql`SELECT * FROM sleep_logs WHERE user_id = '${userId}'`;
```

### Isolation utilisateur

Toutes les fonctions prennent `userId` en paramètre :

```typescript
// ✅ Les données sont isolées par utilisateur
await getSleepLogs(session.user.id, 30);

// ❌ Ne JAMAIS passer l'ID depuis le client
// Le userId doit TOUJOURS venir de la session serveur
```

## 📊 Exemples de requêtes

### Récupérer des données

```typescript
import { getSleepLogs, getMediaEntries } from '@/lib/db';

// Logs de sommeil (30 derniers)
const sleepLogs = await getSleepLogs(userId, 30);

// Tous les médias
const allMedia = await getMediaEntries(userId);

// Médias limités
const recentMedia = await getMediaEntries(userId, 10);
```

### Créer des données

```typescript
import { createSleepLog, createMediaEntry } from '@/lib/db';

// Nouveau log de sommeil
await createSleepLog(userId, {
  sleep_date: new Date('2026-02-03'),
  bedtime: '23:00',
  wake_time: '07:30',
  duration_hours: 8.5,
  quality: 4,
  notes: 'Bonne nuit',
});

// Nouveau média
await createMediaEntry(userId, {
  title: 'Inception',
  type: 'movie',
  rating: 5,
  completed_at: new Date(),
  notes: 'Chef-d\'œuvre',
});
```

### Mettre à jour

```typescript
import { updateSleepLog, updateMediaEntry } from '@/lib/db';

// Modifier la qualité d'un log
await updateSleepLog(userId, logId, {
  quality: 5,
  notes: 'Encore mieux que prévu',
});

// Modifier la note d'un média
await updateMediaEntry(userId, mediaId, {
  rating: 4,
});
```

### Supprimer

```typescript
import { deleteSleepLog, deleteMediaEntry } from '@/lib/db';

await deleteSleepLog(userId, logId);
await deleteMediaEntry(userId, mediaId);
```

### Statistiques

```typescript
import { getSleepStats, getMediaStatsByType } from '@/lib/db';

// Stats de sommeil (30 derniers jours)
const sleepStats = await getSleepStats(userId, 30);
// { avg_duration: 7.5, avg_quality: 4.2, total_logs: 28 }

// Stats par type de média
const mediaStats = await getMediaStatsByType(userId);
// [{ type: 'movie', count: 15, avg_rating: 4.3 }, ...]
```

## ⚙️ Configuration

### 1. Variables d'environnement

Créez `.env.local` :

```env
DATABASE_URL=postgres://user:password@your-endpoint.neon.tech/dbname?sslmode=require
```

### 2. Sur Vercel

Ajoutez la variable dans **Settings > Environment Variables** :
- `DATABASE_URL` = votre connection string Neon

## 🎯 Bonnes pratiques

### ✅ À FAIRE

- Toujours utiliser `server-only` dans les fichiers DB
- Récupérer `userId` depuis la session (côté serveur)
- Valider les données avec Zod avant insertion
- Utiliser les types TypeScript exportés
- Gérer les erreurs avec try/catch

### ❌ À ÉVITER

- Ne JAMAIS importer les fichiers DB côté client
- Ne JAMAIS passer `userId` depuis un formulaire
- Ne JAMAIS construire des requêtes SQL avec des strings
- Ne JAMAIS retourner `password_hash` au client

## 🔄 Ajouter une nouvelle table

1. Créez `lib/db/nouvelle-table.ts`
2. Définissez les types et fonctions
3. Exportez dans `lib/db/index.ts`

```typescript
// lib/db/nouvelle-table.ts
import 'server-only';
import { sql } from './client';

export interface NouvelleTable {
  id: string;
  user_id: string;
  // ...
}

export async function getItems(userId: string) {
  return await sql`SELECT * FROM nouvelle_table WHERE user_id = ${userId}`;
}

// lib/db/index.ts
export * from './nouvelle-table';
```

## 📚 Ressources

- [Documentation Neon](https://neon.tech/docs)
- [Driver @neondatabase/serverless](https://github.com/neondatabase/serverless)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
