# Protocole-Component : Mécanisme Standard d'Intégration des Composants Complexes

## Vue d'ensemble
Ce document décrit le protocole standard utilisé par SiteForge pour l'intégration complète des composants complexes, basé sur l'analyse du composant carrousel qui sert de référence.

## Architecture Unifiée : Les 4 Piliers

### 1. CRÉATION (editor-utils.ts)
**Fonction :** Définition initiale du composant avec architecture componentData

```typescript
case 'carousel':
  return {
    ...baseComponent,
    tag: 'div',
    attributes: { 
      className: 'carousel-container',
      'data-carousel': 'true'
    },
    styles: {
      ...baseComponent.styles,
      // Styles visuels spécifiques
      width: '400px',
      height: '250px',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    componentData: {
      // DONNÉES MÉTIER SPÉCIFIQUES AU COMPOSANT
      slides: [],                 // Collections d'éléments
      currentSlide: 0,           // État interne
      autoplay: false,           // Configuration comportementale
      animationSpeed: 3000,      // Paramètres techniques
      showDots: true,            // Options d'affichage
      showArrows: true
    }
  };
```

**Règles :**
- `componentData` contient TOUTES les données métier
- Les collections (slides, items, etc.) sont dans componentData
- État par défaut : collections vides ou avec données minimum
- Styles initiaux : apparence visuelle de base

### 2. RENDU VISUEL (component-renderer.tsx)
**Fonction :** Affichage conditionnel basé sur componentData

```typescript
case 'carousel':
  // Récupération des données depuis componentData (source unique de vérité)
  const slides = component.componentData?.slides || [];
  const currentSlide = component.componentData?.currentSlide || 0;
  
  return (
    <div className={`carousel-container ${className || ''}`}>
      {slides.length > 0 ? (
        // RENDU AVEC DONNÉES : Affichage complet du composant
        <>
          <div className="carousel-track">
            {slides.map((slide: any, index: number) => (
              <div key={index} className="carousel-slide">
                {/* Rendu spécifique de chaque élément */}
                {slide.image && <img src={slide.image} />}
                <div>
                  {slide.title && <h3>{slide.title}</h3>}
                  {slide.description && <p>{slide.description}</p>}
                </div>
              </div>
            ))}
          </div>
          {/* Indicateurs et contrôles */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button key={index} className={index === currentSlide ? 'active' : ''} />
            ))}
          </div>
        </>
      ) : (
        // ÉTAT VIDE : Message indicatif pour l'utilisateur
        <div className="carousel-placeholder">
          Carrousel vide - Ajoutez des images via la configuration
        </div>
      )}
    </div>
  );
```

**Règles :**
- Lecture EXCLUSIVE depuis componentData
- Gestion conditionnelle : état vide vs état avec données
- Rendu complet de tous les sous-éléments
- Classes CSS spécifiques pour le styling

### 3. CONFIGURATION (properties-panel.tsx)
**Fonction :** Interface de gestion des données métier

```typescript
const renderCarouselProperties = () => (
  <div className="space-y-4">
    <h4>Configuration du Carrousel</h4>
    
    {/* PARAMÈTRES GLOBAUX */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label>Vitesse d'animation (ms)</Label>
        <Input
          type="number"
          value={localComponent?.componentData?.animationSpeed || 3000}
          onChange={(e) => updateProperty('componentData.animationSpeed', parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label>Défilement automatique</Label>
        <Select
          value={localComponent?.componentData?.autoplay || 'false'}
          onValueChange={(value) => updateProperty('componentData.autoplay', value)}
        >
          <SelectItem value="true">Activé</SelectItem>
          <SelectItem value="false">Désactivé</SelectItem>
        </Select>
      </div>
    </div>

    {/* GESTION DES COLLECTIONS */}
    <div>
      <Label>Images du carrousel</Label>
      <div className="space-y-2">
        {(localComponent?.componentData?.slides || []).map((slide: any, index: number) => (
          <div key={index} className="flex gap-2 items-center p-2 border rounded">
            {/* ÉDITION D'ÉLÉMENT INDIVIDUEL */}
            <Input
              placeholder="URL de l'image"
              value={slide.image || ''}
              onChange={(e) => {
                const slides = [...(localComponent?.componentData?.slides || [])];
                slides[index] = { ...slide, image: e.target.value };
                updateProperty('componentData.slides', slides);
              }}
            />
            {/* SUPPRESSION D'ÉLÉMENT */}
            <Button
              onClick={() => {
                const slides = [...(localComponent?.componentData?.slides || [])];
                slides.splice(index, 1);
                updateProperty('componentData.slides', slides);
              }}
            >
              <Minus />
            </Button>
          </div>
        ))}
        
        {/* AJOUT D'ÉLÉMENT */}
        <Button
          onClick={() => {
            const slides = [...(localComponent?.componentData?.slides || [])];
            slides.push({ image: '', caption: `Slide ${slides.length + 1}` });
            updateProperty('componentData.slides', slides);
          }}
        >
          <Plus />
          Ajouter une image
        </Button>
      </div>
    </div>
  </div>
);

// INTÉGRATION DANS LE SWITCH PRINCIPAL
switch (componentType) {
  case 'carousel':
    return renderCarouselProperties();
  // autres cas...
}
```

