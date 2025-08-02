/**
 * Système de validation pour garantir la conformité des composants
 * aux standards établis : responsive, sans minHeight, rendu approprié
 */

export interface ComponentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFeatures: string[];
}

export interface ComponentStandards {
  hasResponsiveSystem: boolean;
  hasContainerRef: boolean;
  hasBoxSizing: boolean;
  hasNoMinHeight: boolean;
  hasProperRendering: boolean;
  hasContentAdaptation: boolean;
}

/**
 * Valide qu'un composant respecte nos standards établis
 */
export function validateComponentStandards(
  componentType: string,
  componentCode: string
): ComponentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingFeatures: string[] = [];

  // 1. Vérification du système responsive
  if (!componentCode.includes('getResponsiveContentStyles') && 
      !componentCode.includes('getResponsiveSpacing') && 
      !componentCode.includes('getResponsiveSize')) {
    errors.push(`Composant '${componentType}': Système responsive manquant - doit utiliser getResponsiveContentStyles(), getResponsiveSpacing(), ou getResponsiveSize()`);
    missingFeatures.push('responsive-system');
  }

  // 2. Vérification de la référence conteneur
  if (!componentCode.includes('containerRef')) {
    errors.push(`Composant '${componentType}': containerRef manquant - nécessaire pour ResizeObserver`);
    missingFeatures.push('container-ref');
  }

  // 3. Vérification du box-sizing
  if (!componentCode.includes('boxSizing: \'border-box\'')) {
    warnings.push(`Composant '${componentType}': boxSizing: 'border-box' recommandé pour un rendu cohérent`);
    missingFeatures.push('box-sizing');
  }

  // 4. Vérification de l'absence de minHeight
  if (componentCode.includes('minHeight:') || componentCode.includes('min-height:')) {
    errors.push(`Composant '${componentType}': contraintes minHeight détectées - doivent être supprimées pour un contrôle dimensionnel total`);
  }

  // 5. Vérification du rendu approprié (pas de fallback par défaut)
  if (componentCode.includes('// Rendu par défaut') && !componentCode.includes(`case '${componentType}':`)) {
    errors.push(`Composant '${componentType}': utilise le rendu par défaut - doit avoir son propre case de rendu spécifique`);
    missingFeatures.push('specific-rendering');
  }

  // 6. Vérification des dimensions adaptatives
  if (!componentCode.includes('height: \'100%\'') || !componentCode.includes('width: \'100%\'')) {
    warnings.push(`Composant '${componentType}': dimensions adaptatives recommandées (width: '100%', height: '100%')`);
    missingFeatures.push('adaptive-dimensions');
  }

  // 7. Vérification de la gestion de l'overflow
  if (!componentCode.includes('overflow:') && componentType !== 'input' && componentType !== 'button') {
    warnings.push(`Composant '${componentType}': gestion overflow recommandée pour éviter le débordement de contenu`);
    missingFeatures.push('overflow-handling');
  }

  // 8. Vérification de l'adaptation du contenu
  const hasContentAdaptation = componentCode.includes('fontSize:') && 
                               (componentCode.includes('containerWidth') || componentCode.includes('containerHeight'));
  if (!hasContentAdaptation && componentType !== 'container' && componentType !== 'section') {
    warnings.push(`Composant '${componentType}': adaptation du contenu aux dimensions recommandée`);
    missingFeatures.push('content-adaptation');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingFeatures
  };
}

/**
 * Analyse le code du ComponentRenderer pour détecter les composants non conformes
 */
export function validateAllComponents(rendererCode: string): ComponentValidationResult[] {
  const results: ComponentValidationResult[] = [];
  const caseRegex = /case '(\w+)':/g;
  let match;

  while ((match = caseRegex.exec(rendererCode)) !== null) {
    const componentType = match[1];
    
    // Extraire le code du composant
    const caseStart = match.index;
    const nextCaseMatch = rendererCode.indexOf("case '", caseStart + 1);
    const defaultMatch = rendererCode.indexOf("default:", caseStart + 1);
    
    let caseEnd = rendererCode.length;
    if (nextCaseMatch !== -1 && (defaultMatch === -1 || nextCaseMatch < defaultMatch)) {
      caseEnd = nextCaseMatch;
    } else if (defaultMatch !== -1) {
      caseEnd = defaultMatch;
    }
    
    const componentCode = rendererCode.slice(caseStart, caseEnd);
    const validation = validateComponentStandards(componentType, componentCode);
    
    if (!validation.isValid || validation.warnings.length > 0) {
      results.push({
        ...validation,
        errors: validation.errors.map(err => `${componentType}: ${err}`),
        warnings: validation.warnings.map(warn => `${componentType}: ${warn}`)
      });
    }
  }

  return results;
}

/**
 * Génère un template pour un nouveau composant conforme aux standards
 */
export function generateComponentTemplate(componentType: string): string {
  return `    case '${componentType}':
      const ${componentType}TitleStyles = getResponsiveContentStyles({ baseSize: 16, minSize: 12, maxSize: 20 });
      const ${componentType}TextStyles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const ${componentType}Padding = getResponsiveSpacing(16);
      
      return (
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className={\`${componentType}-component \${className || ''}\`}
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
            padding: \`\${${componentType}Padding}px\`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              ...${componentType}TitleStyles,
              fontWeight: '600', 
              marginBottom: \`\${Math.max(${componentType}Padding / 2, 8)}px\`, 
              color: '#1f2937',
              textAlign: 'center'
            }}>
              ${componentType.charAt(0).toUpperCase() + componentType.slice(1)} Component
            </div>
            <div style={{ 
              ...${componentType}TextStyles,
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Contenu du composant ${componentType}
            </div>
          </div>
        </div>
      );`;
}

/**
 * Applique automatiquement les corrections nécessaires pour un composant
 */
export function generateComponentFix(componentType: string, missingFeatures: string[]): string {
  let fixes = [];

  if (missingFeatures.includes('responsive-system')) {
    fixes.push(`// Ajouter le système responsive
      const ${componentType}Styles = getResponsiveContentStyles({ baseSize: 14, minSize: 10, maxSize: 18 });
      const ${componentType}Padding = getResponsiveSpacing(12);`);
  }

  if (missingFeatures.includes('container-ref')) {
    fixes.push(`// Ajouter la référence conteneur
          ref={containerRef as React.RefObject<HTMLDivElement>}`);
  }

  if (missingFeatures.includes('box-sizing')) {
    fixes.push(`// Ajouter dans style:
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            overflow: 'hidden'`);
  }

  return fixes.join('\n\n');
}