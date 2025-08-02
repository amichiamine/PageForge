import React, { useRef, useEffect, useState } from 'react';
import type { ComponentDefinition } from '@shared/schema';
import { ComponentValidationHooks } from '@/lib/component-dev-tools';

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

  // Validation automatique en mode développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const hasResponsiveFeatures = containerRef.current !== null;
      ComponentValidationHooks.onComponentRender(component.type, hasResponsiveFeatures);
    }
  }, [component.type]);

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
    boxSizing: 'border-box',
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    whiteSpace: styles.whiteSpace as any,
    wordBreak: styles.wordBreak as any,
    objectFit: styles.objectFit as any,
    overflow: component.type === 'carousel' ? 'hidden' : (styles.overflow as any || 'visible'),
    boxShadow: styles.boxShadow,
    transition: 'all 0.2s ease-in-out',
    cursor: styles.cursor,
    userSelect: styles.userSelect as any,
    outline: isSelected ? '2px solid #3b82f6' : styles.outline,
    maxWidth: styles.maxWidth,
    gridTemplateColumns: styles.gridTemplateColumns,
    gap: styles.gap
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

    // Calcul responsive basé sur les dimensions réelles avec limite mobile
    const widthRatio = Math.max(containerWidth / 200, 0.3); // Minimum 30% sur mobile
    const heightRatio = Math.max(containerHeight / 100, 0.5); // Minimum 50% sur mobile
    const adaptiveScale = Math.sqrt(widthRatio * heightRatio) * scaleFactor;
    
    // Assurer une taille minimum lisible sur mobile
    const adaptedSize = Math.min(Math.max(baseSize * adaptiveScale, minSize), maxSize);
    const adaptedPadding = padding ? Math.max(containerWidth / 50, 4) : 0;
    const adaptedLineHeight = multiline ? 1.4 : 1.2;

    return {
      fontSize: `${adaptedSize}px`,
      lineHeight: adaptedLineHeight,
      padding: padding ? `${adaptedPadding}px` : '0',
      overflow: 'visible', // Changé de 'hidden' à 'visible' pour mobile
      textOverflow: multiline ? 'clip' : 'ellipsis',
      whiteSpace: multiline ? 'normal' : (containerWidth < 150 ? 'normal' : 'nowrap'), // Wrapping forcé sur petits écrans
      wordBreak: containerWidth < 150 ? 'break-word' : 'normal',
      ...(multiline && containerHeight > 60 && {
        display: '-webkit-box',
        WebkitLineClamp: Math.max(Math.floor(containerHeight / (adaptedSize * adaptedLineHeight)) - 1, 1),
        WebkitBoxOrient: 'vertical' as any
      })
    };
  };

  // Fonction pour calculer les espacements adaptatifs
  const getResponsiveSpacing = (baseSpacing: number = 16): number => {
    // Améliorer l'espacement pour mobile avec seuils spécifiques
    const widthFactor = Math.max(containerWidth / 200, 0.4);
    const heightFactor = Math.max(containerHeight / 100, 0.4);
    const scaleFactor = Math.min(Math.sqrt(widthFactor * heightFactor), 1.5);
    return Math.max(baseSpacing * scaleFactor, containerWidth < 150 ? 2 : 4);
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

  // DEBUG: Log du type de composant
  if (component.type === 'gallery') {
    console.log('🔍 COMPONENT-RENDERER: Gallery détectée!', { 
      type: component.type, 
      id: component.id,
      componentData: component.componentData 
    });
  }

  // Cas spéciaux pour certains types de composants avec adaptation responsive complète
  switch (component.type) {
    case 'image':
      const imageContentStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 24 });
      console.log('🖼️ IMAGE DEBUG:', { 
        componentId: component.id, 
        attributesSrc: attributes.src, 
        hasAttributes: !!component.attributes,
        fullAttributes: component.attributes 
      });
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
      
      // Récupération des slides depuis componentData (architecture unifiée)
      const slides = component.componentData?.slides || [];
      const currentSlide = component.componentData?.currentSlide || 0;
      
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
          {slides.length > 0 ? (
            <>
              <div className="carousel-track" style={{ 
                display: 'flex', 
                width: `${slides.length * 100}%`, 
                height: '100%', 
                transition: 'transform 0.3s ease-in-out',
                transform: `translateX(-${currentSlide * (100 / slides.length)}%)`
              }}>
                {slides.map((slide: any, index: number) => (
                  <div 
                    key={index}
                    className="carousel-slide" 
                    style={{ 
                      width: `${100 / slides.length}%`, 
                      height: '100%', 
                      backgroundColor: slide.backgroundColor || '#3b82f6',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      position: 'relative',
                      ...carouselTextStyles
                    }}
                  >
                    {slide.image && (
                      <>
                        <img 
                          src={slide.image} 
                          alt={slide.title || `Slide ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            zIndex: 0
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          zIndex: 1
                        }} />
                      </>
                    )}
                    <div style={{ 
                      position: 'relative', 
                      zIndex: 2, 
                      textAlign: slide.textPosition === 'left' ? 'left' : slide.textPosition === 'right' ? 'right' : 'center',
                      alignSelf: slide.textPosition === 'top' ? 'flex-start' : slide.textPosition === 'bottom' ? 'flex-end' : 'center',
                      width: '100%',
                      padding: '20px',
                      color: slide.textColor || 'white'
                    }}>
                      {slide.title && (
                        <div style={{ 
                          marginBottom: '8px', 
                          fontSize: slide.titleSize || '24px',
                          fontWeight: 'bold'
                        }}>
                          {slide.title}
                        </div>
                      )}
                      {slide.description && (
                        <div style={{ 
                          fontSize: '16px', 
                          opacity: 0.9, 
                          marginBottom: slide.buttonText ? '16px' : '0'
                        }}>
                          {slide.description}
                        </div>
                      )}
                      {slide.buttonText && (
                        <button
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: slide.textColor || 'white',
                            border: `2px solid ${slide.textColor || 'white'}`,
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(4px)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (slide.buttonLink && slide.buttonLink !== '#') {
                              window.open(slide.buttonLink, '_blank');
                            }
                          }}
                        >
                          {slide.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {component.componentData?.showDots && slides.length > 1 && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: `${bottomSpacing}px`, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  display: 'flex', 
                  gap: `${dotGap}px` 
                }}>
                  {slides.map((_: any, index: number) => (
                    <div 
                      key={index}
                      style={{ 
                        width: `${dotSize}px`, 
                        height: `${dotSize}px`, 
                        borderRadius: '50%', 
                        backgroundColor: 'white', 
                        opacity: index === currentSlide ? 0.8 : 0.5 
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: containerWidth < 150 ? '12px' : '14px',
              backgroundColor: '#f8fafc',
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              textAlign: 'center',
              padding: `${getResponsiveSpacing(12)}px`,
              boxSizing: 'border-box'
            }}>
              <div style={{ lineHeight: 1.4 }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>🎠 Carrousel</div>
                <div style={{ fontSize: containerWidth < 150 ? '10px' : '12px', color: '#9ca3af' }}>
                  Ajoutez des slides via la configuration
                </div>
              </div>
            </div>
          )}
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
      console.log('🎯 CASE GALLERY ATTEINT!', { componentId: component.id });
      const galleryTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 28 });
      const galleryIconStyles = getResponsiveContentStyles({ baseSize: 20, minSize: 16, maxSize: 32, scaleFactor: 1.2 });
      const gallerySpacing = getResponsiveSpacing(8);
      const galleryGap = getResponsiveSpacing(6);
      
      // Récupérer les images depuis componentData
      const galleryImages = component.componentData?.images || [];
      const hasImages = galleryImages.length > 0 && galleryImages.some((img: any) => img.src);
      
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
          {hasImages ? (
            // AFFICHAGE DES VRAIES IMAGES
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: galleryImages.length === 1 ? '1fr' : galleryImages.length === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
              gap: `${galleryGap}px`, 
              height: '100%',
              overflow: 'hidden',
              padding: `${gallerySpacing}px`
            }}>
              {galleryImages.map((image: any, index: number) => (
                image.src ? (
                  <div key={index} style={{ 
                    borderRadius: '6px', 
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#f3f4f6'
                  }}>
                    <img 
                      src={image.src} 
                      alt={image.alt || `Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        // En cas d'erreur de chargement, afficher un placeholder
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              background-color: #f3f4f6; 
                              color: #9ca3af;
                              font-size: ${galleryIconStyles.fontSize};
                            ">🖼️</div>
                          `;
                        }
                      }}
                    />
                    {image.caption && (
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        fontSize: '10px',
                        textAlign: 'center'
                      }}>
                        {image.caption}
                      </div>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          ) : (
            // ÉTAT VIDE : Placeholder
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              color: '#9ca3af',
              textAlign: 'center',
              padding: `${gallerySpacing}px`
            }}>
              <div style={{ 
                ...galleryIconStyles,
                marginBottom: `${gallerySpacing}px`
              }}>🖼️</div>
              <div style={{ 
                ...galleryTitleStyles,
                color: '#9ca3af',
                fontSize: '14px'
              }}>Galerie vide</div>
              <div style={{ 
                fontSize: '12px',
                color: '#d1d5db',
                marginTop: '4px'
              }}>Ajoutez des images via la configuration</div>
            </div>
          )}
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
      const accordionContentStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16, multiline: true });
      const accordionPadding = getResponsiveSpacing(10);
      const accordionItemHeight = getResponsiveSize(40, false);
      
      // Récupération des données depuis componentData (architecture unifiée)
      const accordionItems = component.componentData?.items || [];
      
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
          {accordionItems.length > 0 ? (
            <div style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              overflow: 'hidden',
              height: '100%'
            }}>
              {accordionItems.map((item: any, index: number) => (
                <div key={index}>
                  <div style={{ 
                    padding: `${accordionPadding}px ${accordionPadding * 1.3}px`, 
                    backgroundColor: '#f9fafb', 
                    borderBottom: index < accordionItems.length - 1 ? '1px solid #e5e7eb' : 'none',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    height: `${accordionItemHeight}px`,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}>
                    <span style={{ 
                      ...accordionTextStyles,
                      fontWeight: '500',
                      flex: 1
                    }}>{item.question || `Question ${index + 1}`}</span>
                    <span style={{ 
                      ...accordionIconStyles,
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}>{item.isOpen ? '-' : '+'}</span>
                  </div>
                  {item.isOpen && (
                    <div style={{
                      padding: `${accordionPadding}px ${accordionPadding * 1.3}px`,
                      backgroundColor: '#ffffff',
                      borderBottom: index < accordionItems.length - 1 ? '1px solid #e5e7eb' : 'none',
                      ...accordionContentStyles,
                      color: '#6b7280'
                    }}>
                      {item.answer || 'Réponse non définie'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              color: '#9ca3af',
              fontSize: '14px',
              textAlign: 'center',
              padding: `${accordionPadding}px`,
              boxSizing: 'border-box',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              Accordéon vide - Ajoutez des questions/réponses via la configuration
            </div>
          )}
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
      
      // Récupération des données depuis componentData (architecture unifiée)
      const listType = component.componentData?.listType || 'unordered';
      const listItems = component.componentData?.items || [];
      const ListTag = listType === 'ordered' ? 'ol' : listType === 'none' ? 'div' : 'ul';
      
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
          {listItems.length > 0 ? (
            <ListTag style={{ 
              margin: '0', 
              padding: listType === 'none' ? `${listPadding}px` : `0 0 0 ${listPadding}px`, 
              color: '#374151',
              height: '100%',
              overflow: 'hidden',
              listStyle: listType === 'none' ? 'none' : 'initial',
              ...listTextStyles
            }}>
              {listItems.map((item: any, index: number) => {
                const ItemTag = listType === 'none' ? 'div' : 'li';
                return (
                  <ItemTag key={index} style={{ 
                    marginBottom: index < listItems.length - 1 ? `${listItemSpacing}px` : '0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{item.text}</ItemTag>
                );
              })}
            </ListTag>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              color: '#9ca3af',
              fontSize: '14px',
              textAlign: 'center',
              padding: `${listPadding}px`,
              boxSizing: 'border-box'
            }}>
              Liste vide - Ajoutez des éléments via la configuration
            </div>
          )}
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
      const containerTextStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 8, maxSize: 28 });
      const containerPadding = getResponsiveSpacing(12);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`container ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${containerPadding}px`, 
            border: '2px dashed #d1d5db', 
            borderRadius: '8px', 
            height: '100%',
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#f9fafb',
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <span style={{ 
              color: '#6b7280', 
              ...containerTextStyles,
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '100%',
              wordBreak: 'break-word'
            }}>Conteneur</span>
          </div>
          {renderChildren()}
        </div>
      );

    case 'section':
      const sectionTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 24 });
      const sectionTextStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16, multiline: true });
      const sectionPadding = getResponsiveSpacing(16);
      const sectionSpacing = getResponsiveSpacing(8);
      
      return (
        <section
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`section ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${sectionPadding}px`, 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <h2 style={{ 
              ...sectionTitleStyles,
              fontWeight: '600', 
              color: '#1e293b',
              margin: `0 0 ${sectionSpacing}px 0`,
              lineHeight: 1.2,
              flexShrink: 0
            }}>Section</h2>
            <p style={{ 
              ...sectionTextStyles,
              color: '#64748b', 
              lineHeight: 1.4,
              flex: 1,
              margin: 0,
              overflow: 'hidden'
            }}>
              Contenu section
            </p>
          </div>
          {renderChildren()}
        </section>
      );

    case 'header':
      const headerTitleStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 10, maxSize: 22 });
      const headerNavStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const headerPadding = getResponsiveSpacing(12);
      const headerGap = getResponsiveSpacing(8);
      
      // Récupération des données depuis componentData (architecture unifiée)
      const logo = component.componentData?.logo || 'Site';
      const navigation = component.componentData?.navigation || [];
      
      return (
        <header
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`header ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
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
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <div style={{ 
              ...headerTitleStyles,
              fontWeight: 'bold',
              maxWidth: '60%',
              flexShrink: 0,
              lineHeight: 1.2
            }}>
              {logo}
            </div>
            <nav style={{ 
              display: 'flex', 
              gap: `${headerGap}px`,
              maxWidth: '40%',
              overflow: containerWidth < 200 ? 'visible' : 'hidden',
              minWidth: 0,
              flexWrap: containerWidth < 200 ? 'wrap' : 'nowrap'
            }}>
              {navigation.length > 0 ? navigation.map((item: any, index: number) => (
                <a key={index} href={item.link || '#'} style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  ...headerNavStyles,
                  flexShrink: containerWidth < 200 ? 1 : 0,
                  lineHeight: 1.2,
                  fontSize: containerWidth < 150 ? '9px' : headerNavStyles.fontSize
                }}>{item.text}</a>
              )) : (
                <span style={{ 
                  color: '#9ca3af', 
                  ...headerNavStyles,
                  flexShrink: 0,
                  lineHeight: 1.2,
                  fontSize: containerWidth < 150 ? '9px' : headerNavStyles.fontSize
                }}>Menu</span>
              )}
            </nav>
          </div>
        </header>
      );

    case 'footer':
      const footerTitleStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const footerTextStyles = getResponsiveContentStyles({ baseSize: 10, minSize: 8, maxSize: 14 });
      const footerLinkStyles = getResponsiveContentStyles({ baseSize: 10, minSize: 8, maxSize: 14 });
      const footerPadding = getResponsiveSpacing(16);
      const footerSpacing = getResponsiveSpacing(8);
      
      // Récupération des données depuis componentData (architecture unifiée)
      const companyName = component.componentData?.companyName || 'Entreprise';
      const description = component.componentData?.description || '';
      const links = component.componentData?.links || [];
      const copyright = component.componentData?.copyright || '© 2025 Tous droits réservés';
      
      return (
        <footer
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`footer ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${footerPadding}px`, 
            backgroundColor: '#374151', 
            color: 'white', 
            textAlign: 'center',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              ...footerTitleStyles,
              fontWeight: '600', 
              marginBottom: `${footerSpacing}px`,
              lineHeight: 1.2
            }}>{companyName}</div>
            
            {description && (
              <div style={{ 
                ...footerTextStyles,
                color: '#d1d5db',
                marginBottom: `${footerSpacing}px`,
                lineHeight: 1.2 
              }}>{description}</div>
            )}
            
            {links.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: `${footerSpacing}px`,
                marginBottom: `${footerSpacing}px`,
                flexWrap: 'wrap'
              }}>
                {links.map((link: any, index: number) => (
                  <a key={index} href={link.link || '#'} style={{ 
                    color: '#d1d5db',
                    textDecoration: 'none',
                    ...footerLinkStyles,
                    lineHeight: 1.2
                  }}>{link.text}</a>
                ))}
              </div>
            )}
            
            <div style={{ 
              ...footerTextStyles,
              color: '#9ca3af',
              lineHeight: 1.2 
            }}>{copyright}</div>
          </div>
        </footer>
      );

    case 'grid':
      const gridTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const gridPadding = getResponsiveSpacing(12);
      
      // Récupération des données depuis componentData (source unique de vérité)
      const gridItems = component.componentData?.gridItems || [];
      const columns = component.componentData?.columns || 2;
      const gap = component.componentData?.gap || '16px';
      const alignment = component.componentData?.alignment || 'center';
      const itemBackground = component.componentData?.itemBackground || '#f3f4f6';
      

      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`grid-container ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {gridItems.length > 0 ? (
            // RENDU AVEC DONNÉES : Affichage complet du grid
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${columns}, 1fr)`, 
              gap: gap, 
              padding: `${gridPadding}px`,
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
              alignItems: alignment === 'top' ? 'start' : alignment === 'bottom' ? 'end' : 'center'
            }}>
              {gridItems.map((item: any, index: number) => (
                <div key={index} style={{ 
                  backgroundColor: itemBackground, 
                  borderRadius: '8px', 
                  padding: `${gridPadding}px`, 
                  textAlign: 'left',
                  boxSizing: 'border-box',
                  border: '1px solid #e5e7eb',
                  minHeight: '80px',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}>
                  {item.title && <h3 style={{ 
                    ...gridTextStyles,
                    color: '#1f2937',
                    margin: '0 0 8px 0',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>{item.title}</h3>}
                  {item.content && <p style={{ 
                    ...gridTextStyles,
                    color: '#6b7280',
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}>{item.content}</p>}
                </div>
              ))}
            </div>
          ) : (
            // ÉTAT VIDE : Message indicatif pour l'utilisateur
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              color: '#9ca3af',
              fontSize: '14px',
              textAlign: 'center',
              padding: `${gridPadding}px`,
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              boxSizing: 'border-box'
            }}>
              Grille vide - Ajoutez des éléments via la configuration
            </div>
          )}
        </div>
      );

    case 'flexbox':
      const flexTextStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const flexPadding = getResponsiveSpacing(8);
      const flexGap = getResponsiveSpacing(8);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`flexbox-layout ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            display: 'flex', 
            gap: `${flexGap}px`, 
            padding: `${flexPadding}px`, 
            alignItems: 'center',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <div style={{ 
              flex: 1, 
              backgroundColor: '#fef3c7', 
              borderRadius: '8px', 
              padding: `${flexPadding}px`, 
              textAlign: 'center',
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                ...flexTextStyles,
                color: '#92400e',
                lineHeight: 1.2
              }}>A</span>
            </div>
            <div style={{ 
              flex: 1, 
              backgroundColor: '#dbeafe', 
              borderRadius: '8px', 
              padding: `${flexPadding}px`, 
              textAlign: 'center',
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                ...flexTextStyles,
                color: '#1e40af',
                lineHeight: 1.2
              }}>B</span>
            </div>
            <div style={{ 
              flex: 1, 
              backgroundColor: '#dcfce7', 
              borderRadius: '8px', 
              padding: `${flexPadding}px`, 
              textAlign: 'center',
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ 
                ...flexTextStyles,
                color: '#166534',
                lineHeight: 1.2
              }}>C</span>
            </div>
          </div>
        </div>
      );

    // Text Components
    case 'heading':
      const headingTextStyles = getResponsiveContentStyles({ baseSize: 24, minSize: 14, maxSize: 40 });
      const headingPadding = getResponsiveSpacing(8);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`heading ${className || ''}`}
          style={{
            ...inlineStyles,
            overflow: 'hidden',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${headingPadding}px`
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {React.createElement(
            component.tag || 'h1',
            {
              style: {
                ...headingTextStyles,
                fontWeight: styles.fontWeight || 'bold',
                color: styles.color || '#1a202c',
                margin: '0',
                padding: '0',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }
            },
            content || 'Titre'
          )}
        </div>
      );

    case 'paragraph':
      const paragraphTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18, multiline: true });
      const paragraphPadding = getResponsiveSpacing(8);
      
      return (
        <p
          ref={containerRef as React.RefObject<HTMLParagraphElement>}
          className={`text-paragraph ${className || ''}`}
          style={{
            ...inlineStyles,
            color: styles.color || '#4a5568',
            margin: '0',
            padding: `${paragraphPadding}px`,
            overflow: 'hidden',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            position: 'relative',
            ...paragraphTextStyles,
            lineHeight: 1.4,
            wordBreak: 'break-word'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Texte de paragraphe qui s\'adapte automatiquement.'}
        </p>
      );

    case 'button':
      const buttonTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 8, maxSize: 20 });
      const buttonPadding = getResponsiveSpacing(8);
      
      return (
        <button
          ref={containerRef as React.RefObject<HTMLButtonElement>}
          className={`btn-primary ${className || ''}`}
          style={{
            ...inlineStyles,
            backgroundColor: styles.backgroundColor || '#3b82f6',
            color: styles.color || '#ffffff',
            border: 'none',
            borderRadius: styles.borderRadius || '8px',
            padding: `${buttonPadding}px`,
            cursor: 'pointer',
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
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            position: 'relative',
            ...buttonTextStyles,
            lineHeight: 1.2
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Bouton'}
        </button>
      );

    // Forms Components  
    case 'input':
      const inputTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const inputPadding = getResponsiveSpacing(12);
      
      return (
        <input
          ref={containerRef as React.RefObject<HTMLInputElement>}
          type={attributes.type as string || 'text'}
          placeholder={attributes.placeholder as string || 'Texte...'}
          className={`form-input ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: `${inputPadding}px`,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            outline: 'none',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            ...inputTextStyles,
            lineHeight: 1.2
          }}
          onClick={onClick}
          {...otherAttributes}
        />
      );

    case 'textarea':
      const textareaStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const textareaPadding = getResponsiveSpacing(12);
      
      return (
        <textarea
          ref={containerRef as React.RefObject<HTMLTextAreaElement>}
          placeholder={attributes.placeholder as string || 'Entrez votre message...'}
          className={`form-textarea ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: `${textareaPadding}px`,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            ...textareaStyles,
            lineHeight: 1.4
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content}
        </textarea>
      );

    case 'checkbox':
      const checkboxStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const checkboxGap = getResponsiveSpacing(8);
      
      return (
        <label
          ref={containerRef as React.RefObject<HTMLLabelElement>}
          className={`checkbox-label ${className || ''}`}
          style={{
            ...inlineStyles,
            display: 'flex',
            alignItems: 'center',
            gap: `${checkboxGap}px`,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            cursor: 'pointer'
          }}
          onClick={onClick}
        >
          <input type="checkbox" style={{ margin: '0', transform: `scale(${Math.max(containerWidth / 200, 0.8)})` }} />
          <span style={{ ...checkboxStyles }}>{content || 'Case à cocher'}</span>
        </label>
      );

    case 'radio':
      const radioStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const radioGap = getResponsiveSpacing(8);
      const radioSpacing = getResponsiveSpacing(6);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`radio-group ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: `${radioSpacing}px`,
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: `${radioGap}px`, cursor: 'pointer', ...radioStyles }}>
            <input type="radio" name="radio-group" style={{ transform: `scale(${Math.max(containerWidth / 200, 0.8)})` }} />
            <span>Option 1</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: `${radioGap}px`, cursor: 'pointer', ...radioStyles }}>
            <input type="radio" name="radio-group" style={{ transform: `scale(${Math.max(containerWidth / 200, 0.8)})` }} />
            <span>Option 2</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: `${radioGap}px`, cursor: 'pointer', ...radioStyles }}>
            <input type="radio" name="radio-group" style={{ transform: `scale(${Math.max(containerWidth / 200, 0.8)})` }} />
            <span>Option 3</span>
          </label>
        </div>
      );

    case 'select':
      const selectStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const selectPadding = getResponsiveSpacing(12);
      
      return (
        <select
          ref={containerRef as React.RefObject<HTMLSelectElement>}
          className={`form-select ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: `${selectPadding}px`,
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            outline: 'none',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            ...selectStyles
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
      const breadcrumbStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const breadcrumbGap = getResponsiveSpacing(8);
      
      return (
        <nav
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`breadcrumb ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <ol style={{ display: 'flex', alignItems: 'center', gap: `${breadcrumbGap}px`, color: '#6b7280', ...breadcrumbStyles, margin: 0, padding: 0 }}>
            <li><a href="#" style={{ color: '#3b82f6', textDecoration: 'none', ...breadcrumbStyles }}>Accueil</a></li>
            <li style={{ color: '#d1d5db' }}>{'>'}</li>
            <li><a href="#" style={{ color: '#3b82f6', textDecoration: 'none', ...breadcrumbStyles }}>Catégorie</a></li>
            <li style={{ color: '#d1d5db' }}>{'>'}</li>
            <li style={{ color: '#374151', ...breadcrumbStyles }}>Page actuelle</li>
          </ol>
        </nav>
      );

    case 'navbar':
      const navbarLogoStyles = getResponsiveContentStyles({ baseSize: 20, minSize: 14, maxSize: 24 });
      const navbarLinkStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const navbarPadding = getResponsiveSpacing(12);
      const navbarGap = getResponsiveSpacing(16);
      
      // Récupération des données depuis componentData (architecture unifiée)
      const brand = component.componentData?.brand || 'Logo';
      const menuItems = component.componentData?.menuItems || [];
      
      return (
        <nav
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`navbar ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: `${navbarPadding}px`, 
            backgroundColor: '#ffffff', 
            borderBottom: '1px solid #e5e7eb',
            height: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontWeight: 'bold', color: '#1f2937', ...navbarLogoStyles }}>{brand}</div>
            <div style={{ display: 'flex', gap: `${navbarGap}px`, flexWrap: 'wrap' }}>
              {menuItems.length > 0 ? menuItems.map((item: any, index: number) => (
                <a key={index} href={item.link || '#'} style={{ 
                  color: item.active ? '#3b82f6' : '#374151', 
                  textDecoration: 'none', 
                  fontWeight: item.active ? '600' : '500', 
                  ...navbarLinkStyles 
                }}>{item.text}</a>
              )) : (
                <span style={{ color: '#9ca3af', ...navbarLinkStyles }}>Aucun menu configuré</span>
              )}
            </div>
          </div>
        </nav>
      );

    case 'menu':
      const menuHeaderStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const menuItemStyles = getResponsiveContentStyles({ baseSize: 13, minSize: 9, maxSize: 16 });
      const menuPadding = getResponsiveSpacing(8);
      const menuItemPadding = getResponsiveSpacing(10);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`menu ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            backgroundColor: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: `${menuPadding}px`,
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ 
              padding: `${menuItemPadding}px`, 
              borderRadius: '6px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              ...menuHeaderStyles 
            }}>
              Menu principal
            </div>
            <div style={{ 
              padding: `${menuItemPadding}px`, 
              borderRadius: '6px', 
              color: '#374151', 
              cursor: 'pointer',
              ...menuItemStyles 
            }}>
              Option 1
            </div>
            <div style={{ 
              padding: `${menuItemPadding}px`, 
              borderRadius: '6px', 
              color: '#374151', 
              cursor: 'pointer',
              ...menuItemStyles 
            }}>
              Option 2
            </div>
          </div>
        </div>
      );

    case 'pagination':
      const paginationStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const paginationGap = getResponsiveSpacing(6);
      const paginationPadding = getResponsiveSpacing(8);
      
      return (
        <nav
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`pagination ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: `${paginationGap}px`, flexWrap: 'wrap' }}>
            <button style={{ padding: `${paginationPadding}px`, border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer', ...paginationStyles }}>
              Préc
            </button>
            <button style={{ padding: `${paginationPadding}px`, border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', ...paginationStyles }}>
              1
            </button>
            <button style={{ padding: `${paginationPadding}px`, border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer', ...paginationStyles }}>
              2
            </button>
            <button style={{ padding: `${paginationPadding}px`, border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer', ...paginationStyles }}>
              Suiv
            </button>
          </div>
        </nav>
      );

    case 'tabs':
      const tabStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const tabPadding = getResponsiveSpacing(12);
      const tabContentPadding = getResponsiveSpacing(16);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`tabs ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0' }}>
              <button style={{ 
                padding: `${tabPadding}px`, 
                borderBottom: '2px solid #3b82f6', 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: '#3b82f6', 
                fontWeight: '500',
                ...tabStyles 
              }}>
                Onglet 1
              </button>
              <button style={{ 
                padding: `${tabPadding}px`, 
                borderBottom: '2px solid transparent', 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: '#6b7280', 
                fontWeight: '500', 
                cursor: 'pointer',
                ...tabStyles 
              }}>
                Onglet 2
              </button>
            </div>
          </div>
          <div style={{ 
            padding: `${tabContentPadding}px`, 
            backgroundColor: '#ffffff', 
            flex: 1, 
            overflow: 'hidden'
          }}>
            <p style={{ color: '#374151', margin: '0', ...tabStyles }}>Contenu de l'onglet actif</p>
          </div>
        </div>
      );

    case 'sidebar':
      const sidebarTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 24 });
      const sidebarLinkStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const sidebarPadding = getResponsiveSpacing(20);
      const sidebarGap = getResponsiveSpacing(6);
      
      return (
        <aside
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`sidebar ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            padding: `${sidebarPadding}px`, 
            backgroundColor: '#1f2937', 
            color: 'white', 
            height: '100%', 
            borderRadius: '8px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontWeight: '600', 
              marginBottom: `${sidebarPadding}px`, 
              marginTop: '0',
              ...sidebarTitleStyles 
            }}>
              Navigation
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: `${sidebarGap}px`, flex: 1, overflow: 'hidden' }}>
              <a href="#" style={{ 
                padding: `${Math.max(sidebarGap, 8)}px`, 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '6px', 
                backgroundColor: '#374151',
                ...sidebarLinkStyles 
              }}>
                🏠 Accueil
              </a>
              <a href="#" style={{ 
                padding: `${Math.max(sidebarGap, 8)}px`, 
                color: '#d1d5db', 
                textDecoration: 'none', 
                borderRadius: '6px',
                ...sidebarLinkStyles 
              }}>
                📊 Dashboard
              </a>
              <a href="#" style={{ 
                padding: `${Math.max(sidebarGap, 8)}px`, 
                color: '#d1d5db', 
                textDecoration: 'none', 
                borderRadius: '6px',
                ...sidebarLinkStyles 
              }}>
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>
      );

    // Business & E-commerce
    case 'product':
      const productTitleStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 12, maxSize: 20 });
      const productDescStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const productPriceStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 14, maxSize: 24 });
      const productButtonStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const productPadding = getResponsiveSpacing(12);
      const productIconSize = getResponsiveSize(40, true);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`product-card ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #e5e7eb', 
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              width: '100%', 
              flex: '0 0 40%', 
              backgroundColor: '#f3f4f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: `${productIconSize}px` }}>📦</span>
            </div>
            <div style={{ padding: `${productPadding}px`, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ 
                  fontWeight: '600', 
                  marginBottom: `${Math.max(productPadding / 2, 4)}px`, 
                  color: '#1f2937',
                  margin: 0,
                  ...productTitleStyles 
                }}>
                  Produit Premium
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: `${Math.max(productPadding / 2, 6)}px`, 
                  lineHeight: '1.4',
                  margin: 0,
                  ...productDescStyles 
                }}>
                  Description du produit
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: 'bold', color: '#1f2937', ...productPriceStyles }}>49,99 €</span>
                <button style={{ 
                  backgroundColor: '#3b82f6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  padding: `${Math.max(productPadding / 3, 4)}px ${Math.max(productPadding / 2, 8)}px`, 
                  cursor: 'pointer',
                  ...productButtonStyles 
                }}>
                  Acheter
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'cart':
      const cartTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 24 });
      const cartItemStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const cartTotalStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 12, maxSize: 20 });
      const cartPriceStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 14, maxSize: 24 });
      const cartButtonStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const cartPadding = getResponsiveSpacing(16);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`shopping-cart ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: `${cartPadding}px`,
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ 
              fontWeight: '600', 
              marginBottom: `${cartPadding}px`, 
              color: '#1f2937',
              margin: 0,
              ...cartTitleStyles 
            }}>
              Panier d'achat
            </h3>
            <div style={{ 
              marginBottom: `${Math.max(cartPadding / 2, 8)}px`, 
              paddingBottom: `${Math.max(cartPadding / 2, 8)}px`, 
              borderBottom: '1px solid #f3f4f6' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151', ...cartItemStyles }}>Produit 1 × 2</span>
                <span style={{ fontWeight: '500', color: '#1f2937', ...cartItemStyles }}>99,98 €</span>
              </div>
            </div>
            <div style={{ 
              marginBottom: `${cartPadding}px`, 
              paddingBottom: `${Math.max(cartPadding / 2, 8)}px`, 
              borderBottom: '1px solid #f3f4f6' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151', ...cartItemStyles }}>Produit 2 × 1</span>
                <span style={{ fontWeight: '500', color: '#1f2937', ...cartItemStyles }}>29,99 €</span>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: `${cartPadding}px`,
              marginTop: 'auto'
            }}>
              <span style={{ fontWeight: '600', color: '#1f2937', ...cartTotalStyles }}>Total:</span>
              <span style={{ fontWeight: 'bold', color: '#1f2937', ...cartPriceStyles }}>129,97 €</span>
            </div>
            <button style={{ 
              width: '100%', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              padding: `${Math.max(cartPadding / 2, 8)}px`, 
              fontWeight: '500', 
              cursor: 'pointer',
              ...cartButtonStyles 
            }}>
              Procéder au paiement
            </button>
          </div>
        </div>
      );

    case 'form':
      const formTitleStyles = getResponsiveContentStyles({ baseSize: 20, minSize: 14, maxSize: 26 });
      const formLabelStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const formInputStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const formButtonStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const formPadding = getResponsiveSpacing(20);
      const formSpacing = getResponsiveSpacing(12);
      
      return (
        <form
          ref={containerRef as React.RefObject<HTMLFormElement>}
          className={`contact-form ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            backgroundColor: 'white', 
            padding: `${formPadding}px`, 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
            <h3 style={{ 
              fontWeight: '600', 
              marginBottom: `${formPadding}px`, 
              color: '#1f2937',
              margin: `0 0 ${formPadding}px 0`,
              ...formTitleStyles 
            }}>
              Formulaire de contact
            </h3>
            <div style={{ marginBottom: `${formSpacing}px` }}>
              <label style={{ 
                display: 'block', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: `${Math.max(formSpacing / 3, 4)}px`,
                ...formLabelStyles 
              }}>
                Nom complet
              </label>
              <input 
                type="text" 
                placeholder="Votre nom..." 
                style={{ 
                  width: '100%', 
                  padding: `${Math.max(formSpacing / 2, 6)}px`, 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  ...formInputStyles 
                }} 
              />
            </div>
            <div style={{ marginBottom: `${formSpacing}px` }}>
              <label style={{ 
                display: 'block', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: `${Math.max(formSpacing / 3, 4)}px`,
                ...formLabelStyles 
              }}>
                Email
              </label>
              <input 
                type="email" 
                placeholder="votre@email.com" 
                style={{ 
                  width: '100%', 
                  padding: `${Math.max(formSpacing / 2, 6)}px`, 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  ...formInputStyles 
                }} 
              />
            </div>
            <div style={{ marginBottom: `${formPadding}px`, flex: 1 }}>
              <label style={{ 
                display: 'block', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: `${Math.max(formSpacing / 3, 4)}px`,
                ...formLabelStyles 
              }}>
                Message
              </label>
              <textarea 
                placeholder="Votre message..." 
                style={{ 
                  width: '100%', 
                  padding: `${Math.max(formSpacing / 2, 6)}px`, 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  resize: 'none',

                  height: '100%',
                  boxSizing: 'border-box',
                  ...formInputStyles 
                }}
              ></textarea>
            </div>
            <button 
              type="submit" 
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                padding: `${Math.max(formSpacing, 8)}px`, 
                fontWeight: '500', 
                cursor: 'pointer',
                ...formButtonStyles 
              }}
            >
              Envoyer le message
            </button>
          </div>
        </form>
      );

    // Content & Media Components
    case 'blog':
      const blogDateStyles = getResponsiveContentStyles({ baseSize: 12, minSize: 8, maxSize: 16 });
      const blogTitleStyles = getResponsiveContentStyles({ baseSize: 18, minSize: 12, maxSize: 24 });
      const blogTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const blogLinkStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const blogPadding = getResponsiveSpacing(16);
      const blogIconSize = getResponsiveSize(28, true);
      
      return (
        <article
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`blog-post ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #e5e7eb', 
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              width: '100%', 
              flex: '0 0 35%', 
              backgroundColor: '#f3f4f6', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: `${blogIconSize}px` }}>📝</span>
            </div>
            <div style={{ padding: `${blogPadding}px`, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                color: '#6b7280', 
                marginBottom: `${Math.max(blogPadding / 3, 4)}px`,
                ...blogDateStyles 
              }}>
                2 janvier 2024
              </div>
              <h3 style={{ 
                fontWeight: '600', 
                marginBottom: `${Math.max(blogPadding / 2, 6)}px`, 
                color: '#1f2937',
                margin: 0,
                ...blogTitleStyles 
              }}>
                Titre de l'article de blog
              </h3>
              <p style={{ 
                color: '#6b7280', 
                lineHeight: '1.5', 
                marginBottom: `${blogPadding}px`,
                margin: 0,
                flex: 1,
                ...blogTextStyles 
              }}>
                Extrait de l'article de blog avec les premières lignes du contenu...
              </p>
              <a href="#" style={{ 
                color: '#3b82f6', 
                textDecoration: 'none', 
                fontWeight: '500',
                marginTop: 'auto',
                ...blogLinkStyles 
              }}>
                Lire la suite →
              </a>
            </div>
          </div>
        </article>
      );

    case 'timeline':
      const timelineYearStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const timelineTextStyles = getResponsiveContentStyles({ baseSize: 13, minSize: 9, maxSize: 17 });
      const timelinePadding = getResponsiveSpacing(16);
      const timelineSpacing = getResponsiveSpacing(20);
      const timelineCircleSize = getResponsiveSize(10, true);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`timeline ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            position: 'relative', 
            padding: `${timelinePadding}px`,
            height: '100%',
            boxSizing: 'border-box',
            overflow: 'auto'
          }}>
            <div style={{ 
              position: 'absolute', 
              left: `${timelinePadding}px`, 
              top: `${timelinePadding}px`, 
              bottom: `${timelinePadding}px`, 
              width: '2px', 
              backgroundColor: '#e5e7eb' 
            }}></div>
            <div style={{ marginLeft: `${timelinePadding + 20}px` }}>
              <div style={{ marginBottom: `${timelineSpacing}px`, position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: `-${timelinePadding + 6}px`, 
                  top: '4px', 
                  width: `${timelineCircleSize}px`, 
                  height: `${timelineCircleSize}px`, 
                  borderRadius: '50%', 
                  backgroundColor: '#3b82f6' 
                }}></div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '4px',
                  ...timelineYearStyles 
                }}>
                  2024
                </div>
                <div style={{ color: '#6b7280', ...timelineTextStyles }}>Lancement du projet</div>
              </div>
              <div style={{ marginBottom: `${timelineSpacing}px`, position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: `-${timelinePadding + 6}px`, 
                  top: '4px', 
                  width: `${timelineCircleSize}px`, 
                  height: `${timelineCircleSize}px`, 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981' 
                }}></div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '4px',
                  ...timelineYearStyles 
                }}>
                  2023
                </div>
                <div style={{ color: '#6b7280', ...timelineTextStyles }}>Première version stable</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: `-${timelinePadding + 6}px`, 
                  top: '4px', 
                  width: `${timelineCircleSize}px`, 
                  height: `${timelineCircleSize}px`, 
                  borderRadius: '50%', 
                  backgroundColor: '#f59e0b' 
                }}></div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '4px',
                  ...timelineYearStyles 
                }}>
                  2022
                </div>
                <div style={{ color: '#6b7280', ...timelineTextStyles }}>Début du développement</div>
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
      const mapTitleStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 12, maxSize: 20 });
      const mapTextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const mapPadding = getResponsiveSpacing(16);
      const mapIconSize = getResponsiveSize(40, true);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`map-component ${className || ''}`}
          style={{
            ...inlineStyles,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexDirection: 'column',
            padding: `${mapPadding}px`,
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: `${mapIconSize}px`, marginBottom: `${Math.max(mapPadding / 2, 6)}px` }}>🗺️</div>
            <div style={{ 
              fontWeight: '600', 
              color: '#0369a1', 
              marginBottom: `${Math.max(mapPadding / 4, 2)}px`,
              textAlign: 'center',
              ...mapTitleStyles 
            }}>
              Carte interactive
            </div>
            <div style={{ color: '#0284c7', textAlign: 'center', ...mapTextStyles }}>Paris, France</div>
          </div>
        </div>
      );

    case 'text':
      const textStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 20 });
      const textPadding = getResponsiveSpacing(8);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`text-element ${className || ''}`}
          style={{
            ...inlineStyles,
            fontWeight: styles.fontWeight || 'normal',
            color: styles.color || '#374151',
            fontFamily: styles.fontFamily || 'inherit',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: `${textPadding}px`,
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            position: 'relative',
            ...textStyles,
            lineHeight: 1.4
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Texte'}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
      // ERREUR EXPLICITE : Chaque composant doit avoir sa case spécifique
      const errorMessage = `❌ COMPOSANT NON SUPPORTÉ: ${component.type}`;
      console.error(`🚨 ARCHITECTURE: ${errorMessage}`);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={`unsupported-component ${className || ''}`}
          style={{
            ...inlineStyles,
            backgroundColor: '#fef2f2',
            border: '2px solid #f87171',
            color: '#dc2626',
            padding: '16px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {errorMessage}
        </div>
      );
  }
}