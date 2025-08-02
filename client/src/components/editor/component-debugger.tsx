import React, { useState, useEffect } from 'react';
import type { ComponentDefinition } from '@shared/schema';

interface ComponentDebuggerProps {
  components: ComponentDefinition[];
  selectedComponent: ComponentDefinition | null;
  onToggle: () => void;
  isVisible: boolean;
}

export default function ComponentDebugger({ 
  components, 
  selectedComponent, 
  onToggle, 
  isVisible 
}: ComponentDebuggerProps) {
  const [debugLog, setDebugLog] = useState<Array<{
    timestamp: string;
    action: string;
    componentType: string;
    componentId: string;
    styles: any;
    attributes: any;
    details: string;
  }>>([]);

  const [lastComponentCount, setLastComponentCount] = useState(0);

  // Surveiller les nouveaux composants ajoutés et leur positionnement
  useEffect(() => {
    if (components.length > lastComponentCount) {
      const newComponents = components.slice(lastComponentCount);
      
      newComponents.forEach(component => {
        // Analyse détaillée du positionnement et du contenu
        const positionAnalysis = analyzeComponentPosition(component);
        const contentAnalysis = analyzeComponentContent(component);
        
        const logEntry = {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          action: 'COMPONENT_ADDED',
          componentType: component.type,
          componentId: component.id,
          styles: component.styles || {},
          attributes: component.attributes || {},
          details: `${component.type} ajouté - Position: ${positionAnalysis.summary} - Contenu: ${contentAnalysis.summary}`
        };
        
        setDebugLog(prev => [...prev, logEntry].slice(-50));
        
        console.log('🔍 DEBUGGER - Composant ajouté:', {
          type: component.type,
          id: component.id,
          POSITION_ANALYSIS: positionAnalysis,
          CONTENT_ANALYSIS: contentAnalysis,
          RENDERING_ISSUES: detectRenderingIssues(component),
          styles: component.styles,
          attributes: component.attributes
        });
      });
      
      setLastComponentCount(components.length);
    }
  }, [components, lastComponentCount]);

  // Analyser le positionnement d'un composant
  const analyzeComponentPosition = (component: ComponentDefinition) => {
    const styles = component.styles || {};
    
    return {
      summary: `${styles.left || 'auto'}, ${styles.top || 'auto'} (${styles.width || 'auto'} × ${styles.height || 'auto'})`,
      positioning: {
        type: styles.position || 'static',
        coordinates: {
          left: styles.left,
          top: styles.top,
          right: styles.right,
          bottom: styles.bottom
        },
        dimensions: {
          width: styles.width,
          height: styles.height,
          minWidth: styles.minWidth,
          minHeight: styles.minHeight,
          maxWidth: styles.maxWidth,
          maxHeight: styles.maxHeight
        },
        zIndex: styles.zIndex,
        transform: styles.transform
      },
      layout: {
        display: styles.display,
        flexDirection: styles.flexDirection,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
        gridTemplateColumns: styles.gridTemplateColumns,
        gridTemplateRows: styles.gridTemplateRows,
        gap: styles.gap
      },
      spacing: {
        margin: styles.margin,
        padding: styles.padding,
        marginTop: styles.marginTop,
        marginLeft: styles.marginLeft,
        paddingTop: styles.paddingTop,
        paddingLeft: styles.paddingLeft
      },
      overflow: {
        overflow: styles.overflow,
        overflowX: styles.overflowX,
        overflowY: styles.overflowY
      }
    };
  };

  // Analyser le contenu d'un composant
  const analyzeComponentContent = (component: ComponentDefinition) => {
    const hasContent = component.content && component.content.trim().length > 0;
    const hasChildren = component.children && component.children.length > 0;
    const childrenCount = component.children?.length || 0;
    
    return {
      summary: hasContent ? `"${component.content?.substring(0, 30)}${component.content && component.content.length > 30 ? '...' : ''}"` : 
               hasChildren ? `${childrenCount} enfant(s)` : 'Vide',
      textContent: {
        hasText: hasContent,
        text: component.content,
        textLength: component.content?.length || 0,
        isEmpty: !hasContent && !hasChildren
      },
      structure: {
        hasChildren: hasChildren,
        childrenCount: childrenCount,
        childrenTypes: component.children?.map(child => child.type) || [],
        nestingLevel: calculateNestingLevel(component)
      },
      attributes: {
        className: component.attributes?.className,
        id: component.attributes?.id,
        customAttributes: Object.keys(component.attributes || {}).filter(key => !['className', 'id'].includes(key))
      }
    };
  };

  // Détecter les problèmes de rendu potentiels
  const detectRenderingIssues = (component: ComponentDefinition) => {
    const issues: string[] = [];
    const styles = component.styles || {};
    
    // Problèmes de positionnement
    if (styles.position === 'absolute' && (!styles.left && !styles.right)) {
      issues.push('Position absolue sans left/right défini');
    }
    if (styles.position === 'absolute' && (!styles.top && !styles.bottom)) {
      issues.push('Position absolue sans top/bottom défini');
    }
    
    // Problèmes de dimensions
    if (styles.width === '0px' || styles.height === '0px') {
      issues.push('Dimension nulle détectée');
    }
    
    // Problèmes de contenu
    if (!component.content && (!component.children || component.children.length === 0)) {
      issues.push('Composant sans contenu ni enfants');
    }
    
    // Problèmes de z-index
    if (styles.zIndex && parseInt(styles.zIndex) < 0) {
      issues.push('Z-index négatif peut causer des problèmes d\'affichage');
    }
    
    // Problèmes d'overflow
    if (styles.overflow === 'hidden' && (styles.width || styles.height)) {
      issues.push('Overflow hidden peut masquer du contenu');
    }
    
    return {
      hasIssues: issues.length > 0,
      issues: issues,
      severity: issues.length > 2 ? 'HIGH' : issues.length > 0 ? 'MEDIUM' : 'LOW'
    };
  };

  // Calculer le niveau d'imbrication
  const calculateNestingLevel = (component: ComponentDefinition, level = 0): number => {
    if (!component.children || component.children.length === 0) {
      return level;
    }
    return Math.max(...component.children.map(child => calculateNestingLevel(child, level + 1)));
  };

  // Surveiller les changements du composant sélectionné et détecter les décalages
  useEffect(() => {
    if (selectedComponent) {
      // Analyse de position détaillée
      const positionAnalysis = analyzeComponentPosition(selectedComponent);
      const contentAnalysis = analyzeComponentContent(selectedComponent);
      const renderingIssues = detectRenderingIssues(selectedComponent);
      
      const logEntry = {
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        action: 'COMPONENT_SELECTED',
        componentType: selectedComponent.type,
        componentId: selectedComponent.id,
        styles: selectedComponent.styles || {},
        attributes: selectedComponent.attributes || {},
        details: `${selectedComponent.type} sélectionné - Position: ${positionAnalysis.summary} - ${renderingIssues.hasIssues ? `⚠️ ${renderingIssues.issues.length} problème(s)` : '✅ OK'}`
      };
      
      setDebugLog(prev => [...prev, logEntry].slice(-50));
      
      console.log('🎯 DEBUGGER - Composant sélectionné:', {
        type: selectedComponent.type,
        id: selectedComponent.id,
        POSITION_ANALYSIS: positionAnalysis,
        CONTENT_ANALYSIS: contentAnalysis,
        RENDERING_ISSUES: renderingIssues,
        VISUAL_PROPERTIES: {
          layout: {
            position: selectedComponent.styles?.position,
            left: selectedComponent.styles?.left,
            top: selectedComponent.styles?.top,
            width: selectedComponent.styles?.width,
            height: selectedComponent.styles?.height,
            zIndex: selectedComponent.styles?.zIndex,
            display: selectedComponent.styles?.display,
            overflow: selectedComponent.styles?.overflow
          },
          appearance: {
            backgroundColor: selectedComponent.styles?.backgroundColor,
            color: selectedComponent.styles?.color,
            border: selectedComponent.styles?.border,
            borderRadius: selectedComponent.styles?.borderRadius,
            boxShadow: selectedComponent.styles?.boxShadow
          },
          typography: {
            fontSize: selectedComponent.styles?.fontSize,
            fontFamily: selectedComponent.styles?.fontFamily,
            fontWeight: selectedComponent.styles?.fontWeight,
            textAlign: selectedComponent.styles?.textAlign,
            lineHeight: selectedComponent.styles?.lineHeight
          },
          spacing: {
            padding: selectedComponent.styles?.padding,
            margin: selectedComponent.styles?.margin
          }
        },
        OFFSET_DETECTION: detectContentOffset(selectedComponent),
        customizationOptions: getCustomizationOptions(selectedComponent.type)
      });

      // Surveillance continue de la position pour détecter les changements
      const positionWatcher = setInterval(() => {
        checkForPositionChanges(selectedComponent);
      }, 500);

      return () => clearInterval(positionWatcher);
    }
  }, [selectedComponent]);

  // Détecter les décalages de contenu
  const detectContentOffset = (component: ComponentDefinition) => {
    const styles = component.styles || {};
    const issues: string[] = [];
    
    // Vérifier les décalages potentiels
    if (styles.position === 'absolute') {
      if (styles.left && styles.left !== '50px') {
        issues.push(`Position left décalée: ${styles.left} (attendu: 50px)`);
      }
      if (styles.top && styles.top !== '50px') {
        issues.push(`Position top décalée: ${styles.top} (attendu: 50px)`);
      }
    }

    // Vérifier les problèmes de contenu
    if (component.children && component.children.length > 0) {
      component.children.forEach((child, index) => {
        if (child.styles?.position === 'absolute') {
          issues.push(`Enfant ${index} en position absolue peut causer des décalages`);
        }
      });
    }

    // Vérifier les transformations
    if (styles.transform) {
      issues.push(`Transform détecté: ${styles.transform} - peut causer des décalages visuels`);
    }

    return {
      hasOffset: issues.length > 0,
      offsetIssues: issues,
      expectedPosition: { left: '50px', top: '50px' },
      actualPosition: { left: styles.left, top: styles.top },
      positioning: {
        isAbsolute: styles.position === 'absolute',
        hasTransform: !!styles.transform,
        hasFixedParent: false // À implémenter si nécessaire
      }
    };
  };

  // Surveiller les changements de position en temps réel
  const checkForPositionChanges = (component: ComponentDefinition) => {
    // Cette fonction pourrait être étendue pour surveiller les changements DOM réels
    const currentPosition = {
      left: component.styles?.left,
      top: component.styles?.top,
      width: component.styles?.width,
      height: component.styles?.height
    };
    
    // Log des changements détectés (placeholder pour surveillance temps réel)
    console.log('📍 POSITION_WATCHER:', {
      componentId: component.id,
      type: component.type,
      currentPosition,
      timestamp: new Date().toISOString()
    });
  };

  const getCustomizationOptions = (componentType: string) => {
    const commonOptions = {
      layout: ['position', 'left', 'top', 'width', 'height', 'zIndex'],
      appearance: ['backgroundColor', 'color', 'border', 'borderRadius', 'boxShadow'],
      typography: ['fontSize', 'fontFamily', 'fontWeight', 'textAlign', 'lineHeight'],
      spacing: ['padding', 'margin']
    };

    const specificOptions: Record<string, any> = {
      button: {
        ...commonOptions,
        interactive: ['cursor', 'transition', 'hover', 'active'],
        special: ['buttonStyle', 'variant', 'size']
      },
      image: {
        ...commonOptions,
        media: ['src', 'alt', 'objectFit', 'objectPosition'],
        special: ['aspectRatio', 'filter']
      },
      carousel: {
        ...commonOptions,
        carousel: ['autoplay', 'interval', 'showDots', 'showArrows'],
        special: ['slideCount', 'transition']
      },
      pricing: {
        ...commonOptions,
        pricing: ['price', 'currency', 'features', 'highlighted'],
        special: ['planType', 'billing']
      },
      chart: {
        ...commonOptions,
        chart: ['chartType', 'dataPoints', 'colors', 'labels'],
        special: ['animated', 'responsive']
      },
      form: {
        ...commonOptions,
        form: ['method', 'action', 'validation'],
        special: ['fieldTypes', 'required']
      },
      table: {
        ...commonOptions,
        table: ['headers', 'rows', 'striped', 'bordered'],
        special: ['sortable', 'pagination']
      },
      navbar: {
        ...commonOptions,
        navigation: ['logoPosition', 'menuItems', 'sticky'],
        special: ['responsive', 'collapse']
      },
      sidebar: {
        ...commonOptions,
        navigation: ['menuItems', 'collapsible', 'icons'],
        special: ['width', 'position']
      },
      grid: {
        ...commonOptions,
        layout: ['gridTemplateColumns', 'gridTemplateRows', 'gap'],
        special: ['responsive', 'autoFit']
      },
      flexbox: {
        ...commonOptions,
        layout: ['flexDirection', 'justifyContent', 'alignItems', 'gap'],
        special: ['wrap', 'grow', 'shrink']
      }
    };

    return specificOptions[componentType] || commonOptions;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'COMPONENT_ADDED': return '#10b981';
      case 'COMPONENT_SELECTED': return '#3b82f6';
      case 'COMPONENT_UPDATED': return '#f59e0b';
      case 'COMPONENT_REMOVED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const clearLog = () => {
    setDebugLog([]);
    console.clear();
    console.log('🔄 DEBUGGER - Log effacé');
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1f2937',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}
        title="Ouvrir le débogueur"
      >
        🔍
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '500px',
      backgroundColor: '#1f2937',
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          🔍 Débogueur Composants
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={clearLog}
            style={{
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Effacer
          </button>
          <button
            onClick={onToggle}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #374151',
        fontSize: '12px',
        color: '#d1d5db'
      }}>
        <div>Total composants: {components.length}</div>
        <div>Composant sélectionné: {selectedComponent ? selectedComponent.type : 'Aucun'}</div>
        {selectedComponent && (
          <div style={{ marginTop: '4px', padding: '4px', backgroundColor: '#374151', borderRadius: '4px' }}>
            <div>📍 Position: {selectedComponent.styles?.left || 'auto'}, {selectedComponent.styles?.top || 'auto'}</div>
            <div>📏 Taille: {selectedComponent.styles?.width || 'auto'} × {selectedComponent.styles?.height || 'auto'}</div>
            {selectedComponent.content && (
              <div>📝 Contenu: "{selectedComponent.content.substring(0, 25)}{selectedComponent.content.length > 25 ? '...' : ''}"</div>
            )}
          </div>
        )}
        <div>Entrées log: {debugLog.length}</div>
      </div>

      {/* Log */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px'
      }}>
        {debugLog.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            En attente d'activité...
          </div>
        ) : (
          debugLog.slice().reverse().map((entry, index) => (
            <div
              key={index}
              style={{
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: '#374151',
                borderRadius: '6px',
                fontSize: '11px',
                borderLeft: `3px solid ${getActionColor(entry.action)}`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px'
              }}>
                <span style={{ color: getActionColor(entry.action), fontWeight: '600' }}>
                  {entry.action}
                </span>
                <span style={{ color: '#9ca3af' }}>
                  {entry.timestamp}
                </span>
              </div>
              <div style={{ color: '#e5e7eb', marginBottom: '4px' }}>
                {entry.componentType} ({entry.componentId.slice(-8)})
              </div>
              <div style={{ color: '#d1d5db', fontSize: '10px' }}>
                {entry.details}
              </div>
              <details style={{ marginTop: '4px' }}>
                <summary style={{ color: '#9ca3af', cursor: 'pointer', fontSize: '10px' }}>
                  Voir détails
                </summary>
                <div style={{ marginTop: '4px', color: '#d1d5db', fontSize: '10px' }}>
                  <div><strong>Styles:</strong></div>
                  <pre style={{ 
                    fontSize: '9px', 
                    color: '#9ca3af', 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    margin: '2px 0'
                  }}>
                    {JSON.stringify(entry.styles, null, 2)}
                  </pre>
                  <div><strong>Attributs:</strong></div>
                  <pre style={{ 
                    fontSize: '9px', 
                    color: '#9ca3af', 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    margin: '2px 0'
                  }}>
                    {JSON.stringify(entry.attributes, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}