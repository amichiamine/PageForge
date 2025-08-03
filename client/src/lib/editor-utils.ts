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
        content: '',
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
        content: '',
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
        content: '',
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
          src: '',
          alt: '',
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
        content: '',
        attributes: { className: 'container' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: 'transparent',
          border: '2px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '20px',
          width: '100%',
          height: '400px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'block',
          position: 'relative',
          left: '0',
          top: '100px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          minHeight: '120px',
          boxSizing: 'border-box'
        },
        componentData: {
          preset: 'default',
          maxWidth: '1200px',
          centered: true,
          padding: '20px',
          columns: 1,
          gap: '20px',
          gridTemplate: 'none',
          distribution: 'flex-start',
          overflow: 'visible',
          constraints: [],
          responsive: {
            mobile: { padding: '10px', columns: 1, maxWidth: '100%' },
            tablet: { padding: '15px', columns: 2, maxWidth: '768px' },
            desktop: { padding: '20px', columns: 1, maxWidth: '1200px' }
          },
          guides: {
            showLimits: true,
            showGrid: false,
            snapToGrid: false
          }
        }
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
          placeholder: '', 
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
          slides: [],
          currentSlide: 0,
          autoplay: false,
          animationSpeed: 3000,
          showDots: false,
          showArrows: false
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
          items: []
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
          items: [],
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
          fields: [],
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
          title: '',
          description: '',
          buttonText: '',
          buttonLink: ''
        }
      };

    case 'chart':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'chart-component' },
        styles: {
          ...baseComponent.styles,
          width: '380px',
          height: '250px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          type: 'bar',
          title: '',
          data: [],
          colors: [],
          showLegend: false,
          showGrid: false
        }
      };

    case 'video':
      return {
        ...baseComponent,
        tag: 'video',
        attributes: { 
          className: 'video-component',
          controls: true,
          preload: 'metadata'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '225px',
          backgroundColor: '#000000',
          borderRadius: '8px',
          objectFit: 'cover'
        },
        componentData: {
          src: '',
          poster: '',
          autoplay: false,
          loop: false,
          muted: false
        }
      };

    case 'audio':
      return {
        ...baseComponent,
        tag: 'audio',
        attributes: { 
          className: 'audio-component',
          controls: true,
          preload: 'metadata'
        },
        styles: {
          ...baseComponent.styles,
          width: '350px',
          height: '54px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px'
        },
        componentData: {
          src: '',
          title: '',
          autoplay: false,
          loop: false,
          volume: 1.0
        }
      };

    case 'table':
      return {
        ...baseComponent,
        tag: 'table',
        attributes: { className: 'table-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '250px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          borderCollapse: 'collapse'
        },
        componentData: {
          headers: [],
          rows: [],
          striped: false,
          bordered: false,
          hoverable: false
        }
      };

    case 'modal':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'modal-trigger' },
        styles: {
          ...baseComponent.styles,
          width: '150px',
          height: '40px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          triggerText: '',
          title: '',
          content: '',
          size: 'medium',
          backdrop: true
        }
      };

    case 'dropdown':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'dropdown-component' },
        styles: {
          ...baseComponent.styles,
          width: '200px',
          height: '40px',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          position: 'relative',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          label: '',
          options: [],
          placeholder: '',
          multiple: false
        }
      };

    case 'badge':
      return {
        ...baseComponent,
        tag: 'span',
        attributes: { className: 'badge-component' },
        styles: {
          ...baseComponent.styles,
          width: 'auto',
          height: '24px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '500',
          padding: '4px 8px',
          borderRadius: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          text: '',
          variant: 'primary',
          size: 'medium'
        }
      };

    case 'alert':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'alert-component' },
        styles: {
          ...baseComponent.styles,
          width: '350px',
          height: '80px',
          backgroundColor: '#dbeafe',
          border: '1px solid #93c5fd',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          type: 'info',
          title: '',
          message: '',
          dismissible: true,
          icon: true
        }
      };

    case 'progress':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'progress-component' },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative'
        },
        componentData: {
          value: 65,
          max: 100,
          color: '#3b82f6',
          showLabel: true,
          animated: false
        }
      };

    case 'slider':
      return {
        ...baseComponent,
        tag: 'input',
        attributes: { 
          className: 'slider-component',
          type: 'range'
        },
        styles: {
          ...baseComponent.styles,
          width: '250px',
          height: '20px',
          backgroundColor: 'transparent',
          appearance: 'none',
          borderRadius: '10px'
        },
        componentData: {
          min: 0,
          max: 100,
          value: 50,
          step: 1,
          color: '#3b82f6'
        }
      };

    case 'toggle':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'toggle-component' },
        styles: {
          ...baseComponent.styles,
          width: '50px',
          height: '28px',
          backgroundColor: '#d1d5db',
          borderRadius: '14px',
          position: 'relative',
          cursor: 'pointer'
        },
        componentData: {
          checked: false,
          label: '',
          size: 'medium',
          color: '#3b82f6'
        }
      };

    case 'tooltip':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'tooltip-trigger' },
        styles: {
          ...baseComponent.styles,
          width: '100px',
          height: '30px',
          backgroundColor: '#6b7280',
          color: '#ffffff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          text: '',
          tooltip: '',
          position: 'top',
          delay: 0
        }
      };

    case 'rating':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'rating-component' },
        styles: {
          ...baseComponent.styles,
          width: '150px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '20px'
        },
        componentData: {
          rating: 4,
          maxRating: 5,
          allowHalfRating: true,
          readonly: false,
          icon: '★'
        }
      };

    case 'calendar':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'calendar-component' },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '250px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          selectedDate: new Date().toISOString().split('T')[0],
          minDate: '',
          maxDate: '',
          locale: 'fr',
          showWeekNumbers: false
        }
      };

    case 'stepper':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'stepper-component' },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '80px',
          backgroundColor: '#ffffff',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          steps: [],
          currentStep: 0,
          orientation: 'horizontal',
          showNumbers: false
        }
      };

    case 'hero':
      return {
        ...baseComponent,
        tag: 'section',
        attributes: { className: 'hero-section' },
        styles: {
          ...baseComponent.styles,
          width: '600px',
          height: '400px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          title: '',
          subtitle: '',
          backgroundImage: '',
          ctaText: '',
          ctaLink: '',
          overlay: true
        }
      };

    case 'banner':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'banner-component' },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '100px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          message: '',
          type: 'warning',
          dismissible: true,
          icon: true,
          actionText: '',
          actionLink: ''
        }
      };

    case 'header':
      return {
        ...baseComponent,
        tag: 'header',
        attributes: { className: 'header-component' },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '80px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          logo: '',
          navigation: [],
          showSearch: false,
          sticky: false
        }
      };

    case 'footer':
      return {
        ...baseComponent,
        tag: 'footer',
        attributes: { className: 'footer-component' },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '120px',
          backgroundColor: '#374151',
          color: '#ffffff',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          companyName: '',
          description: '',
          links: [],
          copyright: ''
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
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          title: '',
          items: [],
          collapsible: true,
          position: 'left'
        }
      };

    case 'navbar':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'navbar-component' },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '60px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          brand: '',
          items: [],
          alignment: 'left',
          style: 'horizontal'
        }
      };

    case 'grid':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { 
          className: 'grid-container',
          'data-grid': 'true'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '300px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          // DONNÉES MÉTIER SPÉCIFIQUES AU GRID (Architecture unifiée)
          gridItems: [],              // Collection d'éléments - démarre vide
          columns: 2,                 // Configuration structure
          gap: '16px',               // Paramètre technique
          alignment: 'center',        // Options d'affichage
          itemBackground: '#f3f4f6'   // Personnalisation visuelle
        }
      };

    // COMPOSANTS SIMPLES RESTANTS
    case 'divider':
      return {
        ...baseComponent,
        tag: 'div',
        content: '',
        attributes: { className: 'divider-component' },
        styles: {
          ...baseComponent.styles,
          width: '100%',
          height: '2px',
          backgroundColor: 'transparent',
          border: 'none',
          margin: '20px 0',
          left: '0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          preset: 'minimal',
          style: 'solid',
          thickness: '2px',
          color: '#e5e7eb',
          width: '100%',
          alignment: 'center',
          orientation: 'horizontal',
          spacing: {
            top: '20px',
            bottom: '20px'
          },
          withText: false,
          text: '',
          textStyle: {
            fontSize: '14px',
            color: '#6b7280',
            backgroundColor: '#ffffff',
            padding: '0 12px'
          },
          decorative: {
            pattern: 'none',
            dotCount: 3,
            waveAmplitude: '5px'
          },
          effects: {
            shadow: false,
            glow: false,
            gradient: null,
            animation: 'none'
          },
          responsive: {
            mobile: { width: '90%', thickness: '1px' },
            tablet: { width: '95%', thickness: '2px' },
            desktop: { width: '100%', thickness: '2px' }
          }
        }
      };

    case 'spacer':
      return {
        ...baseComponent,
        tag: 'div',
        content: '',
        attributes: { className: 'spacer-component' },
        styles: {
          ...baseComponent.styles,
          width: '100%',
          height: '20px',
          backgroundColor: 'transparent',
          border: 'none',
          position: 'relative',
          display: 'block',
          flexShrink: '0',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        componentData: {
          preset: 'small',
          type: 'vertical',
          size: {
            height: '20px',
            width: '100%'
          },
          visibility: {
            showInEditor: true,
            showInExport: false,
            showGuides: true
          },
          responsive: {
            mobile: { height: '15px' },
            tablet: { height: '20px' },
            desktop: { height: '20px' }
          },
          advanced: {
            flexGrow: false,
            flexShrink: true,
            minHeight: '5px',
            maxHeight: '500px'
          },
          styling: {
            editorBorder: '1px dashed #cbd5e1',
            editorBackground: '#f8fafc',
            exportDisplay: 'block'
          }
        }
      };

    case 'link':
      return {
        ...baseComponent,
        tag: 'a',
        content: '',
        attributes: { 
          href: '',
          className: 'link-component',
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        styles: {
          ...baseComponent.styles,
          color: '#3b82f6',
          textDecoration: 'underline',
          fontSize: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          width: '180px',
          height: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          borderRadius: '4px',
          padding: '4px'
        },
        componentData: {
          preset: 'external',
          linkType: 'url',
          href: '',
          text: '',
          target: '_blank',
          rel: 'noopener noreferrer',
          styling: {
            variant: 'link',
            size: 'medium',
            color: '#3b82f6',
            hoverColor: '#2563eb',
            visitedColor: '#7c3aed',
            activeColor: '#1d4ed8',
            decoration: 'underline',
            weight: 'normal'
          },
          icon: {
            show: false,
            position: 'left',
            type: 'external',
            size: '16px',
            color: 'inherit'
          },
          validation: {
            autoValidate: true,
            showStatus: true,
            requireHttps: false
          },
          analytics: {
            trackClicks: false,
            utmSource: '',
            utmMedium: '',
            utmCampaign: '',
            utmContent: ''
          },
          accessibility: {
            ariaLabel: '',
            title: '',
            downloadFileName: ''
          },
          responsive: {
            mobile: { fontSize: '14px' },
            tablet: { fontSize: '16px' },
            desktop: { fontSize: '16px' }
          }
        }
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
        content: ''
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
          items: []
        }
      };

    case 'gallery':
      return {
        ...baseComponent,
        tag: 'div',
        content: '',
        attributes: { className: 'gallery' },
        componentData: {
          images: []
        },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '200px',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        },
      };

    case 'code':
      return {
        ...baseComponent,
        tag: 'div',
        content: '',
        attributes: { className: 'code-component' },
        componentData: {
          content: '',
          language: 'javascript'
        },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '200px',
          backgroundColor: '#1f2937',
          color: '#e5e7eb',
          fontFamily: 'Monaco, "Lucida Console", monospace',
          fontSize: '13px',
          padding: '16px',
          border: '1px solid #374151',
          borderRadius: '6px'
        },
      };

    case 'menu':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'menu-component' },
        componentData: {
          items: [],
          orientation: 'horizontal',
          style: 'default'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '60px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'pricing':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'pricing-component' },
        componentData: {
          plans: [],
          featured: 0,
          currency: 'EUR'
        },
        styles: {
          ...baseComponent.styles,
          width: '600px',
          height: '400px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'testimonial':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'testimonial-component' },
        componentData: {
          quote: '',
          author: '',
          role: '',
          company: '',
          avatar: ''
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'team':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'team-component' },
        componentData: {
          members: [],
          layout: 'grid'
        },
        styles: {
          ...baseComponent.styles,
          width: '600px',
          height: '400px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'stats':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'stats-component' },
        componentData: {
          items: [],
          layout: 'horizontal'
        },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '150px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'breadcrumb':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'breadcrumb-component' },
        componentData: {
          items: [],
          separator: '/'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '40px',
          backgroundColor: 'transparent',
          padding: '8px 0',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'pagination':
      return {
        ...baseComponent,
        tag: 'nav',
        attributes: { className: 'pagination-component' },
        componentData: {
          currentPage: 0,
          totalPages: 0,
          showNumbers: false
        },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '50px',
          backgroundColor: 'transparent',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'tabs':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'tabs-component' },
        componentData: {
          tabs: [],
          activeTab: 0
        },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '300px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'contact':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'contact-component' },
        componentData: {
          title: '',
          items: []
        },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'map':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'map-component' },
        componentData: {
          address: '',
          zoom: 0,
          type: 'roadmap'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '300px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        },
      };

    case 'faq':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'faq-component' },
        componentData: {
          items: []
        },
        styles: {
          ...baseComponent.styles,
          width: '500px',
          height: '400px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'blog':
      return {
        ...baseComponent,
        tag: 'article',
        attributes: { className: 'blog-component' },
        componentData: {
          title: '',
          excerpt: '',
          author: '',
          date: '',
          image: ''
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '300px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'product':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'product-component' },
        componentData: {
          name: '',
          price: '',
          image: '',
          description: '',
          rating: 0
        },
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '400px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'cart':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'cart-component' },
        componentData: {
          items: [],
          total: 0,
          currency: 'EUR'
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '300px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'filters':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'filters-component' },
        componentData: {
          filters: [],
          layout: 'vertical'
        },
        styles: {
          ...baseComponent.styles,
          width: '250px',
          height: '400px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    case 'section':
      return {
        ...baseComponent,
        tag: 'section',
        content: '',
        attributes: { className: 'section-component' },
        styles: {
          ...baseComponent.styles,
          width: '600px',
          height: '200px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        },
      };

    default:
      // ❌ ERREUR : Composant non supporté dans createComponent
      console.error(`🚨 EDITOR-UTILS: Composant '${type}' non supporté dans createComponent !`);
      return {
        ...baseComponent,
        tag: 'div',
        content: `❌ COMPOSANT NON SUPPORTÉ: ${type}`,
        attributes: { className: 'unsupported-component' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#fef2f2',
          border: '2px solid #f87171',
          color: '#dc2626',
          padding: '20px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
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