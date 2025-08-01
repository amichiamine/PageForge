// Collection massive de toutes les propriétés CSS disponibles
export interface CSSProperty {
  type: 'text' | 'number' | 'color' | 'select' | 'range' | 'checkbox' | 'file' | 'multi-select';
  label: string;
  description?: string;
  defaultValue?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  category: string;
  responsive?: boolean;
}

export const massiveCSSProperties: Record<string, CSSProperty> = {
  // === LAYOUT & POSITIONING ===
  'display': {
    type: 'select',
    label: 'Affichage',
    category: 'Layout',
    options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'table', 'table-cell', 'table-row', 'none', 'contents'],
    defaultValue: 'block',
    responsive: true
  },
  'position': {
    type: 'select',
    label: 'Position',
    category: 'Layout',
    options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    defaultValue: 'static'
  },
  'top': { type: 'text', label: 'Haut', category: 'Layout', unit: 'px', defaultValue: 'auto' },
  'right': { type: 'text', label: 'Droite', category: 'Layout', unit: 'px', defaultValue: 'auto' },
  'bottom': { type: 'text', label: 'Bas', category: 'Layout', unit: 'px', defaultValue: 'auto' },
  'left': { type: 'text', label: 'Gauche', category: 'Layout', unit: 'px', defaultValue: 'auto' },
  'z-index': { type: 'number', label: 'Z-Index', category: 'Layout', min: -999, max: 999, defaultValue: 'auto' },
  
  // === FLEXBOX ===
  'flex-direction': {
    type: 'select',
    label: 'Direction Flex',
    category: 'Flexbox',
    options: ['row', 'row-reverse', 'column', 'column-reverse'],
    defaultValue: 'row',
    responsive: true
  },
  'flex-wrap': {
    type: 'select',
    label: 'Flex Wrap',
    category: 'Flexbox',
    options: ['nowrap', 'wrap', 'wrap-reverse'],
    defaultValue: 'nowrap'
  },
  'justify-content': {
    type: 'select',
    label: 'Justification',
    category: 'Flexbox',
    options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
    defaultValue: 'flex-start',
    responsive: true
  },
  'align-items': {
    type: 'select',
    label: 'Alignement Items',
    category: 'Flexbox',
    options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
    defaultValue: 'stretch',
    responsive: true
  },
  'align-content': {
    type: 'select',
    label: 'Alignement Contenu',
    category: 'Flexbox',
    options: ['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    defaultValue: 'stretch'
  },
  'flex-grow': { type: 'number', label: 'Flex Grow', category: 'Flexbox', min: 0, max: 10, defaultValue: 0 },
  'flex-shrink': { type: 'number', label: 'Flex Shrink', category: 'Flexbox', min: 0, max: 10, defaultValue: 1 },
  'flex-basis': { type: 'text', label: 'Flex Basis', category: 'Flexbox', defaultValue: 'auto' },
  'align-self': {
    type: 'select',
    label: 'Alignement Self',
    category: 'Flexbox',
    options: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
    defaultValue: 'auto'
  },
  'order': { type: 'number', label: 'Ordre', category: 'Flexbox', min: -999, max: 999, defaultValue: 0 },

  // === GRID ===
  'grid-template-columns': { type: 'text', label: 'Colonnes Grid', category: 'Grid', defaultValue: 'none' },
  'grid-template-rows': { type: 'text', label: 'Lignes Grid', category: 'Grid', defaultValue: 'none' },
  'grid-template-areas': { type: 'text', label: 'Aires Grid', category: 'Grid', defaultValue: 'none' },
  'grid-column-gap': { type: 'text', label: 'Espace Colonnes', category: 'Grid', unit: 'px', defaultValue: '0' },
  'grid-row-gap': { type: 'text', label: 'Espace Lignes', category: 'Grid', unit: 'px', defaultValue: '0' },
  'grid-gap': { type: 'text', label: 'Espace Grid', category: 'Grid', unit: 'px', defaultValue: '0' },
  'grid-column': { type: 'text', label: 'Colonne', category: 'Grid', defaultValue: 'auto' },
  'grid-row': { type: 'text', label: 'Ligne', category: 'Grid', defaultValue: 'auto' },
  'grid-area': { type: 'text', label: 'Aire', category: 'Grid', defaultValue: 'auto' },

  // === DIMENSIONS ===
  'width': { type: 'text', label: 'Largeur', category: 'Dimensions', unit: 'px', defaultValue: 'auto', responsive: true },
  'height': { type: 'text', label: 'Hauteur', category: 'Dimensions', unit: 'px', defaultValue: 'auto', responsive: true },
  'min-width': { type: 'text', label: 'Largeur Min', category: 'Dimensions', unit: 'px', defaultValue: '0', responsive: true },
  'min-height': { type: 'text', label: 'Hauteur Min', category: 'Dimensions', unit: 'px', defaultValue: '0', responsive: true },
  'max-width': { type: 'text', label: 'Largeur Max', category: 'Dimensions', unit: 'px', defaultValue: 'none', responsive: true },
  'max-height': { type: 'text', label: 'Hauteur Max', category: 'Dimensions', unit: 'px', defaultValue: 'none', responsive: true },
  'box-sizing': {
    type: 'select',
    label: 'Box Sizing',
    category: 'Dimensions',
    options: ['content-box', 'border-box'],
    defaultValue: 'content-box'
  },

  // === MARGINS ===
  'margin': { type: 'text', label: 'Marge', category: 'Marges', unit: 'px', defaultValue: '0', responsive: true },
  'margin-top': { type: 'text', label: 'Marge Haut', category: 'Marges', unit: 'px', defaultValue: '0', responsive: true },
  'margin-right': { type: 'text', label: 'Marge Droite', category: 'Marges', unit: 'px', defaultValue: '0', responsive: true },
  'margin-bottom': { type: 'text', label: 'Marge Bas', category: 'Marges', unit: 'px', defaultValue: '0', responsive: true },
  'margin-left': { type: 'text', label: 'Marge Gauche', category: 'Marges', unit: 'px', defaultValue: '0', responsive: true },

  // === PADDING ===
  'padding': { type: 'text', label: 'Espacement', category: 'Espacement', unit: 'px', defaultValue: '0', responsive: true },
  'padding-top': { type: 'text', label: 'Espacement Haut', category: 'Espacement', unit: 'px', defaultValue: '0', responsive: true },
  'padding-right': { type: 'text', label: 'Espacement Droite', category: 'Espacement', unit: 'px', defaultValue: '0', responsive: true },
  'padding-bottom': { type: 'text', label: 'Espacement Bas', category: 'Espacement', unit: 'px', defaultValue: '0', responsive: true },
  'padding-left': { type: 'text', label: 'Espacement Gauche', category: 'Espacement', unit: 'px', defaultValue: '0', responsive: true },

  // === TYPOGRAPHY ===
  'font-family': {
    type: 'select',
    label: 'Police',
    category: 'Typographie',
    options: ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'monospace', 'serif', 'sans-serif'],
    defaultValue: 'Arial'
  },
  'font-size': { type: 'range', label: 'Taille Police', category: 'Typographie', min: 8, max: 72, step: 1, unit: 'px', defaultValue: 16, responsive: true },
  'font-weight': {
    type: 'select',
    label: 'Poids Police',
    category: 'Typographie',
    options: ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold', 'bolder', 'lighter'],
    defaultValue: '400'
  },
  'font-style': {
    type: 'select',
    label: 'Style Police',
    category: 'Typographie',
    options: ['normal', 'italic', 'oblique'],
    defaultValue: 'normal'
  },
  'line-height': { type: 'range', label: 'Hauteur Ligne', category: 'Typographie', min: 0.5, max: 3, step: 0.1, defaultValue: 1.4 },
  'letter-spacing': { type: 'range', label: 'Espacement Lettres', category: 'Typographie', min: -5, max: 10, step: 0.1, unit: 'px', defaultValue: 0 },
  'word-spacing': { type: 'range', label: 'Espacement Mots', category: 'Typographie', min: -10, max: 50, step: 1, unit: 'px', defaultValue: 0 },
  'text-align': {
    type: 'select',
    label: 'Alignement Texte',
    category: 'Typographie',
    options: ['left', 'center', 'right', 'justify'],
    defaultValue: 'left',
    responsive: true
  },
  'text-decoration': {
    type: 'select',
    label: 'Décoration Texte',
    category: 'Typographie',
    options: ['none', 'underline', 'overline', 'line-through'],
    defaultValue: 'none'
  },
  'text-transform': {
    type: 'select',
    label: 'Transformation',
    category: 'Typographie',
    options: ['none', 'capitalize', 'uppercase', 'lowercase'],
    defaultValue: 'none'
  },
  'text-indent': { type: 'text', label: 'Indentation', category: 'Typographie', unit: 'px', defaultValue: '0' },
  'text-shadow': { type: 'text', label: 'Ombre Texte', category: 'Typographie', defaultValue: 'none' },

  // === COLORS ===
  'color': { type: 'color', label: 'Couleur Texte', category: 'Couleurs', defaultValue: '#000000' },
  'background-color': { type: 'color', label: 'Couleur Fond', category: 'Couleurs', defaultValue: 'transparent' },
  'border-color': { type: 'color', label: 'Couleur Bordure', category: 'Couleurs', defaultValue: '#000000' },

  // === BACKGROUND ===
  'background-image': { type: 'text', label: 'Image Fond', category: 'Arrière-plan', defaultValue: 'none' },
  'background-size': {
    type: 'select',
    label: 'Taille Fond',
    category: 'Arrière-plan',
    options: ['auto', 'cover', 'contain'],
    defaultValue: 'auto'
  },
  'background-position': {
    type: 'select',
    label: 'Position Fond',
    category: 'Arrière-plan',
    options: ['left top', 'left center', 'left bottom', 'center top', 'center center', 'center bottom', 'right top', 'right center', 'right bottom'],
    defaultValue: 'left top'
  },
  'background-repeat': {
    type: 'select',
    label: 'Répétition Fond',
    category: 'Arrière-plan',
    options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
    defaultValue: 'repeat'
  },
  'background-attachment': {
    type: 'select',
    label: 'Attachement Fond',
    category: 'Arrière-plan',
    options: ['scroll', 'fixed', 'local'],
    defaultValue: 'scroll'
  },

  // === BORDERS ===
  'border': { type: 'text', label: 'Bordure', category: 'Bordures', defaultValue: 'none' },
  'border-width': { type: 'text', label: 'Épaisseur Bordure', category: 'Bordures', unit: 'px', defaultValue: '0' },
  'border-style': {
    type: 'select',
    label: 'Style Bordure',
    category: 'Bordures',
    options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
    defaultValue: 'none'
  },
  'border-radius': { type: 'text', label: 'Radius Bordure', category: 'Bordures', unit: 'px', defaultValue: '0' },
  'border-top': { type: 'text', label: 'Bordure Haut', category: 'Bordures', defaultValue: 'none' },
  'border-right': { type: 'text', label: 'Bordure Droite', category: 'Bordures', defaultValue: 'none' },
  'border-bottom': { type: 'text', label: 'Bordure Bas', category: 'Bordures', defaultValue: 'none' },
  'border-left': { type: 'text', label: 'Bordure Gauche', category: 'Bordures', defaultValue: 'none' },
  'border-top-left-radius': { type: 'text', label: 'Radius Haut-Gauche', category: 'Bordures', unit: 'px', defaultValue: '0' },
  'border-top-right-radius': { type: 'text', label: 'Radius Haut-Droite', category: 'Bordures', unit: 'px', defaultValue: '0' },
  'border-bottom-left-radius': { type: 'text', label: 'Radius Bas-Gauche', category: 'Bordures', unit: 'px', defaultValue: '0' },
  'border-bottom-right-radius': { type: 'text', label: 'Radius Bas-Droite', category: 'Bordures', unit: 'px', defaultValue: '0' },

  // === EFFECTS & SHADOWS ===
  'box-shadow': { type: 'text', label: 'Ombre Boîte', category: 'Effets', defaultValue: 'none' },
  'opacity': { type: 'range', label: 'Opacité', category: 'Effets', min: 0, max: 1, step: 0.1, defaultValue: 1 },
  'filter': { type: 'text', label: 'Filtres', category: 'Effets', defaultValue: 'none' },
  'backdrop-filter': { type: 'text', label: 'Filtre Arrière', category: 'Effets', defaultValue: 'none' },

  // === TRANSFORMS ===
  'transform': { type: 'text', label: 'Transformation', category: 'Transformations', defaultValue: 'none' },
  'transform-origin': { type: 'text', label: 'Origine Transform', category: 'Transformations', defaultValue: '50% 50%' },
  'transform-style': {
    type: 'select',
    label: 'Style Transform',
    category: 'Transformations',
    options: ['flat', 'preserve-3d'],
    defaultValue: 'flat'
  },
  'perspective': { type: 'text', label: 'Perspective', category: 'Transformations', unit: 'px', defaultValue: 'none' },
  'perspective-origin': { type: 'text', label: 'Origine Perspective', category: 'Transformations', defaultValue: '50% 50%' },

  // === ANIMATIONS ===
  'transition': { type: 'text', label: 'Transition', category: 'Animations', defaultValue: 'none' },
  'transition-property': { type: 'text', label: 'Propriété Transition', category: 'Animations', defaultValue: 'all' },
  'transition-duration': { type: 'text', label: 'Durée Transition', category: 'Animations', unit: 's', defaultValue: '0s' },
  'transition-timing-function': {
    type: 'select',
    label: 'Fonction Transition',
    category: 'Animations',
    options: ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'],
    defaultValue: 'ease'
  },
  'transition-delay': { type: 'text', label: 'Délai Transition', category: 'Animations', unit: 's', defaultValue: '0s' },
  'animation': { type: 'text', label: 'Animation', category: 'Animations', defaultValue: 'none' },
  'animation-name': { type: 'text', label: 'Nom Animation', category: 'Animations', defaultValue: 'none' },
  'animation-duration': { type: 'text', label: 'Durée Animation', category: 'Animations', unit: 's', defaultValue: '0s' },
  'animation-timing-function': {
    type: 'select',
    label: 'Fonction Animation',
    category: 'Animations',
    options: ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'],
    defaultValue: 'ease'
  },
  'animation-delay': { type: 'text', label: 'Délai Animation', category: 'Animations', unit: 's', defaultValue: '0s' },
  'animation-iteration-count': { type: 'text', label: 'Répétitions', category: 'Animations', defaultValue: '1' },
  'animation-direction': {
    type: 'select',
    label: 'Direction Animation',
    category: 'Animations',
    options: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
    defaultValue: 'normal'
  },
  'animation-fill-mode': {
    type: 'select',
    label: 'Mode Remplissage',
    category: 'Animations',
    options: ['none', 'forwards', 'backwards', 'both'],
    defaultValue: 'none'
  },

  // === OVERFLOW & VISIBILITY ===
  'overflow': {
    type: 'select',
    label: 'Débordement',
    category: 'Affichage',
    options: ['visible', 'hidden', 'scroll', 'auto'],
    defaultValue: 'visible'
  },
  'overflow-x': {
    type: 'select',
    label: 'Débordement X',
    category: 'Affichage',
    options: ['visible', 'hidden', 'scroll', 'auto'],
    defaultValue: 'visible'
  },
  'overflow-y': {
    type: 'select',
    label: 'Débordement Y',
    category: 'Affichage',
    options: ['visible', 'hidden', 'scroll', 'auto'],
    defaultValue: 'visible'
  },
  'visibility': {
    type: 'select',
    label: 'Visibilité',
    category: 'Affichage',
    options: ['visible', 'hidden', 'collapse'],
    defaultValue: 'visible'
  },

  // === CURSOR & INTERACTION ===
  'cursor': {
    type: 'select',
    label: 'Curseur',
    category: 'Interaction',
    options: ['auto', 'default', 'pointer', 'crosshair', 'move', 'text', 'wait', 'help', 'not-allowed', 'grab', 'grabbing'],
    defaultValue: 'auto'
  },
  'pointer-events': {
    type: 'select',
    label: 'Événements Pointeur',
    category: 'Interaction',
    options: ['auto', 'none'],
    defaultValue: 'auto'
  },
  'user-select': {
    type: 'select',
    label: 'Sélection Utilisateur',
    category: 'Interaction',
    options: ['auto', 'none', 'text', 'all'],
    defaultValue: 'auto'
  },

  // === TABLE ===
  'table-layout': {
    type: 'select',
    label: 'Layout Table',
    category: 'Table',
    options: ['auto', 'fixed'],
    defaultValue: 'auto'
  },
  'border-collapse': {
    type: 'select',
    label: 'Bordures Table',
    category: 'Table',
    options: ['separate', 'collapse'],
    defaultValue: 'separate'
  },
  'border-spacing': { type: 'text', label: 'Espacement Bordures', category: 'Table', unit: 'px', defaultValue: '0' },

  // === LIST ===
  'list-style': { type: 'text', label: 'Style Liste', category: 'Liste', defaultValue: 'none' },
  'list-style-type': {
    type: 'select',
    label: 'Type Liste',
    category: 'Liste',
    options: ['none', 'disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha'],
    defaultValue: 'disc'
  },
  'list-style-position': {
    type: 'select',
    label: 'Position Liste',
    category: 'Liste',
    options: ['inside', 'outside'],
    defaultValue: 'outside'
  },

  // === OUTLINE ===
  'outline': { type: 'text', label: 'Contour', category: 'Contour', defaultValue: 'none' },
  'outline-width': { type: 'text', label: 'Épaisseur Contour', category: 'Contour', unit: 'px', defaultValue: 'medium' },
  'outline-style': {
    type: 'select',
    label: 'Style Contour',
    category: 'Contour',
    options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
    defaultValue: 'none'
  },
  'outline-color': { type: 'color', label: 'Couleur Contour', category: 'Contour', defaultValue: '#000000' },
  'outline-offset': { type: 'text', label: 'Décalage Contour', category: 'Contour', unit: 'px', defaultValue: '0' }
};

