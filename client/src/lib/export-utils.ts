import type { Project, ComponentDefinition } from "@shared/schema";

export interface ExportOptions {
  includeCSS?: boolean;
  includeJS?: boolean;
  minify?: boolean;
  inlineCSS?: boolean;
  responsive?: boolean;
  seoOptimized?: boolean;
}

export interface ExportFile {
  path: string;
  content: string;
  type: string;
}

export function exportProject(project: Project, options: ExportOptions = {}): ExportFile[] {
  // Validation du projet
  if (!project || !project.name) {
    throw new Error('Projet invalide : nom manquant');
  }
  
  const files: ExportFile[] = [];
  const currentPage = project.content?.pages?.[0];
  
  if (!currentPage) {
    return [{
      path: "index.html",
      content: `<!DOCTYPE html><html><head><title>${project.name}</title></head><body><p>Projet vide - aucun contenu à exporter</p></body></html>`,
      type: "html"
    }];
  }

  // Generate HTML
  const htmlContent = generateHTML(project, currentPage, options);
  files.push({
    path: "index.html",
    content: htmlContent,
    type: "html"
  });

  // Generate CSS if requested
  if (options.includeCSS && !options.inlineCSS) {
    const cssContent = generateCSS(project, currentPage, options);
    files.push({
      path: "styles.css",
      content: cssContent,
      type: "css"
    });
  }

  // Generate JavaScript if requested
  if (options.includeJS) {
    const jsContent = generateJS(project, currentPage, options);
    files.push({
      path: "script.js",
      content: jsContent,
      type: "js"
    });
  }

  // Add package.json for project metadata
  files.push({
    path: "package.json",
    content: JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: "1.0.0",
      description: project.description || "Exported from PageForge",
      main: "index.html",
      scripts: {
        start: "npx serve .",
        build: "echo 'Already built'",
        dev: "npx serve . -l 3000"
      },
      keywords: ["website", "exported", "pageforge"],
      author: "PageForge",
      license: "MIT",
      devDependencies: {
        "serve": "^14.0.0"
      }
    }, null, 2),
    type: "json"
  });

  // Add README.md with deployment instructions
  files.push({
    path: "README.md",
    content: `# ${project.name}

${project.description || "Projet exporté depuis PageForge"}

## Installation

\`\`\`bash
npm install
\`\`\`

## Développement local

\`\`\`bash
npm start
\`\`\`

## Déploiement

Ce projet est prêt pour le déploiement sur n'importe quel serveur web statique.

### Options de déploiement :
- **Netlify**: Glissez-déposez le dossier dans Netlify
- **Vercel**: Connectez votre repository GitHub
- **GitHub Pages**: Activez Pages dans les paramètres du repository
- **Serveur traditionnel**: Uploadez les fichiers via FTP/cPanel

### Structure des fichiers :
- \`index.html\` - Page principale
- \`styles.css\` - Feuilles de style (si séparées)
- \`script.js\` - Scripts JavaScript (si inclus)

Généré avec PageForge - ${new Date().toLocaleDateString()}
`,
    type: "md"
  });

  return files;
}

