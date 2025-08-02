#!/usr/bin/env node

/**
 * Script de validation des composants
 * Exécute la validation de tous les composants et génère un rapport
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulation des fonctions de validation (à adapter selon l'environnement)
function validateComponentStandards(componentType, componentCode) {
  const errors = [];
  const warnings = [];
  const missingFeatures = [];

  // 1. Vérification du système responsive
  if (!componentCode.includes('getResponsiveContentStyles') && 
      !componentCode.includes('getResponsiveSpacing') && 
      !componentCode.includes('getResponsiveSize')) {
    errors.push(`Système responsive manquant - doit utiliser getResponsiveContentStyles(), getResponsiveSpacing(), ou getResponsiveSize()`);
    missingFeatures.push('responsive-system');
  }

  // 2. Vérification de la référence conteneur
  if (!componentCode.includes('containerRef')) {
    errors.push(`containerRef manquant - nécessaire pour ResizeObserver`);
    missingFeatures.push('container-ref');
  }

  // 3. Vérification du box-sizing
  if (!componentCode.includes('boxSizing: \'border-box\'')) {
    warnings.push(`boxSizing: 'border-box' recommandé pour un rendu cohérent`);
    missingFeatures.push('box-sizing');
  }

  // 4. Vérification de l'absence de minHeight
  if (componentCode.includes('minHeight:') || componentCode.includes('min-height:')) {
    errors.push(`contraintes minHeight détectées - doivent être supprimées pour un contrôle dimensionnel total`);
  }

  // 5. Vérification du rendu approprié
  if (componentCode.includes('// Rendu par défaut') && !componentCode.includes(`case '${componentType}':`)) {
    errors.push(`utilise le rendu par défaut - doit avoir son propre case de rendu spécifique`);
    missingFeatures.push('specific-rendering');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingFeatures
  };
}

function validateAllComponents(rendererCode) {
  const results = [];
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
    
    results.push({
      componentType,
      ...validation
    });
  }

  return results;
}

// Exécution du script
const rendererPath = path.join(__dirname, '../client/src/components/editor/component-renderer.tsx');

if (!fs.existsSync(rendererPath)) {
  console.error('❌ Fichier ComponentRenderer non trouvé:', rendererPath);
  process.exit(1);
}

const rendererCode = fs.readFileSync(rendererPath, 'utf8');
const results = validateAllComponents(rendererCode);

console.log('🔍 RAPPORT DE VALIDATION DES COMPOSANTS');
console.log('=====================================\n');

const validComponents = results.filter(r => r.isValid && r.warnings.length === 0);
const componentsWithWarnings = results.filter(r => r.isValid && r.warnings.length > 0);
const invalidComponents = results.filter(r => !r.isValid);

console.log(`✅ Composants conformes: ${validComponents.length}`);
console.log(`⚠️  Composants avec avertissements: ${componentsWithWarnings.length}`);
console.log(`❌ Composants non conformes: ${invalidComponents.length}`);
console.log(`📊 Total: ${results.length} composants analysés\n`);

if (componentsWithWarnings.length > 0) {
  console.log('⚠️  COMPOSANTS AVEC AVERTISSEMENTS:');
  componentsWithWarnings.forEach(result => {
    console.log(`\n📋 ${result.componentType}:`);
    result.warnings.forEach(warning => console.log(`   • ${warning}`));
  });
  console.log('');
}

if (invalidComponents.length > 0) {
  console.log('❌ COMPOSANTS NON CONFORMES:');
  invalidComponents.forEach(result => {
    console.log(`\n🚨 ${result.componentType}:`);
    result.errors.forEach(error => console.log(`   ❌ ${error}`));
    if (result.missingFeatures.length > 0) {
      console.log('   📋 Fonctionnalités manquantes:');
      result.missingFeatures.forEach(feature => console.log(`      - ${feature}`));
    }
  });
  console.log('');
}

if (validComponents.length === results.length) {
  console.log('🎉 Tous les composants respectent les standards établis !');
  process.exit(0);
} else {
  console.log('🔧 Certains composants nécessitent des corrections.');
  process.exit(1);
}