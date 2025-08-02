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

  // Surveiller les nouveaux composants ajoutés
  useEffect(() => {
    if (components.length > lastComponentCount) {
      const newComponents = components.slice(lastComponentCount);
      
      newComponents.forEach(component => {
        const logEntry = {
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          action: 'COMPONENT_ADDED',
          componentType: component.type,
          componentId: component.id,
          styles: component.styles || {},
          attributes: component.attributes || {},
          details: `Nouveau composant ${component.type} ajouté avec ${Object.keys(component.styles || {}).length} propriétés CSS`
        };
        
        setDebugLog(prev => [...prev, logEntry].slice(-50)); // Garder seulement les 50 dernières entrées
        
        console.log('🔍 DEBUGGER - Composant ajouté:', {
          type: component.type,
          id: component.id,
          styles: component.styles,
          attributes: component.attributes,
          position: { left: component.styles?.left, top: component.styles?.top },
          dimensions: { width: component.styles?.width, height: component.styles?.height },
          appearance: {
            backgroundColor: component.styles?.backgroundColor,
            color: component.styles?.color,
            fontSize: component.styles?.fontSize,
            fontFamily: component.styles?.fontFamily,
            border: component.styles?.border,
            borderRadius: component.styles?.borderRadius,
            padding: component.styles?.padding,
            margin: component.styles?.margin
          }
        });
      });
      
      setLastComponentCount(components.length);
    }
  }, [components, lastComponentCount]);

  // Surveiller les changements du composant sélectionné
  useEffect(() => {
    if (selectedComponent) {
      const logEntry = {
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        action: 'COMPONENT_SELECTED',
        componentType: selectedComponent.type,
        componentId: selectedComponent.id,
        styles: selectedComponent.styles || {},
        attributes: selectedComponent.attributes || {},
        details: `Composant ${selectedComponent.type} sélectionné pour édition`
      };
      
      setDebugLog(prev => [...prev, logEntry].slice(-50));
      
      console.log('🎯 DEBUGGER - Composant sélectionné:', {
        type: selectedComponent.type,
        id: selectedComponent.id,
        currentStyles: selectedComponent.styles,
        renderingMode: 'ComponentRenderer',
        visualProperties: {
          layout: {
            position: selectedComponent.styles?.position,
            left: selectedComponent.styles?.left,
            top: selectedComponent.styles?.top,
            width: selectedComponent.styles?.width,
            height: selectedComponent.styles?.height,
            zIndex: selectedComponent.styles?.zIndex
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
        customizationOptions: getCustomizationOptions(selectedComponent.type)
      });
    }
  }, [selectedComponent]);

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