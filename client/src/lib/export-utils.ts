import type { Project, ComponentDefinition } from "@shared/schema";

export interface ExportOptions {
  includeCSS: boolean;
  includeJS: boolean;
  minify: boolean;
  inlineCSS: boolean;
  responsive: boolean;
  seoOptimized: boolean;
}

export interface ExportedFile {
  path: string;
  content: string;
  type: "html" | "css" | "js" | "json";
}

export const defaultExportOptions: ExportOptions = {
  includeCSS: true,
  includeJS: true,
  minify: false,
  inlineCSS: false,
  responsive: true,
  seoOptimized: true,
};

export function exportProject(project: Project, options = defaultExportOptions): ExportedFile[] {
  const files: ExportedFile[] = [];

  // Generate HTML files for each page
  if (project.content.pages) {
    project.content.pages.forEach(page => {
      const htmlContent = generateHTML(page, project, options);
      const fileName = page.path === "/" ? "index.html" : `${page.name}.html`;
      
      files.push({
        path: fileName,
        content: htmlContent,
        type: "html"
      });
    });
  }

  // Generate CSS file
  if (options.includeCSS && !options.inlineCSS) {
    const cssContent = generateCSS(project, options);
    if (cssContent.trim()) {
      files.push({
        path: "styles.css",
        content: cssContent,
        type: "css"
      });
    }
  }

  // Generate JavaScript file
  if (options.includeJS) {
    const jsContent = generateJS(project, options);
    if (jsContent.trim()) {
      files.push({
        path: "script.js",
        content: jsContent,
        type: "js"
      });
    }
  }

  // Generate package.json for standalone projects
  if (project.type === "standalone") {
    const packageJson = generatePackageJson(project);
    files.push({
      path: "package.json",
      content: packageJson,
      type: "json"
    });
  }

  return files;
}

function generateHTML(page: any, project: Project, options: ExportOptions): string {
  const title = page.meta?.title || project.settings.seo?.title || project.name;
  const description = page.meta?.description || project.settings.seo?.description || "";
  const keywords = page.meta?.keywords?.join(", ") || project.settings.seo?.keywords?.join(", ") || "";
  
  const viewport = options.responsive 
    ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    : '';

  const seoMeta = options.seoOptimized ? `
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${page.meta?.author || 'SiteJet Clone'}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
  ` : '';

  const cssLink = options.includeCSS && !options.inlineCSS 
    ? '<link rel="stylesheet" href="styles.css">' 
    : '';

  const inlineCSS = options.includeCSS && options.inlineCSS 
    ? `<style>\n${generateCSS(project, options)}\n</style>` 
    : '';

  const jsScript = options.includeJS 
    ? '<script src="script.js"></script>' 
    : '';

  const bodyContent = renderComponents(page.content?.structure || []);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    ${viewport}
    <title>${title}</title>
    ${seoMeta}
    ${cssLink}
    ${inlineCSS}
</head>
<body>
    ${bodyContent}
    ${jsScript}
</body>
</html>`;

  return options.minify ? minifyHTML(html) : html;
}

function renderComponents(components: ComponentDefinition[]): string {
  return components.map(component => {
    const tag = component.tag || 'div';
    const attributes = component.attributes || {};
    const styles = component.styles || {};
    
    // Build attributes string
    const attributesArray = Object.entries(attributes)
      .filter(([key, value]) => key !== 'style' && value !== undefined)
      .map(([key, value]) => `${key}="${escapeHtml(String(value))}"`);

    // Build inline styles
    if (Object.keys(styles).length > 0) {
      const styleString = Object.entries(styles)
        .map(([key, value]) => `${camelToKebab(key)}:${value}`)
        .join(';');
      attributesArray.push(`style="${styleString}"`);
    }

    const attributesString = attributesArray.join(' ');
    const children = component.children ? renderComponents(component.children) : '';
    const content = escapeHtml(component.content || '');

    // Self-closing tags
    if (['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tag)) {
      return `<${tag} ${attributesString} />`;
    }

    return `<${tag} ${attributesString}>${content}${children}</${tag}>`;
  }).join('\n');
}

function generateCSS(project: Project, options: ExportOptions): string {
  let css = "";

  // Add base styles for responsive design
  if (options.responsive) {
    css += `
/* Base responsive styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

img {
  max-width: 100%;
  height: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
}

`;
  }

  // Add global styles from project
  if (project.content.styles?.global) {
    css += project.content.styles.global + "\n\n";
  }

  // Add component-specific styles
  if (project.content.styles?.components) {
    Object.entries(project.content.styles.components).forEach(([selector, styles]) => {
      css += `${selector} {\n${styles}\n}\n\n`;
    });
  }

  // Generate styles from page components
  if (project.content.pages) {
    project.content.pages.forEach(page => {
      if (page.content?.structure) {
        css += generateComponentStyles(page.content.structure);
      }
    });
  }

  return options.minify ? minifyCSS(css) : css;
}

function generateComponentStyles(components: ComponentDefinition[]): string {
  let css = "";

  components.forEach(component => {
    if (component.styles && Object.keys(component.styles).length > 0) {
      const selector = `#${component.id}`;
      const styleEntries = Object.entries(component.styles)
        .map(([property, value]) => `  ${camelToKebab(property)}: ${value};`)
        .join('\n');
      
      css += `${selector} {\n${styleEntries}\n}\n\n`;
    }

    if (component.children) {
      css += generateComponentStyles(component.children);
    }
  });

  return css;
}

function generateJS(project: Project, options: ExportOptions): string {
  let js = `
// Generated by SiteJet Clone
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully');
    
    // Add basic interactivity
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.getAttribute('onclick')) {
                console.log('Button clicked:', this.textContent);
            }
        });
    });
    
    // Form handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
        });
    });
    
    // Responsive image loading
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Utility functions
function toggleElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = element.style.display === 'none' ? '' : 'none';
    }
}

function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}
`;

  return options.minify ? minifyJS(js) : js;
}

function generatePackageJson(project: Project): string {
  const packageJson = {
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    description: project.description || `Website generated by SiteJet Clone`,
    main: "index.html",
    scripts: {
      start: "python -m http.server 8000",
      "start:php": "php -S localhost:8000",
      "start:node": "npx http-server -p 8000"
    },
    keywords: [
      "website",
      "sitejet-clone",
      "static-site"
    ],
    author: "SiteJet Clone",
    license: "MIT",
    devDependencies: {
      "http-server": "^14.1.1"
    }
  };

  return JSON.stringify(packageJson, null, 2);
}

// Utility functions
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function minifyHTML(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function minifyCSS(css: string): string {
  return css
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .trim();
}

function minifyJS(js: string): string {
  // Basic JS minification - for production, use a proper minifier
  return js
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, ';}')
    .replace(/{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .trim();
}

export function downloadFiles(files: ExportedFile[], projectName: string): void {
  if (files.length === 1) {
    // Download single file
    const file = files[0];
    downloadFile(file.content, file.path);
  } else {
    // Create and download ZIP (basic implementation)
    // In a real implementation, you'd use a library like JSZip
    files.forEach(file => {
      setTimeout(() => downloadFile(file.content, file.path), 100);
    });
  }
}

function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