**Règles :**
- Fonction dédiée : `render[ComponentName]Properties()`
- updateProperty() avec chemin 'componentData.propriété'
- Gestion CRUD complète des collections
- Interface intuitive avec labels descriptifs

### 4. EXPORT HTML (editor.tsx)
**Fonction :** Génération du code HTML final optimisé

```typescript
// Gestion conditionnelle pour l'export
if (component.type === 'carousel' && component.componentData?.slides) {
  const slides = component.componentData.slides;
  
  if (slides.length === 0) {
    // Export avec placeholder pour carrousel vide
    return `${indentStr}<div ${idAttr} class="carousel-container carousel-placeholder">
${childIndentStr}<div class="carousel-slide">
${childIndentStr}  <h3>Carrousel</h3>
${childIndentStr}  <p>Configurez vos images dans l'éditeur</p>
${childIndentStr}</div>
${indentStr}</div>`;
  }
  
  // Export complet avec toutes les slides
  const slidesHTML = slides.map((slide: any) => {
    const slideStyle = `
      width: ${100 / slides.length}%;
      height: 100%;
      background: ${slide.backgroundColor || '#3b82f6'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
      object-fit: cover;
    `;
    
    return `${childIndentStr}<div class="carousel-slide" style="${slideStyle}">
${childIndentStr}  ${slide.image ? '<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.3); z-index: 1;"></div>' : ''}
${childIndentStr}  <div style="position: relative; z-index: 2; text-align: center; padding: 20px;">
${childIndentStr}    ${slide.title ? `<h3>${slide.title}</h3>` : ''}
${childIndentStr}    ${slide.description ? `<p>${slide.description}</p>` : ''}
${childIndentStr}    ${slide.buttonText ? `<button>${slide.buttonText}</button>` : ''}
${childIndentStr}  </div>
${childIndentStr}</div>`;
  }).join('\n');
  
  return `${indentStr}${openingTag}
${childIndentStr}<div class="carousel-track" style="display: flex; width: ${slides.length * 100}%; height: 100%;">
${slidesHTML}
${childIndentStr}</div>
${indentStr}</${tag}>`;
}
```

**Règles :**
- Génération conditionnelle basée sur componentData
- HTML sémantique avec classes CSS spécifiques
- Styles inline pour la compatibilité export
- Structure complète incluant tous les sous-éléments

## Flux de Données Unifié

```
CRÉATION → RENDU → CONFIGURATION → EXPORT
    ↓         ↓           ↓           ↓
componentData → componentData → componentData → componentData
    ↓         ↓           ↓           ↓
 Données    Affichage   Édition    Code HTML
 initiales   visuel    utilisateur   final
```

## Points Critiques du Protocole

### 1. Source Unique de Vérité
- **TOUT** passe par `componentData`
- Aucune donnée dans `children` ou autres propriétés
- Cohérence garantie entre tous les systèmes

### 2. Gestion des États
- **État vide** : Placeholder informatif
- **État avec données** : Rendu complet
- **Transitions** : Mises à jour temps réel

### 3. Interface Utilisateur
- Fonction dédiée pour chaque composant
- Panneau spécialisé avec tous les contrôles
- Actions CRUD complètes sur les collections

### 4. Intégration Système
- Switch case dans `renderComponentSpecificProperties()`
- updateProperty() avec notation pointée
- Préservation des styles de position

## Template d'Implémentation

Pour créer un nouveau composant complexe, suivre ce template :

```typescript
// 1. CRÉATION (editor-utils.ts)
case 'nouveauComponent':
  return {
    ...baseComponent,
    tag: 'div',
    attributes: { className: 'nouveau-component' },
    styles: { /* styles de base */ },
    componentData: {
      // Collections et paramètres spécifiques
      items: [],
      config: defaultValue
    }
  };

// 2. RENDU (component-renderer.tsx)
case 'nouveauComponent':
  const items = component.componentData?.items || [];
  return (
    <div className="nouveau-component">
      {items.length > 0 ? (
        // Rendu avec données
      ) : (
        // État vide
      )}
    </div>
  );

// 3. CONFIGURATION (properties-panel.tsx)
const renderNouveauComponentProperties = () => (
  <div className="space-y-4">
    {/* Interface de configuration */}
  </div>
);

// Dans le switch :
case 'nouveauComponent':
  return renderNouveauComponentProperties();

// 4. EXPORT (editor.tsx)
if (component.type === 'nouveauComponent') {
  // Génération HTML conditionnelle
}
```

## Validation du Protocole

Un composant respecte le protocole si :
- ✅ Utilise exclusivement componentData
- ✅ Gère l'état vide avec placeholder
- ✅ Possède un panneau de configuration dédié
- ✅ Exporte du HTML sémantique
- ✅ Maintient la cohérence entre tous les systèmes

Ce protocole garantit une architecture unifiée, maintenable et évolutive pour tous les composants complexes de SiteForge.