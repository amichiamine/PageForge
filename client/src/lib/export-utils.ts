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
        return `${childIndentStr}<div class="carousel-slide" ${slide.backgroundColor ? `data-bg-color="${slide.backgroundColor}"` : ''} ${slide.image ? `data-bg-image="${slide.image}"` : ''}>
${childIndentStr}  ${slide.image ? '<div class="carousel-overlay"></div>' : ''}
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

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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

/* Styles pour des éléments génériques */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

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
  
  let js = `// Scripts générés par PageForge
document.addEventListener('DOMContentLoaded', function() {
  console.log('${project.name} chargé avec succès');
  
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
    
    // Appliquer les couleurs et images personnalisées
    slides.forEach(slide => {
      const bgColor = slide.getAttribute('data-bg-color');
      const bgImage = slide.getAttribute('data-bg-image');
      
      if (bgColor) {
        slide.style.backgroundColor = bgColor;
      }
      
      if (bgImage) {
        slide.style.backgroundImage = \`url(\${bgImage})\`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
      }
    });
  });
  
  // Fonctionnalité accordéon
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
  
  // Animation au scroll
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
});
`;

  if (pageScripts) {
    js += `\n// Scripts personnalisés\n${pageScripts}\n`;
  }

  return options.minify 
    ? js.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, '').trim()
    : js;
}