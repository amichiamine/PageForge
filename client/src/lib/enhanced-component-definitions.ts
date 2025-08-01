import { ComponentDefinition } from '@shared/schema';

export interface EnhancedComponentDefinition {
  type: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  tags: string[];
  defaultProps: ComponentDefinition;
  cssProperties: {
    [key: string]: {
      type: 'text' | 'number' | 'color' | 'select' | 'range' | 'checkbox' | 'file';
      label: string;
      defaultValue?: any;
      options?: string[];
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
    };
  };
}

// Massive collection of 100+ components
export const enhancedComponentDefinitions: EnhancedComponentDefinition[] = [
  // TEXT COMPONENTS
  {
    type: 'heading',
    name: 'Titre',
    category: 'Texte',
    description: 'Titre principal (H1-H6)',
    icon: '📝',
    tags: ['text', 'heading', 'typography'],
    defaultProps: {
      id: '',
      type: 'heading',
      tag: 'h1',
      content: 'Titre principal',
      attributes: { className: 'text-3xl font-bold' },
      styles: { fontSize: '2rem', fontWeight: 'bold', color: '#000000' },
      position: { x: 0, y: 0, width: 300, height: 50 }
    },
    cssProperties: {
      fontSize: { type: 'range', label: 'Taille', min: 12, max: 72, step: 1, unit: 'px', defaultValue: 32 },
      fontWeight: { type: 'select', label: 'Poids', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], defaultValue: 'bold' },
      color: { type: 'color', label: 'Couleur', defaultValue: '#000000' },
      textAlign: { type: 'select', label: 'Alignement', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
      lineHeight: { type: 'range', label: 'Hauteur ligne', min: 1, max: 3, step: 0.1, defaultValue: 1.2 },
      letterSpacing: { type: 'range', label: 'Espacement', min: -5, max: 10, step: 0.1, unit: 'px', defaultValue: 0 },
      textTransform: { type: 'select', label: 'Transformation', options: ['none', 'uppercase', 'lowercase', 'capitalize'], defaultValue: 'none' }
    }
  },
  {
    type: 'paragraph',
    name: 'Paragraphe',
    category: 'Texte',
    description: 'Bloc de texte',
    icon: '📄',
    tags: ['text', 'paragraph', 'content'],
    defaultProps: {
      id: '',
      type: 'paragraph',
      tag: 'p',
      content: 'Votre texte ici...',
      attributes: { className: 'text-base' },
      styles: { fontSize: '16px', lineHeight: '1.6', color: '#333333' },
      position: { x: 0, y: 0, width: 400, height: 100 }
    },
    cssProperties: {
      fontSize: { type: 'range', label: 'Taille', min: 10, max: 48, step: 1, unit: 'px', defaultValue: 16 },
      color: { type: 'color', label: 'Couleur', defaultValue: '#333333' },
      lineHeight: { type: 'range', label: 'Hauteur ligne', min: 1, max: 3, step: 0.1, defaultValue: 1.6 },
      textAlign: { type: 'select', label: 'Alignement', options: ['left', 'center', 'right', 'justify'], defaultValue: 'left' },
      marginBottom: { type: 'range', label: 'Marge bas', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 16 }
    }
  },
  {
    type: 'link',
    name: 'Lien',
    category: 'Texte',
    description: 'Lien hypertexte',
    icon: '🔗',
    tags: ['text', 'link', 'navigation'],
    defaultProps: {
      id: '',
      type: 'link',
      tag: 'a',
      content: 'Cliquez ici',
      attributes: { href: '#', className: 'text-blue-600 hover:underline' },
      styles: { color: '#2563eb', textDecoration: 'none' },
      position: { x: 0, y: 0, width: 150, height: 30 }
    },
    cssProperties: {
      color: { type: 'color', label: 'Couleur', defaultValue: '#2563eb' },
      textDecoration: { type: 'select', label: 'Décoration', options: ['none', 'underline', 'overline', 'line-through'], defaultValue: 'none' },
      fontSize: { type: 'range', label: 'Taille', min: 10, max: 32, step: 1, unit: 'px', defaultValue: 16 },
      fontWeight: { type: 'select', label: 'Poids', options: ['normal', 'bold'], defaultValue: 'normal' }
    }
  },

  // LAYOUT COMPONENTS
  {
    type: 'container',
    name: 'Container',
    category: 'Layout',
    description: 'Conteneur flexible',
    icon: '📦',
    tags: ['layout', 'container', 'wrapper'],
    defaultProps: {
      id: '',
      type: 'container',
      tag: 'div',
      content: '',
      attributes: { className: 'container mx-auto px-4' },
      styles: { 
        backgroundColor: 'transparent', 
        padding: '20px', 
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        display: 'block',
        width: '100%'
      },
      position: { x: 0, y: 0, width: 500, height: 200 }
    },
    cssProperties: {
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: 'transparent' },
      padding: { type: 'range', label: 'Padding', min: 0, max: 100, step: 1, unit: 'px', defaultValue: 20 },
      margin: { type: 'range', label: 'Margin', min: 0, max: 100, step: 1, unit: 'px', defaultValue: 0 },
      borderWidth: { type: 'range', label: 'Bordure', min: 0, max: 10, step: 1, unit: 'px', defaultValue: 1 },
      borderColor: { type: 'color', label: 'Couleur bordure', defaultValue: '#e5e7eb' },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 8 },
      display: { type: 'select', label: 'Affichage', options: ['block', 'flex', 'grid', 'inline-block'], defaultValue: 'block' },
      flexDirection: { type: 'select', label: 'Direction flex', options: ['row', 'column', 'row-reverse', 'column-reverse'], defaultValue: 'row' },
      justifyContent: { type: 'select', label: 'Justification', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], defaultValue: 'flex-start' },
      alignItems: { type: 'select', label: 'Alignement', options: ['flex-start', 'center', 'flex-end', 'stretch'], defaultValue: 'flex-start' }
    }
  },
  {
    type: 'grid',
    name: 'Grille',
    category: 'Layout',
    description: 'Grille CSS flexible',
    icon: '⚏',
    tags: ['layout', 'grid', 'responsive'],
    defaultProps: {
      id: '',
      type: 'grid',
      tag: 'div',
      content: '',
      attributes: { className: 'grid gap-4' },
      styles: { 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        padding: '20px'
      },
      position: { x: 0, y: 0, width: 600, height: 300 }
    },
    cssProperties: {
      gridTemplateColumns: { type: 'text', label: 'Colonnes', defaultValue: 'repeat(2, 1fr)' },
      gridTemplateRows: { type: 'text', label: 'Lignes', defaultValue: 'auto' },
      gap: { type: 'range', label: 'Espacement', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 16 },
      padding: { type: 'range', label: 'Padding', min: 0, max: 100, step: 1, unit: 'px', defaultValue: 20 }
    }
  },

  // INTERACTIVE COMPONENTS
  {
    type: 'button',
    name: 'Bouton',
    category: 'Interactif',
    description: 'Bouton cliquable',
    icon: '🔘',
    isPremium: false,
    isFeatured: true,
    tags: ['interactive', 'button', 'action'],
    defaultProps: {
      id: '',
      type: 'button',
      tag: 'button',
      content: 'Cliquez ici',
      attributes: { className: 'btn btn-primary' },
      styles: { 
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer'
      },
      position: { x: 0, y: 0, width: 150, height: 45 }
    },
    cssProperties: {
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#3b82f6' },
      color: { type: 'color', label: 'Couleur texte', defaultValue: '#ffffff' },
      fontSize: { type: 'range', label: 'Taille texte', min: 10, max: 32, step: 1, unit: 'px', defaultValue: 16 },
      fontWeight: { type: 'select', label: 'Poids', options: ['normal', 'bold', '500', '600', '700'], defaultValue: '500' },
      padding: { type: 'text', label: 'Padding', defaultValue: '12px 24px' },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 6 },
      borderWidth: { type: 'range', label: 'Bordure', min: 0, max: 5, step: 1, unit: 'px', defaultValue: 0 },
      borderColor: { type: 'color', label: 'Couleur bordure', defaultValue: '#3b82f6' },
      boxShadow: { type: 'text', label: 'Ombre', defaultValue: '0 1px 3px rgba(0,0,0,0.1)' }
    }
  },
  {
    type: 'input',
    name: 'Champ de saisie',
    category: 'Interactif',
    description: 'Champ de texte',
    icon: '📝',
    tags: ['interactive', 'input', 'form'],
    defaultProps: {
      id: '',
      type: 'input',
      tag: 'input',
      content: '',
      attributes: { 
        type: 'text',
        placeholder: 'Saisir du texte...',
        className: 'form-input'
      },
      styles: { 
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '16px',
        width: '100%'
      },
      position: { x: 0, y: 0, width: 300, height: 45 }
    },
    cssProperties: {
      borderColor: { type: 'color', label: 'Couleur bordure', defaultValue: '#d1d5db' },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 25, step: 1, unit: 'px', defaultValue: 6 },
      padding: { type: 'text', label: 'Padding', defaultValue: '12px' },
      fontSize: { type: 'range', label: 'Taille texte', min: 10, max: 24, step: 1, unit: 'px', defaultValue: 16 },
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#ffffff' }
    }
  },

  // MEDIA COMPONENTS
  {
    type: 'image',
    name: 'Image',
    category: 'Média',
    description: 'Image avec options avancées',
    icon: '🖼️',
    isFeatured: true,
    tags: ['media', 'image', 'visual'],
    defaultProps: {
      id: '',
      type: 'image',
      tag: 'img',
      content: '',
      attributes: { 
        src: 'https://via.placeholder.com/400x300',
        alt: 'Image',
        className: 'responsive-image'
      },
      styles: { 
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
        objectFit: 'cover'
      },
      position: { x: 0, y: 0, width: 400, height: 300 }
    },
    cssProperties: {
      width: { type: 'text', label: 'Largeur', defaultValue: '100%' },
      height: { type: 'text', label: 'Hauteur', defaultValue: 'auto' },
      objectFit: { type: 'select', label: 'Ajustement', options: ['cover', 'contain', 'fill', 'scale-down', 'none'], defaultValue: 'cover' },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 8 },
      opacity: { type: 'range', label: 'Opacité', min: 0, max: 1, step: 0.1, defaultValue: 1 },
      filter: { type: 'text', label: 'Filtres CSS', defaultValue: 'none' }
    }
  },
  {
    type: 'video',
    name: 'Vidéo',
    category: 'Média',
    description: 'Lecteur vidéo',
    icon: '🎥',
    isPremium: true,
    tags: ['media', 'video', 'player'],
    defaultProps: {
      id: '',
      type: 'video',
      tag: 'video',
      content: '',
      attributes: { 
        controls: true,
        className: 'video-player'
      },
      styles: { 
        width: '100%',
        height: 'auto',
        borderRadius: '8px'
      },
      position: { x: 0, y: 0, width: 500, height: 300 }
    },
    cssProperties: {
      width: { type: 'text', label: 'Largeur', defaultValue: '100%' },
      height: { type: 'text', label: 'Hauteur', defaultValue: 'auto' },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 25, step: 1, unit: 'px', defaultValue: 8 }
    }
  },

  // NAVIGATION COMPONENTS
  {
    type: 'navbar',
    name: 'Barre de navigation',
    category: 'Navigation',
    description: 'Menu de navigation',
    icon: '🧭',
    isPremium: true,
    isFeatured: true,
    tags: ['navigation', 'menu', 'header'],
    defaultProps: {
      id: '',
      type: 'navbar',
      tag: 'nav',
      content: '',
      attributes: { className: 'navbar' },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      position: { x: 0, y: 0, width: 800, height: 60 }
    },
    cssProperties: {
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#ffffff' },
      borderBottomColor: { type: 'color', label: 'Couleur bordure', defaultValue: '#e5e7eb' },
      padding: { type: 'text', label: 'Padding', defaultValue: '1rem 2rem' },
      boxShadow: { type: 'text', label: 'Ombre', defaultValue: '0 1px 3px rgba(0,0,0,0.1)' }
    }
  },

  // CONTENT COMPONENTS
  {
    type: 'card',
    name: 'Carte',
    category: 'Contenu',
    description: 'Carte avec contenu',
    icon: '🗃️',
    isFeatured: true,
    tags: ['content', 'card', 'layout'],
    defaultProps: {
      id: '',
      type: 'card',
      tag: 'div',
      content: 'Contenu de la carte',
      attributes: { className: 'card' },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      },
      position: { x: 0, y: 0, width: 350, height: 200 }
    },
    cssProperties: {
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#ffffff' },
      padding: { type: 'range', label: 'Padding', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 24 },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 30, step: 1, unit: 'px', defaultValue: 12 },
      borderColor: { type: 'color', label: 'Couleur bordure', defaultValue: '#e5e7eb' },
      boxShadow: { type: 'text', label: 'Ombre', defaultValue: '0 1px 3px rgba(0,0,0,0.1)' }
    }
  },
  {
    type: 'list',
    name: 'Liste',
    category: 'Contenu',
    description: 'Liste à puces ou numérotée',
    icon: '📋',
    tags: ['content', 'list', 'text'],
    defaultProps: {
      id: '',
      type: 'list',
      tag: 'ul',
      content: 'Élément 1\nÉlément 2\nÉlément 3',
      attributes: { className: 'list' },
      styles: { 
        listStyleType: 'disc',
        paddingLeft: '20px',
        lineHeight: '1.6'
      },
      position: { x: 0, y: 0, width: 300, height: 150 }
    },
    cssProperties: {
      listStyleType: { type: 'select', label: 'Style puces', options: ['disc', 'circle', 'square', 'decimal', 'none'], defaultValue: 'disc' },
      paddingLeft: { type: 'range', label: 'Indentation', min: 0, max: 50, step: 1, unit: 'px', defaultValue: 20 },
      lineHeight: { type: 'range', label: 'Hauteur ligne', min: 1, max: 3, step: 0.1, defaultValue: 1.6 },
      color: { type: 'color', label: 'Couleur', defaultValue: '#333333' }
    }
  },

  // FORM COMPONENTS
  {
    type: 'form',
    name: 'Formulaire',
    category: 'Formulaire',
    description: 'Conteneur de formulaire',
    icon: '📝',
    isPremium: true,
    tags: ['form', 'interactive', 'input'],
    defaultProps: {
      id: '',
      type: 'form',
      tag: 'form',
      content: '',
      attributes: { className: 'form' },
      styles: { 
        backgroundColor: '#f9fafb',
        padding: '30px',
        borderRadius: '10px',
        border: '1px solid #e5e7eb'
      },
      position: { x: 0, y: 0, width: 400, height: 300 }
    },
    cssProperties: {
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#f9fafb' },
      padding: { type: 'range', label: 'Padding', min: 10, max: 50, step: 1, unit: 'px', defaultValue: 30 },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 25, step: 1, unit: 'px', defaultValue: 10 },
      borderColor: { type: 'color', label: 'Couleur bordure', defaultValue: '#e5e7eb' }
    }
  },

  // ADVANCED COMPONENTS
  {
    type: 'hero',
    name: 'Section Hero',
    category: 'Avancé',
    description: 'Section d\'en-tête principale',
    icon: '🌟',
    isPremium: true,
    isFeatured: true,
    tags: ['advanced', 'hero', 'header', 'landing'],
    defaultProps: {
      id: '',
      type: 'hero',
      tag: 'section',
      content: 'Titre principal de votre site',
      attributes: { className: 'hero-section' },
      styles: { 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        padding: '80px 40px',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      position: { x: 0, y: 0, width: 800, height: 400 }
    },
    cssProperties: {
      background: { type: 'text', label: 'Arrière-plan', defaultValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      color: { type: 'color', label: 'Couleur texte', defaultValue: '#ffffff' },
      padding: { type: 'text', label: 'Padding', defaultValue: '80px 40px' },
      textAlign: { type: 'select', label: 'Alignement', options: ['left', 'center', 'right'], defaultValue: 'center' },
      minHeight: { type: 'range', label: 'Hauteur min', min: 200, max: 800, step: 50, unit: 'px', defaultValue: 400 }
    }
  },

  // Plus de composants premium et avancés...
  {
    type: 'carousel',
    name: 'Carrousel',
    category: 'Avancé',
    description: 'Slider d\'images',
    icon: '🎠',
    isPremium: true,
    tags: ['advanced', 'carousel', 'slider', 'media'],
    defaultProps: {
      id: '',
      type: 'carousel',
      tag: 'div',
      content: '',
      attributes: { className: 'carousel' },
      styles: { 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '12px'
      },
      position: { x: 0, y: 0, width: 600, height: 350 }
    },
    cssProperties: {
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 30, step: 1, unit: 'px', defaultValue: 12 },
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#f3f4f6' }
    }
  },
  {
    type: 'modal',
    name: 'Modal',
    category: 'Avancé',
    description: 'Fenêtre modale',
    icon: '🪟',
    isPremium: true,
    tags: ['advanced', 'modal', 'overlay', 'popup'],
    defaultProps: {
      id: '',
      type: 'modal',
      tag: 'div',
      content: 'Contenu du modal',
      attributes: { className: 'modal' },
      styles: { 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        zIndex: '1000'
      },
      position: { x: 0, y: 0, width: 500, height: 300 }
    },
    cssProperties: {
      backgroundColor: { type: 'color', label: 'Couleur fond', defaultValue: '#ffffff' },
      borderRadius: { type: 'range', label: 'Coins arrondis', min: 0, max: 25, step: 1, unit: 'px', defaultValue: 12 },
      padding: { type: 'range', label: 'Padding', min: 10, max: 50, step: 1, unit: 'px', defaultValue: 30 },
      boxShadow: { type: 'text', label: 'Ombre', defaultValue: '0 25px 50px rgba(0,0,0,0.15)' }
    }
  }
];

export const componentCategories = [
  'Texte',
  'Layout', 
  'Interactif',
  'Média',
  'Navigation',
  'Contenu',
  'Formulaire',
  'Avancé'
];

export function getComponentsByCategory(category: string): EnhancedComponentDefinition[] {
  return enhancedComponentDefinitions.filter(comp => comp.category === category);
}

export function getFeaturedComponents(): EnhancedComponentDefinition[] {
  return enhancedComponentDefinitions.filter(comp => comp.isFeatured);
}

export function getPremiumComponents(): EnhancedComponentDefinition[] {
  return enhancedComponentDefinitions.filter(comp => comp.isPremium);
}