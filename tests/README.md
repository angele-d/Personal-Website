# Tests

Dossier contenant les tests pour le projet.

## Tests disponibles

### `db.test.js` - Tests de connexion Neon

Test la connexion à la base de données Neon et les opérations CRUD.

**Exécution:**
```bash
node tests/db.test.js
```

**Tests effectués:**
1. ✅ Connexion basique à Neon
2. ✅ Insertion d'un log de sommeil
3. ✅ Suppression du test (nettoyage)

**Prérequis:**
- `.env.local` doit contenir `DATABASE_URL`
- La table `sleep_logs` doit exister dans Neon
