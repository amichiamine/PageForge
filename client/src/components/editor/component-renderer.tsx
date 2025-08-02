import React, { useRef, useEffect, useState } from 'react';
import type { ComponentDefinition } from '@shared/schema';

interface ComponentRendererProps {
  component: ComponentDefinition;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ComponentRenderer({ component, isSelected, onClick }: ComponentRendererProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 100 });
  
  const styles = component.styles || {};
  const attributes = component.attributes || {};
  const { className, ...otherAttributes } = attributes;

  // Observer pour détecter les changements de taille en temps réel
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width: Math.max(width, 50), height: Math.max(height, 30) });
      }
    });

    resizeObserver.observe(containerRef.current);
    
    // Initialiser les dimensions
    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ 
      width: Math.max(rect.width || parseInt(styles.width || '200px'), 50), 
      height: Math.max(rect.height || parseInt(styles.height || '100px'), 30) 
    });

    return () => resizeObserver.disconnect();
  }, [styles.width, styles.height]);
  
  // Dimensions adaptatives basées sur l'observation en temps réel
  const containerWidth = dimensions.width;
  const containerHeight = dimensions.height;
  
  // Convertir les styles CSS en objet React avec adaptation automatique du contenu
  const inlineStyles: React.CSSProperties = {
    position: styles.position as any || 'absolute',
    left: styles.left || '50px',
    top: styles.top || '50px',
    width: styles.width || '200px',
    height: styles.height || '100px',
    backgroundColor: styles.backgroundColor || 'transparent',
    color: styles.color || '#000000',
    fontSize: styles.fontSize || '16px',
    fontFamily: styles.fontFamily || 'Arial, sans-serif',
    padding: '0',
    margin: '0',
    border: styles.border || 'none',
    borderRadius: styles.borderRadius || '0px',
    zIndex: parseInt(styles.zIndex || '1000'),
    display: styles.display || 'block',
    alignItems: styles.alignItems as any,
    justifyContent: styles.justifyContent as any,
    flexDirection: styles.flexDirection as any,
    textAlign: styles.textAlign as any,
    fontWeight: styles.fontWeight as any,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    whiteSpace: styles.whiteSpace as any,
    wordBreak: styles.wordBreak as any,
    objectFit: styles.objectFit as any,
    overflow: 'hidden', // Forcer le masquage du débordement
    boxShadow: styles.boxShadow,
    transition: 'all 0.2s ease-in-out', // Animation fluide lors du redimensionnement
    cursor: styles.cursor,
    userSelect: styles.userSelect as any,
    outline: isSelected ? '2px solid #3b82f6' : styles.outline,
    minHeight: styles.minHeight,
    maxWidth: styles.maxWidth,
    gridTemplateColumns: styles.gridTemplateColumns,
    gap: styles.gap,
    boxSizing: 'border-box' as any
  };

  // Fonction avancée pour adaptation responsive du contenu
  const getResponsiveContentStyles = (config: {
    baseSize?: number;
    minSize?: number;
    maxSize?: number;
    scaleFactor?: number;
    multiline?: boolean;
    padding?: boolean;
  } = {}): React.CSSProperties => {
    const {
      baseSize = 16,
      minSize = 8,
      maxSize = 48,
      scaleFactor = 1,
      multiline = false,
      padding = false
    } = config;

    // Calcul responsive basé sur les dimensions réelles
    const widthRatio = containerWidth / 200;
    const heightRatio = containerHeight / 100;
    const adaptiveScale = Math.sqrt(widthRatio * heightRatio) * scaleFactor;
    
    const adaptedSize = Math.min(Math.max(baseSize * adaptiveScale, minSize), maxSize);
    const adaptedPadding = padding ? Math.max(containerWidth / 50, 4) : 0;
    const adaptedLineHeight = multiline ? 1.4 : 1.2;

    return {
      fontSize: `${adaptedSize}px`,
      lineHeight: adaptedLineHeight,
      padding: padding ? `${adaptedPadding}px` : '0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: multiline ? 'normal' : 'nowrap',
      ...(multiline && {
        display: '-webkit-box',
        WebkitLineClamp: Math.max(Math.floor(containerHeight / (adaptedSize * adaptedLineHeight)) - 1, 1),
        WebkitBoxOrient: 'vertical' as any
      })
    };
  };

  // Fonction pour calculer les espacements adaptatifs
  const getResponsiveSpacing = (baseSpacing: number = 16): number => {
    const scaleFactor = Math.min(containerWidth / 200, containerHeight / 100, 1.5);
    return Math.max(baseSpacing * scaleFactor, 4);
  };

  // Fonction pour calculer les tailles d'éléments adaptatifs
  const getResponsiveSize = (baseSize: number, isWidth: boolean = true): number => {
    const dimension = isWidth ? containerWidth : containerHeight;
    const ratio = dimension / (isWidth ? 200 : 100);
    return Math.max(baseSize * ratio, isWidth ? 20 : 15);
  };

  // Filtrer les valeurs undefined pour éviter les warnings React
  Object.keys(inlineStyles).forEach(key => {
    if (inlineStyles[key as keyof React.CSSProperties] === undefined) {
      delete inlineStyles[key as keyof React.CSSProperties];
    }
  });

  const Tag = component.tag || 'div';
  const content = component.content || '';

  // Rendu des enfants récursivement
  const renderChildren = () => {
    if (!component.children || component.children.length === 0) return null;
    return component.children.map(child => (
      <ComponentRenderer key={child.id} component={child} />
    ));
  };

  // Cas spéciaux pour certains types de composants avec adaptation responsive complète
  switch (component.type) {
    case 'image':
      const imageContentStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 24 });
      if (attributes.src) {
        return (
          <img
            ref={containerRef as React.RefObject<HTMLImageElement>}
            src={attributes.src as string}
            alt={attributes.alt as string || ''}
            className={className as string}
            style={{
              ...inlineStyles,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              overflow: 'hidden'
            }}
            onClick={onClick}
            {...otherAttributes}
          />
        );
      }
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={className as string}
          style={{
            ...inlineStyles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            border: '2px dashed #d1d5db',
            color: '#6b7280',
            overflow: 'hidden',
            ...imageContentStyles
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          Image
        </div>
      );

    case 'carousel':
      const carouselTextStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 10, maxSize: 32, scaleFactor: 1.2 });
      const dotSize = getResponsiveSize(8, false);
      const bottomSpacing = getResponsiveSpacing(12);
      const dotGap = getResponsiveSpacing(6);
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`carousel-container ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div className="carousel-track" style={{ 
            display: 'flex', 
            width: '300%', 
            height: '100%', 
            transition: 'transform 0.3s ease-in-out' 
          }}>
            <div className="carousel-slide" style={{ 
              width: '33.333%', 
              height: '100%', 
              backgroundColor: '#3b82f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: 'bold',
              overflow: 'hidden',
              ...carouselTextStyles
            }}>
              Slide 1
            </div>
            <div className="carousel-slide" style={{ 
              width: '33.333%', 
              height: '100%', 
              backgroundColor: '#10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: 'bold',
              overflow: 'hidden',
              ...carouselTextStyles
            }}>
              Slide 2
            </div>
            <div className="carousel-slide" style={{ 
              width: '33.333%', 
              height: '100%', 
              backgroundColor: '#f59e0b', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: 'bold',
              overflow: 'hidden',
              ...carouselTextStyles
            }}>
              Slide 3
            </div>
          </div>
          <div style={{ 
            position: 'absolute', 
            bottom: `${bottomSpacing}px`, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            display: 'flex', 
            gap: `${dotGap}px` 
          }}>
            <div style={{ 
              width: `${dotSize}px`, 
              height: `${dotSize}px`, 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              opacity: 0.8 
            }}></div>
            <div style={{ 
              width: `${dotSize}px`, 
              height: `${dotSize}px`, 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              opacity: 0.5 
            }}></div>
            <div style={{ 
              width: `${dotSize}px`, 
              height: `${dotSize}px`, 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              opacity: 0.5 
            }}></div>
          </div>
        </div>
      );

    case 'pricing':
      const pricingTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 28, scaleFactor: 1.1 });
      const pricingPriceStyles = getResponsiveContentStyles({ baseSize: 24, minSize: 16, maxSize: 40, scaleFactor: 1.3 });
      const pricingTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 9, maxSize: 18 });
      const pricingButtonStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const pricingPadding = getResponsiveSpacing(16);
      const pricingSpacing = getResponsiveSpacing(10);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`pricing-card ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            textAlign: 'center', 
            padding: `${pricingPadding}px`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <h3 style={{ 
              ...pricingTitleStyles,
              fontWeight: 'bold', 
              marginBottom: `${pricingSpacing}px`, 
              color: '#1f2937',
              margin: `0 0 ${pricingSpacing}px 0`
            }}>Plan Standard</h3>
            <div style={{ 
              ...pricingPriceStyles,
              fontWeight: 'bold', 
              color: '#3b82f6', 
              marginBottom: `${pricingSpacing}px`
            }}>
              29€<span style={{ 
                fontSize: `${parseInt(pricingPriceStyles.fontSize as string) * 0.6}px`, 
                color: '#6b7280' 
              }}>/mois</span>
            </div>
            <ul style={{ 
              listStyle: 'none', 
              padding: '0', 
              margin: '0', 
              color: '#4b5563',
              flex: 1,
              overflow: 'hidden'
            }}>
              <li style={{ 
                ...pricingTextStyles,
                padding: `${pricingSpacing / 2}px 0`
              }}>✓ 10 projets inclus</li>
              <li style={{ 
                ...pricingTextStyles,
                padding: `${pricingSpacing / 2}px 0`
              }}>✓ Support prioritaire</li>
              <li style={{ 
                ...pricingTextStyles,
                padding: `${pricingSpacing / 2}px 0`
              }}>✓ Analytics avancées</li>
            </ul>
            <button style={{ 
              ...pricingButtonStyles,
              marginTop: `${pricingSpacing}px`, 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              padding: `${pricingSpacing / 2}px ${pricingSpacing}px`, 
              cursor: 'pointer'
            }}>
              Choisir ce plan
            </button>
          </div>
        </div>
      );

    case 'testimonial':
      const testQuoteStyles = getResponsiveContentStyles({ baseSize: 24, minSize: 16, maxSize: 48, scaleFactor: 1.4 });
      const testTextStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 10, maxSize: 24, multiline: true });
      const testNameStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 9, maxSize: 20 });
      const testTitleStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const testPadding = getResponsiveSpacing(16);
      const testSpacing = getResponsiveSpacing(10);
      const testAvatarSize = getResponsiveSize(40, false);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`testimonial ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${testPadding}px`, 
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ 
              ...testQuoteStyles,
              color: '#d1d5db', 
              marginBottom: `${testSpacing}px`,
              whiteSpace: 'nowrap'
            }}>"</div>
            <p style={{ 
              ...testTextStyles,
              color: '#4b5563', 
              marginBottom: `${testSpacing}px`, 
              fontStyle: 'italic',
              flex: 1
            }}>
              Ce service a transformé notre façon de travailler. Vraiment exceptionnel !
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: `${testSpacing / 2}px`,
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${testAvatarSize}px`, 
                height: `${testAvatarSize}px`, 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb',
                flexShrink: 0
              }}></div>
              <div style={{ 
                overflow: 'hidden',
                minWidth: 0
              }}>
                <div style={{ 
                  ...testNameStyles,
                  fontWeight: 'bold', 
                  color: '#1f2937'
                }}>Marie Dubois</div>
                <div style={{ 
                  ...testTitleStyles,
                  color: '#6b7280'
                }}>Directrice Marketing</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'team':
      const teamAvatarSize = getResponsiveSize(80, false);
      const teamNameStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 26 });
      const teamRoleStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 20 });
      const teamDescStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 18, multiline: true });
      const teamIconStyles = getResponsiveContentStyles({ baseSize: teamAvatarSize / 3, minSize: 16, maxSize: 32 });
      const teamPadding = getResponsiveSpacing(16);
      const teamSpacing = getResponsiveSpacing(12);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`team-member ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            textAlign: 'center', 
            padding: `${teamPadding}px`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${teamAvatarSize}px`, 
              height: `${teamAvatarSize}px`, 
              borderRadius: '50%', 
              backgroundColor: '#e5e7eb', 
              margin: `0 auto ${teamSpacing}px`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#9ca3af',
              flexShrink: 0,
              ...teamIconStyles
            }}>
              👤
            </div>
            <h3 style={{ 
              ...teamNameStyles,
              fontWeight: 'bold', 
              marginBottom: `${teamSpacing / 2}px`, 
              color: '#1f2937',
              margin: `0 0 ${teamSpacing / 2}px 0`
            }}>Jean Martin</h3>
            <p style={{ 
              ...teamRoleStyles,
              color: '#3b82f6', 
              marginBottom: `${teamSpacing}px`
            }}>Développeur Senior</p>
            <p style={{ 
              ...teamDescStyles,
              color: '#6b7280',
              flex: 1
            }}>
              Expert en développement web avec 8 ans d'expérience en React et Node.js.
            </p>
          </div>
        </div>
      );

    case 'stats':
      const statsIconStyles = getResponsiveContentStyles({ baseSize: 32, minSize: 20, maxSize: 64, scaleFactor: 1.5 });
      const statsNumberStyles = getResponsiveContentStyles({ baseSize: 28, minSize: 16, maxSize: 48, scaleFactor: 1.3 });
      const statsLabelStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 22 });
      const statsPadding = getResponsiveSpacing(16);
      const statsSpacing = getResponsiveSpacing(10);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`stats-card ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            textAlign: 'center', 
            padding: `${statsPadding}px`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ 
              ...statsIconStyles,
              marginBottom: `${statsSpacing}px`,
              whiteSpace: 'nowrap'
            }}>📊</div>
            <div style={{ 
              ...statsNumberStyles,
              fontWeight: 'bold', 
              color: '#3b82f6', 
              marginBottom: `${statsSpacing / 2}px`
            }}>1,247</div>
            <div style={{ 
              ...statsLabelStyles,
              color: '#6b7280'
            }}>Projets créés</div>
          </div>
        </div>
      );

    case 'faq':
      const faqTitleStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 11, maxSize: 24 });
      const faqTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 9, maxSize: 18, multiline: true });
      const faqIconStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 28 });
      const faqPadding = getResponsiveSpacing(12);
      const faqSpacing = getResponsiveSpacing(8);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`faq-item ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${faqPadding}px`, 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: `${faqSpacing}px`,
              overflow: 'hidden'
            }}>
              <h4 style={{ 
                ...faqTitleStyles,
                fontWeight: '600', 
                color: '#1f2937',
                flex: 1,
                margin: 0
              }}>Comment ça fonctionne ?</h4>
              <span style={{ 
                ...faqIconStyles,
                color: '#6b7280',
                flexShrink: 0,
                marginLeft: '8px',
                whiteSpace: 'nowrap'
              }}>+</span>
            </div>
            <p style={{ 
              ...faqTextStyles,
              color: '#6b7280',
              flex: 1,
              margin: 0
            }}>
              Notre plateforme vous permet de créer des sites web professionnels en quelques clics grâce à notre éditeur visuel intuitif.
            </p>
          </div>
        </div>
      );

    case 'weather':
      const weatherIconStyles = getResponsiveContentStyles({ baseSize: 36, minSize: 24, maxSize: 72, scaleFactor: 1.8 });
      const weatherTempStyles = getResponsiveContentStyles({ baseSize: 24, minSize: 16, maxSize: 40, scaleFactor: 1.4 });
      const weatherCityStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 20 });
      const weatherDescStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 18 });
      const weatherPadding = getResponsiveSpacing(16);
      const weatherSpacing = getResponsiveSpacing(10);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`weather-widget ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${weatherPadding}px`, 
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ 
              ...weatherIconStyles,
              marginBottom: `${weatherSpacing}px`,
              whiteSpace: 'nowrap'
            }}>☀️</div>
            <div style={{ 
              ...weatherTempStyles,
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: `${weatherSpacing / 2}px`
            }}>22°C</div>
            <div style={{ 
              ...weatherCityStyles,
              color: '#6b7280', 
              marginBottom: `${weatherSpacing}px`
            }}>Paris, France</div>
            <div style={{ 
              ...weatherDescStyles,
              color: '#9ca3af'
            }}>Ensoleillé</div>
          </div>
        </div>
      );

    case 'gallery':
      const galleryTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 28 });
      const galleryIconStyles = getResponsiveContentStyles({ baseSize: 20, minSize: 16, maxSize: 32, scaleFactor: 1.2 });
      const gallerySpacing = getResponsiveSpacing(8);
      const galleryGap = getResponsiveSpacing(6);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`gallery-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <h3 style={{ 
            ...galleryTitleStyles,
            fontWeight: '600', 
            marginBottom: `${gallerySpacing}px`, 
            color: '#1f2937', 
            textAlign: 'center',
            margin: `0 0 ${gallerySpacing}px 0`
          }}>Galerie Photos</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: `${galleryGap}px`, 
            height: `calc(100% - ${parseInt(galleryTitleStyles.fontSize as string)}px - ${gallerySpacing}px)`,
            overflow: 'hidden'
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ 
                backgroundColor: '#f3f4f6', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden',
                ...galleryIconStyles
              }}>🖼️</div>
            ))}
          </div>
        </div>
      );

    case 'chart':
      const chartTitleStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 11, maxSize: 24 });
      const chartLabelStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 18 });
      const chartPadding = getResponsiveSpacing(12);
      const chartSpacing = getResponsiveSpacing(8);
      const chartBarWidth = getResponsiveSize(16, true);
      const chartGap = getResponsiveSpacing(4);
      const titleHeight = parseInt(chartTitleStyles.fontSize as string);
      const labelHeight = parseInt(chartLabelStyles.fontSize as string);
      const chartBarAreaHeight = Math.max(containerHeight - titleHeight - labelHeight - chartPadding * 2 - chartSpacing * 2, 60);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`chart-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${chartPadding}px`,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <h3 style={{ 
              ...chartTitleStyles,
              fontWeight: '600', 
              marginBottom: `${chartSpacing}px`, 
              color: '#1f2937',
              margin: `0 0 ${chartSpacing}px 0`
            }}>Ventes mensuelles</h3>
            <div style={{ 
              display: 'flex', 
              alignItems: 'end', 
              justifyContent: 'space-between', 
              height: `${chartBarAreaHeight}px`, 
              gap: `${chartGap}px`,
              flex: 1,
              overflow: 'hidden'
            }}>
              {[
                { color: '#3b82f6', height: 0.5 },
                { color: '#10b981', height: 0.67 },
                { color: '#f59e0b', height: 0.83 },
                { color: '#ef4444', height: 0.58 },
                { color: '#8b5cf6', height: 0.75 }
              ].map((bar, i) => (
                <div key={i} style={{ 
                  backgroundColor: bar.color, 
                  width: `${chartBarWidth}px`, 
                  height: `${Math.max(chartBarAreaHeight * bar.height, 20)}px`, 
                  borderRadius: '2px',
                  flexShrink: 0
                }}></div>
              ))}
            </div>
            <div style={{ 
              ...chartLabelStyles,
              marginTop: `${chartSpacing}px`, 
              color: '#6b7280', 
              textAlign: 'center'
            }}>Jan - Mai 2024</div>
          </div>
        </div>
      );

    case 'video':
      const videoPlayStyles = getResponsiveContentStyles({ baseSize: 48, minSize: 24, maxSize: 80, scaleFactor: 2 });
      const videoTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 22 });
      const videoSpacing = getResponsiveSpacing(8);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`video-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#000', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <div style={{ 
                ...videoPlayStyles,
                marginBottom: `${videoSpacing}px`,
                whiteSpace: 'nowrap'
              }}>▶️</div>
              <div style={{ 
                ...videoTextStyles
              }}>Vidéo de démonstration</div>
            </div>
          </div>
        </div>
      );

    case 'audio':
      const audioIconStyles = getResponsiveContentStyles({ baseSize: 24, minSize: 16, maxSize: 40, scaleFactor: 1.5 });
      const audioTitleStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 20 });
      const audioSubtitleStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const audioPadding = getResponsiveSpacing(12);
      const audioGap = getResponsiveSpacing(8);
      const audioButtonSize = getResponsiveSize(32, false);
      const audioButtonIconStyles = getResponsiveContentStyles({ baseSize: audioButtonSize / 3, minSize: 8, maxSize: 16 });
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`audio-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: `${audioGap}px`, 
            backgroundColor: '#f8fafc', 
            padding: `${audioPadding}px`, 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            height: '100%',
            overflow: 'hidden'
          }}>
            <div style={{ 
              ...audioIconStyles,
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}>🎵</div>
            <div style={{ 
              flex: 1,
              overflow: 'hidden',
              minWidth: 0
            }}>
              <div style={{ 
                ...audioTitleStyles,
                fontWeight: '600', 
                color: '#1e293b'
              }}>Musique d'ambiance</div>
              <div style={{ 
                ...audioSubtitleStyles,
                color: '#64748b', 
                marginTop: `${audioPadding / 6}px`
              }}>3:45 / 5:20</div>
            </div>
            <button style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: `${audioButtonSize}px`, 
              height: `${audioButtonSize}px`, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              ...audioButtonIconStyles
            }}>
              ▶️
            </button>
          </div>
        </div>
      );

    case 'icon':
      const iconSize = Math.max(Math.min(containerWidth, containerHeight) / 3, 16);
      return (
        <div
          className={`icon-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '100%', 
            height: '100%',
            overflow: 'hidden'
          }}>
            <span style={{ fontSize: `${iconSize}px` }}>{content || '⭐'}</span>
          </div>
        </div>
      );

    case 'link':
      const linkTextStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 10, maxSize: 24 });
      const linkPadding = getResponsiveSpacing(8);
      
      return (
        <a
          ref={containerRef as React.RefObject<HTMLAnchorElement>}
          href="#"
          className={`link-component ${className || ''}`}
          style={{ 
            ...inlineStyles, 
            textDecoration: 'underline', 
            color: '#3b82f6', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: `${linkPadding}px`,
            overflow: 'hidden',
            ...linkTextStyles
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Lien vers la page'}
        </a>
      );

    case 'modal':
      const modalIconStyles = getResponsiveContentStyles({ baseSize: 28, minSize: 16, maxSize: 48, scaleFactor: 1.6 });
      const modalTextStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 10, maxSize: 24 });
      const modalButtonStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 8, maxSize: 20 });
      const modalPadding = getResponsiveSpacing(16);
      const modalSpacing = getResponsiveSpacing(10);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`modal-preview ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            border: '2px dashed #d1d5db', 
            padding: `${modalPadding}px`, 
            textAlign: 'center', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div style={{ 
              ...modalIconStyles,
              marginBottom: `${modalSpacing}px`,
              whiteSpace: 'nowrap'
            }}>🪟</div>
            <div style={{ 
              ...modalTextStyles,
              color: '#6b7280',
              marginBottom: `${modalSpacing}px`
            }}>Modal Dialog</div>
            <button style={{ 
              ...modalButtonStyles,
              padding: `${modalSpacing / 2}px ${modalSpacing}px`, 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}>
              Ouvrir
            </button>
          </div>
        </div>
      );

    case 'dropdown':
      const dropdownTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 20 });
      const dropdownIconStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const dropdownPadding = getResponsiveSpacing(10);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`dropdown-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            border: '1px solid #d1d5db', 
            borderRadius: '6px', 
            padding: `${dropdownPadding}px ${dropdownPadding * 1.5}px`, 
            backgroundColor: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            height: '100%',
            overflow: 'hidden'
          }}>
            <span style={{ 
              ...dropdownTextStyles,
              flex: 1
            }}>Sélectionner une option</span>
            <span style={{ 
              ...dropdownIconStyles,
              color: '#6b7280',
              flexShrink: 0,
              marginLeft: '8px',
              whiteSpace: 'nowrap'
            }}>▼</span>
          </div>
        </div>
      );

    case 'accordion':
      const accordionTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 9, maxSize: 20 });
      const accordionIconStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 12, maxSize: 24 });
      const accordionPadding = getResponsiveSpacing(10);
      const accordionItemHeight = getResponsiveSize(40, false);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`accordion-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            overflow: 'hidden',
            height: '100%'
          }}>
            {['Section 1', 'Section 2', 'Section 3'].map((title, index) => (
              <div key={index} style={{ 
                padding: `${accordionPadding}px ${accordionPadding * 1.3}px`, 
                backgroundColor: '#f9fafb', 
                borderBottom: index < 2 ? '1px solid #e5e7eb' : 'none',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                height: `${accordionItemHeight}px`,
                overflow: 'hidden'
              }}>
                <span style={{ 
                  ...accordionTextStyles,
                  fontWeight: '500',
                  flex: 1
                }}>{title}</span>
                <span style={{ 
                  ...accordionIconStyles,
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}>+</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'table':
      const tableTextStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 18 });
      const tablePadding = getResponsiveSpacing(6);
      const tableData = [
        ['Jean Dupont', 'jean@example.com', 'Actif'],
        ['Marie Martin', 'marie@example.com', 'Inactif']
      ];
      const tableHeaders = ['Nom', 'Email', 'Statut'];
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`table-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <table style={{ 
            width: '100%', 
            height: '100%',
            borderCollapse: 'collapse',
            overflow: 'hidden',
            ...tableTextStyles
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                {tableHeaders.map((header, index) => (
                  <th key={index} style={{ 
                    padding: `${tablePadding}px`, 
                    border: '1px solid #d1d5db', 
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ 
                      padding: `${tablePadding}px`, 
                      border: '1px solid #d1d5db',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'list':
      const listTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 9, maxSize: 20 });
      const listPadding = getResponsiveSpacing(16);
      const listItemSpacing = getResponsiveSpacing(6);
      const listItems = [
        'Premier élément de la liste',
        'Deuxième élément important', 
        'Troisième point à retenir',
        'Dernier élément conclusif'
      ];
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`list-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <ul style={{ 
            margin: '0', 
            padding: `0 0 0 ${listPadding}px`, 
            color: '#374151',
            height: '100%',
            overflow: 'hidden',
            ...listTextStyles
          }}>
            {listItems.map((item, index) => (
              <li key={index} style={{ 
                marginBottom: index < listItems.length - 1 ? `${listItemSpacing}px` : '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'card':
      const cardTitleSize = Math.max(containerWidth / 15, 12);
      const cardTextSize = Math.max(containerWidth / 22, 10);
      const cardButtonSize = Math.max(containerWidth / 25, 9);
      const cardPadding = Math.max(containerHeight / 15, 10);
      const cardSpacing = Math.max(containerHeight / 25, 6);
      return (
        <div
          className={`card-component ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${cardPadding}px`, 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #e5e7eb',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontSize: `${cardTitleSize}px`, 
              fontWeight: '600', 
              marginBottom: `${cardSpacing}px`, 
              color: '#1f2937',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: `0 0 ${cardSpacing}px 0`
            }}>Titre de la carte</h3>
            <p style={{ 
              fontSize: `${cardTextSize}px`, 
              color: '#6b7280', 
              lineHeight: '1.4', 
              marginBottom: `${cardSpacing}px`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: Math.max(Math.floor((containerHeight - cardTitleSize - cardButtonSize * 2 - cardPadding * 2 - cardSpacing * 3) / (cardTextSize * 1.4)), 1),
              WebkitBoxOrient: 'vertical' as any,
              flex: 1
            }}>
              Description de la carte avec du contenu informatif et pertinent pour l'utilisateur.
            </p>
            <button style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              padding: `${Math.max(cardSpacing / 2, 4)}px ${cardSpacing}px`, 
              fontSize: `${cardButtonSize}px`, 
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: 'auto'
            }}>
              En savoir plus
            </button>
          </div>
        </div>
      );

    // Layout Components
    case 'container':
      return (
        <div
          className={`container ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '20px', border: '2px dashed #d1d5db', borderRadius: '8px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Conteneur - Glissez des composants ici</span>
          </div>
          {renderChildren()}
        </div>
      );

    case 'section':
      return (
        <section
          className={`section ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>Section Titre</h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              Contenu de la section avec du texte descriptif et informatif pour présenter cette partie de la page.
            </p>
          </div>
          {renderChildren()}
        </section>
      );

    case 'header':
      const headerTitleSize = Math.max(containerWidth / 10, 12);
      const headerNavSize = Math.max(containerWidth / 15, 10);
      const headerPadding = Math.max(containerHeight / 8, 8);
      
      return (
        <header
          className={`header ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            width: '100%', 
            height: '100%', 
            padding: `${headerPadding}px`, 
            backgroundColor: '#1f2937', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxSizing: 'border-box',
            margin: '0',
            overflow: 'hidden'
          }}>
            <div style={{ 
              fontSize: `${headerTitleSize}px`, 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%'
            }}>
              Mon Site Web
            </div>
            <nav style={{ 
              display: 'flex', 
              gap: `${Math.max(containerWidth / 20, 8)}px`,
              maxWidth: '40%',
              overflow: 'hidden'
            }}>
              <a href="#" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: `${headerNavSize}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>Accueil</a>
              <a href="#" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: `${headerNavSize}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>À propos</a>
              <a href="#" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                fontSize: `${headerNavSize}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>Contact</a>
            </nav>
          </div>
        </header>
      );

    case 'footer':
      return (
        <footer
          className={`footer ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '24px', backgroundColor: '#374151', color: 'white', textAlign: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Mon Entreprise</div>
              <div style={{ fontSize: '14px', color: '#d1d5db' }}>© 2024 Tous droits réservés</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '14px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Mentions légales</a>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Confidentialité</a>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
        </footer>
      );

    case 'grid':
      return (
        <div
          className={`grid-layout ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px' }}>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Grille 1</span>
            </div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Grille 2</span>
            </div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Grille 3</span>
            </div>
          </div>
        </div>
      );

    case 'flexbox':
      return (
        <div
          className={`flexbox-layout ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', gap: '16px', padding: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, backgroundColor: '#fef3c7', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#92400e' }}>Flex 1</span>
            </div>
            <div style={{ flex: 2, backgroundColor: '#dbeafe', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#1e40af' }}>Flex 2 (plus large)</span>
            </div>
            <div style={{ flex: 1, backgroundColor: '#dcfce7', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#166534' }}>Flex 3</span>
            </div>
          </div>
        </div>
      );

    // Text Components
    case 'heading':
      return (
        <div
          className={`heading ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          {React.createElement(
            component.tag || 'h1',
            {
              style: {
                fontSize: styles.fontSize || '28px',
                fontWeight: styles.fontWeight || 'bold',
                color: styles.color || '#1a202c',
                margin: '0',
                padding: '0',
                lineHeight: '1.2',
                letterSpacing: '-0.025em'
              }
            },
            content || 'Titre principal'
          )}
        </div>
      );

    case 'paragraph':
      const paragraphTextSize = Math.max(containerWidth / 20, 10);
      const paragraphPadding = Math.max(containerHeight / 15, 4);
      return (
        <p
          className={`text-paragraph ${className || ''}`}
          style={{
            ...inlineStyles,
            fontSize: `${paragraphTextSize}px`,
            lineHeight: '1.4',
            color: styles.color || '#4a5568',
            margin: '0',
            padding: `${paragraphPadding}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: Math.max(Math.floor(containerHeight / (paragraphTextSize * 1.4)), 1),
            WebkitBoxOrient: 'vertical' as any,
            wordBreak: 'break-word'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
        </p>
      );

    case 'button':
      const buttonTextSize = Math.max(containerWidth / 18, 10);
      const buttonPadding = Math.max(containerHeight / 12, 6);
      return (
        <button
          className={`btn-primary ${className || ''}`}
          style={{
            ...inlineStyles,
            backgroundColor: styles.backgroundColor || '#3b82f6',
            color: styles.color || '#ffffff',
            border: 'none',
            borderRadius: styles.borderRadius || '8px',
            padding: `${buttonPadding}px ${buttonPadding * 1.5}px`,
            cursor: 'pointer',
            fontSize: `${buttonTextSize}px`,
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            outline: 'none',
            userSelect: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Cliquez ici'}
        </button>
      );

    // Forms Components  
    case 'input':
      return (
        <input
          type={attributes.type as string || 'text'}
          placeholder={attributes.placeholder as string || 'Entrez votre texte...'}
          className={`form-input ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        />
      );

    case 'textarea':
      return (
        <textarea
          placeholder={attributes.placeholder as string || 'Entrez votre message...'}
          className={`form-textarea ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            resize: 'vertical',
            outline: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content}
        </textarea>
      );

    case 'checkbox':
      return (
        <label
          className={`checkbox-label ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" style={{ margin: '0' }} />
            <span style={{ fontSize: '14px' }}>{content || 'Case à cocher'}</span>
          </div>
        </label>
      );

    case 'radio':
      return (
        <div
          className={`radio-group ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="radio" name="radio-group" />
              <span>Option 1</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="radio" name="radio-group" />
              <span>Option 2</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="radio" name="radio-group" />
              <span>Option 3</span>
            </label>
          </div>
        </div>
      );

    case 'select':
      return (
        <select
          className={`form-select ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <option>Sélectionnez une option</option>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      );

    // Navigation & E-commerce Components
    case 'breadcrumb':
      return (
        <nav
          className={`breadcrumb ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <li><a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Accueil</a></li>
            <li style={{ color: '#d1d5db' }}>{'>'}</li>
            <li><a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Catégorie</a></li>
            <li style={{ color: '#d1d5db' }}>{'>'}</li>
            <li style={{ color: '#374151' }}>Page actuelle</li>
          </ol>
        </nav>
      );

    case 'navbar':
      return (
        <nav
          className={`navbar ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Logo</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Accueil</a>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Produits</a>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>À propos</a>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Contact</a>
            </div>
          </div>
        </nav>
      );

    case 'menu':
      return (
        <div
          className={`menu ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', marginBottom: '4px', fontSize: '14px' }}>
              Menu principal
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
              Option 1
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
              Option 2
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
              Option 3
            </div>
          </div>
        </div>
      );

    case 'pagination':
      return (
        <nav
          className={`pagination ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer' }}>
              Précédent
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white' }}>
              1
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}>
              2
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}>
              3
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}>
              Suivant
            </button>
          </div>
        </nav>
      );

    case 'tabs':
      return (
        <div
          className={`tabs ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '0' }}>
              <button style={{ padding: '12px 24px', borderBottom: '2px solid #3b82f6', backgroundColor: 'transparent', border: 'none', color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                Onglet 1
              </button>
              <button style={{ padding: '12px 24px', borderBottom: '2px solid transparent', backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Onglet 2
              </button>
              <button style={{ padding: '12px 24px', borderBottom: '2px solid transparent', backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Onglet 3
              </button>
            </div>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>Contenu de l'onglet actif</p>
          </div>
        </div>
      );

    case 'sidebar':
      return (
        <aside
          className={`sidebar ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '24px', backgroundColor: '#1f2937', color: 'white', height: '100%', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', marginTop: '0' }}>Navigation</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#" style={{ padding: '12px 16px', color: 'white', textDecoration: 'none', borderRadius: '6px', backgroundColor: '#374151', fontSize: '14px' }}>
                🏠 Accueil
              </a>
              <a href="#" style={{ padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                📊 Tableau de bord
              </a>
              <a href="#" style={{ padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                👥 Utilisateurs
              </a>
              <a href="#" style={{ padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>
      );

    // Business & E-commerce
    case 'product':
      return (
        <div
          className={`product-card ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '160px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '48px' }}>📦</span>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Produit Premium</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.4' }}>
                Description détaillée du produit avec ses principales caractéristiques.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>49,99 €</span>
                <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}>
                  Acheter
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'cart':
      return (
        <div
          className={`shopping-cart ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Panier d'achat</h3>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Produit 1 × 2</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>99,98 €</span>
              </div>
            </div>
            <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Produit 2 × 1</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>29,99 €</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Total:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>129,97 €</span>
            </div>
            <button style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Procéder au paiement
            </button>
          </div>
        </div>
      );

    case 'form':
      return (
        <form
          className={`contact-form ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Formulaire de contact</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Nom complet</label>
              <input type="text" placeholder="Votre nom..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email</label>
              <input type="email" placeholder="votre@email.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Message</label>
              <textarea placeholder="Votre message..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical', minHeight: '80px' }}></textarea>
            </div>
            <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Envoyer le message
            </button>
          </div>
        </form>
      );

    // Content & Media Components
    case 'blog':
      return (
        <article
          className={`blog-post ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '120px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '32px' }}>📝</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>2 janvier 2024</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Titre de l'article de blog</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
                Extrait de l'article de blog avec les premières lignes du contenu pour donner un aperçu...
              </p>
              <a href="#" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Lire la suite →
              </a>
            </div>
          </div>
        </article>
      );

    case 'timeline':
      return (
        <div
          className={`timeline ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ position: 'relative', padding: '20px' }}>
            <div style={{ position: 'absolute', left: '20px', top: '20px', bottom: '20px', width: '2px', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ marginLeft: '40px' }}>
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2024</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Lancement du projet</div>
              </div>
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2023</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Première version stable</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2022</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Début du développement</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'progress':
      return (
        <div
          className={`progress-bar ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Progression du projet</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>75%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      );

    case 'map':
      return (
        <div
          className={`map-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>Carte interactive</div>
            <div style={{ fontSize: '12px', color: '#0284c7' }}>Paris, France</div>
          </div>
        </div>
      );

    case 'text':
      const adaptiveTextSize = Math.max(containerWidth / 15, 10);
      return (
        <div
          className={`text-element ${className || ''}`}
          style={{
            ...inlineStyles,
            fontSize: `${adaptiveTextSize}px`,
            fontWeight: styles.fontWeight || 'normal',
            color: styles.color || '#374151',
            fontFamily: styles.fontFamily || 'inherit',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: `${Math.max(containerHeight / 20, 4)}px`
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Texte modifiable'}
        </div>
      );

    case 'filters':
      const filterTitleSize = Math.max(containerWidth / 12, 12);
      const filterTextSize = Math.max(containerWidth / 16, 10);
      const filterPadding = Math.max(containerHeight / 10, 8);
      const filterGap = Math.max(containerHeight / 15, 4);
      
      return (
        <div
          className={`filters-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: `${filterPadding}px`,
            boxSizing: 'border-box',
            margin: '0',
            overflow: 'hidden'
          }}>
            <h4 style={{ 
              fontSize: `${filterTitleSize}px`, 
              fontWeight: '600', 
              marginBottom: `${filterGap}px`, 
              color: '#1f2937', 
              margin: `0 0 ${filterGap}px 0`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>Filtres</h4>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: `${Math.max(filterGap / 2, 2)}px`,
              height: `calc(100% - ${filterTitleSize + filterGap}px)`,
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: `${filterTextSize + 4}px` }}>
                <input type="checkbox" id="filter1" style={{ 
                  marginRight: '2px',
                  transform: `scale(${Math.min(filterTextSize / 14, 1)})`
                }} />
                <label htmlFor="filter1" style={{ 
                  fontSize: `${filterTextSize}px`, 
                  color: '#374151',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>Catégorie A</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: `${filterTextSize + 4}px` }}>
                <input type="checkbox" id="filter2" style={{ 
                  marginRight: '2px',
                  transform: `scale(${Math.min(filterTextSize / 14, 1)})`
                }} />
                <label htmlFor="filter2" style={{ 
                  fontSize: `${filterTextSize}px`, 
                  color: '#374151',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>Catégorie B</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minHeight: `${filterTextSize + 4}px` }}>
                <input type="checkbox" id="filter3" style={{ 
                  marginRight: '2px',
                  transform: `scale(${Math.min(filterTextSize / 14, 1)})`
                }} />
                <label htmlFor="filter3" style={{ 
                  fontSize: `${filterTextSize}px`, 
                  color: '#374151',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>Catégorie C</label>
              </div>
            </div>
          </div>
        </div>
      );

    case 'contact':
      const contactTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 28 });
      const contactTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 20 });
      const contactIconStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 12, maxSize: 24 });
      const contactPadding = getResponsiveSpacing(16);
      const contactGap = getResponsiveSpacing(12);
      const contactItems = [
        { icon: '📧', text: 'contact@example.com' },
        { icon: '📞', text: '+33 1 23 45 67 89' },
        { icon: '📍', text: '123 Rue Example, Paris' }
      ];
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`contact-info ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: `${contactPadding}px`,
            boxSizing: 'border-box',
            margin: '0',
            overflow: 'hidden'
          }}>
            <h3 style={{ 
              ...contactTitleStyles,
              fontWeight: '600', 
              marginBottom: `${contactGap}px`, 
              color: '#1f2937', 
              margin: `0 0 ${contactGap}px 0`
            }}>Contact</h3>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: `${contactGap / 2}px`,
              height: `calc(100% - ${parseInt(contactTitleStyles.fontSize as string) + contactGap}px)`,
              overflow: 'hidden'
            }}>
              {contactItems.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: `${contactGap / 3}px`,
                  minHeight: `${parseInt(contactTextStyles.fontSize as string) + 4}px`
                }}>
                  <span style={{ 
                    ...contactIconStyles,
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}>{item.icon}</span>
                  <span style={{ 
                    ...contactTextStyles,
                    color: '#374151'
                  }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      // Rendu par défaut pour tous les autres composants
      // Éléments vides (void elements) ne peuvent pas avoir d'enfants
      const voidElements = ['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
      const isVoidElement = voidElements.includes(Tag.toLowerCase());
      
      if (isVoidElement) {
        return React.createElement(
          Tag as any,
          {
            className: className as string,
            style: inlineStyles,
            onClick: onClick,
            ...otherAttributes
          }
        );
      }
      
      return React.createElement(
        Tag as any,
        {
          className: className as string,
          style: inlineStyles,
          onClick: onClick,
          ...otherAttributes
        },
        content,
        renderChildren()
      );
  }
}