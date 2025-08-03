# 📦 SCRIPTS DE BUILD ET DÉPLOIEMENT

## Scripts Disponibles

### Développement
```bash
npm run dev          # Lancement serveur développement
```

### Production
```bash
npm run build        # Build complet (client + serveur)
npm run start        # Lancement production
```

### Utilitaires
```bash
npm run check        # Vérification TypeScript
npm run db:push      # Migration base de données
```

## Build Manuel

### Client (Frontend)
```bash
vite build
```

### Serveur (Backend)
```bash
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## Déploiement cPanel

### 1. Préparation
```bash
npm install
npm run build
```

### 2. Upload Fichiers
- `dist/` → `public_html/pageforge/`
- `.env` (configuré)
- `package.json`

### 3. Configuration Serveur
- Node.js 18+ activé
- Variables d'environnement configurées
- Base de données PostgreSQL créée