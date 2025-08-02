# Procédure de Vérification des Composants PageForge

## Vue d'ensemble
Cette procédure permet d'analyser méthodiquement un composant pour identifier les problèmes dans sa logique complète, de la création à la configuration.

## Étapes de Diagnostic

### 1. 🔍 Analyse de la Logique de Création
**Fichier :** `client/src/lib/editor-utils.ts`

**Vérifications :**
- Structure du composant de base (`baseComponent`)
- Propriétés `tag`, `attributes`, `styles`
- Initialisation de `componentData` (si applicable)
- Valeurs par défaut cohérentes

**Points d'attention :**
- Tous les composants complexes doivent avoir `componentData`
- Les valeurs par défaut doivent être fonctionnelles
- La structure doit respecter l'architecture unifiée

### 2. 🎨 Analyse du Rendu Visuel
**Fichier :** `client/src/components/editor/component-renderer.tsx`

**Vérifications :**
- Récupération des données depuis `componentData`
- Logique conditionnelle (état vide vs. avec données)
- Styles responsifs et adaptatifs
- Gestion des valeurs par défaut (fallbacks)

**Points d'attention :**
- Source unique de vérité : `componentData`
- Gestion de l'état vide pour les composants complexes
- Cohérence visuelle avec les autres composants

### 3. ⚙️ Analyse de la Configuration
**Fichier :** `client/src/components/editor/properties-panel.tsx`

**Vérifications :**
- Fonction `renderXProperties()` existe et est appelée
- Paramètres CSS (styles de base)
- Section configuration (componentData)
- Fonction `updateProperty()` utilisée correctement

**Points d'attention :**
- Chemins de propriétés corrects (`styles.X` vs `componentData.X`)
- Validation des valeurs (ex: `ensureSelectValue`)
- Gestion des collections (ajout/suppression d'éléments)

### 4. 🔧 Analyse de la Fonction updateProperty
**Fichier :** `client/src/components/editor/properties-panel.tsx`

**Vérifications :**
- Gestion des différents types de propriétés
- Propagation des changements (`setLocalComponent` + `onComponentUpdate`)
- Préservation des propriétés critiques (position, taille)

**Points d'attention :**
- Immutabilité des objets (spread operator)
- Synchronisation locale vs. globale
- Éviter les références circulaires dans `useEffect`

### 5. 🧪 Tests de Flux Complet

**Scénarios à tester :**
1. **Création** : Ajouter le composant depuis la palette
2. **Configuration initiale** : Vérifier l'état par défaut
3. **Modification simple** : Changer une propriété CSS
4. **Modification complexe** : Ajouter/modifier des éléments de collection
5. **Rendu** : Vérifier l'affichage en temps réel

## Problèmes Courants Identifiés

### ❌ Double Initialisation
- Initialisation dans `editor-utils.ts` ET dans `properties-panel.tsx`
- Conditions d'initialisation contradictoires

### ❌ Références Circulaires
- `useEffect` avec dépendances qui changent à chaque render
- `onComponentUpdate` dans les dépendances d'effet

### ❌ Chemins de Propriétés Incorrects
- Confusion entre `styles.X` et `componentData.X`
- Mauvaise utilisation de la fonction `updateProperty`

### ❌ Gestion d'État Incohérente
- `localComponent` non synchronisé avec le composant parent
- Mises à jour partielles qui ne se propagent pas

## Modèle de Diagnostic

### Template d'Analyse
```markdown
## DIAGNOSTIC COMPOSANT : [NOM_COMPOSANT]

### 🔍 CRÉATION (editor-utils.ts)
- ✅/❌ Structure de base
- ✅/❌ ComponentData initialisé
- ✅/❌ Valeurs par défaut

### 🎨 RENDU (component-renderer.tsx)
- ✅/❌ Récupération componentData
- ✅/❌ Logique conditionnelle
- ✅/❌ Gestion état vide

### ⚙️ CONFIGURATION (properties-panel.tsx)
- ✅/❌ Fonction render[X]Properties
- ✅/❌ Appels updateProperty
- ✅/❌ Gestion collections

### 🔧 FONCTION updateProperty
- ✅/❌ Chemins de propriétés
- ✅/❌ Propagation changements
- ✅/❌ Préservation état

### 🚨 PROBLÈMES IDENTIFIÉS
1. [Description du problème]
2. [Description du problème]

### 🎯 SOLUTIONS REQUISES
1. [Action corrective]
2. [Action corrective]
```

## Checklist de Validation

- [ ] Le composant se crée sans erreur
- [ ] L'état par défaut est fonctionnel
- [ ] Les propriétés CSS se modifient en temps réel
- [ ] Les éléments de collection s'ajoutent/modifient/suppriment
- [ ] Le rendu visuel est cohérent
- [ ] Aucune erreur console
- [ ] La sauvegarde automatique fonctionne

## Notes d'Utilisation

Cette procédure doit être appliquée :
- À chaque nouveau composant créé
- Lors de modifications majeures de l'architecture
- En cas de dysfonctionnement rapporté
- Pour valider l'implémentation du Protocole-Component

**Dernière mise à jour :** Janvier 2025
**Créé pour :** PageForge - Système de validation des composants