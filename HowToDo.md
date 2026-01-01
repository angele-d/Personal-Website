
Summary

- [File tree](#file-tree)

## File tree

```ruby
mon-projet/
├─ app/                  # l’équivalent de "pages" + "routes" dans Next.js
│   ├─ page.tsx          # page d’accueil
│   ├─ movies/           # route /movies
│   │   └─ page.tsx      # page liste de films
│   └─ stats/            # route /stats
│       └─ page.tsx
│
├─ components/           # tous tes composants réutilisables
│   ├─ Button.tsx
│   ├─ Header.tsx
│   └─ MovieCard.tsx
│
├─ styles/               # fichiers CSS globaux ou modules
│   ├─ globals.css
│   └─ MovieCard.module.css
│
├─ types/                # types TS
│   ├─ Movie.ts
│   └─ Sleep.ts
│
├─ utils/                # fonctions utilitaires
│   ├─ dateHelpers.ts
│   └─ math.ts
│
├─ services/             # appels API / Supabase
│   └─ supabase.ts
│
├─ public/               # fichiers statiques
│   └─ images/
│
├─ node_modules/
├─ package.json
├─ tsconfig.json
└─ next.config.js
```