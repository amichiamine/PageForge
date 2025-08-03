# 🚀 PageForge - Déploiement Production

## Vue d'ensemble
PageForge est maintenant optimisé et prêt pour le déploiement en production via VS Code ou hébergement web cPanel.

## Déploiement rapide

### VS Code Local
```bash
# Installation
npm install
# Configuration DB (voir .env.example)
npm run build
npm run start
```

### Hébergement cPanel
1. Upload dossier `dist/` vers `public_html/`
2. Configurer `.env` avec paramètres DB
3. Activer Node.js 18+ via cPanel
4. Démarrer application

## Fonctionnalités incluses
- ✅ Éditeur visuel 52 composants
- ✅ Système de templates
- ✅ Export HTML/CSS/JS
- ✅ Base de données PostgreSQL
- ✅ Interface responsive
- ✅ Système de déploiement

## Support technique
- Compatible Node.js 18+
- Compatible PostgreSQL
- Optimisé pour production
- Documentation complète fournie