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
  const files: ExportFile[] = [];
  const currentPage = project.content?.pages?.[0];
  
  if (!currentPage) {
    return [{
      path: "index.html",
      content: "<!DOCTYPE html><html><head><title>Empty Project</title></head><body><p>No content to export</p></body></html>",
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
      description: project.description || "Exported from SiteJet clone",
      main: "index.html",
      scripts: {
        start: "serve .",
        build: "echo 'Already built'"
      },
      keywords: ["website", "exported", "sitejet"],
      author: "SiteJet Clone",
      license: "MIT"
    }, null, 2),
    type: "json"
  });

  return files;
}

function generateHTML(project: Project, page: any, options: ExportOptions): string {
  const renderComponent = (component: ComponentDefinition): string => {
    const Tag = component.tag || 'div';
    const styleString = component.styles ? 
      Object.entries(component.styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ') : '';
    
    const attributes = component.attributes || {};
    const attrString = Object.entries(attributes)
      .filter(([key]) => key !== 'className')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
      
    const className = attributes.className || '';
    
    const children = component.children?.map(renderComponent).join('') || '';
    const content = component.content || '';
    
    const inlineStyle = options.inlineCSS ? ` style="${styleString}"` : '';
    
    return `<${Tag} ${attrString} class="${className}"${inlineStyle}>${content}${children}</${Tag}>`;
  };
  
  const bodyContent = page.content.structure?.map(renderComponent).join('') || '';
  
  const cssLink = options.includeCSS && !options.inlineCSS ? 
    '<link rel="stylesheet" href="styles.css">' : '';
  
  const jsScript = options.includeJS ? 
    '<script src="script.js"></script>' : '';

  const inlineCSSStyles = options.inlineCSS ? '' : `
    <style>
      ${generateInlineCSS(project, page, options)}
    </style>
  `;

  const responsiveMeta = options.responsive ? 
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' : '';

  const seoMeta = options.seoOptimized ? `
    <meta name="description" content="${page.content.meta?.description || project.description || 'Generated with SiteJet Clone'}">
    <meta property="og:title" content="${page.content.meta?.title || project.name}">
    <meta property="og:description" content="${page.content.meta?.description || project.description || ''}">
    <meta property="og:type" content="website">
  ` : '';
  
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    ${responsiveMeta}
    <title>${page.content.meta?.title || project.name}</title>
    ${seoMeta}
    ${cssLink}
    ${inlineCSSStyles}
  </head>
  <body>
    ${bodyContent}
    ${jsScript}
  </body>
</html>`;
}

function generateCSS(project: Project, page: any, options: ExportOptions): string {
  let css = `
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Component Styles */
`;

  // Add global styles from project
  if (project.content?.styles?.global) {
    css += project.content.styles.global + '\n';
  }

  // Add page-specific styles
  if (page.content.styles) {
    css += page.content.styles + '\n';
  }

  // Add responsive styles if requested
  if (options.responsive) {
    css += `
/* Responsive Styles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-size: 1.25rem;
  }
}
`;
  }

  return options.minify ? css.replace(/\s+/g, ' ').trim() : css;
}

function generateInlineCSS(project: Project, page: any, options: ExportOptions): string {
  let css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; }
  `;

  if (project.content?.styles?.global) {
    css += project.content.styles.global;
  }

  if (page.content.styles) {
    css += page.content.styles;
  }

  return css;
}

function generateJS(project: Project, page: any, options: ExportOptions): string {
  let js = `
// Generated JavaScript for ${project.name}
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page loaded successfully');
  
  // Initialize interactive components
  initializeCarousels();
  initializeCalendars();
  initializeForms();
});

function initializeCarousels() {
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    const items = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    
    function showSlide(index) {
      items.forEach((item, i) => {
        item.style.display = i === index ? 'block' : 'none';
      });
      dots.forEach((dot, i) => {
        dot.className = i === index ? 'carousel-dot active' : 'carousel-dot';
      });
    }
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentIndex = i;
        showSlide(currentIndex);
      });
    });
    
    // Auto-advance carousel every 5 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % items.length;
      showSlide(currentIndex);
    }, 5000);
  });
}

function initializeCalendars() {
  const calendars = document.querySelectorAll('.calendar');
  calendars.forEach(calendar => {
    const prevBtn = calendar.querySelector('.calendar-nav:first-child');
    const nextBtn = calendar.querySelector('.calendar-nav:last-child');
    const title = calendar.querySelector('.calendar-title');
    
    if (prevBtn && nextBtn && title) {
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      let currentMonth = 0;
      let currentYear = 2024;
      
      function updateCalendar() {
        title.textContent = \`\${months[currentMonth]} \${currentYear}\`;
      }
      
      prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        updateCalendar();
      });
      
      nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        updateCalendar();
      });
    }
  });
}

function initializeForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Formulaire soumis avec succès!');
    });
  });
}
`;

  return options.minify ? js.replace(/\s+/g, ' ').trim() : js;
}