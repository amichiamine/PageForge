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
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        attributes: { className: 'text-paragraph' },
        styles: {
          ...baseComponent.styles,
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#4a5568',
          height: 'auto',
          minHeight: '60px',
          width: '320px',
          textAlign: 'left',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          margin: '0',
          padding: '0',
          display: 'block',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        },
      };

    case 'button':
      return {
        ...baseComponent,
        tag: 'button',
        content: 'Cliquez ici',
        attributes: { 
          className: 'btn-primary', 
          type: 'button',
          'aria-label': 'Bouton d\'action'
        },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          cursor: 'pointer',
          width: '140px',
          height: '44px',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          outline: 'none',
          userSelect: 'none'
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
        // Supprimer les children pour éviter l'affichage comme sous-éléments
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
        // Composant unifié - pas de children séparés
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

    case 'chart':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { 
          className: 'chart-container',
          'data-chart-type': 'bar'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '300px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'chart-title',
            tag: 'h3',
            content: 'Statistiques',
            styles: {
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#1f2937'
            }
          },
          {
            id: nanoid(),
            type: 'chart-visual',
            tag: 'div',
            attributes: { className: 'chart-bars' },
            styles: {
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'space-around',
              height: '200px',
              backgroundColor: '#f9fafb',
              borderRadius: '4px',
              padding: '20px 10px'
            },
            children: [
              {
                id: nanoid(),
                type: 'chart-bar',
                tag: 'div',
                attributes: { className: 'chart-bar', 'data-value': '75' },
                styles: {
                  width: '40px',
                  height: '75%',
                  backgroundColor: '#3b82f6',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }
              },
              {
                id: nanoid(),
                type: 'chart-bar',
                tag: 'div',
                attributes: { className: 'chart-bar', 'data-value': '60' },
                styles: {
                  width: '40px',
                  height: '60%',
                  backgroundColor: '#10b981',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }
              },
              {
                id: nanoid(),
                type: 'chart-bar',
                tag: 'div',
                attributes: { className: 'chart-bar', 'data-value': '90' },
                styles: {
                  width: '40px',
                  height: '90%',
                  backgroundColor: '#f59e0b',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }
              },
              {
                id: nanoid(),
                type: 'chart-bar',
                tag: 'div',
                attributes: { className: 'chart-bar', 'data-value': '45' },
                styles: {
                  width: '40px',
                  height: '45%',
                  backgroundColor: '#ef4444',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }
              }
            ]
          }
        ]
      };

    case 'card':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'card-component' },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '240px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'card-image',
            tag: 'div',
            styles: {
              width: '100%',
              height: '120px',
              backgroundColor: '#f3f4f6',
              backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            },
            content: '🖼️'
          },
          {
            id: nanoid(),
            type: 'card-content',
            tag: 'div',
            styles: {
              padding: '20px'
            },
            children: [
              {
                id: nanoid(),
                type: 'card-title',
                tag: 'h3',
                content: 'Titre de la carte',
                styles: {
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#1f2937'
                }
              },
              {
                id: nanoid(),
                type: 'card-description',
                tag: 'p',
                content: 'Description concise du contenu de cette carte avec les informations essentielles.',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  marginBottom: '12px'
                }
              },
              {
                id: nanoid(),
                type: 'card-action',
                tag: 'button',
                content: 'En savoir plus',
                styles: {
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }
              }
            ]
          }
        ]
      };

    case 'video':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { 
          className: 'video-player',
          'data-video': 'true'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '250px',
          backgroundColor: '#000000',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'video-placeholder',
            tag: 'div',
            styles: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textAlign: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'play-icon',
                tag: 'div',
                content: '▶️',
                styles: {
                  fontSize: '48px',
                  marginBottom: '16px'
                }
              },
              {
                id: nanoid(),
                type: 'video-title',
                tag: 'div',
                content: 'Lecteur Vidéo',
                styles: {
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'Inter, sans-serif'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'video-controls',
            tag: 'div',
            attributes: { className: 'video-controls' },
            styles: {
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '20px 16px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            },
            children: [
              {
                id: nanoid(),
                type: 'progress-bar',
                tag: 'div',
                styles: {
                  flex: '1',
                  height: '4px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'progress-fill',
                    tag: 'div',
                    styles: {
                      width: '30%',
                      height: '100%',
                      backgroundColor: '#3b82f6',
                      borderRadius: '2px'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'section':
      return {
        ...baseComponent,
        tag: 'section',
        content: 'Section de contenu',
        attributes: { className: 'page-section' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '2px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '16px',
          color: '#64748b',
          textAlign: 'center',
          minHeight: '160px',
          boxSizing: 'border-box'
        }
      };

    case 'header':
      return {
        ...baseComponent,
        tag: 'header',
        attributes: { className: 'site-header' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '80px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'header-logo',
            tag: 'div',
            content: 'Logo',
            styles: {
              fontSize: '20px',
              fontWeight: 'bold'
            }
          },
          {
            id: nanoid(),
            type: 'header-nav',
            tag: 'nav',
            styles: {
              display: 'flex',
              gap: '24px'
            },
            children: [
              {
                id: nanoid(),
                type: 'nav-link',
                tag: 'a',
                content: 'Accueil',
                attributes: { href: '#' },
                styles: {
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }
              },
              {
                id: nanoid(),
                type: 'nav-link',
                tag: 'a',
                content: 'Services',
                attributes: { href: '#' },
                styles: {
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }
              },
              {
                id: nanoid(),
                type: 'nav-link',
                tag: 'a', 
                content: 'Contact',
                attributes: { href: '#' },
                styles: {
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }
              }
            ]
          }
        ]
      };

    case 'footer':
      return {
        ...baseComponent,
        tag: 'footer',
        attributes: { className: 'site-footer' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '120px',
          backgroundColor: '#374151',
          color: '#d1d5db',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
        children: [
          {
            id: nanoid(),
            type: 'footer-content',
            tag: 'div',
            styles: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            },
            children: [
              {
                id: nanoid(),
                type: 'footer-info',
                tag: 'div',
                children: [
                  {
                    id: nanoid(),
                    type: 'footer-title',
                    tag: 'h4',
                    content: 'Mon Site',
                    styles: {
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#ffffff'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'footer-description',
                    tag: 'p',
                    content: 'Description de votre entreprise',
                    styles: {
                      fontSize: '14px',
                      color: '#9ca3af'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'footer-links',
                tag: 'div',
                styles: {
                  display: 'flex',
                  gap: '16px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'footer-link',
                    tag: 'a',
                    content: 'Mentions légales',
                    attributes: { href: '#' },
                    styles: {
                      fontSize: '12px',
                      color: '#9ca3af',
                      textDecoration: 'none'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'footer-link',
                    tag: 'a',
                    content: 'Contact',
                    attributes: { href: '#' },
                    styles: {
                      fontSize: '12px',
                      color: '#9ca3af',
                      textDecoration: 'none'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: nanoid(),
            type: 'footer-copyright',
            tag: 'div',
            content: '© 2025 Tous droits réservés',
            styles: {
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #4b5563'
            }
          }
        ]
      };

    case 'sidebar':
      return {
        ...baseComponent,
        tag: 'aside',
        attributes: { className: 'sidebar-component' },
        styles: {
          ...baseComponent.styles,
          width: '280px',
          height: '300px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        },
        children: [
          {
            id: nanoid(),
            type: 'sidebar-header',
            tag: 'div',
            content: 'Navigation',
            styles: {
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid #374151'
            }
          },
          {
            id: nanoid(),
            type: 'sidebar-menu',
            tag: 'nav',
            styles: {
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            },
            children: [
              {
                id: nanoid(),
                type: 'sidebar-item',
                tag: 'a',
                content: '🏠 Accueil',
                attributes: { href: '#' },
                styles: {
                  padding: '12px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }
              },
              {
                id: nanoid(),
                type: 'sidebar-item',
                tag: 'a',
                content: '📊 Analytics',
                attributes: { href: '#' },
                styles: {
                  padding: '12px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#d1d5db',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }
              },
              {
                id: nanoid(),
                type: 'sidebar-item',
                tag: 'a',
                content: '⚙️ Paramètres',
                attributes: { href: '#' },
                styles: {
                  padding: '12px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#d1d5db',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }
              }
            ]
          }
        ]
      };

    case 'navbar':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'navbar-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '60px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'navbar-brand',
            tag: 'div',
            content: 'Brand',
            styles: {
              fontSize: '18px',
              fontWeight: '700',
              color: '#1f2937'
            }
          },
          {
            id: nanoid(),
            type: 'navbar-menu',
            tag: 'ul',
            styles: {
              display: 'flex',
              gap: '24px',
              listStyle: 'none',
              margin: '0',
              padding: '0'
            },
            children: [
              {
                id: nanoid(),
                type: 'navbar-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'navbar-link',
                    tag: 'a',
                    content: 'Accueil',
                    attributes: { href: '#' },
                    styles: {
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      transition: 'color 0.2s'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'navbar-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'navbar-link',
                    tag: 'a',
                    content: 'Services',
                    attributes: { href: '#' },
                    styles: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      transition: 'color 0.2s'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'navbar-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'navbar-link',
                    tag: 'a',
                    content: 'Contact',
                    attributes: { href: '#' },
                    styles: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      transition: 'color 0.2s'
                    }
                  }
                ]
              }
            ]
          }
        ]
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
        children: [
          {
            id: nanoid(),
            type: 'grid-item',
            tag: 'div',
            content: 'Item 1',
            styles: {
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }
          },
          {
            id: nanoid(),
            type: 'grid-item',
            tag: 'div',
            content: 'Item 2',
            styles: {
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }
          },
          {
            id: nanoid(),
            type: 'grid-item',
            tag: 'div',
            content: 'Item 3',
            styles: {
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }
          },
          {
            id: nanoid(),
            type: 'grid-item',
            tag: 'div',
            content: 'Item 4',
            styles: {
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }
          }
        ]
      };

    case 'flexbox':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'flexbox-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '160px',
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
        children: [
          {
            id: nanoid(),
            type: 'flex-item',
            tag: 'div',
            content: 'Flex 1',
            styles: {
              flex: '1',
              backgroundColor: '#dbeafe',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1e40af'
            }
          },
          {
            id: nanoid(),
            type: 'flex-item',
            tag: 'div',
            content: 'Flex 2',
            styles: {
              flex: '1',
              backgroundColor: '#dcfce7',
              border: '1px solid #10b981',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#047857'
            }
          },
          {
            id: nanoid(),
            type: 'flex-item',
            tag: 'div',
            content: 'Flex 3',
            styles: {
              flex: '1',
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#92400e'
            }
          }
        ]
      };

    case 'quote':
      return {
        ...baseComponent,
        tag: 'blockquote',
        content: '"Cette citation inspirante démontre l\'importance de persévérer dans ses projets et de toujours viser l\'excellence."',
        attributes: { className: 'quote-component' },
        styles: {
          ...baseComponent.styles,
          width: '380px',
          height: 'auto',
          minHeight: '120px',
          backgroundColor: '#f8fafc',
          border: 'none',
          borderLeft: '4px solid #3b82f6',
          borderRadius: '0 8px 8px 0',
          padding: '24px 28px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '18px',
          fontStyle: 'italic',
          lineHeight: '1.6',
          color: '#374151',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        },
        children: [
          {
            id: nanoid(),
            type: 'quote-author',
            tag: 'cite',
            content: '— Steve Jobs',
            styles: {
              display: 'block',
              marginTop: '16px',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: '500',
              color: '#6b7280',
              textAlign: 'right'
            }
          }
        ]
      };

    case 'code':
      return {
        ...baseComponent,
        tag: 'pre',
        attributes: { className: 'code-component' },
        styles: {
          ...baseComponent.styles,
          width: '380px',
          height: 'auto',
          minHeight: '140px',
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'code-content',
            tag: 'code',
            content: `function createComponent(type) {
  return {
    id: generateId(),
    type: type,
    content: '',
    styles: {}
  };
}`,
            styles: {
              color: '#f9fafb',
              fontSize: '14px',
              fontFamily: 'inherit'
            }
          }
        ]
      };

    case 'table':
      return {
        ...baseComponent,
        tag: 'table',
        attributes: { className: 'table-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: 'auto',
          minHeight: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          borderCollapse: 'separate',
          borderSpacing: '0',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '14px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'table-header',
            tag: 'thead',
            styles: {
              backgroundColor: '#f9fafb'
            },
            children: [
              {
                id: nanoid(),
                type: 'table-row',
                tag: 'tr',
                children: [
                  {
                    id: nanoid(),
                    type: 'table-header-cell',
                    tag: 'th',
                    content: 'Nom',
                    styles: {
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'table-header-cell',
                    tag: 'th',
                    content: 'Email',
                    styles: {
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'table-header-cell',
                    tag: 'th',
                    content: 'Statut',
                    styles: {
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: nanoid(),
            type: 'table-body',
            tag: 'tbody',
            children: [
              {
                id: nanoid(),
                type: 'table-row',
                tag: 'tr',
                children: [
                  {
                    id: nanoid(),
                    type: 'table-cell',
                    tag: 'td',
                    content: 'Marie Dupont',
                    styles: {
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#1f2937'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'table-cell',
                    tag: 'td',
                    content: 'marie@example.com',
                    styles: {
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#6b7280'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'table-cell',
                    tag: 'td',
                    content: 'Actif',
                    styles: {
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#059669',
                      fontWeight: '500'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'table-row',
                tag: 'tr',
                children: [
                  {
                    id: nanoid(),
                    type: 'table-cell',
                    tag: 'td',
                    content: 'Jean Martin',
                    styles: {
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#1f2937'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'table-cell',
                    tag: 'td',
                    content: 'jean@example.com',
                    styles: {
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#6b7280'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'table-cell',
                    tag: 'td',
                    content: 'Inactif',
                    styles: {
                      padding: '12px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      color: '#dc2626',
                      fontWeight: '500'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'audio':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'audio-player' },
        styles: {
          ...baseComponent.styles,
          width: '380px',
          height: '120px',
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'audio-controls',
            tag: 'div',
            styles: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            },
            children: [
              {
                id: nanoid(),
                type: 'play-button',
                tag: 'button',
                content: '▶️',
                styles: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'audio-info',
            tag: 'div',
            styles: {
              flex: '1',
              color: '#ffffff'
            },
            children: [
              {
                id: nanoid(),
                type: 'audio-title',
                tag: 'div',
                content: 'Titre du morceau',
                styles: {
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }
              },
              {
                id: nanoid(),
                type: 'audio-artist',
                tag: 'div',
                content: 'Nom de l\'artiste',
                styles: {
                  fontSize: '14px',
                  color: '#9ca3af',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'audio-progress',
                tag: 'div',
                styles: {
                  height: '4px',
                  backgroundColor: '#374151',
                  borderRadius: '2px',
                  overflow: 'hidden'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'progress-bar',
                    tag: 'div',
                    styles: {
                      width: '35%',
                      height: '100%',
                      backgroundColor: '#3b82f6',
                      borderRadius: '2px'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'gallery':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'gallery-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '280px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'hidden'
        },
        children: [
          {
            id: nanoid(),
            type: 'gallery-title',
            tag: 'h3',
            content: 'Galerie Photos',
            styles: {
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937',
              textAlign: 'center'
            }
          },
          {
            id: nanoid(),
            type: 'gallery-grid',
            tag: 'div',
            styles: {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              height: '200px'
            },
            children: [
              {
                id: nanoid(),
                type: 'gallery-item',
                tag: 'div',
                styles: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6b7280',
                  aspectRatio: '1',
                  backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                },
                content: '🖼️'
              },
              {
                id: nanoid(),
                type: 'gallery-item',
                tag: 'div',
                styles: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6b7280',
                  aspectRatio: '1',
                  backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                },
                content: '📷'
              },
              {
                id: nanoid(),
                type: 'gallery-item',
                tag: 'div',
                styles: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6b7280',
                  aspectRatio: '1',
                  backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                },
                content: '🎨'
              },
              {
                id: nanoid(),
                type: 'gallery-item',
                tag: 'div',
                styles: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6b7280',
                  aspectRatio: '1',
                  backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                },
                content: '🌟'
              },
              {
                id: nanoid(),
                type: 'gallery-item',
                tag: 'div',
                styles: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6b7280',
                  aspectRatio: '1',
                  backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                },
                content: '🎪'
              },
              {
                id: nanoid(),
                type: 'gallery-item',
                tag: 'div',
                styles: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#6b7280',
                  aspectRatio: '1',
                  backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
                  backgroundSize: '12px 12px',
                  backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px'
                },
                content: '🚀'
              }
            ]
          }
        ]
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

    case 'link':
      return {
        ...baseComponent,
        tag: 'a',
        content: 'Cliquez pour visiter',
        attributes: { 
          className: 'link-component', 
          href: '#',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        styles: {
          ...baseComponent.styles,
          width: 'auto',
          height: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#3b82f6',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #3b82f6',
          backgroundColor: 'transparent',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          outline: 'none'
        },
        children: [
          {
            id: nanoid(),
            type: 'link-icon',
            tag: 'span',
            content: '🔗',
            styles: {
              fontSize: '14px'
            }
          }
        ]
      };

    case 'modal':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'modal-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '250px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          position: 'relative'
        },
        children: [
          {
            id: nanoid(),
            type: 'modal-content',
            tag: 'div',
            styles: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              width: '320px',
              maxHeight: '200px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative'
            },
            children: [
              {
                id: nanoid(),
                type: 'modal-header',
                tag: 'div',
                styles: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'modal-title',
                    tag: 'h3',
                    content: 'Titre de la modale',
                    styles: {
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'modal-close',
                    tag: 'button',
                    content: '✕',
                    styles: {
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'modal-body',
                tag: 'div',
                content: 'Contenu de la fenêtre modale avec des informations importantes.',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }
              },
              {
                id: nanoid(),
                type: 'modal-footer',
                tag: 'div',
                styles: {
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'modal-button',
                    tag: 'button',
                    content: 'Annuler',
                    styles: {
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'modal-button',
                    tag: 'button',
                    content: 'Confirmer',
                    styles: {
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'dropdown':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'dropdown-component' },
        styles: {
          ...baseComponent.styles,
          width: '240px',
          height: 'auto',
          minHeight: '120px',
          position: 'relative',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'dropdown-trigger',
            tag: 'button',
            content: 'Sélectionnez une option',
            styles: {
              width: '100%',
              height: '44px',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s'
            },
            children: [
              {
                id: nanoid(),
                type: 'dropdown-arrow',
                tag: 'span',
                content: '▼',
                styles: {
                  fontSize: '12px',
                  color: '#6b7280'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'dropdown-menu',
            tag: 'div',
            styles: {
              position: 'absolute',
              top: '48px',
              left: '0',
              right: '0',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: '10',
              overflow: 'hidden'
            },
            children: [
              {
                id: nanoid(),
                type: 'dropdown-item',
                tag: 'div',
                content: 'Option 1',
                styles: {
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s'
                }
              },
              {
                id: nanoid(),
                type: 'dropdown-item',
                tag: 'div',
                content: 'Option 2',
                styles: {
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.2s'
                }
              },
              {
                id: nanoid(),
                type: 'dropdown-item',
                tag: 'div',
                content: 'Option 3',
                styles: {
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }
              }
            ]
          }
        ]
      };

    case 'pricing':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'pricing-component' },
        styles: {
          ...baseComponent.styles,
          width: '320px',
          height: '380px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        },
        children: [
          {
            id: nanoid(),
            type: 'pricing-header',
            tag: 'div',
            styles: {
              textAlign: 'center',
              marginBottom: '24px'
            },
            children: [
              {
                id: nanoid(),
                type: 'pricing-title',
                tag: 'h3',
                content: 'Plan Professionnel',
                styles: {
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'pricing-price',
                tag: 'div',
                styles: {
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  marginBottom: '8px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'price-amount',
                    tag: 'span',
                    content: '29€',
                    styles: {
                      fontSize: '36px',
                      fontWeight: '800',
                      color: '#3b82f6'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'price-period',
                    tag: 'span',
                    content: '/mois',
                    styles: {
                      fontSize: '16px',
                      color: '#6b7280',
                      marginLeft: '4px'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'pricing-description',
                tag: 'p',
                content: 'Idéal pour les équipes qui grandissent',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'pricing-features',
            tag: 'ul',
            styles: {
              listStyle: 'none',
              padding: '0',
              margin: '0 0 24px 0',
              flex: '1'
            },
            children: [
              {
                id: nanoid(),
                type: 'feature-item',
                tag: 'li',
                content: '✅ 10 utilisateurs inclus',
                styles: {
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'feature-item',
                tag: 'li',
                content: '✅ Support prioritaire',
                styles: {
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'feature-item',
                tag: 'li',
                content: '✅ Intégrations avancées',
                styles: {
                  fontSize: '14px',
                  color: '#374151',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'pricing-button',
            tag: 'button',
            content: 'Commencer maintenant',
            styles: {
              width: '100%',
              height: '44px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }
          }
        ]
      };

    case 'testimonial':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'testimonial-component' },
        styles: {
          ...baseComponent.styles,
          width: '380px',
          height: '220px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
        children: [
          {
            id: nanoid(),
            type: 'testimonial-quote',
            tag: 'blockquote',
            content: '"Cette solution a transformé notre façon de travailler. Les résultats sont impressionnants et l\'équipe est très satisfaite."',
            styles: {
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#374151',
              fontStyle: 'italic',
              margin: '0 0 20px 0',
              flex: '1'
            }
          },
          {
            id: nanoid(),
            type: 'testimonial-author',
            tag: 'div',
            styles: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            },
            children: [
              {
                id: nanoid(),
                type: 'author-avatar',
                tag: 'div',
                content: '👤',
                styles: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }
              },
              {
                id: nanoid(),
                type: 'author-info',
                tag: 'div',
                children: [
                  {
                    id: nanoid(),
                    type: 'author-name',
                    tag: 'div',
                    content: 'Marie Dubois',
                    styles: {
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'author-title',
                    tag: 'div',
                    content: 'Directrice Marketing, TechCorp',
                    styles: {
                      fontSize: '14px',
                      color: '#6b7280'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'team':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'team-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '320px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'hidden'
        },
        children: [
          {
            id: nanoid(),
            type: 'team-title',
            tag: 'h3',
            content: 'Notre Équipe',
            styles: {
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: '24px'
            }
          },
          {
            id: nanoid(),
            type: 'team-grid',
            tag: 'div',
            styles: {
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px'
            },
            children: [
              {
                id: nanoid(),
                type: 'team-member',
                tag: 'div',
                styles: {
                  textAlign: 'center'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'member-avatar',
                    tag: 'div',
                    content: '👨‍💼',
                    styles: {
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      margin: '0 auto 12px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'member-name',
                    tag: 'h4',
                    content: 'Pierre Martin',
                    styles: {
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'member-role',
                    tag: 'p',
                    content: 'CEO & Fondateur',
                    styles: {
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'team-member',
                tag: 'div',
                styles: {
                  textAlign: 'center'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'member-avatar',
                    tag: 'div',
                    content: '👩‍💻',
                    styles: {
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      margin: '0 auto 12px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'member-name',
                    tag: 'h4',
                    content: 'Sophie Chen',
                    styles: {
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'member-role',
                    tag: 'p',
                    content: 'CTO',
                    styles: {
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'stats':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'stats-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        },
        children: [
          {
            id: nanoid(),
            type: 'stat-item',
            tag: 'div',
            styles: {
              textAlign: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'stat-number',
                tag: 'div',
                content: '150+',
                styles: {
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#3b82f6',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'stat-label',
                tag: 'div',
                content: 'Clients',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'stat-item',
            tag: 'div',
            styles: {
              textAlign: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'stat-number',
                tag: 'div',
                content: '98%',
                styles: {
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#10b981',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'stat-label',
                tag: 'div',
                content: 'Satisfaction',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'stat-item',
            tag: 'div',
            styles: {
              textAlign: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'stat-number',
                tag: 'div',
                content: '24/7',
                styles: {
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#f59e0b',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'stat-label',
                tag: 'div',
                content: 'Support',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  fontWeight: '500'
                }
              }
            ]
          }
        ]
      };

    case 'features':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'features-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '280px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'features-title',
            tag: 'h3',
            content: 'Fonctionnalités',
            styles: {
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'center'
            }
          },
          {
            id: nanoid(),
            type: 'features-list',
            tag: 'div',
            styles: {
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            },
            children: [
              {
                id: nanoid(),
                type: 'feature-item',
                tag: 'div',
                styles: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'feature-icon',
                    tag: 'div',
                    content: '⚡',
                    styles: {
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'feature-text',
                    tag: 'div',
                    children: [
                      {
                        id: nanoid(),
                        type: 'feature-name',
                        tag: 'div',
                        content: 'Performance rapide',
                        styles: {
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }
                      },
                      {
                        id: nanoid(),
                        type: 'feature-description',
                        tag: 'div',
                        content: 'Optimisé pour une vitesse maximale',
                        styles: {
                          fontSize: '14px',
                          color: '#6b7280'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'feature-item',
                tag: 'div',
                styles: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'feature-icon',
                    tag: 'div',
                    content: '🔒',
                    styles: {
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'feature-text',
                    tag: 'div',
                    children: [
                      {
                        id: nanoid(),
                        type: 'feature-name',
                        tag: 'div',
                        content: 'Sécurité avancée',
                        styles: {
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }
                      },
                      {
                        id: nanoid(),
                        type: 'feature-description',
                        tag: 'div',
                        content: 'Chiffrement et protection des données',
                        styles: {
                          fontSize: '14px',
                          color: '#6b7280'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'cta':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'cta-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '200px',
          backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '16px',
          padding: '32px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'cta-title',
            tag: 'h3',
            content: 'Prêt à commencer ?',
            styles: {
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '12px',
              color: '#ffffff'
            }
          },
          {
            id: nanoid(),
            type: 'cta-description',
            tag: 'p',
            content: 'Rejoignez des milliers d\'utilisateurs satisfaits',
            styles: {
              fontSize: '16px',
              marginBottom: '24px',
              color: '#e0e7ff',
              opacity: '0.9'
            }
          },
          {
            id: nanoid(),
            type: 'cta-button',
            tag: 'button',
            content: 'Commencer gratuitement',
            styles: {
              backgroundColor: '#ffffff',
              color: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }
          }
        ]
      };

    case 'menu':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'menu-component' },
        styles: {
          ...baseComponent.styles,
          width: '320px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        children: [
          {
            id: nanoid(),
            type: 'menu-list',
            tag: 'ul',
            styles: {
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            },
            children: [
              {
                id: nanoid(),
                type: 'menu-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'menu-link',
                    tag: 'a',
                    content: '🏠 Accueil',
                    attributes: { href: '#' },
                    styles: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#f3f4f6',
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'menu-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'menu-link',
                    tag: 'a',
                    content: '📁 Produits',
                    attributes: { href: '#' },
                    styles: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'menu-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'menu-link',
                    tag: 'a',
                    content: '📞 Support',
                    attributes: { href: '#' },
                    styles: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderRadius: '6px',
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'breadcrumb':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'breadcrumb-component', 'aria-label': 'Breadcrumb' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '60px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          alignItems: 'center'
        },
        children: [
          {
            id: nanoid(),
            type: 'breadcrumb-list',
            tag: 'ol',
            styles: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              listStyle: 'none',
              padding: '0',
              margin: '0'
            },
            children: [
              {
                id: nanoid(),
                type: 'breadcrumb-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'breadcrumb-link',
                    tag: 'a',
                    content: 'Accueil',
                    attributes: { href: '#' },
                    styles: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'breadcrumb-separator',
                tag: 'span',
                content: '/',
                styles: {
                  color: '#d1d5db',
                  fontSize: '14px'
                }
              },
              {
                id: nanoid(),
                type: 'breadcrumb-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'breadcrumb-link',
                    tag: 'a',
                    content: 'Produits',
                    attributes: { href: '#' },
                    styles: {
                      color: '#6b7280',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'breadcrumb-separator',
                tag: 'span',
                content: '/',
                styles: {
                  color: '#d1d5db',
                  fontSize: '14px'
                }
              },
              {
                id: nanoid(),
                type: 'breadcrumb-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'breadcrumb-current',
                    tag: 'span',
                    content: 'Détails',
                    styles: {
                      color: '#1f2937',
                      fontSize: '14px',
                      fontWeight: '500'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'pagination':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'pagination-component', 'aria-label': 'Pagination' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '80px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        },
        children: [
          {
            id: nanoid(),
            type: 'pagination-list',
            tag: 'ul',
            styles: {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              listStyle: 'none',
              padding: '0',
              margin: '0'
            },
            children: [
              {
                id: nanoid(),
                type: 'pagination-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'pagination-button',
                    tag: 'button',
                    content: '‹',
                    styles: {
                      width: '32px',
                      height: '32px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      color: '#6b7280',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'pagination-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'pagination-button',
                    tag: 'button',
                    content: '1',
                    styles: {
                      width: '32px',
                      height: '32px',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'pagination-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'pagination-button',
                    tag: 'button',
                    content: '2',
                    styles: {
                      width: '32px',
                      height: '32px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'pagination-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'pagination-button',
                    tag: 'button',
                    content: '3',
                    styles: {
                      width: '32px',
                      height: '32px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'pagination-item',
                tag: 'li',
                children: [
                  {
                    id: nanoid(),
                    type: 'pagination-button',
                    tag: 'button',
                    content: '›',
                    styles: {
                      width: '32px',
                      height: '32px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'tabs':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'tabs-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '240px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'hidden'
        },
        children: [
          {
            id: nanoid(),
            type: 'tabs-list',
            tag: 'div',
            styles: {
              display: 'flex',
              borderBottom: '1px solid #e5e7eb'
            },
            children: [
              {
                id: nanoid(),
                type: 'tab-button',
                tag: 'button',
                content: 'Onglet 1',
                styles: {
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: '2px solid #3b82f6'
                }
              },
              {
                id: nanoid(),
                type: 'tab-button',
                tag: 'button',
                content: 'Onglet 2',
                styles: {
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: '2px solid transparent'
                }
              },
              {
                id: nanoid(),
                type: 'tab-button',
                tag: 'button',
                content: 'Onglet 3',
                styles: {
                  flex: '1',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: '2px solid transparent'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'tab-content',
            tag: 'div',
            content: 'Contenu du premier onglet avec des informations détaillées et des fonctionnalités spécifiques.',
            styles: {
              padding: '24px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#374151',
              height: '160px',
              overflow: 'auto'
            }
          }
        ]
      };

    case 'search':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'search-component' },
        styles: {
          ...baseComponent.styles,
          width: '380px',
          height: '120px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        },
        children: [
          {
            id: nanoid(),
            type: 'search-input',
            tag: 'div',
            styles: {
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'search-field',
                tag: 'input',
                attributes: {
                  type: 'search',
                  placeholder: 'Rechercher...',
                  className: 'search-input'
                },
                styles: {
                  width: '100%',
                  height: '44px',
                  padding: '0 16px 0 44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }
              },
              {
                id: nanoid(),
                type: 'search-icon',
                tag: 'div',
                content: '🔍',
                styles: {
                  position: 'absolute',
                  left: '14px',
                  fontSize: '16px',
                  color: '#6b7280',
                  pointerEvents: 'none'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'search-button',
            tag: 'button',
            content: 'Rechercher',
            styles: {
              height: '40px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }
          }
        ]
      };

    case 'faq':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'faq-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '280px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'faq-title',
            tag: 'h3',
            content: 'Questions Fréquentes',
            styles: {
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'center'
            }
          },
          {
            id: nanoid(),
            type: 'faq-list',
            tag: 'div',
            styles: {
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            },
            children: [
              {
                id: nanoid(),
                type: 'faq-item',
                tag: 'details',
                attributes: { open: 'true' },
                styles: {
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'faq-question',
                    tag: 'summary',
                    content: 'Comment puis-je commencer ?',
                    styles: {
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      cursor: 'pointer',
                      listStyle: 'none'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'faq-answer',
                    tag: 'div',
                    content: 'Il suffit de créer un compte et de suivre notre guide de démarrage rapide.',
                    styles: {
                      padding: '16px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#6b7280',
                      backgroundColor: '#ffffff'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'faq-item',
                tag: 'details',
                styles: {
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'faq-question',
                    tag: 'summary',
                    content: 'Quels sont les tarifs ?',
                    styles: {
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      cursor: 'pointer',
                      listStyle: 'none'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'faq-answer',
                    tag: 'div',
                    content: 'Nos plans commencent à partir de 19€/mois avec une version gratuite disponible.',
                    styles: {
                      padding: '16px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#6b7280',
                      backgroundColor: '#ffffff'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'timeline':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'timeline-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '320px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'auto'
        },
        children: [
          {
            id: nanoid(),
            type: 'timeline-title',
            tag: 'h3',
            content: 'Notre Histoire',
            styles: {
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '20px',
              textAlign: 'center'
            }
          },
          {
            id: nanoid(),
            type: 'timeline-list',
            tag: 'div',
            styles: {
              position: 'relative',
              paddingLeft: '32px'
            },
            children: [
              {
                id: nanoid(),
                type: 'timeline-line',
                tag: 'div',
                styles: {
                  position: 'absolute',
                  left: '12px',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  backgroundColor: '#e5e7eb'
                }
              },
              {
                id: nanoid(),
                type: 'timeline-item',
                tag: 'div',
                styles: {
                  position: 'relative',
                  marginBottom: '24px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'timeline-marker',
                    tag: 'div',
                    styles: {
                      position: 'absolute',
                      left: '-26px',
                      top: '4px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      border: '3px solid #ffffff',
                      boxShadow: '0 0 0 2px #3b82f6'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'timeline-date',
                    tag: 'div',
                    content: '2023',
                    styles: {
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'timeline-content',
                    tag: 'div',
                    content: 'Création de l\'entreprise',
                    styles: {
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'timeline-description',
                    tag: 'div',
                    content: 'Lancement de nos premiers services',
                    styles: {
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'timeline-item',
                tag: 'div',
                styles: {
                  position: 'relative',
                  marginBottom: '24px'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'timeline-marker',
                    tag: 'div',
                    styles: {
                      position: 'absolute',
                      left: '-26px',
                      top: '4px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      border: '3px solid #ffffff',
                      boxShadow: '0 0 0 2px #10b981'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'timeline-date',
                    tag: 'div',
                    content: '2024',
                    styles: {
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'timeline-content',
                    tag: 'div',
                    content: 'Expansion internationale',
                    styles: {
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'timeline-description',
                    tag: 'div',
                    content: 'Ouverture de nouveaux marchés',
                    styles: {
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'blog-post':
      return {
        ...baseComponent,
        tag: 'article',
        attributes: { className: 'blog-post-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '320px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          overflow: 'auto'
        },
        children: [
          {
            id: nanoid(),
            type: 'blog-header',
            tag: 'header',
            styles: {
              marginBottom: '16px'
            },
            children: [
              {
                id: nanoid(),
                type: 'blog-title',
                tag: 'h2',
                content: 'Les Tendances du Design Web en 2024',
                styles: {
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }
              },
              {
                id: nanoid(),
                type: 'blog-meta',
                tag: 'div',
                styles: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  color: '#6b7280'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'blog-author',
                    tag: 'span',
                    content: 'Par Marie Dupont',
                    styles: {
                      fontWeight: '500'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'blog-date',
                    tag: 'time',
                    content: '15 mars 2024',
                    attributes: { datetime: '2024-03-15' }
                  }
                ]
              }
            ]
          },
          {
            id: nanoid(),
            type: 'blog-content',
            tag: 'div',
            styles: {
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#374151'
            },
            children: [
              {
                id: nanoid(),
                type: 'blog-excerpt',
                tag: 'p',
                content: 'Découvrez les dernières tendances qui façonnent le design web moderne. Du minimalisme aux interfaces immersives, explorez comment créer des expériences utilisateur exceptionnelles.',
                styles: {
                  marginBottom: '16px'
                }
              },
              {
                id: nanoid(),
                type: 'blog-read-more',
                tag: 'a',
                content: 'Lire la suite →',
                attributes: { href: '#' },
                styles: {
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '14px'
                }
              }
            ]
          }
        ]
      };

    case 'countdown':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'countdown-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '200px',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        },
        children: [
          {
            id: nanoid(),
            type: 'countdown-title',
            tag: 'h3',
            content: 'Lancement dans',
            styles: {
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#ffffff'
            }
          },
          {
            id: nanoid(),
            type: 'countdown-timer',
            tag: 'div',
            styles: {
              display: 'flex',
              gap: '16px',
              alignItems: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'countdown-unit',
                tag: 'div',
                styles: {
                  textAlign: 'center'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'countdown-number',
                    tag: 'div',
                    content: '15',
                    styles: {
                      fontSize: '28px',
                      fontWeight: '800',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'countdown-label',
                    tag: 'div',
                    content: 'Jours',
                    styles: {
                      fontSize: '12px',
                      opacity: '0.8'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'countdown-separator',
                tag: 'div',
                content: ':',
                styles: {
                  fontSize: '24px',
                  fontWeight: '600'
                }
              },
              {
                id: nanoid(),
                type: 'countdown-unit',
                tag: 'div',
                styles: {
                  textAlign: 'center'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'countdown-number',
                    tag: 'div',
                    content: '08',
                    styles: {
                      fontSize: '28px',
                      fontWeight: '800',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'countdown-label',
                    tag: 'div',
                    content: 'Heures',
                    styles: {
                      fontSize: '12px',
                      opacity: '0.8'
                    }
                  }
                ]
              },
              {
                id: nanoid(),
                type: 'countdown-separator',
                tag: 'div',
                content: ':',
                styles: {
                  fontSize: '24px',
                  fontWeight: '600'
                }
              },
              {
                id: nanoid(),
                type: 'countdown-unit',
                tag: 'div',
                styles: {
                  textAlign: 'center'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'countdown-number',
                    tag: 'div',
                    content: '42',
                    styles: {
                      fontSize: '28px',
                      fontWeight: '800',
                      marginBottom: '4px'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'countdown-label',
                    tag: 'div',
                    content: 'Min',
                    styles: {
                      fontSize: '12px',
                      opacity: '0.8'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    case 'map':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'map-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '250px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'map-placeholder',
            tag: 'div',
            styles: {
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px'
            },
            children: [
              {
                id: nanoid(),
                type: 'map-icon',
                tag: 'div',
                content: '🗺️',
                styles: {
                  fontSize: '48px'
                }
              },
              {
                id: nanoid(),
                type: 'map-text',
                tag: 'div',
                content: 'Carte Interactive',
                styles: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#6b7280'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'map-marker',
            tag: 'div',
            content: '📍',
            styles: {
              position: 'absolute',
              top: '60px',
              left: '180px',
              fontSize: '24px',
              zIndex: '2'
            }
          }
        ]
      };

    case 'weather':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'weather-component' },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '200px',
          backgroundColor: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
          borderRadius: '16px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(116, 185, 255, 0.3)'
        },
        children: [
          {
            id: nanoid(),
            type: 'weather-header',
            tag: 'div',
            styles: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            },
            children: [
              {
                id: nanoid(),
                type: 'weather-location',
                tag: 'div',
                content: 'Paris, France',
                styles: {
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: '0.9'
                }
              },
              {
                id: nanoid(),
                type: 'weather-icon',
                tag: 'div',
                content: '☀️',
                styles: {
                  fontSize: '32px'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'weather-main',
            tag: 'div',
            children: [
              {
                id: nanoid(),
                type: 'weather-temp',
                tag: 'div',
                content: '23°C',
                styles: {
                  fontSize: '48px',
                  fontWeight: '300',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'weather-description',
                tag: 'div',
                content: 'Ensoleillé',
                styles: {
                  fontSize: '16px',
                  opacity: '0.9'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'weather-details',
            tag: 'div',
            styles: {
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              opacity: '0.8'
            },
            children: [
              {
                id: nanoid(),
                type: 'weather-humidity',
                tag: 'div',
                content: 'Humidité: 65%'
              },
              {
                id: nanoid(),
                type: 'weather-wind',
                tag: 'div',
                content: 'Vent: 12 km/h'
              }
            ]
          }
        ]
      };

    case 'product-card':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'product-card-component' },
        styles: {
          ...baseComponent.styles,
          width: '280px',
          height: '360px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        },
        children: [
          {
            id: nanoid(),
            type: 'product-image',
            tag: 'div',
            styles: {
              width: '100%',
              height: '180px',
              backgroundColor: '#f3f4f6',
              backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#9ca3af'
            },
            content: '📱'
          },
          {
            id: nanoid(),
            type: 'product-content',
            tag: 'div',
            styles: {
              padding: '16px'
            },
            children: [
              {
                id: nanoid(),
                type: 'product-title',
                tag: 'h3',
                content: 'iPhone 15 Pro',
                styles: {
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }
              },
              {
                id: nanoid(),
                type: 'product-description',
                tag: 'p',
                content: 'Le smartphone le plus avancé avec puce A17 Pro et caméra 48MP.',
                styles: {
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }
              },
              {
                id: nanoid(),
                type: 'product-footer',
                tag: 'div',
                styles: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                },
                children: [
                  {
                    id: nanoid(),
                    type: 'product-price',
                    tag: 'div',
                    content: '1 199€',
                    styles: {
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#3b82f6'
                    }
                  },
                  {
                    id: nanoid(),
                    type: 'product-button',
                    tag: 'button',
                    content: 'Acheter',
                    styles: {
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };

    default:
      return {
        ...baseComponent,
        tag: 'div',
        content: 'Nouveau composant',
        attributes: { className: '' },
      };
  }
}

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
  id: string,
  updates: Partial<ComponentDefinition>
): ComponentDefinition[] {
  return components.map(component => {
    if (component.id === id) {
      console.log('🔄 UPDATING COMPONENT IN TREE:', { 
        componentId: id, 
        componentType: component.type,
        oldComponent: component, 
        updates,
        mergedComponent: { ...component, ...updates }
      });
      return { ...component, ...updates };
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentInTree(component.children, id, updates)
      };
    }
    return component;
  });
}

export function removeComponentFromTree(components: ComponentDefinition[], id: string): ComponentDefinition[] {
  return components.filter(component => {
    if (component.id === id) {
      return false;
    }
    if (component.children) {
      component.children = removeComponentFromTree(component.children, id);
    }
    return true;
  });
}

export function addComponentToTree(
  components: ComponentDefinition[],
  parentId: string | null,
  newComponent: ComponentDefinition,
  index?: number
): ComponentDefinition[] {
  if (!parentId) {
    // Add to root level
    if (index !== undefined) {
      const newComponents = [...components];
      newComponents.splice(index, 0, newComponent);
      return newComponents;
    }
    return [...components, newComponent];
  }

  return components.map(component => {
    if (component.id === parentId) {
      const children = component.children || [];
      if (index !== undefined) {
        const newChildren = [...children];
        newChildren.splice(index, 0, newComponent);
        return { ...component, children: newChildren };
      }
      return { ...component, children: [...children, newComponent] };
    }
    if (component.children) {
      return {
        ...component,
        children: addComponentToTree(component.children, parentId, newComponent, index)
      };
    }
    return component;
  });
}