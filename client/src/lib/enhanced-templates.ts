import type { TemplateContent } from '@shared/schema';

export interface EnhancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  content: TemplateContent;
  tags: string[];
  isBuiltIn: boolean;
  isPremium?: boolean;
  isNew?: boolean;
}

export const templateCategories = [
  { id: 'landing', name: 'Pages d\'atterrissage', description: 'Pages de conversion et marketing' },
  { id: 'business', name: 'Entreprise', description: 'Sites d\'entreprise et corporatifs' },
  { id: 'portfolio', name: 'Portfolio', description: 'Showcases créatifs et professionnels' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Boutiques en ligne et catalogues' },
  { id: 'blog', name: 'Blog', description: 'Sites de contenu et actualités' },
  { id: 'dashboard', name: 'Tableau de bord', description: 'Interfaces d\'administration' },
  { id: 'education', name: 'Éducation', description: 'Plateformes d\'apprentissage' },
  { id: 'restaurant', name: 'Restaurant', description: 'Sites de restauration' },
  { id: 'agency', name: 'Agence', description: 'Agences créatives et de services' },
  { id: 'saas', name: 'SaaS', description: 'Applications web et services' },
  { id: 'event', name: 'Événements', description: 'Sites d\'événements et conférences' },
  { id: 'nonprofit', name: 'Association', description: 'Organisations à but non lucratif' }
];

export const enhancedTemplates: EnhancedTemplate[] = [
  // Landing Pages
  {
    id: 'startup-landing',
    name: 'Landing Startup Moderne',
    description: 'Page d\'atterrissage moderne pour startup avec sections hero, fonctionnalités, témoignages et CTA',
    category: 'landing',
    thumbnail: '/api/placeholder/400/300',
    tags: ['startup', 'saas', 'moderne', 'conversion'],
    isBuiltIn: true,
    isNew: true,
    content: {
      structure: [
        {
          id: 'hero-section',
          type: 'section',
          tag: 'section',
          content: '',
          attributes: { className: 'min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center text-white' },
          styles: { padding: '4rem 2rem', textAlign: 'center' },
          children: [
            {
              id: 'hero-container',
              type: 'container',
              tag: 'div',
              attributes: { className: 'max-w-6xl mx-auto' },
              children: [
                {
                  id: 'hero-title',
                  type: 'heading',
                  tag: 'h1',
                  content: 'Révolutionnez votre workflow avec notre solution innovante',
                  attributes: { className: 'text-5xl md:text-7xl font-bold mb-6' },
                  styles: { fontSize: '4rem', fontWeight: 'bold', marginBottom: '2rem', lineHeight: '1.1' }
                },
                {
                  id: 'hero-subtitle',
                  type: 'paragraph',
                  tag: 'p',
                  content: 'Découvrez la plateforme qui transforme la façon dont les équipes collaborent et créent ensemble.',
                  attributes: { className: 'text-xl md:text-2xl mb-8 opacity-90' },
                  styles: { fontSize: '1.5rem', marginBottom: '2rem', opacity: '0.9' }
                },
                {
                  id: 'hero-cta',
                  type: 'button',
                  tag: 'button',
                  content: 'Commencer gratuitement',
                  attributes: { className: 'bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors' },
                  styles: { backgroundColor: 'white', color: '#7c3aed', padding: '1rem 2rem', borderRadius: '9999px', fontSize: '1.125rem', fontWeight: '600' }
                }
              ]
            }
          ]
        },
        {
          id: 'features-section',
          type: 'section',
          tag: 'section',
          attributes: { className: 'py-20 bg-gray-50' },
          styles: { padding: '5rem 2rem', backgroundColor: '#f9fafb' },
          children: [
            {
              id: 'features-container',
              type: 'container',
              tag: 'div',
              attributes: { className: 'max-w-6xl mx-auto' },
              children: [
                {
                  id: 'features-title',
                  type: 'heading',
                  tag: 'h2',
                  content: 'Des fonctionnalités puissantes',
                  attributes: { className: 'text-4xl font-bold text-center mb-16 text-gray-800' },
                  styles: { fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem' }
                },
                {
                  id: 'features-grid',
                  type: 'grid',
                  tag: 'div',
                  attributes: { className: 'grid md:grid-cols-3 gap-8' },
                  styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
                  children: [
                    {
                      id: 'feature-1',
                      type: 'card',
                      tag: 'div',
                      attributes: { className: 'bg-white p-6 rounded-xl shadow-lg text-center' },
                      children: [
                        {
                          id: 'feature-1-title',
                          type: 'heading',
                          tag: 'h3',
                          content: 'Interface intuitive',
                          styles: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }
                        },
                        {
                          id: 'feature-1-desc',
                          type: 'paragraph',
                          tag: 'p',
                          content: 'Une interface utilisateur conçue pour la simplicité et l\'efficacité.',
                          styles: { color: '#6b7280' }
                        }
                      ]
                    },
                    {
                      id: 'feature-2',
                      type: 'card',
                      tag: 'div',
                      attributes: { className: 'bg-white p-6 rounded-xl shadow-lg text-center' },
                      children: [
                        {
                          id: 'feature-2-title',
                          type: 'heading',
                          tag: 'h3',
                          content: 'Collaboration en temps réel',
                          styles: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }
                        },
                        {
                          id: 'feature-2-desc',
                          type: 'paragraph',
                          tag: 'p',
                          content: 'Travaillez ensemble instantanément, où que vous soyez.',
                          styles: { color: '#6b7280' }
                        }
                      ]
                    },
                    {
                      id: 'feature-3',
                      type: 'card',
                      tag: 'div',
                      attributes: { className: 'bg-white p-6 rounded-xl shadow-lg text-center' },
                      children: [
                        {
                          id: 'feature-3-title',
                          type: 'heading',
                          tag: 'h3',
                          content: 'Sécurité avancée',
                          styles: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }
                        },
                        {
                          id: 'feature-3-desc',
                          type: 'paragraph',
                          tag: 'p',
                          content: 'Vos données sont protégées par des standards de sécurité de niveau entreprise.',
                          styles: { color: '#6b7280' }
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
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
        .hero-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .card:hover { transform: translateY(-5px); transition: transform 0.3s ease; }
      `,
      scripts: `
        console.log('Landing page loaded');
        // Animation au scroll
        window.addEventListener('scroll', () => {
          const scrolled = window.pageYOffset;
          const hero = document.querySelector('.hero-section');
          if (hero) {
            hero.style.transform = 'translateY(' + scrolled * 0.5 + 'px)';
          }
        });
      `,
      meta: {
        title: 'Startup Innovation - Solution Révolutionnaire',
        description: 'Découvrez notre plateforme innovante qui transforme la collaboration et la productivité de votre équipe.'
      }
    }
  },

  {
    id: 'product-launch',
    name: 'Lancement de Produit',
    description: 'Page optimisée pour le lancement d\'un nouveau produit avec countdown et pré-commandes',
    category: 'landing',
    thumbnail: '/api/placeholder/400/300',
    tags: ['produit', 'lancement', 'countdown', 'conversion'],
    isBuiltIn: true,
    isPremium: true,
    content: {
      structure: [
        {
          id: 'announcement-bar',
          type: 'navbar',
          tag: 'div',
          content: '🚀 Lancement imminent - Soyez les premiers informés !',
          attributes: { className: 'bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-semibold' },
          styles: { backgroundColor: '#f97316', color: 'white', padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }
        },
        {
          id: 'launch-hero',
          type: 'section',
          tag: 'section',
          attributes: { className: 'min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden' },
          styles: { minHeight: '100vh', backgroundColor: '#000000', color: 'white', position: 'relative' },
          children: [
            {
              id: 'countdown-container',
              type: 'container',
              tag: 'div',
              attributes: { className: 'text-center z-10 relative' },
              children: [
                {
                  id: 'launch-title',
                  type: 'heading',
                  tag: 'h1',
                  content: 'Le Futur Arrive',
                  attributes: { className: 'text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent' },
                  styles: { fontSize: '5rem', fontWeight: 'bold', marginBottom: '2rem' }
                },
                {
                  id: 'countdown-timer',
                  type: 'container',
                  tag: 'div',
                  attributes: { className: 'flex justify-center gap-8 mb-8' },
                  children: [
                    {
                      id: 'days-counter',
                      type: 'container',
                      tag: 'div',
                      attributes: { className: 'text-center' },
                      children: [
                        {
                          id: 'days-number',
                          type: 'text',
                          tag: 'div',
                          content: '15',
                          attributes: { className: 'text-4xl font-bold' }
                        },
                        {
                          id: 'days-label',
                          type: 'text',
                          tag: 'div',
                          content: 'JOURS',
                          attributes: { className: 'text-sm opacity-70' }
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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        .countdown-digit { 
          background: linear-gradient(45deg, #1e40af, #7c3aed);
          border-radius: 12px;
          padding: 1rem;
          min-width: 80px;
        }
      `,
      scripts: `
        // Countdown Timer
        function updateCountdown() {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + 15);
          
          const now = new Date().getTime();
          const target = targetDate.getTime();
          const distance = target - now;
          
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          document.getElementById('days-number').textContent = days;
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
      `,
      meta: {
        title: 'Lancement Produit Révolutionnaire',
        description: 'Découvrez en avant-première notre nouveau produit qui va changer votre quotidien.'
      }
    }
  },

  // Business Templates
  {
    id: 'corporate-site',
    name: 'Site Corporatif Professionnel',
    description: 'Site d\'entreprise complet avec présentation, services, équipe et contact',
    category: 'business',
    thumbnail: '/api/placeholder/400/300',
    tags: ['entreprise', 'corporatif', 'professionnel', 'services'],
    isBuiltIn: true,
    content: {
      structure: [
        {
          id: 'corporate-header',
          type: 'navbar',
          tag: 'header',
          attributes: { className: 'bg-white shadow-sm sticky top-0 z-50' },
          styles: { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '0', zIndex: '50' },
          children: [
            {
              id: 'nav-container',
              type: 'container',
              tag: 'nav',
              attributes: { className: 'max-w-7xl mx-auto px-4 flex justify-between items-center py-4' },
              children: [
                {
                  id: 'logo',
                  type: 'text',
                  tag: 'div',
                  content: 'ENTREPRISE',
                  attributes: { className: 'text-2xl font-bold text-blue-600' },
                  styles: { fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }
                },
                {
                  id: 'nav-menu',
                  type: 'menu',
                  tag: 'ul',
                  attributes: { className: 'hidden md:flex space-x-8' },
                  children: [
                    {
                      id: 'nav-accueil',
                      type: 'link',
                      tag: 'a',
                      content: 'Accueil',
                      attributes: { href: '#accueil', className: 'text-gray-700 hover:text-blue-600 font-medium' }
                    },
                    {
                      id: 'nav-services',
                      type: 'link',
                      tag: 'a',
                      content: 'Services',
                      attributes: { href: '#services', className: 'text-gray-700 hover:text-blue-600 font-medium' }
                    },
                    {
                      id: 'nav-about',
                      type: 'link',
                      tag: 'a',
                      content: 'À propos',
                      attributes: { href: '#about', className: 'text-gray-700 hover:text-blue-600 font-medium' }
                    },
                    {
                      id: 'nav-contact',
                      type: 'link',
                      tag: 'a',
                      content: 'Contact',
                      attributes: { href: '#contact', className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700' }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'hero-business',
          type: 'section',
          tag: 'section',
          attributes: { className: 'bg-gradient-to-br from-blue-50 to-indigo-100 py-20' },
          styles: { background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', padding: '5rem 2rem' },
          children: [
            {
              id: 'hero-content',
              type: 'container',
              tag: 'div',
              attributes: { className: 'max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center' },
              children: [
                {
                  id: 'hero-text',
                  type: 'container',
                  tag: 'div',
                  children: [
                    {
                      id: 'hero-heading',
                      type: 'heading',
                      tag: 'h1',
                      content: 'Excellence et Innovation au Service de Votre Réussite',
                      attributes: { className: 'text-5xl font-bold text-gray-900 mb-6 leading-tight' },
                      styles: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', lineHeight: '1.2' }
                    },
                    {
                      id: 'hero-description',
                      type: 'paragraph',
                      tag: 'p',
                      content: 'Depuis plus de 20 ans, nous accompagnons les entreprises dans leur transformation digitale avec des solutions sur mesure et un service client d\'exception.',
                      attributes: { className: 'text-xl text-gray-600 mb-8' },
                      styles: { fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }
                    },
                    {
                      id: 'hero-cta-group',
                      type: 'container',
                      tag: 'div',
                      attributes: { className: 'flex flex-col sm:flex-row gap-4' },
                      children: [
                        {
                          id: 'hero-cta-primary',
                          type: 'button',
                          tag: 'button',
                          content: 'Découvrir nos services',
                          attributes: { className: 'bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors' }
                        },
                        {
                          id: 'hero-cta-secondary',
                          type: 'button',
                          tag: 'button',
                          content: 'Nous contacter',
                          attributes: { className: 'border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors' }
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
        body { font-family: 'Inter', sans-serif; }
        .gradient-text { background: linear-gradient(45deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hover-scale:hover { transform: scale(1.05); transition: transform 0.3s ease; }
      `,
      scripts: `
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      `,
      meta: {
        title: 'Entreprise Excellence - Solutions Professionnelles',
        description: 'Leader dans la transformation digitale, nous accompagnons votre entreprise vers le succès avec innovation et expertise.'
      }
    }
  },

  // Portfolio Templates
  {
    id: 'creative-portfolio',
    name: 'Portfolio Créatif',
    description: 'Portfolio moderne pour créatifs, designers et artistes avec galerie interactive',
    category: 'portfolio',
    thumbnail: '/api/placeholder/400/300',
    tags: ['portfolio', 'créatif', 'design', 'galerie'],
    isBuiltIn: true,
    isNew: true,
    content: {
      structure: [
        {
          id: 'portfolio-hero',
          type: 'section',
          tag: 'section',
          attributes: { className: 'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center text-white' },
          styles: { minHeight: '100vh', background: 'linear-gradient(135deg, #111827 0%, #581c87 50%, #7c3aed 100%)', color: 'white' },
          children: [
            {
              id: 'portfolio-intro',
              type: 'container',
              tag: 'div',
              attributes: { className: 'text-center max-w-4xl mx-auto px-4' },
              children: [
                {
                  id: 'designer-name',
                  type: 'heading',
                  tag: 'h1',
                  content: 'ALEX MARTIN',
                  attributes: { className: 'text-6xl md:text-8xl font-bold mb-4 tracking-wider' },
                  styles: { fontSize: '5rem', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '1rem' }
                },
                {
                  id: 'designer-title',
                  type: 'text',
                  tag: 'p',
                  content: 'Creative Director & Digital Artist',
                  attributes: { className: 'text-xl md:text-2xl mb-8 opacity-80 font-light' },
                  styles: { fontSize: '1.5rem', opacity: '0.8', fontWeight: '300', marginBottom: '2rem' }
                },
                {
                  id: 'portfolio-nav',
                  type: 'container',
                  tag: 'div',
                  attributes: { className: 'flex justify-center space-x-8' },
                  children: [
                    {
                      id: 'view-work-btn',
                      type: 'button',
                      tag: 'button',
                      content: 'Voir mes travaux',
                      attributes: { className: 'border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300 font-semibold' }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'portfolio-gallery',
          type: 'section',
          tag: 'section',
          attributes: { className: 'py-20 bg-gray-100' },
          styles: { padding: '5rem 2rem', backgroundColor: '#f3f4f6' },
          children: [
            {
              id: 'gallery-container',
              type: 'container',
              tag: 'div',
              attributes: { className: 'max-w-7xl mx-auto' },
              children: [
                {
                  id: 'gallery-title',
                  type: 'heading',
                  tag: 'h2',
                  content: 'Mes Créations',
                  attributes: { className: 'text-4xl font-bold text-center mb-16 text-gray-800' },
                  styles: { fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '4rem' }
                },
                {
                  id: 'works-grid',
                  type: 'grid',
                  tag: 'div',
                  attributes: { className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' },
                  styles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
                  children: [
                    {
                      id: 'work-1',
                      type: 'card',
                      tag: 'div',
                      attributes: { className: 'group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300' },
                      children: [
                        {
                          id: 'work-1-image',
                          type: 'image',
                          tag: 'img',
                          attributes: { src: '/api/placeholder/400/300', alt: 'Projet créatif 1', className: 'w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300' }
                        },
                        {
                          id: 'work-1-overlay',
                          type: 'container',
                          tag: 'div',
                          attributes: { className: 'absolute inset-0 bg-purple-900 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center' },
                          children: [
                            {
                              id: 'work-1-title',
                              type: 'heading',
                              tag: 'h3',
                              content: 'Identité Visuelle',
                              attributes: { className: 'text-white text-xl font-semibold' }
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; }
        .portfolio-grid { 
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .work-item:hover img { transform: scale(1.1); }
        .gradient-overlay { background: linear-gradient(45deg, rgba(124, 58, 237, 0.8), rgba(168, 85, 247, 0.8)); }
      `,
      scripts: `
        // Portfolio gallery interactions
        document.querySelectorAll('.work-item').forEach(item => {
          item.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.1)';
          });
          
          item.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
          });
        });
        
        // Smooth reveal animation on scroll
        const observerOptions = {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        }, observerOptions);
        
        document.querySelectorAll('.work-item').forEach(item => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(30px)';
          item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          observer.observe(item);
        });
      `,
      meta: {
        title: 'Alex Martin - Directeur Créatif & Artiste Digital',
        description: 'Portfolio créatif présentant mes travaux en design, direction artistique et création digitale.'
      }
    }
  },

  // E-commerce Templates
  {
    id: 'fashion-store',
    name: 'Boutique Mode',
    description: 'E-commerce moderne pour boutique de mode avec catalogue produits et panier',
    category: 'ecommerce',
    thumbnail: '/api/placeholder/400/300',
    tags: ['ecommerce', 'mode', 'boutique', 'vente'],
    isBuiltIn: true,
    isPremium: true,
    content: {
      structure: [
        {
          id: 'store-header',
          type: 'navbar',
          tag: 'header',
          attributes: { className: 'bg-white border-b sticky top-0 z-50' },
          styles: { backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: '0', zIndex: '50' },
          children: [
            {
              id: 'store-nav',
              type: 'container',
              tag: 'nav',
              attributes: { className: 'max-w-7xl mx-auto px-4 flex justify-between items-center py-4' },
              children: [
                {
                  id: 'store-logo',
                  type: 'text',
                  tag: 'div',
                  content: 'FASHION',
                  attributes: { className: 'text-2xl font-bold tracking-wide' },
                  styles: { fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em' }
                },
                {
                  id: 'store-menu',
                  type: 'menu',
                  tag: 'ul',
                  attributes: { className: 'hidden md:flex space-x-8' },
                  children: [
                    {
                      id: 'menu-femme',
                      type: 'link',
                      tag: 'a',
                      content: 'Femme',
                      attributes: { href: '#femme', className: 'text-gray-700 hover:text-black font-medium' }
                    },
                    {
                      id: 'menu-homme',
                      type: 'link',
                      tag: 'a',
                      content: 'Homme',
                      attributes: { href: '#homme', className: 'text-gray-700 hover:text-black font-medium' }
                    },
                    {
                      id: 'menu-accessoires',
                      type: 'link',
                      tag: 'a',
                      content: 'Accessoires',
                      attributes: { href: '#accessoires', className: 'text-gray-700 hover:text-black font-medium' }
                    }
                  ]
                },
                {
                  id: 'store-actions',
                  type: 'container',
                  tag: 'div',
                  attributes: { className: 'flex items-center space-x-4' },
                  children: [
                    {
                      id: 'search-btn',
                      type: 'button',
                      tag: 'button',
                      content: '🔍',
                      attributes: { className: 'p-2' }
                    },
                    {
                      id: 'cart-btn',
                      type: 'button',
                      tag: 'button',
                      content: '🛒 (0)',
                      attributes: { className: 'p-2' }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'store-hero',
          type: 'section',
          tag: 'section',
          attributes: { className: 'relative h-screen bg-gray-100' },
          styles: { height: '100vh', backgroundColor: '#f3f4f6', position: 'relative' },
          children: [
            {
              id: 'hero-image',
              type: 'image',
              tag: 'img',
              attributes: { 
                src: '/api/placeholder/1200/800',
                alt: 'Collection automne',
                className: 'w-full h-full object-cover' 
              },
              styles: { width: '100%', height: '100%', objectFit: 'cover' }
            },
            {
              id: 'hero-overlay',
              type: 'container',
              tag: 'div',
              attributes: { className: 'absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center' },
              children: [
                {
                  id: 'hero-content',
                  type: 'container',
                  tag: 'div',
                  attributes: { className: 'text-center text-white' },
                  children: [
                    {
                      id: 'collection-title',
                      type: 'heading',
                      tag: 'h1',
                      content: 'Nouvelle Collection Automne',
                      attributes: { className: 'text-5xl md:text-7xl font-light mb-6' },
                      styles: { fontSize: '4rem', fontWeight: '300', marginBottom: '2rem' }
                    },
                    {
                      id: 'collection-subtitle',
                      type: 'text',
                      tag: 'p',
                      content: 'Élégance et confort redéfinis',
                      attributes: { className: 'text-xl mb-8' },
                      styles: { fontSize: '1.25rem', marginBottom: '2rem' }
                    },
                    {
                      id: 'shop-btn',
                      type: 'button',
                      tag: 'button',
                      content: 'Découvrir la collection',
                      attributes: { className: 'bg-white text-black px-8 py-3 font-semibold hover:bg-gray-100 transition-colors' },
                      styles: { backgroundColor: 'white', color: 'black', padding: '0.75rem 2rem', fontWeight: '600' }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      styles: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .hero-parallax { background-attachment: fixed; background-position: center; background-repeat: no-repeat; background-size: cover; }
      `,
      scripts: `
        // Cart functionality
        let cartItems = 0;
        
        function addToCart() {
          cartItems++;
          document.querySelector('#cart-btn').textContent = '🛒 (' + cartItems + ')';
        }
        
        // Product hover effects
        document.querySelectorAll('.product-card').forEach(card => {
          card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
          });
          
          card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          });
        });
        
        // Search functionality
        document.querySelector('#search-btn').addEventListener('click', function() {
          const searchTerm = prompt('Rechercher un produit:');
          if (searchTerm) {
            console.log('Recherche:', searchTerm);
          }
        });
      `,
      meta: {
        title: 'Fashion Store - Mode & Élégance',
        description: 'Découvrez notre collection exclusive de vêtements et accessoires de mode. Livraison gratuite dès 50€.'
      }
    }
  }
];

export function getTemplatesByCategory(category: string): EnhancedTemplate[] {
  if (category === 'all') return enhancedTemplates;
  return enhancedTemplates.filter(template => template.category === category);
}

export function getTemplateById(id: string): EnhancedTemplate | undefined {
  return enhancedTemplates.find(template => template.id === id);
}

export function getFeaturedTemplates(): EnhancedTemplate[] {
  return enhancedTemplates.filter(template => template.isNew || template.isPremium).slice(0, 6);
}

export function searchTemplates(query: string): EnhancedTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return enhancedTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}