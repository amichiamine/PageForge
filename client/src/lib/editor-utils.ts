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

    case 'list':
      return {
        ...baseComponent,
        tag: 'ul',
        content: '',
        attributes: { className: 'styled-list' },
        children: [
          {
            id: nanoid(),
            type: 'list-item',
            tag: 'li',
            content: 'Premier élément',
            styles: { 
              padding: '8px 0', 
              borderBottom: '1px solid #e2e8f0',
              fontSize: '14px',
              color: '#374151'
            }
          },
          {
            id: nanoid(),
            type: 'list-item', 
            tag: 'li',
            content: 'Deuxième élément',
            styles: { 
              padding: '8px 0', 
              borderBottom: '1px solid #e2e8f0',
              fontSize: '14px',
              color: '#374151'
            }
          },
          {
            id: nanoid(),
            type: 'list-item',
            tag: 'li', 
            content: 'Troisième élément',
            styles: { 
              padding: '8px 0',
              fontSize: '14px',
              color: '#374151'
            }
          }
        ],
        styles: {
          ...baseComponent.styles,
          listStyle: 'none',
          padding: '16px',
          height: '140px',
          width: '280px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          margin: '0'
        },
      };

    case 'form':
      return {
        ...baseComponent,
        tag: 'form',
        attributes: { 
          className: 'contact-form',
          action: '#',
          method: 'POST'
        },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          width: '320px',
          height: '280px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        children: [
          {
            id: nanoid(),
            type: 'input',
            tag: 'input',
            attributes: { 
              type: 'email', 
              placeholder: 'Votre email', 
              className: 'form-input',
              required: true
            },
            styles: {
              width: '100%',
              height: '44px',
              padding: '12px 16px',
              marginBottom: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              boxSizing: 'border-box'
            }
          },
          {
            id: nanoid(),
            type: 'textarea',
            tag: 'textarea',
            attributes: { 
              placeholder: 'Votre message...', 
              className: 'form-textarea',
              rows: 4,
              required: true
            },
            styles: {
              width: '100%',
              height: '100px',
              padding: '12px 16px',
              marginBottom: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }
          },
          {
            id: nanoid(),
            type: 'button',
            tag: 'button',
            content: 'Envoyer',
            attributes: { 
              type: 'submit',
              className: 'form-submit'
            },
            styles: {
              width: '100%',
              height: '44px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }
          }
        ],
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
        children: [
          {
            id: nanoid(),
            type: 'carousel-track',
            tag: 'div',
            attributes: { className: 'carousel-track' },
            styles: {
              display: 'flex',
              width: '300%',
              height: '100%',
              transition: 'transform 0.3s ease-in-out'
            },
            children: [
              {
                id: nanoid(),
                type: 'carousel-slide',
                tag: 'div',
                attributes: { className: 'carousel-slide' },
                styles: {
                  width: '33.333%',
                  height: '100%',
                  backgroundColor: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold'
                },
                content: '1'
              },
              {
                id: nanoid(),
                type: 'carousel-slide',
                tag: 'div',
                attributes: { className: 'carousel-slide' },
                styles: {
                  width: '33.333%',
                  height: '100%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold'
                },
                content: '2'
              },
              {
                id: nanoid(),
                type: 'carousel-slide',
                tag: 'div',
                attributes: { className: 'carousel-slide' },
                styles: {
                  width: '33.333%',
                  height: '100%',
                  backgroundColor: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 'bold'
                },
                content: '3'
              }
            ]
          },
          {
            id: nanoid(),
            type: 'carousel-nav',
            tag: 'div',
            attributes: { className: 'carousel-navigation' },
            styles: {
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              zIndex: '10'
            },
            children: [
              {
                id: nanoid(),
                type: 'carousel-dot',
                tag: 'button',
                attributes: { className: 'carousel-dot active' },
                styles: {
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  opacity: '1'
                }
              },
              {
                id: nanoid(),
                type: 'carousel-dot',
                tag: 'button',
                attributes: { className: 'carousel-dot' },
                styles: {
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  opacity: '0.5'
                }
              },
              {
                id: nanoid(),
                type: 'carousel-dot',
                tag: 'button',
                attributes: { className: 'carousel-dot' },
                styles: {
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  opacity: '0.5'
                }
              }
            ]
          }
        ]
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
        children: [
          {
            id: nanoid(),
            type: 'accordion-item',
            tag: 'div',
            attributes: { className: 'accordion-item' },
            styles: {
              borderBottom: '1px solid #e5e7eb'
            },
            children: [
              {
                id: nanoid(),
                type: 'accordion-trigger',
                tag: 'button',
                content: 'Question 1',
                attributes: { className: 'accordion-trigger' },
                styles: {
                  width: '100%',
                  padding: '16px 20px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }
              },
              {
                id: nanoid(),
                type: 'accordion-content',
                tag: 'div',
                content: 'Réponse à la première question avec des détails utiles.',
                attributes: { className: 'accordion-content' },
                styles: {
                  padding: '0 20px 16px',
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }
              }
            ]
          },
          {
            id: nanoid(),
            type: 'accordion-item',
            tag: 'div',
            attributes: { className: 'accordion-item' },
            children: [
              {
                id: nanoid(),
                type: 'accordion-trigger',
                tag: 'button',
                content: 'Question 2',
                attributes: { className: 'accordion-trigger' },
                styles: {
                  width: '100%',
                  padding: '16px 20px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }
              },
              {
                id: nanoid(),
                type: 'accordion-content',
                tag: 'div',
                content: 'Réponse à la deuxième question avec des informations complémentaires.',
                attributes: { className: 'accordion-content', style: 'display: none;' },
                styles: {
                  padding: '0 20px 16px',
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  display: 'none'
                }
              }
            ]
          }
        ]
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