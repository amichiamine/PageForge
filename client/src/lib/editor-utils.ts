import { nanoid } from "nanoid";
import type { ComponentDefinition } from "@shared/schema";

export function createComponent(type: string): ComponentDefinition {
  const baseComponent: ComponentDefinition = {
    id: `component-${nanoid()}`,
    type,
    content: '',
    attributes: {},
    styles: {
      position: 'absolute',
      left: '50px',
      top: '50px',
      width: '200px',
      height: '100px',
      backgroundColor: 'transparent',
      color: '#000000',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      margin: '0px',
      border: 'none',
      borderRadius: '0px',
      zIndex: '1000'
    },
  };

  switch (type) {
    case 'heading':
      return {
        ...baseComponent,
        tag: 'h1',
        content: 'Titre principal',
        attributes: { className: 'heading' },
        styles: {
          ...baseComponent.styles,
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1a202c',
          height: '40px',
          width: '280px',
          textAlign: 'left',
          lineHeight: '1.2',
          letterSpacing: '-0.025em',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          margin: '0',
          padding: '0',
          display: 'block'
        },
      };

    case 'paragraph':
      return {
        ...baseComponent,
        tag: 'p',
        content: 'Voici un paragraphe de démonstration. Vous pouvez modifier ce texte en cliquant dessus et taper votre contenu.',
        attributes: { className: 'paragraph' },
        styles: {
          ...baseComponent.styles,
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#2d3748',
          width: '320px',
          height: '80px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          margin: '0',
          padding: '0'
        },
      };

    case 'button':
      return {
        ...baseComponent,
        tag: 'button',
        content: 'Cliquez ici',
        attributes: { className: 'styled-button', type: 'button' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          width: '140px',
          height: '44px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          transition: 'background-color 0.2s ease-in-out',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
      };

    case 'image':
      return {
        ...baseComponent,
        tag: 'img',
        attributes: {
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
          alt: 'Image de démonstration',
          className: 'responsive-image',
          loading: 'lazy'
        },
        styles: {
          ...baseComponent.styles,
          width: '280px',
          height: '180px',
          objectFit: 'cover',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'block',
          maxWidth: '100%',
          imageRendering: 'auto'
        },
      };

    case 'container':
      return {
        ...baseComponent,
        tag: 'div',
        content: 'Zone de contenu',
        attributes: { className: 'container' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#ffffff',
          border: '2px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '20px',
          width: '320px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          textAlign: 'center',
          minHeight: '120px',
          boxSizing: 'border-box'
        },
      };

    case 'input':
      return {
        ...baseComponent,
        tag: 'input',
        attributes: { 
          type: 'text', 
          placeholder: 'Tapez ici...', 
          className: 'styled-input',
          'aria-label': 'Champ de saisie'
        },
        styles: {
          ...baseComponent.styles,
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          width: '280px',
          height: '44px',
          outline: 'none',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease-in-out'
        },
      };

    case 'textarea':
      return {
        ...baseComponent,
        tag: 'textarea',
        content: '',
        attributes: { 
          placeholder: 'Écrivez votre texte ici...', 
          className: 'styled-textarea',
          rows: 5,
          'aria-label': 'Zone de texte'
        },
        styles: {
          ...baseComponent.styles,
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          resize: 'vertical',
          width: '320px',
          height: '120px',
          outline: 'none',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box',
          lineHeight: '1.5',
          transition: 'border-color 0.2s ease-in-out'
        },
      };

    // COMPOSANTS UNIFIÉS - Gérés via componentData uniquement
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
          slides: [
            {
              image: '',
              title: 'Slide 1',
              description: 'Description du premier slide',
              buttonText: 'En savoir plus',
              buttonLink: '#',
              backgroundColor: '#3b82f6'
            },
            {
              image: '',
              title: 'Slide 2',
              description: 'Description du deuxième slide',
              buttonText: 'Découvrir',
              buttonLink: '#',
              backgroundColor: '#10b981'
            },
            {
              image: '',
              title: 'Slide 3',
              description: 'Description du troisième slide',
              buttonText: 'Voir plus',
              buttonLink: '#',
              backgroundColor: '#ef4444'
            }
          ],
          currentSlide: 0,
          autoplay: true,
          animationSpeed: 3000,
          showDots: true,
          showArrows: true
        }
      };

    case 'accordion':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { 
          className: 'accordion-container',
          'data-accordion': 'true'
        },
        styles: {
          ...baseComponent.styles,
          width: '350px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'hidden'
        },
        componentData: {
          items: [
            {
              question: 'Question 1',
              answer: 'Réponse à la première question avec des détails utiles.',
              isOpen: true
            },
            {
              question: 'Question 2', 
              answer: 'Réponse à la deuxième question avec des informations complémentaires.',
              isOpen: false
            }
          ]
        }
      };

    case 'list':
      return {
        ...baseComponent,
        tag: 'ul',
        attributes: { className: 'list-component' },
        styles: {
          ...baseComponent.styles,
          width: '250px',
          height: '180px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          listStyle: 'none'
        },
        componentData: {
          items: [
            { text: 'Premier élément', id: nanoid() },
            { text: 'Deuxième élément', id: nanoid() },
            { text: 'Troisième élément', id: nanoid() }
          ],
          listType: 'unordered'
        }
      };

    case 'form':
      return {
        ...baseComponent,
        tag: 'form',
        attributes: { className: 'form-component' },
        styles: {
          ...baseComponent.styles,
          width: '350px',
          height: '280px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          fields: [
            { type: 'email', label: 'Email', placeholder: 'Votre email', required: true, id: nanoid() },
            { type: 'textarea', label: 'Message', placeholder: 'Votre message...', required: true, id: nanoid() }
          ],
          submitText: 'Envoyer'
        }
      };

    case 'card':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'card-component' },
        styles: {
          ...baseComponent.styles,
          width: '280px',
          height: '320px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          image: '',
          title: 'Titre de la carte',
          description: 'Description concise du contenu de cette carte avec les informations essentielles.',
          buttonText: 'En savoir plus',
          buttonLink: '#'
        }
      };

    case 'chart':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'chart-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '300px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          title: 'Statistiques',
          chartType: 'bar',
          data: [
            { label: 'Serie 1', value: 75, color: '#3b82f6' },
            { label: 'Serie 2', value: 60, color: '#10b981' },
            { label: 'Serie 3', value: 90, color: '#f59e0b' },
            { label: 'Serie 4', value: 45, color: '#ef4444' }
          ]
        }
      };

    case 'video':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'video-component' },
        styles: {
          ...baseComponent.styles,
          width: '480px',
          height: '270px',
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          videoUrl: '',
          title: 'Lecteur Vidéo',
          autoplay: false,
          controls: true,
          poster: ''
        }
      };

    case 'header':
      return {
        ...baseComponent,
        tag: 'header',
        attributes: { className: 'header-component' },
        styles: {
          ...baseComponent.styles,
          width: '100%',
          height: '80px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          position: 'sticky',
          top: '0',
          zIndex: '100'
        },
        componentData: {
          logo: 'Logo',
          navigation: [
            { text: 'Accueil', link: '#', id: nanoid() },
            { text: 'Services', link: '#', id: nanoid() },
            { text: 'Contact', link: '#', id: nanoid() }
          ]
        }
      };

    case 'footer':
      return {
        ...baseComponent,
        tag: 'footer',
        attributes: { className: 'footer-component' },
        styles: {
          ...baseComponent.styles,
          width: '100%',
          height: '200px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '40px 24px 20px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          companyName: 'Mon Site',
          description: 'Description de votre entreprise',
          links: [
            { text: 'Mentions légales', link: '#', id: nanoid() },
            { text: 'Contact', link: '#', id: nanoid() }
          ],
          copyright: '© 2025 Tous droits réservés'
        }
      };

    case 'sidebar':
      return {
        ...baseComponent,
        tag: 'aside',
        attributes: { className: 'sidebar-component' },
        styles: {
          ...baseComponent.styles,
          width: '250px',
          height: '400px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          title: 'Navigation',
          menuItems: [
            { text: '🏠 Accueil', link: '#', active: true, id: nanoid() },
            { text: '📊 Analytics', link: '#', active: false, id: nanoid() },
            { text: '⚙️ Paramètres', link: '#', active: false, id: nanoid() }
          ]
        }
      };

    case 'navbar':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'navbar-component' },
        styles: {
          ...baseComponent.styles,
          width: '100%',
          height: '64px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          brand: 'Brand',
          menuItems: [
            { text: 'Accueil', link: '#', active: true, id: nanoid() },
            { text: 'Services', link: '#', active: false, id: nanoid() },
            { text: 'Contact', link: '#', active: false, id: nanoid() }
          ]
        }
      };

    case 'grid':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'grid-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '240px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          columns: 2,
          items: [
            { text: 'Item 1', id: nanoid() },
            { text: 'Item 2', id: nanoid() },
            { text: 'Item 3', id: nanoid() },
            { text: 'Item 4', id: nanoid() }
          ]
        }
      };

    // COMPOSANTS SIMPLES RESTANTS
    case 'divider':
      return {
        ...baseComponent,
        tag: 'hr',
        attributes: { className: 'divider' },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '1px',
          backgroundColor: '#e2e8f0',
          border: 'none',
          margin: '20px 0'
        },
      };

    case 'spacer':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'spacer' },
        styles: {
          ...baseComponent.styles,
          width: '100px',
          height: '50px',
          backgroundColor: 'transparent',
          border: '1px dashed #cbd5e1'
        },
      };

    case 'link':
      return {
        ...baseComponent,
        tag: 'a',
        content: 'Lien vers une page',
        attributes: { 
          href: '#',
          className: 'styled-link',
          target: '_blank'
        },
        styles: {
          ...baseComponent.styles,
          color: '#3b82f6',
          textDecoration: 'underline',
          fontSize: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          width: '180px',
          height: '24px',
          transition: 'color 0.2s ease-in-out',
          cursor: 'pointer'
        },
      };

    case 'icon':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'icon-component' },
        styles: {
          ...baseComponent.styles,
          width: '80px',
          height: '80px',
          backgroundColor: '#f3f4f6',
          border: '2px solid #d1d5db',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: '#3b82f6',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        content: '⭐'
      };

    case 'flexbox':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'flexbox-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '120px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          direction: 'row',
          justify: 'space-between',
          align: 'center',
          gap: '16px',
          items: [
            { text: 'Flex 1', id: nanoid(), color: '#3b82f6' },
            { text: 'Flex 2', id: nanoid(), color: '#10b981' },
            { text: 'Flex 3', id: nanoid(), color: '#f59e0b' }
          ]
        }
      };

    default:
      return {
        ...baseComponent,
        tag: 'div',
        content: 'Composant inconnu',
        attributes: { className: 'unknown-component' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#dc2626',
          padding: '20px',
          textAlign: 'center',
          fontSize: '14px'
        },
      };
  }
}

// Fonctions utilitaires
export function findComponentById(components: ComponentDefinition[], id: string): ComponentDefinition | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateComponentInTree(
  components: ComponentDefinition[], 
  componentId: string, 
  updates: Partial<ComponentDefinition>
): ComponentDefinition[] {
  return components.map(component => {
    if (component.id === componentId) {
      return { ...component, ...updates };
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentInTree(component.children, componentId, updates)
      };
    }
    return component;
  });
}

export function removeComponentFromTree(
  components: ComponentDefinition[], 
  componentId: string
): ComponentDefinition[] {
  return components.filter(component => {
    if (component.id === componentId) {
      return false;
    }
    if (component.children) {
      component.children = removeComponentFromTree(component.children, componentId);
    }
    return true;
  });
}