function generateHTML(project: Project, page: any, options: ExportOptions): string {
  const pageStructure = page.content?.structure || [];
  const title = page.content?.meta?.title || project.name;
  const description = page.content?.meta?.description || project.description || "";
  
  const renderComponent = (component: ComponentDefinition, indent: number = 2): string => {
    const attributes = component.attributes || {};
    const { className, ...otherAttributes } = attributes;

    const attributeString = Object.entries(otherAttributes)
      .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    const tag = component.tag || 'div';
    const classAttr = className ? `class="${className}"` : '';
    const idAttr = `id="${component.id}"`;
    const indentStr = ' '.repeat(indent);
    const childIndentStr = ' '.repeat(indent + 2);

    // Construire la balise ouvrante
    const openingTagParts = [tag, idAttr, classAttr, attributeString].filter(part => part.trim().length > 0);
    const openingTag = `<${openingTagParts.join(' ')}>`;

    // Gestion spéciale pour les composants complexes avec componentData
    if (component.type === 'carousel') {
      const slides = component.componentData?.slides || [];
      
      // Si pas de slides configurés, afficher un placeholder
      if (slides.length === 0) {
        return `${indentStr}<div ${idAttr} class="carousel-container ${className || ''}">
${childIndentStr}<div class="carousel-track">
${childIndentStr}  <div class="carousel-slide carousel-placeholder">
${childIndentStr}    <div class="carousel-content">
${childIndentStr}      <h3 class="carousel-title">Carousel</h3>
${childIndentStr}      <p class="carousel-description">Configurez vos slides dans l'éditeur</p>
${childIndentStr}    </div>
${childIndentStr}  </div>
${childIndentStr}</div>
${indentStr}</div>`;
      }
      
      const slidesHTML = slides.map((slide: any, index: number) => {
        return `${childIndentStr}<div class="carousel-slide" ${slide.backgroundColor ? `data-bg-color="${slide.backgroundColor}"` : ''}>
${slide.image ? `${childIndentStr}  <img src="${slide.image}" alt="${slide.title || `Slide ${index + 1}`}" class="carousel-slide-image">` : ''}
${slide.image ? `${childIndentStr}  <div class="carousel-overlay"></div>` : ''}
${childIndentStr}  <div class="carousel-content">
${childIndentStr}    ${slide.title ? `<h3 class="carousel-title">${slide.title}</h3>` : ''}
${childIndentStr}    ${slide.description ? `<p class="carousel-description">${slide.description}</p>` : ''}
${childIndentStr}    ${slide.buttonText ? `<button class="carousel-button">${slide.buttonText}</button>` : ''}
${childIndentStr}  </div>
${childIndentStr}</div>`;
      }).join('\n');
      
      return `${indentStr}<div ${idAttr} class="carousel-container ${className || ''}">
${childIndentStr}<div class="carousel-track">
${slidesHTML}
${childIndentStr}</div>
${indentStr}</div>`;
    }

    // Gestion des listes avec éléments
    if (component.type === 'list' && component.componentData?.listItems) {
      const items = component.componentData.listItems;
      const itemsHTML = items.map((item: any) => {
        return `${childIndentStr}<li>${item.link ? `<a href="${item.link}">${item.text}</a>` : item.text}</li>`;
      }).join('\n');
      
      return `${indentStr}<ul ${idAttr} ${classAttr}>
${itemsHTML}
${indentStr}</ul>`;
    }

    // Gestion des accordéons
    if (component.type === 'accordion' && component.componentData?.accordionItems) {
      const items = component.componentData.accordionItems;
      const itemsHTML = items.map((item: any, index: number) => {
        return `${childIndentStr}<div class="accordion-item" style="border: 1px solid #e5e7eb; margin-bottom: 8px; border-radius: 6px;">
${childIndentStr}  <button class="accordion-header" style="width: 100%; padding: 12px; background: #f9fafb; border: none; text-align: left; font-weight: 600; cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
${childIndentStr}    ${item.question}
${childIndentStr}  </button>
${childIndentStr}  <div class="accordion-content" style="padding: 12px; display: ${index === 0 ? 'block' : 'none'}; border-top: 1px solid #e5e7eb;">
${childIndentStr}    ${item.answer}
${childIndentStr}  </div>
${childIndentStr}</div>`;
      }).join('\n');
      
      return `${indentStr}${openingTag}
${itemsHTML}
${indentStr}</${tag}>`;
    }

    // Gestion des grilles avec éléments
    if (component.type === 'grid' && component.componentData?.gridItems) {
      const items = component.componentData.gridItems;
      const itemsHTML = items.map((item: any) => {
        return `${childIndentStr}<div class="grid-item" style="padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
${childIndentStr}  ${item.title ? `<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${item.title}</h3>` : ''}
${childIndentStr}  ${item.content ? `<p style="margin: 0; color: #6b7280;">${item.content}</p>` : ''}
${childIndentStr}</div>`;
      }).join('\n');
      
      return `${indentStr}${openingTag}
${itemsHTML}
${indentStr}</${tag}>`;
    }

    // Gestion spécifique pour les images
    if (component.type === 'image') {
      if (attributes.src) {
        return `${indentStr}<img src="${attributes.src}" alt="${attributes.alt || ''}" ${idAttr} ${classAttr} ${attributeString} />`;
      } else {
        return `${indentStr}<div ${idAttr} ${classAttr} style="background-color: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; padding: 20px;">
${childIndentStr}📷 Image non configurée
${indentStr}</div>`;
      }
    }

    // Gestion spécifique pour l'audio
    if (component.type === 'audio') {
      if (attributes.src) {
        return `${indentStr}<audio controls ${idAttr} ${classAttr} ${attributeString}>
${childIndentStr}<source src="${attributes.src}" type="audio/mpeg">
${childIndentStr}Votre navigateur ne supporte pas l'élément audio.
${indentStr}</audio>`;
      } else {
        return `${indentStr}<div ${idAttr} ${classAttr} style="background-color: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; padding: 20px;">
${childIndentStr}🎵 Fichier audio non configuré
${indentStr}</div>`;
      }
    }

    // Gestion spécifique pour la vidéo
    if (component.type === 'video') {
      if (attributes.src) {
        return `${indentStr}<video controls ${idAttr} ${classAttr} ${attributeString}>
${childIndentStr}<source src="${attributes.src}" type="video/mp4">
${childIndentStr}Votre navigateur ne supporte pas l'élément vidéo.
${indentStr}</video>`;
      } else {
        return `${indentStr}<div ${idAttr} ${classAttr} style="background-color: #f3f4f6; border: 2px dashed #d1d5db; display: flex; align-items: center; justify-content: center; color: #6b7280; padding: 20px;">
${childIndentStr}🎬 Vidéo non configurée
${indentStr}</div>`;
      }
    }

    // Contenu et enfants
    const content = component.content || '';
    const children = component.children?.map(child => renderComponent(child, indent + 2)).join('\n') || '';

    if (content && children) {
      return `${indentStr}${openingTag}\n${childIndentStr}${content}\n${children}\n${indentStr}</${tag}>`;
    } else if (content) {
      return `${indentStr}${openingTag}\n${childIndentStr}${content}\n${indentStr}</${tag}>`;
    } else if (children) {
      return `${indentStr}${openingTag}\n${children}\n${indentStr}</${tag}>`;
    } else {
      return `${indentStr}${openingTag}</${tag}>`;
    }
  };

  const bodyContent = pageStructure.map((component: ComponentDefinition) => 
    renderComponent(component, 2)
  ).join('\n');

  const cssLink = options.includeCSS && !options.inlineCSS 
    ? '  <link rel="stylesheet" href="styles.css">\n' 
    : '';

  const inlineCSS = options.inlineCSS && options.includeCSS 
    ? `  <style>\n${generateCSS(project, page, options)}\n  </style>\n`
    : '';

  const jsScript = options.includeJS 
    ? '  <script src="script.js"></script>\n'
    : '';

  const responsiveMeta = options.responsive 
    ? '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    : '';

  const seoMeta = options.seoOptimized 
    ? `  <meta name="description" content="${description}">\n  <meta name="author" content="PageForge">\n`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
${responsiveMeta}  <title>${title}</title>
${seoMeta}${cssLink}${inlineCSS}</head>
<body>
${bodyContent}
${jsScript}</body>
</html>`;
}

function generateCSS(project: Project, page: any, options: ExportOptions): string {
  const globalStyles = project.content?.styles?.global || '';
  const pageStyles = page.content?.styles || '';
  const pageStructure = page.content?.structure || [];
  
  // Fonction pour détecter les types de composants utilisés
  const getUsedComponentTypes = (components: ComponentDefinition[]): Set<string> => {
    const usedTypes = new Set<string>();
    
    const processComponent = (component: ComponentDefinition) => {
      usedTypes.add(component.type);
      
      if (component.children) {
        component.children.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    return usedTypes;
  };
  
  // Générer le CSS pour chaque composant
  const generateComponentCSS = (components: ComponentDefinition[]): string => {
    let css = '';
    
    const processComponent = (component: ComponentDefinition) => {
      if (component.styles && Object.keys(component.styles).length > 0) {
        const selector = `#${component.id}`;
        const styles = Object.entries(component.styles)
          .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
          .map(([key, value]) => `  ${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
          .join('\n');
        
        if (styles) {
          css += `${selector} {\n${styles}\n}\n\n`;
        }
      }
      
      // Traiter les enfants récursivement
      if (component.children) {
        component.children.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    return css;
  };
  
  const componentCSS = generateComponentCSS(pageStructure);
  const usedTypes = getUsedComponentTypes(pageStructure);
  
  // Fonction pour générer les styles spécifiques aux composants
  const getComponentSpecificStyles = (usedTypes: Set<string>): string => {
    let styles = '';
    
    // Styles pour carousel
    if (usedTypes.has('carousel')) {
      styles += `
/* Styles pour carousel */
.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.carousel-slide img,
.carousel-slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.carousel-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
}

.carousel-title {
  font-size: 24px;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.carousel-description {
  margin: 0 0 16px 0;
  font-size: 16px;
}

.carousel-button {
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.carousel-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.carousel-placeholder {
  background-color: #3b82f6;
}

.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 10;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}
`;
    }
    
    // Styles pour accordion
    if (usedTypes.has('accordion')) {
      styles += `
/* Styles pour accordion */
.accordion-item {
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  border-radius: 6px;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  padding: 12px 16px;
  background: #f9fafb;
  border: none;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-header:hover {
  background: #f3f4f6;
}

.accordion-header::after {
  content: '+';
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.accordion-header.active::after {
  transform: rotate(45deg);
}

.accordion-content {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
}
`;
    }
    
    // Styles pour grid
    if (usedTypes.has('grid')) {
      styles += `
/* Styles pour grid */
.grid-container {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-item {
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.grid-item h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.grid-item p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}
`;
    }
    
    // Styles pour modal
    if (usedTypes.has('modal')) {
      styles += `
/* Styles pour modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
}

.modal-close:hover {
  color: #374151;
}
`;
    }
    
    // Styles pour card
    if (usedTypes.has('card')) {
      styles += `
/* Styles pour card */
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.card-body {
  padding: 16px;
}

.card-footer {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.card-text {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}
`;
    }
    
    // Styles pour form
    if (usedTypes.has('form')) {
      styles += `
/* Styles pour form */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.form-button:hover {
  background: #2563eb;
}

.form-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
`;
    }
    
    // Styles pour button
    if (usedTypes.has('button')) {
      styles += `
/* Styles pour button */
.btn {
  display: inline-block;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

.btn-outline:hover {
  background: #3b82f6;
  color: white;
}
`;
    }
    
    // Styles pour table
    if (usedTypes.has('table')) {
      styles += `
/* Styles pour table */
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.table tbody tr:hover {
  background: #f9fafb;
}

.table tbody tr:last-child td {
  border-bottom: none;
}
`;
    }
    
    // Styles pour navbar
    if (usedTypes.has('navbar')) {
      styles += `
/* Styles pour navbar */
.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  text-decoration: none;
}

.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
}

.navbar-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar-link:hover {
  color: #3b82f6;
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .navbar-toggle {
    display: block;
  }
  
  .navbar-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
  
  .navbar-nav.active {
    display: flex;
  }
}
`;
    }
    
    return styles;
  };
  
  let css = `/* Styles générés par PageForge */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

img {
  max-width: 100%;
  height: auto;
}

/* Styles pour des éléments génériques */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
`;

  // Générer les styles CSS conditionnellement selon les composants utilisés
  const componentStyles = getComponentSpecificStyles(usedTypes);
  css += componentStyles;

  // Ajouter les styles personnalisés des composants
  css += `
/* Styles des composants individuels */
${componentCSS}`;

  if (options.responsive) {
    css += `
/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  h1 { font-size: 1.8rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.3rem; }
}

@media (max-width: 480px) {
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.3rem; }
  h3 { font-size: 1.1rem; }
}
`;
  }

  if (globalStyles) {
    css += `\n/* Styles globaux */\n${globalStyles}\n`;
  }

  if (pageStyles) {
    css += `\n/* Styles de page */\n${pageStyles}\n`;
  }

  return options.minify ? css.replace(/\s+/g, ' ').trim() : css;
}

function generateJS(project: Project, page: any, options: ExportOptions): string {
  const pageScripts = page.content?.scripts || '';
  const pageStructure = page.content?.structure || [];
  
  // Détecter les types de composants utilisés
  const getUsedComponentTypes = (components: ComponentDefinition[]): Set<string> => {
    const usedTypes = new Set<string>();
    
    const processComponent = (component: ComponentDefinition) => {
      usedTypes.add(component.type);
      
      if (component.children) {
        component.children.forEach(processComponent);
      }
    };
    
    components.forEach(processComponent);
    return usedTypes;
  };
  
  const usedTypes = getUsedComponentTypes(pageStructure);
  
  let js = `// Scripts générés par PageForge
document.addEventListener('DOMContentLoaded', function() {
  console.log('${project.name} chargé avec succès');`;

  // Fonction pour générer le JavaScript spécifique aux composants
  const getComponentSpecificJS = (usedTypes: Set<string>): string => {
    let jsCode = '';
    
    if (usedTypes.has('carousel')) {
      jsCode += `
  
  // Fonctionnalité carousel
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    
    if (!track || slides.length <= 1) return;
    
    let currentSlide = 0;
    let autoplayInterval = null;
    
    // Créer les dots seulement s'il n'y en a pas déjà
    if (!carousel.querySelector('.carousel-dots')) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
      
      carousel.appendChild(dotsContainer);
    }
    
    function goToSlide(index) {
      if (index < 0 || index >= slides.length) return;
      
      currentSlide = index;
      track.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
      
      // Mettre à jour les dots
      const dots = carousel.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    // Navigation par flèches clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
      } else if (e.key === 'ArrowRight') {
        goToSlide((currentSlide + 1) % slides.length);
      }
    });
    
    // Auto-play avec pause au survol
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
      }, 5000);
    }
    
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    
    // Démarrer l'autoplay
    startAutoplay();
    
    // Pause/reprise au survol
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Appliquer les couleurs personnalisées
    slides.forEach(slide => {
      const bgColor = slide.getAttribute('data-bg-color');
      
      if (bgColor) {
        slide.style.backgroundColor = bgColor;
      }
    });
  });`;
    }
    
    return jsCode;
  };
  
  // Ajouter les fonctionnalités JavaScript conditionnellement
  const componentJS = getComponentSpecificJS(usedTypes);
  js += componentJS;
  
  // Fermer la fonction principale
  js += `
});`;

  // Ajouter les autres fonctionnalités génériques conditionnellement
  if (usedTypes.has('accordion')) {
    js += `

// Fonctionnalité accordéon
document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = content.style.display !== 'none';
      
      // Fermer tous les autres
      accordionHeaders.forEach(otherHeader => {
        if (otherHeader !== this) {
          otherHeader.nextElementSibling.style.display = 'none';
        }
      });
      
      // Toggle celui-ci
      content.style.display = isOpen ? 'none' : 'block';
    });
  });
});`;
  }

  // Animation au scroll générique (toujours incluse)
  js += `

// Animation au scroll
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observer tous les éléments avec animation
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});`;

  if (pageScripts) {
    js += `\n// Scripts personnalisés\n${pageScripts}\n`;
  }

  return options.minify 
    ? js.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, '').trim()
    : js;
}