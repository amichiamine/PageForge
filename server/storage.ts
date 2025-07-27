import { type User, type InsertUser, type Project, type InsertProject, type UpdateProject, 
         type Template, type InsertTemplate, type Page, type InsertPage, type UpdatePage,
         type ProjectContent, type TemplateContent, type ComponentDefinition } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Page methods
  getProjectPages(projectId: string): Promise<Page[]>;
  getPage(id: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, updates: UpdatePage): Promise<Page | undefined>;
  deletePage(id: string): Promise<boolean>;
  
  // Export methods
  exportProject(projectId: string): Promise<{ files: Array<{ path: string; content: string; }> }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private templates: Map<string, Template>;
  private pages: Map<string, Page>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.templates = new Map();
    this.pages = new Map();
    
    // Initialize with built-in templates
    this.initializeBuiltInTemplates();
  }

  private initializeBuiltInTemplates() {
    const builtInTemplates: Array<Omit<Template, 'id' | 'createdAt'>> = [
      {
        name: "Page d'accueil moderne",
        description: "Template responsive avec sections hero, features, témoignages",
        category: "landing",
        thumbnail: "landing-modern",
        content: {
          structure: [
            {
              id: "hero-section",
              type: "section",
              tag: "section",
              attributes: { className: "hero-section" },
              styles: { 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center"
              },
              children: [
                {
                  id: "hero-container",
                  type: "container",
                  tag: "div",
                  attributes: { className: "container" },
                  styles: { maxWidth: "1200px", padding: "0 2rem" },
                  children: [
                    {
                      id: "hero-title",
                      type: "heading",
                      tag: "h1",
                      content: "Bienvenue sur notre site",
                      styles: { fontSize: "3rem", marginBottom: "1rem", fontWeight: "bold" }
                    },
                    {
                      id: "hero-subtitle",
                      type: "text",
                      tag: "p",
                      content: "Découvrez nos solutions innovantes",
                      styles: { fontSize: "1.25rem", marginBottom: "2rem" }
                    },
                    {
                      id: "hero-cta",
                      type: "button",
                      tag: "button",
                      content: "En savoir plus",
                      styles: { 
                        backgroundColor: "#ff6b6b",
                        color: "white",
                        padding: "1rem 2rem",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontSize: "1.1rem",
                        cursor: "pointer"
                      }
                    }
                  ]
                }
              ]
            }
          ],
          styles: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; }
            .hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 1200px; margin: 0 auto; }
          `,
          meta: {
            title: "Page d'accueil moderne",
            description: "Template de landing page moderne et responsive"
          }
        },
        tags: ["landing", "hero", "modern", "responsive"],
        isBuiltIn: true
      },
      {
        name: "Boutique en ligne",
        description: "Template pour site marchand avec catalogue produits",
        category: "ecommerce",
        thumbnail: "ecommerce-store",
        content: {
          structure: [
            {
              id: "header",
              type: "header",
              tag: "header",
              attributes: { className: "site-header" },
              styles: { 
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "sticky",
                top: "0",
                zIndex: "1000"
              },
              children: [
                {
                  id: "nav",
                  type: "navigation",
                  tag: "nav",
                  attributes: { className: "main-nav" },
                  styles: { 
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 2rem"
                  },
                  children: [
                    {
                      id: "logo",
                      type: "text",
                      tag: "h1",
                      content: "Ma Boutique",
                      styles: { fontSize: "1.5rem", fontWeight: "bold", color: "#333" }
                    },
                    {
                      id: "cart",
                      type: "button",
                      tag: "button",
                      content: "Panier (0)",
                      styles: { 
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "0.25rem"
                      }
                    }
                  ]
                }
              ]
            },
            {
              id: "products-section",
              type: "section",
              tag: "section",
              attributes: { className: "products" },
              styles: { padding: "3rem 2rem" },
              children: [
                {
                  id: "products-grid",
                  type: "grid",
                  tag: "div",
                  attributes: { className: "products-grid" },
                  styles: { 
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "2rem",
                    maxWidth: "1200px",
                    margin: "0 auto"
                  },
                  children: [
                    {
                      id: "product-card",
                      type: "card",
                      tag: "div",
                      attributes: { className: "product-card" },
                      styles: { 
                        backgroundColor: "white",
                        borderRadius: "0.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        overflow: "hidden"
                      },
                      children: [
                        {
                          id: "product-image",
                          type: "image",
                          tag: "div",
                          styles: { 
                            backgroundColor: "#f8f9fa",
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                            color: "#dee2e6"
                          },
                          content: "📦"
                        },
                        {
                          id: "product-info",
                          type: "container",
                          tag: "div",
                          styles: { padding: "1rem" },
                          children: [
                            {
                              id: "product-title",
                              type: "heading",
                              tag: "h3",
                              content: "Produit exemple",
                              styles: { marginBottom: "0.5rem" }
                            },
                            {
                              id: "product-price",
                              type: "text",
                              tag: "p",
                              content: "29,99 €",
                              styles: { fontSize: "1.25rem", fontWeight: "bold", color: "#007bff" }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          styles: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
          `,
          meta: {
            title: "Boutique en ligne",
            description: "Template pour site e-commerce moderne"
          }
        },
        tags: ["ecommerce", "shop", "products", "responsive"],
        isBuiltIn: true
      },
      {
        name: "Portfolio créatif",
        description: "Showcase pour projets créatifs et professionnels",
        category: "portfolio",
        thumbnail: "portfolio-creative",
        content: {
          structure: [
            {
              id: "portfolio-header",
              type: "header",
              tag: "header",
              attributes: { className: "portfolio-header" },
              styles: { 
                backgroundColor: "#1a1a1a",
                color: "white",
                padding: "4rem 2rem",
                textAlign: "center"
              },
              children: [
                {
                  id: "profile-image",
                  type: "image",
                  tag: "div",
                  styles: { 
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "#333",
                    margin: "0 auto 2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "4rem"
                  },
                  content: "👤"
                },
                {
                  id: "profile-name",
                  type: "heading",
                  tag: "h1",
                  content: "Votre Nom",
                  styles: { fontSize: "2.5rem", marginBottom: "1rem" }
                },
                {
                  id: "profile-title",
                  type: "text",
                  tag: "p",
                  content: "Développeur Web & Designer",
                  styles: { fontSize: "1.25rem", opacity: "0.8" }
                }
              ]
            },
            {
              id: "portfolio-grid",
              type: "section",
              tag: "section",
              attributes: { className: "portfolio-grid" },
              styles: { padding: "4rem 2rem" },
              children: [
                {
                  id: "projects-container",
                  type: "container",
                  tag: "div",
                  styles: { 
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                    maxWidth: "1200px",
                    margin: "0 auto"
                  },
                  children: [
                    {
                      id: "project-card",
                      type: "card",
                      tag: "div",
                      attributes: { class: "project-card" },
                      styles: { 
                        backgroundColor: "white",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease"
                      },
                      children: [
                        {
                          id: "project-image",
                          type: "image",
                          tag: "div",
                          styles: { 
                            backgroundColor: "#8b5cf6",
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "2rem"
                          },
                          content: "🎨"
                        },
                        {
                          id: "project-info",
                          type: "container",
                          tag: "div",
                          styles: { padding: "1.5rem" },
                          children: [
                            {
                              id: "project-title",
                              type: "heading",
                              tag: "h3",
                              content: "Projet Créatif",
                              styles: { marginBottom: "0.5rem", fontSize: "1.25rem" }
                            },
                            {
                              id: "project-description",
                              type: "text",
                              tag: "p",
                              content: "Description du projet et technologies utilisées",
                              styles: { color: "#666", lineHeight: "1.6" }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          styles: `
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; }
            .project-card:hover { transform: translateY(-4px); }
          `,
          meta: {
            title: "Portfolio créatif",
            description: "Portfolio moderne pour showcaser vos projets"
          }
        },
        tags: ["portfolio", "creative", "projects", "personal"],
        isBuiltIn: true
      }
    ];

    builtInTemplates.forEach(template => {
      const id = randomUUID();
      this.templates.set(id, {
        ...template,
        id,
        createdAt: new Date()
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.isActive)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getProject(id: string): Promise<Project | undefined> {
    const project = this.projects.get(id);
    return project?.isActive ? project : undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    
    let content: ProjectContent = { pages: [], assets: [], styles: { global: "", components: {} } };
    
    // If template is specified, initialize with template content
    if (insertProject.template) {
      const template = await this.getTemplate(insertProject.template);
      if (template) {
        content = {
          pages: [{
            id: randomUUID(),
            name: "index",
            path: "/",
            content: {
              structure: template.content.structure,
              styles: template.content.styles,
              scripts: template.content.scripts
            }
          }],
          assets: [],
          styles: {
            global: template.content.styles || "",
            components: {}
          }
        };
      }
    } else {
      // Always initialize with at least one page
      content = {
        pages: [{
          id: randomUUID(),
          name: "index",
          path: "/",
          content: {
            structure: [],
            styles: "",
            scripts: ""
          }
        }],
        assets: [],
        styles: {
          global: "",
          components: {}
        }
      };
    }

    const project: Project = {
      ...insertProject,
      id,
      description: insertProject.description || null,
      template: insertProject.template || null,
      content,
      settings: {
        responsive: {
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
          }
        },
        seo: {},
        deployment: {},
        vscode: {}
      },
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };
    
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: UpdateProject): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project || !project.isActive) {
      return undefined;
    }

    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    const project = this.projects.get(id);
    if (!project) {
      return false;
    }

    // Soft delete
    const updatedProject: Project = {
      ...project,
      isActive: false,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updatedProject);
    
    // Also soft delete associated pages
    const projectPages = await this.getProjectPages(id);
    for (const page of projectPages) {
      await this.deletePage(page.id);
    }
    
    return true;
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      ...insertTemplate,
      id,
      description: insertTemplate.description || null,
      thumbnail: insertTemplate.thumbnail || null,
      tags: insertTemplate.tags || null,
      createdAt: new Date(),
      isBuiltIn: false,
    };
    
    this.templates.set(id, template);
    return template;
  }

  // Page methods
  async getProjectPages(projectId: string): Promise<Page[]> {
    return Array.from(this.pages.values())
      .filter(page => page.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getPage(id: string): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const id = randomUUID();
    const now = new Date();
    
    const page: Page = {
      ...insertPage,
      id,
      content: insertPage.content || { structure: [] },
      meta: insertPage.meta || {},
      createdAt: now,
      updatedAt: now,
    };
    
    this.pages.set(id, page);
    return page;
  }

  async updatePage(id: string, updates: UpdatePage): Promise<Page | undefined> {
    const page = this.pages.get(id);
    if (!page) {
      return undefined;
    }

    const updatedPage: Page = {
      ...page,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.pages.set(id, updatedPage);
    return updatedPage;
  }

  async deletePage(id: string): Promise<boolean> {
    return this.pages.delete(id);
  }

  // Export methods
  async exportProject(projectId: string): Promise<{ files: Array<{ path: string; content: string; }> }> {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const files: Array<{ path: string; content: string; }> = [];
    
    // Generate HTML files for each page
    if (project.content.pages) {
      for (const page of project.content.pages) {
        const htmlContent = this.generateHTML(page, project);
        files.push({
          path: page.path === "/" ? "index.html" : `${page.name}.html`,
          content: htmlContent
        });
      }
    }

    // Generate CSS file
    const cssContent = this.generateCSS(project);
    if (cssContent) {
      files.push({
        path: "styles.css",
        content: cssContent
      });
    }

    // Generate JavaScript file
    const jsContent = this.generateJS(project);
    if (jsContent) {
      files.push({
        path: "script.js",
        content: jsContent
      });
    }

    return { files };
  }

  private generateHTML(page: any, project: Project): string {
    const title = page.content?.meta?.title || project.settings.seo?.title || project.name;
    const description = page.content?.meta?.description || project.settings.seo?.description || "";
    
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${this.renderComponents(page.content.structure || [])}
    <script src="script.js"></script>
</body>
</html>`;
  }

  private renderComponents(components: ComponentDefinition[]): string {
    return components.map(component => {
      const tag = component.tag || 'div';
      const attributes = component.attributes || {};
      const styles = component.styles ? `style="${this.styleObjectToString(component.styles)}"` : '';
      
      const attributesString = Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      
      const children = component.children ? this.renderComponents(component.children) : '';
      const content = component.content || '';
      
      return `<${tag} ${attributesString} ${styles}>${content}${children}</${tag}>`;
    }).join('\n');
  }

  private styleObjectToString(styles: Record<string, any>): string {
    return Object.entries(styles)
      .map(([key, value]) => `${this.camelToKebab(key)}:${value}`)
      .join(';');
  }

  private camelToKebab(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  private generateCSS(project: Project): string {
    const globalStyles = project.content.styles?.global || '';
    const componentStyles = project.content.styles?.components || {};
    
    let css = globalStyles + '\n\n';
    
    Object.entries(componentStyles).forEach(([selector, styles]) => {
      css += `${selector} {\n${styles}\n}\n\n`;
    });
    
    return css;
  }

  private generateJS(project: Project): string {
    // Generate basic JavaScript for interactivity
    return `
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
});
`;
  }
}

export const storage = new MemStorage();