// Groupes de propriétés par catégories
export const cssPropertyGroups: Record<string, string[]> = {
  'Layout': ['display', 'position', 'top', 'right', 'bottom', 'left', 'z-index'],
  'Flexbox': ['flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order'],
  'Grid': ['grid-template-columns', 'grid-template-rows', 'grid-template-areas', 'grid-column-gap', 'grid-row-gap', 'grid-gap', 'grid-column', 'grid-row', 'grid-area'],
  'Dimensions': ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'box-sizing'],
  'Marges': ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  'Espacement': ['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  'Typographie': ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'word-spacing', 'text-align', 'text-decoration', 'text-transform', 'text-indent', 'text-shadow'],
  'Couleurs': ['color', 'background-color', 'border-color'],
  'Arrière-plan': ['background-image', 'background-size', 'background-position', 'background-repeat', 'background-attachment'],
  'Bordures': ['border', 'border-width', 'border-style', 'border-radius', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'],
  'Effets': ['box-shadow', 'opacity', 'filter', 'backdrop-filter'],
  'Transformations': ['transform', 'transform-origin', 'transform-style', 'perspective', 'perspective-origin'],
  'Animations': ['transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay', 'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode'],
  'Affichage': ['overflow', 'overflow-x', 'overflow-y', 'visibility'],
  'Interaction': ['cursor', 'pointer-events', 'user-select'],
  'Table': ['table-layout', 'border-collapse', 'border-spacing'],
  'Liste': ['list-style', 'list-style-type', 'list-style-position'],
  'Contour': ['outline', 'outline-width', 'outline-style', 'outline-color', 'outline-offset']
};

// Fonction pour obtenir toutes les propriétés d'une catégorie
export function getPropertiesByCategory(category: string): string[] {
  return (cssPropertyGroups as Record<string, string[]>)[category] || [];
}

// Fonction pour obtenir la définition d'une propriété
export function getCSSPropertyDefinition(property: string): CSSProperty | null {
  return massiveCSSProperties[property] || null;
}

// Fonction pour obtenir toutes les catégories
export function getAllCategories(): string[] {
  return Object.keys(cssPropertyGroups);
}

// Fonction pour filtrer les propriétés par recherche
export function searchCSSProperties(searchTerm: string): string[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return Object.keys(massiveCSSProperties).filter(property => {
    const def = massiveCSSProperties[property];
    return property.toLowerCase().includes(lowerSearchTerm) ||
           def.label.toLowerCase().includes(lowerSearchTerm) ||
           def.category.toLowerCase().includes(lowerSearchTerm);
  });
}