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
    const styles = component.styles || {};
    const attributes = component.attributes || {};
    const { className, ...otherAttributes } = attributes;

    const styleString = Object.entries(styles)
      .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    const attributeString = Object.entries(otherAttributes)
      .filter(([key, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    const tag = component.tag || 'div';
    const classAttr = className ? `class="${className}"` : '';
    const indentStr = ' '.repeat(indent);

    const openingTagParts = [
      classAttr,
      styleString ? `style="${styleString}"` : '',
      attributeString
    ].filter(Boolean).join(' ');

    const openingTag = `<${tag}${openingTagParts ? ' ' + openingTagParts : ''}>`;

    if (component.children && component.children.length > 0) {
      const childrenHTML = component.children.map(child => 
        renderComponent(child, indent + 2)
      ).join('\n');
      
      return `${indentStr}${openingTag}\n${childrenHTML}\n${indentStr}</${tag}>`;
    } else {
      const content = component.content || '';
      if (content) {
        return `${indentStr}${openingTag}${content}</${tag}>`;
      }
      return `${indentStr}${openingTag}</${tag}>`;
    }
  };

  const bodyContent = pageStructure.map(component => 
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
`;

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