// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  projects;
  templates;
  pages;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.templates = /* @__PURE__ */ new Map();
    this.pages = /* @__PURE__ */ new Map();
    this.initializeBuiltInTemplates();
  }
  initializeBuiltInTemplates() {
    const builtInTemplates = [
      {
        name: "Page d'accueil moderne",
        description: "Template responsive avec sections hero, features, t\xE9moignages",
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
                      content: "D\xE9couvrez nos solutions innovantes",
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
              id: "featured-carousel",
              type: "section",
              tag: "section",
              attributes: { className: "featured-carousel" },
              styles: { backgroundColor: "#fff", padding: "3rem 2rem" },
              children: [
                {
                  id: "carousel-container",
                  type: "container",
                  tag: "div",
                  styles: { maxWidth: "1200px", margin: "0 auto" },
                  children: [
                    {
                      id: "carousel-title",
                      type: "heading",
                      tag: "h2",
                      content: "Produits Populaires",
                      styles: { fontSize: "2rem", textAlign: "center", marginBottom: "2rem", color: "#333" }
                    },
                    {
                      id: "products-carousel",
                      type: "carousel",
                      tag: "div",
                      attributes: { className: "products-carousel" },
                      styles: {
                        display: "flex",
                        gap: "1.5rem",
                        overflowX: "auto",
                        padding: "1rem 0",
                        scrollBehavior: "smooth"
                      },
                      children: [
                        {
                          id: "carousel-product-1",
                          type: "card",
                          tag: "div",
                          attributes: { className: "carousel-product-card" },
                          styles: {
                            minWidth: "280px",
                            backgroundColor: "white",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            border: "1px solid #e2e8f0"
                          },
                          children: [
                            {
                              id: "carousel-product-image-1",
                              type: "image",
                              tag: "div",
                              styles: {
                                backgroundColor: "#f59e0b",
                                height: "200px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "3rem",
                                color: "white"
                              },
                              content: "\u2B50"
                            },
                            {
                              id: "carousel-product-info-1",
                              type: "container",
                              tag: "div",
                              styles: { padding: "1.5rem" },
                              children: [
                                {
                                  id: "carousel-product-title-1",
                                  type: "heading",
                                  tag: "h3",
                                  content: "Produit Vedette",
                                  styles: { fontSize: "1.25rem", marginBottom: "0.5rem", color: "#333" }
                                },
                                {
                                  id: "carousel-product-price-1",
                                  type: "text",
                                  tag: "p",
                                  content: "49,99 \u20AC",
                                  styles: { fontSize: "1.25rem", fontWeight: "bold", color: "#f59e0b", marginBottom: "1rem" }
                                },
                                {
                                  id: "carousel-add-to-cart-1",
                                  type: "button",
                                  tag: "button",
                                  content: "Ajouter au panier",
                                  styles: {
                                    width: "100%",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    padding: "0.75rem",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    cursor: "pointer",
                                    fontWeight: "500"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
              styles: { padding: "3rem 2rem", backgroundColor: "#f8f9fa" },
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
                          content: "\u{1F4E6}"
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
                              content: "29,99 \u20AC",
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
            .products-carousel::-webkit-scrollbar { height: 8px; }
            .products-carousel::-webkit-scrollbar-track { background: #f1f5f9; }
            .products-carousel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .carousel-product-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
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
        name: "Portfolio cr\xE9atif",
        description: "Showcase pour projets cr\xE9atifs et professionnels",
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
                  content: "\u{1F464}"
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
                  content: "D\xE9veloppeur Web & Designer",
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
                          content: "\u{1F3A8}"
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
                              content: "Projet Cr\xE9atif",
                              styles: { marginBottom: "0.5rem", fontSize: "1.25rem" }
                            },
                            {
                              id: "project-description",
                              type: "text",
                              tag: "p",
                              content: "Description du projet et technologies utilis\xE9es",
                              styles: { color: "#666", lineHeight: "1.6" }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "skills-section",
              type: "section",
              tag: "section",
              attributes: { className: "skills-section" },
              styles: { backgroundColor: "#f8fafc", padding: "4rem 2rem" },
              children: [
                {
                  id: "skills-container",
                  type: "container",
                  tag: "div",
                  styles: { maxWidth: "800px", margin: "0 auto", textAlign: "center" },
                  children: [
                    {
                      id: "skills-title",
                      type: "heading",
                      tag: "h2",
                      content: "Mes Comp\xE9tences",
                      styles: { fontSize: "2.5rem", marginBottom: "3rem", color: "#1a202c" }
                    },
                    {
                      id: "skills-carousel",
                      type: "carousel",
                      tag: "div",
                      attributes: { className: "skills-carousel" },
                      styles: {
                        display: "flex",
                        gap: "2rem",
                        overflowX: "auto",
                        padding: "1rem",
                        scrollBehavior: "smooth"
                      },
                      children: [
                        {
                          id: "skill-react",
                          type: "card",
                          tag: "div",
                          attributes: { className: "skill-card" },
                          styles: {
                            minWidth: "200px",
                            backgroundColor: "white",
                            borderRadius: "1rem",
                            padding: "2rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            textAlign: "center"
                          },
                          children: [
                            {
                              id: "skill-icon",
                              type: "text",
                              tag: "div",
                              content: "\u269B\uFE0F",
                              styles: { fontSize: "3rem", marginBottom: "1rem" }
                            },
                            {
                              id: "skill-name",
                              type: "heading",
                              tag: "h3",
                              content: "React",
                              styles: { fontSize: "1.25rem", marginBottom: "0.5rem" }
                            },
                            {
                              id: "skill-progress",
                              type: "progress",
                              tag: "div",
                              styles: {
                                width: "100%",
                                height: "6px",
                                backgroundColor: "#e2e8f0",
                                borderRadius: "3px",
                                overflow: "hidden"
                              },
                              children: [
                                {
                                  id: "progress-bar",
                                  type: "div",
                                  tag: "div",
                                  styles: {
                                    width: "90%",
                                    height: "100%",
                                    backgroundColor: "#3b82f6",
                                    borderRadius: "3px"
                                  }
                                }
                              ]
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
            .skills-carousel::-webkit-scrollbar { height: 6px; }
            .skills-carousel::-webkit-scrollbar-track { background: #f1f5f9; }
            .skills-carousel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
          `,
          meta: {
            title: "Portfolio cr\xE9atif",
            description: "Portfolio moderne pour showcaser vos projets"
          }
        },
        tags: ["portfolio", "creative", "projects", "personal"],
        isBuiltIn: true
      },
      {
        name: "Blog moderne",
        description: "Template de blog avec syst\xE8me d'articles et cat\xE9gories",
        category: "blog",
        thumbnail: "blog-modern",
        content: {
          structure: [
            {
              id: "blog-header",
              type: "header",
              tag: "header",
              attributes: { className: "blog-header" },
              styles: {
                backgroundColor: "#2d3748",
                color: "white",
                padding: "3rem 2rem",
                textAlign: "center"
              },
              children: [
                {
                  id: "blog-title",
                  type: "heading",
                  tag: "h1",
                  content: "Mon Blog",
                  styles: { fontSize: "3rem", marginBottom: "1rem", fontWeight: "bold" }
                },
                {
                  id: "blog-subtitle",
                  type: "text",
                  tag: "p",
                  content: "Mes r\xE9flexions et d\xE9couvertes",
                  styles: { fontSize: "1.25rem", opacity: "0.9" }
                }
              ]
            },
            {
              id: "blog-content",
              type: "section",
              tag: "main",
              attributes: { className: "blog-content" },
              styles: { padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto" },
              children: [
                {
                  id: "article-card",
                  type: "card",
                  tag: "article",
                  attributes: { className: "article-card" },
                  styles: {
                    backgroundColor: "white",
                    borderRadius: "0.75rem",
                    padding: "2rem",
                    marginBottom: "2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0"
                  },
                  children: [
                    {
                      id: "article-title",
                      type: "heading",
                      tag: "h2",
                      content: "Premier article de blog",
                      styles: { fontSize: "1.75rem", marginBottom: "0.5rem", color: "#2d3748" }
                    },
                    {
                      id: "article-meta",
                      type: "text",
                      tag: "p",
                      content: "Publi\xE9 le 30 juillet 2025 \u2022 5 min de lecture",
                      styles: { color: "#718096", fontSize: "0.9rem", marginBottom: "1rem" }
                    },
                    {
                      id: "article-content",
                      type: "text",
                      tag: "p",
                      content: "Bienvenue sur mon blog ! Ici je partage mes r\xE9flexions sur le d\xE9veloppement web, les nouvelles technologies et mes projets personnels. N'h\xE9sitez pas \xE0 laisser des commentaires et \xE0 partager vos propres exp\xE9riences.",
                      styles: { lineHeight: "1.7", color: "#4a5568", marginBottom: "1rem" }
                    },
                    {
                      id: "read-more",
                      type: "button",
                      tag: "button",
                      content: "Lire la suite",
                      styles: {
                        backgroundColor: "#4299e1",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        border: "none",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500"
                      }
                    }
                  ]
                },
                {
                  id: "blog-faq",
                  type: "section",
                  tag: "section",
                  attributes: { className: "blog-faq" },
                  styles: { backgroundColor: "#f8fafc", padding: "4rem 2rem", marginTop: "3rem" },
                  children: [
                    {
                      id: "faq-container",
                      type: "container",
                      tag: "div",
                      styles: { maxWidth: "800px", margin: "0 auto" },
                      children: [
                        {
                          id: "faq-title",
                          type: "heading",
                          tag: "h2",
                          content: "Questions Fr\xE9quentes",
                          styles: { fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }
                        },
                        {
                          id: "faq-accordion",
                          type: "accordion",
                          tag: "div",
                          attributes: { className: "faq-accordion" },
                          styles: { backgroundColor: "white", borderRadius: "0.75rem", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                          children: [
                            {
                              id: "faq-item-1",
                              type: "accordion-item",
                              tag: "div",
                              attributes: { className: "faq-item" },
                              styles: { borderBottom: "1px solid #e2e8f0" },
                              children: [
                                {
                                  id: "faq-question-1",
                                  type: "button",
                                  tag: "button",
                                  content: "Comment publier un nouvel article ?",
                                  styles: {
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "1.5rem",
                                    fontSize: "1.1rem",
                                    fontWeight: "600",
                                    backgroundColor: "transparent",
                                    border: "none",
                                    cursor: "pointer"
                                  }
                                },
                                {
                                  id: "faq-answer-1",
                                  type: "text",
                                  tag: "div",
                                  content: "Utilisez l'\xE9diteur int\xE9gr\xE9 pour cr\xE9er vos articles. Vous avez acc\xE8s \xE0 tous les outils de formatage n\xE9cessaires.",
                                  styles: {
                                    padding: "0 1.5rem 1.5rem",
                                    color: "#64748b",
                                    lineHeight: "1.6"
                                  }
                                }
                              ]
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
            body { font-family: 'Inter', sans-serif; background-color: #f7fafc; }
            .article-card:hover { transform: translateY(-2px); transition: transform 0.3s ease; }
            .faq-item button:hover { background-color: #f8fafc; }
          `,
          meta: {
            title: "Blog moderne",
            description: "Template de blog moderne et responsive"
          }
        },
        tags: ["blog", "articles", "content", "modern"],
        isBuiltIn: true
      },
      {
        name: "Dashboard analytiques",
        description: "Interface de tableau de bord avec graphiques et m\xE9triques",
        category: "dashboard",
        thumbnail: "dashboard-analytics",
        content: {
          structure: [
            {
              id: "dashboard-container",
              type: "container",
              tag: "div",
              attributes: { className: "dashboard-container" },
              styles: {
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                padding: "2rem"
              },
              children: [
                {
                  id: "dashboard-header",
                  type: "header",
                  tag: "div",
                  attributes: { className: "dashboard-header" },
                  styles: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                    backgroundColor: "white",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  },
                  children: [
                    {
                      id: "dashboard-title",
                      type: "heading",
                      tag: "h1",
                      content: "Tableau de bord",
                      styles: { fontSize: "1.75rem", fontWeight: "bold", color: "#1a202c" }
                    },
                    {
                      id: "dashboard-date",
                      type: "text",
                      tag: "p",
                      content: "30 juillet 2025",
                      styles: { color: "#718096" }
                    }
                  ]
                },
                {
                  id: "metrics-grid",
                  type: "container",
                  tag: "div",
                  attributes: { className: "metrics-grid" },
                  styles: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2rem"
                  },
                  children: [
                    {
                      id: "metric-card-1",
                      type: "card",
                      tag: "div",
                      attributes: { className: "metric-card" },
                      styles: {
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #e2e8f0"
                      },
                      children: [
                        {
                          id: "metric-title-1",
                          type: "text",
                          tag: "p",
                          content: "Visiteurs totaux",
                          styles: { color: "#718096", fontSize: "0.9rem", marginBottom: "0.5rem" }
                        },
                        {
                          id: "metric-value-1",
                          type: "text",
                          tag: "p",
                          content: "12,456",
                          styles: { fontSize: "2rem", fontWeight: "bold", color: "#2d3748" }
                        },
                        {
                          id: "metric-change-1",
                          type: "text",
                          tag: "p",
                          content: "+12% ce mois",
                          styles: { color: "#38a169", fontSize: "0.85rem" }
                        }
                      ]
                    },
                    {
                      id: "metric-card-2",
                      type: "card",
                      tag: "div",
                      attributes: { className: "metric-card" },
                      styles: {
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #e2e8f0"
                      },
                      children: [
                        {
                          id: "metric-title-2",
                          type: "text",
                          tag: "p",
                          content: "Revenus",
                          styles: { color: "#718096", fontSize: "0.9rem", marginBottom: "0.5rem" }
                        },
                        {
                          id: "metric-value-2",
                          type: "text",
                          tag: "p",
                          content: "\u20AC8,250",
                          styles: { fontSize: "2rem", fontWeight: "bold", color: "#2d3748" }
                        },
                        {
                          id: "metric-change-2",
                          type: "text",
                          tag: "p",
                          content: "+8% ce mois",
                          styles: { color: "#38a169", fontSize: "0.85rem" }
                        }
                      ]
                    }
                  ]
                },
                {
                  id: "charts-section",
                  type: "section",
                  tag: "div",
                  attributes: { className: "charts-section" },
                  styles: {
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "1.5rem",
                    marginBottom: "2rem"
                  },
                  children: [
                    {
                      id: "main-chart",
                      type: "chart",
                      tag: "div",
                      attributes: { className: "main-chart" },
                      styles: {
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #e2e8f0"
                      },
                      children: [
                        {
                          id: "chart-title",
                          type: "heading",
                          tag: "h3",
                          content: "\xC9volution des Visiteurs",
                          styles: { fontSize: "1.25rem", marginBottom: "1rem", color: "#2d3748" }
                        },
                        {
                          id: "chart-placeholder",
                          type: "div",
                          tag: "div",
                          styles: {
                            height: "300px",
                            backgroundColor: "#f8fafc",
                            borderRadius: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#718096",
                            fontSize: "3rem"
                          },
                          content: "\u{1F4CA}"
                        }
                      ]
                    },
                    {
                      id: "side-stats",
                      type: "container",
                      tag: "div",
                      attributes: { className: "side-stats" },
                      styles: {
                        backgroundColor: "white",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid #e2e8f0"
                      },
                      children: [
                        {
                          id: "stats-title",
                          type: "heading",
                          tag: "h3",
                          content: "Top Pages",
                          styles: { fontSize: "1.25rem", marginBottom: "1rem", color: "#2d3748" }
                        },
                        {
                          id: "page-stats",
                          type: "list",
                          tag: "div",
                          children: [
                            {
                              id: "page-item-1",
                              type: "div",
                              tag: "div",
                              styles: {
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "0.75rem 0",
                                borderBottom: "1px solid #e2e8f0"
                              },
                              children: [
                                {
                                  id: "page-name-1",
                                  type: "text",
                                  tag: "span",
                                  content: "/accueil",
                                  styles: { color: "#4a5568" }
                                },
                                {
                                  id: "page-views-1",
                                  type: "text",
                                  tag: "span",
                                  content: "2,456",
                                  styles: { fontWeight: "600", color: "#2d3748" }
                                }
                              ]
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
            .metric-card:hover { transform: translateY(-2px); transition: transform 0.3s ease; }
            @media (max-width: 768px) { .charts-section { grid-template-columns: 1fr; } }
          `,
          meta: {
            title: "Dashboard analytiques",
            description: "Interface de tableau de bord moderne avec m\xE9triques"
          }
        },
        tags: ["dashboard", "analytics", "metrics", "admin"],
        isBuiltIn: true
      },
      {
        name: "Page contact",
        description: "Formulaire de contact professionnel avec informations",
        category: "contact",
        thumbnail: "contact-form",
        content: {
          structure: [
            {
              id: "contact-section",
              type: "section",
              tag: "section",
              attributes: { className: "contact-section" },
              styles: {
                minHeight: "100vh",
                backgroundColor: "#f7fafc",
                padding: "4rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: [
                {
                  id: "contact-container",
                  type: "container",
                  tag: "div",
                  attributes: { className: "contact-container" },
                  styles: {
                    maxWidth: "800px",
                    backgroundColor: "white",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    overflow: "hidden"
                  },
                  children: [
                    {
                      id: "contact-header",
                      type: "header",
                      tag: "div",
                      attributes: { className: "contact-header" },
                      styles: {
                        backgroundColor: "#4299e1",
                        color: "white",
                        padding: "3rem",
                        textAlign: "center"
                      },
                      children: [
                        {
                          id: "contact-title",
                          type: "heading",
                          tag: "h1",
                          content: "Contactez-nous",
                          styles: { fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "bold" }
                        },
                        {
                          id: "contact-subtitle",
                          type: "text",
                          tag: "p",
                          content: "Nous sommes l\xE0 pour r\xE9pondre \xE0 toutes vos questions",
                          styles: { fontSize: "1.1rem", opacity: "0.9" }
                        }
                      ]
                    },
                    {
                      id: "contact-form",
                      type: "form",
                      tag: "form",
                      attributes: { className: "contact-form" },
                      styles: {
                        padding: "3rem",
                        display: "grid",
                        gap: "1.5rem"
                      },
                      children: [
                        {
                          id: "form-grid",
                          type: "container",
                          tag: "div",
                          styles: {
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem"
                          },
                          children: [
                            {
                              id: "name-input",
                              type: "input",
                              tag: "input",
                              attributes: { type: "text", placeholder: "Votre nom" },
                              styles: {
                                padding: "0.75rem",
                                border: "2px solid #e2e8f0",
                                borderRadius: "0.5rem",
                                fontSize: "1rem"
                              }
                            },
                            {
                              id: "email-input",
                              type: "input",
                              tag: "input",
                              attributes: { type: "email", placeholder: "Votre email" },
                              styles: {
                                padding: "0.75rem",
                                border: "2px solid #e2e8f0",
                                borderRadius: "0.5rem",
                                fontSize: "1rem"
                              }
                            }
                          ]
                        },
                        {
                          id: "message-textarea",
                          type: "textarea",
                          tag: "textarea",
                          attributes: { placeholder: "Votre message", rows: "5" },
                          styles: {
                            padding: "0.75rem",
                            border: "2px solid #e2e8f0",
                            borderRadius: "0.5rem",
                            fontSize: "1rem",
                            resize: "vertical"
                          }
                        },
                        {
                          id: "submit-button",
                          type: "button",
                          tag: "button",
                          content: "Envoyer le message",
                          styles: {
                            backgroundColor: "#4299e1",
                            color: "white",
                            padding: "1rem 2rem",
                            border: "none",
                            borderRadius: "0.5rem",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            cursor: "pointer"
                          }
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
            .contact-form input:focus, .contact-form textarea:focus { 
              outline: none; 
              border-color: #4299e1; 
              box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1); 
            }
            .submit-button:hover { background-color: #3182ce; }
          `,
          meta: {
            title: "Contact",
            description: "Formulaire de contact professionnel"
          }
        },
        tags: ["contact", "form", "business", "professional"],
        isBuiltIn: true
      }
    ];
    builtInTemplates.forEach((template) => {
      const id = randomUUID();
      this.templates.set(id, {
        ...template,
        id,
        createdAt: /* @__PURE__ */ new Date()
      });
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Project methods
  async getProjects() {
    return Array.from(this.projects.values()).filter((project) => project.isActive).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  async getProject(id) {
    const project = this.projects.get(id);
    return project?.isActive ? project : void 0;
  }
  async createProject(insertProject) {
    const existingProject = Array.from(this.projects.values()).find(
      (project2) => project2.isActive && project2.name.toLowerCase() === insertProject.name.toLowerCase()
    );
    if (existingProject) {
      throw new Error(`Un projet avec le nom "${insertProject.name}" existe d\xE9j\xE0`);
    }
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    let content = { pages: [], assets: [], styles: { global: "", components: {} } };
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
    const project = {
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
      isActive: true
    };
    this.projects.set(id, project);
    return project;
  }
  async updateProject(id, updates) {
    const project = this.projects.get(id);
    if (!project || !project.isActive) {
      return void 0;
    }
    const updatedContent = updates.content ? {
      ...project.content,
      ...updates.content,
      pages: updates.content.pages || project.content.pages,
      assets: updates.content.assets || project.content.assets,
      styles: {
        ...project.content.styles,
        ...updates.content.styles || {}
      }
    } : project.content;
    const updatedProject = {
      ...project,
      name: updates.name || project.name,
      description: updates.description !== void 0 ? updates.description : project.description,
      content: updatedContent,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  async deleteProject(id) {
    const project = this.projects.get(id);
    if (!project) {
      return false;
    }
    const updatedProject = {
      ...project,
      isActive: false,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(id, updatedProject);
    const projectPages = await this.getProjectPages(id);
    for (const page of projectPages) {
      await this.deletePage(page.id);
    }
    return true;
  }
  // Template methods
  async getTemplates() {
    return Array.from(this.templates.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getTemplate(id) {
    return this.templates.get(id);
  }
  async createTemplate(insertTemplate) {
    const id = randomUUID();
    const template = {
      ...insertTemplate,
      id,
      content: insertTemplate.content,
      description: insertTemplate.description || null,
      thumbnail: insertTemplate.thumbnail || null,
      tags: insertTemplate.tags || null,
      createdAt: /* @__PURE__ */ new Date(),
      isBuiltIn: false
    };
    this.templates.set(id, template);
    return template;
  }
  // Page methods
  async getProjectPages(projectId) {
    return Array.from(this.pages.values()).filter((page) => page.projectId === projectId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  async getPage(id) {
    return this.pages.get(id);
  }
  async createNewPage(insertPage) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const page = {
      ...insertPage,
      id,
      content: insertPage.content || { structure: [] },
      meta: insertPage.meta || {},
      createdAt: now,
      updatedAt: now
    };
    this.pages.set(id, page);
    return page;
  }
  async updatePage(id, updates) {
    const page = this.pages.get(id);
    if (!page) {
      return void 0;
    }
    const updatedPage = {
      ...page,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.pages.set(id, updatedPage);
    return updatedPage;
  }
  async deletePage(id) {
    return this.pages.delete(id);
  }
  // Export methods
  async exportProject(projectId, options = {}) {
    const project = await this.getProject(projectId);
    if (!project) {
      throw new Error(`Projet avec l'ID ${projectId} introuvable`);
    }
    if (!project.content) {
      throw new Error(`Le projet "${project.name}" n'a pas de contenu \xE0 exporter`);
    }
    if (!project.content.pages || project.content.pages.length === 0) {
      throw new Error(`Le projet "${project.name}" n'a aucune page d\xE9finie. Veuillez cr\xE9er au moins une page avant d'exporter.`);
    }
    const files = [];
    const exportOptions = {
      includeCSS: true,
      includeJS: true,
      responsive: true,
      seoOptimized: true,
      cacheVersion: Date.now().toString(),
      ...options
    };
    for (const page of project.content.pages) {
      const htmlContent = this.generateOptimizedHTML(page, project, exportOptions);
      const fileName = page.path === "/" ? "index.html" : this.sanitizeFileName(`${page.name}.html`);
      files.push({
        path: fileName,
        content: htmlContent
      });
    }
    if (exportOptions.includeCSS) {
      const cssContent = this.generateOptimizedCSS(project, exportOptions);
      if (cssContent.trim()) {
        files.push({
          path: "styles.css",
          content: cssContent
        });
      }
    }
    if (exportOptions.includeJS) {
      const jsContent = this.generateOptimizedJS(project, exportOptions);
      if (jsContent.trim()) {
        files.push({
          path: `script.js${exportOptions.cacheVersion ? `?v=${exportOptions.cacheVersion}` : ""}`,
          content: jsContent
        });
      }
    }
    files.push(...this.generateMetadataFiles(project));
    return { files };
  }
  // Helper methods
  sanitizeFileName(fileName) {
    return fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  generateMetadataFiles(project) {
    const files = [];
    files.push({
      path: "package.json",
      content: JSON.stringify(this.createPackageJson(project), null, 2)
    });
    files.push({
      path: "README.md",
      content: this.createReadmeContent(project)
    });
    return files;
  }
  createPackageJson(project) {
    return {
      name: project.name.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      description: project.description || "Export\xE9 depuis PageForge",
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
    };
  }
  createReadmeContent(project) {
    return `# ${project.name}

${project.description || "Projet export\xE9 depuis PageForge"}

## Installation

\`\`\`bash
npm install
\`\`\`

## D\xE9veloppement local

\`\`\`bash
npm start
\`\`\`

## D\xE9ploiement

Ce projet est pr\xEAt pour le d\xE9ploiement sur n'importe quel serveur web statique.

### Options de d\xE9ploiement :
- **Netlify**: Glissez-d\xE9posez le dossier dans Netlify
- **Vercel**: Connectez votre repository GitHub
- **GitHub Pages**: Activez Pages dans les param\xE8tres du repository
- **Serveur traditionnel**: Uploadez les fichiers via FTP/cPanel

### Structure des fichiers :
- \`index.html\` - Page principale
- \`styles.css\` - Feuilles de style
- \`script.js\` - Scripts JavaScript

G\xE9n\xE9r\xE9 avec PageForge - ${(/* @__PURE__ */ new Date()).toLocaleDateString()}
`;
  }
  generateOptimizedHTML(page, project, options) {
    const title = page.content?.meta?.title || project.settings?.seo?.title || project.name;
    const description = page.content?.meta?.description || project.settings?.seo?.description || project.description || "";
    const keywords = Array.isArray(project.settings?.seo?.keywords) ? project.settings.seo.keywords.join(", ") : project.settings?.seo?.keywords || "";
    const author = "PageForge";
    const cacheVersion = options.cacheVersion || "";
    const seoMeta = options.seoOptimized ? this.generateSeoMetaTags(page, project, { title, description, keywords, author }) : "";
    const cssLink = options.includeCSS ? `<link rel="stylesheet" href="styles.css${cacheVersion ? `?v=${cacheVersion}` : ""}">
    ` : "";
    const jsScript = options.includeJS ? `<script src="script.js${cacheVersion ? `?v=${cacheVersion}` : ""}"></script>` : "";
    const responsiveMeta = options.responsive ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ' : "";
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    ${responsiveMeta}<title>${this.escapeHtml(title)}</title>
    <meta name="description" content="${this.escapeHtml(description)}">
    ${seoMeta}${cssLink}</head>
<body>
    ${this.renderComponents(page.content?.structure || [])}
    ${jsScript}
</body>
</html>`;
  }
  generateSeoMetaTags(page, project, meta) {
    const tags = [];
    if (meta.keywords) {
      tags.push(`<meta name="keywords" content="${this.escapeHtml(meta.keywords)}">`);
    }
    if (meta.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(meta.author)}">`);
    }
    tags.push(`<meta property="og:title" content="${this.escapeHtml(meta.title)}">`);
    tags.push(`<meta property="og:description" content="${this.escapeHtml(meta.description)}">`);
    tags.push(`<meta property="og:type" content="website">`);
    tags.push(`<meta property="og:site_name" content="${this.escapeHtml(project.name)}">`);
    tags.push(`<meta name="twitter:card" content="summary">`);
    tags.push(`<meta name="twitter:title" content="${this.escapeHtml(meta.title)}">`);
    tags.push(`<meta name="twitter:description" content="${this.escapeHtml(meta.description)}">`);
    return tags.length > 0 ? tags.join("\n    ") + "\n    " : "";
  }
  escapeHtml(text2) {
    return text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  generateOptimizedCSS(project, options) {
    let css = `/* Generated by PageForge - ${(/* @__PURE__ */ new Date()).toISOString()} */

`;
    css += `/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

`;
    css += `/* Base Styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
}

`;
    const globalStyles = project.content?.styles?.global || "";
    if (globalStyles.trim()) {
      css += `/* Global Project Styles */
${globalStyles}

`;
    }
    const componentStyles = project.content?.styles?.components || {};
    if (Object.keys(componentStyles).length > 0) {
      css += `/* Component Styles */
`;
      Object.entries(componentStyles).forEach(([selector, styles]) => {
        css += `${selector} {
${styles}
}

`;
      });
    }
    if (options.responsive) {
      css += this.generateResponsiveCSS();
    }
    return options.minify ? this.minifyCSS(css) : css;
  }
  generateResponsiveCSS() {
    return `/* Responsive Styles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-size: 1.5rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  body {
    font-size: 0.9rem;
  }
  
  .container {
    padding: 0.5rem;
  }
}

`;
  }
  generateOptimizedJS(project, options) {
    let js = `// Generated by PageForge - ${(/* @__PURE__ */ new Date()).toISOString()}

`;
    js += `document.addEventListener('DOMContentLoaded', function() {
`;
    js += `    console.log('${project.name} - Page loaded successfully');

`;
    js += this.generateBasicInteractivity();
    js += this.generateComponentInteractivity(project);
    js += `});

`;
    js += this.generateUtilityFunctions();
    return options.minify ? this.minifyJS(js) : js;
  }
  generateBasicInteractivity() {
    return `    // Basic button interactivity
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.getAttribute('onclick')) {
                console.log('Button clicked:', this.textContent);
            }
        });
    });

    // Basic form handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted:', new FormData(this));
        });
    });

`;
  }
  generateComponentInteractivity(project) {
    let js = "";
    if (this.projectHasComponent(project, "carousel")) {
      js += this.generateCarouselJS();
    }
    if (this.projectHasComponent(project, "modal")) {
      js += this.generateModalJS();
    }
    return js;
  }
  generateUtilityFunctions() {
    return `// Utility Functions
function toggleClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

`;
  }
  generateCarouselJS() {
    return `    // Carousel functionality
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

`;
  }
  generateModalJS() {
    return `    // Modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloses = document.querySelectorAll('[data-modal-close]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = document.querySelector(trigger.dataset.modalTarget);
            if (modal) modal.style.display = 'block';
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const modal = close.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
`;
  }
  projectHasComponent(project, componentType) {
    if (!project.content?.pages) return false;
    for (const page of project.content.pages) {
      if (this.pageHasComponent(page.content?.structure || [], componentType)) {
        return true;
      }
    }
    return false;
  }
  pageHasComponent(structure, componentType) {
    for (const component of structure) {
      if (component.type === componentType) return true;
      if (component.children && this.pageHasComponent(component.children, componentType)) {
        return true;
      }
    }
    return false;
  }
  renderComponents(components) {
    return components.map((component) => {
      const tag = component.tag || "div";
      const attributes = component.attributes || {};
      const styles = component.styles ? `style="${this.styleObjectToString(component.styles)}"` : "";
      const attributesString = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(" ");
      const children = component.children ? this.renderComponents(component.children) : "";
      let content = component.content || "";
      if (component.componentData && component.type) {
        content = this.generateComponentContent(component.type, component.componentData);
      }
      return `<${tag} ${attributesString} ${styles}>${content}${children}</${tag}>`;
    }).join("\n");
  }
  generateComponentContent(type, componentData) {
    switch (type) {
      case "header":
        return this.generateHeaderContent(componentData);
      case "footer":
        return this.generateFooterContent(componentData);
      case "navbar":
        return this.generateNavbarContent(componentData);
      case "carousel":
        return this.generateCarouselContent(componentData);
      case "grid":
        return this.generateGridContent(componentData);
      case "list":
        return this.generateListContent(componentData);
      case "accordion":
        return this.generateAccordionContent(componentData);
      case "card":
        return this.generateCardContent(componentData);
      case "chart":
        return this.generateChartContent(componentData);
      default:
        return "";
    }
  }
  generateHeaderContent(data) {
    const logo = data.logo || "Logo";
    const navigation = data.navigation || [];
    const showSearch = data.showSearch || false;
    let navItems = "";
    if (navigation.length > 0) {
      navItems = navigation.map(
        (item) => `<a href="${item.link || "#"}" style="color: inherit; text-decoration: none; margin: 0 1rem;">${item.text || "Lien"}</a>`
      ).join("");
    }
    const searchBox = showSearch ? '<input type="search" placeholder="Rechercher..." style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">' : "";
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        <div style="font-weight: bold; font-size: 1.2em;">${logo}</div>
        <nav style="display: flex; align-items: center; gap: 1rem;">
          ${navItems}
          ${searchBox}
        </nav>
      </div>
    `;
  }
  generateFooterContent(data) {
    const company = data.company || "Mon Entreprise";
    const links = data.links || [];
    const socialMedia = data.socialMedia || [];
    const copyright = data.copyright || `\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${company}`;
    const linksList = links.map(
      (link) => `<a href="${link.url || "#"}" style="color: inherit; text-decoration: none; margin: 0 0.5rem;">${link.label || "Lien"}</a>`
    ).join("");
    const socialList = socialMedia.map(
      (social) => `<a href="${social.url || "#"}" style="color: inherit; text-decoration: none; margin: 0 0.5rem;">${social.platform || "Social"}</a>`
    ).join("");
    return `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; text-align: center;">
        <div style="margin-bottom: 1rem;">
          ${linksList}
        </div>
        <div style="margin-bottom: 1rem;">
          ${socialList}
        </div>
        <div style="font-size: 0.9em;">
          ${copyright}
        </div>
      </div>
    `;
  }
  generateNavbarContent(data) {
    const brand = data.brand || "Brand";
    const items = data.items || [];
    const navItems = items.map(
      (item) => `<a href="${item.url || "#"}" style="color: inherit; text-decoration: none; padding: 0.5rem 1rem;">${item.label || "Item"}</a>`
    ).join("");
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 100%;">
        <div style="font-weight: bold;">${brand}</div>
        <nav style="display: flex; align-items: center;">
          ${navItems}
        </nav>
      </div>
    `;
  }
  generateCarouselContent(data) {
    const images = data.images || [];
    if (images.length === 0) return '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Carrousel vide</div>';
    return `
      <div style="position: relative; width: 100%; height: 100%; overflow: hidden;">
        <img src="${images[0].src || "https://via.placeholder.com/400x200"}" 
             alt="${images[0].alt || "Image"}" 
             style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 3px; font-size: 0.8em;">
          1/${images.length}
        </div>
      </div>
    `;
  }
  generateGridContent(data) {
    const items = data.gridItems || [];
    if (items.length === 0) return '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Grille vide</div>';
    const gridItems = items.map(
      (item) => `<div style="padding: 1rem; border: 1px solid #e0e0e0;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1em;">${item.title || "Titre"}</h3>
        <p style="margin: 0; font-size: 0.9em;">${item.content || "Contenu"}</p>
      </div>`
    ).join("");
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; width: 100%; height: 100%;">
        ${gridItems}
      </div>
    `;
  }
  generateListContent(data) {
    const items = data.items || [];
    if (items.length === 0) return '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Liste vide</div>';
    const listItems = items.map(
      (item) => `<li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">${item.text || item}</li>`
    ).join("");
    return `
      <ul style="list-style: none; padding: 1rem; margin: 0; width: 100%; height: 100%; overflow-y: auto;">
        ${listItems}
      </ul>
    `;
  }
  generateAccordionContent(data) {
    const items = data.items || [];
    if (items.length === 0) return '<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">Accord\xE9on vide</div>';
    const accordionItems = items.map(
      (item, index) => `<div style="border-bottom: 1px solid #e0e0e0;">
        <div style="padding: 1rem; background: #f8f9fa; font-weight: bold; cursor: pointer;" onclick="toggleAccordion(${index})">
          ${item.question || "Question"}
        </div>
        <div id="accordion-${index}" style="padding: 1rem; display: ${index === 0 ? "block" : "none"};">
          ${item.answer || "R\xE9ponse"}
        </div>
      </div>`
    ).join("");
    return `
      <div style="width: 100%; height: 100%; overflow-y: auto;">
        ${accordionItems}
      </div>
    `;
  }
  generateCardContent(data) {
    const title = data.title || "Titre de la carte";
    const content = data.content || "Contenu de la carte";
    const imageUrl = data.imageUrl || "";
    const imageHtml = imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 1rem;">` : "";
    return `
      <div style="padding: 1rem; width: 100%; height: 100%; display: flex; flex-direction: column;">
        ${imageHtml}
        <h3 style="margin: 0 0 1rem 0; font-size: 1.2em;">${title}</h3>
        <p style="margin: 0; flex: 1; font-size: 0.9em;">${content}</p>
      </div>
    `;
  }
  generateChartContent(data) {
    const chartType = data.chartType || "bar";
    const title = data.title || "Graphique";
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 1rem;">
        <h3 style="margin: 0 0 1rem 0;">${title}</h3>
        <div style="width: 100%; height: 60%; background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; display: flex; align-items: center; justify-content: center; border: 1px solid #ddd;">
          <span style="background: white; padding: 0.5rem; border-radius: 4px;">Graphique ${chartType}</span>
        </div>
      </div>
    `;
  }
  styleObjectToString(styles) {
    return Object.entries(styles).filter(([key, value]) => {
      if (key === "lineHeight" && typeof value === "string" && value.match(/^\d+px$/)) {
        const heightValue = parseInt(value);
        if (heightValue > 50) {
          return false;
        }
      }
      return value !== "" && value !== null && value !== void 0;
    }).map(([key, value]) => `${this.camelToKebab(key)}:${value}`).join(";");
  }
  camelToKebab(str) {
    return str.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  minifyCSS(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/;\s*}/g, "}").replace(/\s*{\s*/g, "{").replace(/;\s*/g, ";").trim();
  }
  minifyJS(js) {
    return js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/\s+/g, " ").replace(/;\s*}/g, "}").trim();
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("standalone"),
  // standalone, vscode-integration, existing-project, single-page, multi-page, ftp-integration
  template: text("template"),
  content: json("content").$type().notNull().default({}),
  settings: json("settings").$type().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true)
});
var templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
  content: json("content").$type().notNull(),
  tags: text("tags").array(),
  isBuiltIn: boolean("is_built_in").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  content: json("content").$type().notNull().default({ structure: [] }),
  meta: json("meta").$type().notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var componentDefinitionSchema = z.object({
  id: z.string(),
  type: z.string(),
  tag: z.string().optional(),
  content: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  styles: z.record(z.any()).optional(),
  children: z.array(z.any()).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }).optional()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  type: z.enum(["standalone", "vscode-integration", "existing-project", "single-page", "multi-page", "ftp-integration"]),
  template: z.string().optional()
});
var updateProjectContentSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  content: z.any().optional()
});
var insertTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  thumbnail: z.string().optional(),
  content: z.any(),
  tags: z.array(z.string()).optional()
});
var insertPageSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1, "Page name is required"),
  path: z.string().min(1, "Page path is required"),
  content: z.any(),
  meta: z.any().optional()
});
var updateProjectSchema = insertProjectSchema.partial();
var updatePageSchema = insertPageSchema.omit({ projectId: true }).partial();

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/projects", async (req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: error.message || "Failed to create project" });
    }
  });
  app2.patch("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = req.body.content ? updateProjectContentSchema.parse(req.body) : updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  app2.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  app2.post("/api/projects/:id/export", async (req, res) => {
    try {
      const exportResult = await storage.exportProject(req.params.id);
      if (!exportResult) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", 'attachment; filename="project-export.json"');
      res.json(exportResult);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ message: "Failed to export project" });
    }
  });
  app2.get("/api/templates", async (req, res) => {
    try {
      const templates2 = await storage.getTemplates();
      res.json(templates2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });
  app2.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });
  app2.post("/api/projects/from-template", async (req, res) => {
    try {
      const { templateId, name, description } = req.body;
      if (!templateId || !name) {
        return res.status(400).json({ error: "Template ID and project name are required" });
      }
      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      const projectData = {
        name,
        type: "standalone",
        description: description || template.description,
        template: template.name,
        content: template.content,
        settings: {
          theme: "modern",
          responsive: true,
          seo: true
        }
      };
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project from template:", error);
      res.status(500).json({ error: "Failed to create project from template" });
    }
  });
  app2.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create template" });
    }
  });
  app2.get("/api/projects/:projectId/pages", async (req, res) => {
    try {
      const pages2 = await storage.getProjectPages(req.params.projectId);
      res.json(pages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });
  app2.get("/api/pages/:id", async (req, res) => {
    try {
      const page = await storage.getPage(req.params.id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });
  app2.post("/api/projects/:projectId/pages", async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const page = await storage.createNewPage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create page" });
    }
  });
  app2.patch("/api/pages/:id", async (req, res) => {
    try {
      const validatedData = updatePageSchema.parse(req.body);
      const page = await storage.updatePage(req.params.id, validatedData);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update page" });
    }
  });
  app2.delete("/api/pages/:id", async (req, res) => {
    try {
      const success = await storage.deletePage(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });
  app2.post("/api/projects/:id/export", async (req, res) => {
    try {
      const exportOptions = req.body || {};
      const exportData = await storage.exportProject(req.params.id, exportOptions);
      res.setHeader("Content-Type", "application/json");
      res.json(exportData);
    } catch (error) {
      console.error("Export error:", error);
      const statusCode = error.message.includes("introuvable") || error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        message: error.message || "Failed to export project",
        error: process.env.NODE_ENV === "development" ? error.stack : void 0
      });
    }
  });
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ limit: "50mb", extended: true }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "80", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
