/**
 * Outils de développement pour la validation automatique des composants
 * Exécute les vérifications en mode développement
 */

import { validateAllComponents, validateComponentStandards, ComponentValidationResult } from './component-validation';

let hasRunValidation = false;

/**
 * Exécute la validation automatique en mode développement
 */
export function runDevelopmentValidation() {
  if (hasRunValidation || process.env.NODE_ENV === 'production') {
    return;
  }

  hasRunValidation = true;

  // Validation différée pour permettre le chargement complet
  setTimeout(() => {
    validateComponentRenderer();
  }, 2000);
}

/**
 * Valide le ComponentRenderer et affiche les résultats
 */
async function validateComponentRenderer() {
  try {
    // Charger le code du ComponentRenderer (simulation)
    const response = await fetch('/src/components/editor/component-renderer.tsx');
    if (!response.ok) {
      console.warn('🔍 VALIDATION: Impossible de charger le ComponentRenderer pour validation');
      return;
    }
    
    const rendererCode = await response.text();
    const validationResults = validateAllComponents(rendererCode);

    if (validationResults.length === 0) {
      console.log('✅ VALIDATION: Tous les composants respectent les standards établis');
      return;
    }

    console.group('🔍 VALIDATION DES COMPOSANTS');
    
    validationResults.forEach(result => {
      if (result.errors.length > 0) {
        console.group('❌ ERREURS CRITIQUES');
        result.errors.forEach(error => console.error(error));
        console.groupEnd();
      }

      if (result.warnings.length > 0) {
        console.group('⚠️ AVERTISSEMENTS');
        result.warnings.forEach(warning => console.warn(warning));
        console.groupEnd();
      }

      if (result.missingFeatures.length > 0) {
        console.group('📋 FONCTIONNALITÉS MANQUANTES');
        result.missingFeatures.forEach(feature => console.info(`- ${feature}`));
        console.groupEnd();
      }
    });

    console.groupEnd();

  } catch (error) {
    console.warn('🔍 VALIDATION: Erreur lors de la validation automatique:', error);
  }
}

/**
 * Valide un composant spécifique et retourne le résultat
 */
export function validateSingleComponent(componentType: string, componentCode: string): ComponentValidationResult {
  const result = validateComponentStandards(componentType, componentCode);
  
  if (!result.isValid) {
    console.group(`🔍 VALIDATION: Composant '${componentType}'`);
    
    if (result.errors.length > 0) {
      console.error('❌ Erreurs:', result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn('⚠️ Avertissements:', result.warnings);
    }
    
    if (result.missingFeatures.length > 0) {
      console.info('📋 Fonctionnalités manquantes:', result.missingFeatures);
    }
    
    console.groupEnd();
  }

  return result;
}

/**
 * Hooks de développement pour la validation en temps réel
 */
export const ComponentValidationHooks = {
  /**
   * Hook appelé lors de l'ajout d'un nouveau composant
   */
  onComponentAdd: (componentType: string, componentCode: string) => {
    if (process.env.NODE_ENV === 'development') {
      const result = validateSingleComponent(componentType, componentCode);
      
      if (!result.isValid) {
        console.warn(`🚨 Le composant '${componentType}' ne respecte pas les standards établis`);
      } else {
        console.log(`✅ Le composant '${componentType}' respecte tous les standards`);
      }
    }
  },

  /**
   * Hook appelé lors de la modification d'un composant
   */
  onComponentUpdate: (componentType: string, componentCode: string) => {
    if (process.env.NODE_ENV === 'development') {
      validateSingleComponent(componentType, componentCode);
    }
  },

  /**
   * Hook appelé lors du rendu d'un composant
   */
  onComponentRender: (componentType: string, hasResponsiveFeatures: boolean) => {
    if (process.env.NODE_ENV === 'development' && !hasResponsiveFeatures) {
      console.warn(`⚠️ RENDU: Le composant '${componentType}' n'utilise pas le système responsive`);
    }
  }
};