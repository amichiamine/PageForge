import React from 'react';
import type { ComponentDefinition } from '@shared/schema';

interface ComponentRendererProps {
  component: ComponentDefinition;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ComponentRenderer({ component, isSelected, onClick }: ComponentRendererProps) {
  const styles = component.styles || {};
  const attributes = component.attributes || {};
  const { className, ...otherAttributes } = attributes;

  // Convertir les styles CSS en objet React
  const inlineStyles: React.CSSProperties = {
    position: styles.position as any || 'absolute',
    left: styles.left || '50px',
    top: styles.top || '50px',
    width: styles.width || '200px',
    height: styles.height || '100px',
    backgroundColor: styles.backgroundColor || 'transparent',
    color: styles.color || '#000000',
    fontSize: styles.fontSize || '16px',
    fontFamily: styles.fontFamily || 'Arial, sans-serif',
    padding: styles.padding || '10px',
    margin: styles.margin || '0px',
    border: styles.border || 'none',
    borderRadius: styles.borderRadius || '0px',
    zIndex: parseInt(styles.zIndex || '1000'),
    display: styles.display || 'block',
    alignItems: styles.alignItems as any,
    justifyContent: styles.justifyContent as any,
    flexDirection: styles.flexDirection as any,
    textAlign: styles.textAlign as any,
    fontWeight: styles.fontWeight as any,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    whiteSpace: styles.whiteSpace as any,
    wordBreak: styles.wordBreak as any,
    objectFit: styles.objectFit as any,
    overflow: styles.overflow as any,
    boxShadow: styles.boxShadow,
    transition: styles.transition,
    cursor: styles.cursor,
    userSelect: styles.userSelect as any,
    outline: isSelected ? '2px solid #3b82f6' : styles.outline,
    minHeight: styles.minHeight,
    maxWidth: styles.maxWidth,
    gridTemplateColumns: styles.gridTemplateColumns,
    gap: styles.gap
  };

  // Filtrer les valeurs undefined pour éviter les warnings React
  Object.keys(inlineStyles).forEach(key => {
    if (inlineStyles[key as keyof React.CSSProperties] === undefined) {
      delete inlineStyles[key as keyof React.CSSProperties];
    }
  });

  const Tag = component.tag || 'div';
  const content = component.content || '';

  // Rendu des enfants récursivement
  const renderChildren = () => {
    if (!component.children || component.children.length === 0) return null;
    return component.children.map(child => (
      <ComponentRenderer key={child.id} component={child} />
    ));
  };

  // Cas spéciaux pour certains types de composants
  switch (component.type) {
    case 'image':
      if (attributes.src) {
        return (
          <img
            src={attributes.src as string}
            alt={attributes.alt as string || ''}
            className={className as string}
            style={inlineStyles}
            onClick={onClick}
            {...otherAttributes}
          />
        );
      }
      return (
        <div
          className={className as string}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          Image
        </div>
      );

    case 'carousel':
      return (
        <div
          className={`carousel-container ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div className="carousel-track" style={{ display: 'flex', width: '300%', height: '100%', transition: 'transform 0.3s ease-in-out' }}>
            <div className="carousel-slide" style={{ width: '33.333%', height: '100%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              Slide 1
            </div>
            <div className="carousel-slide" style={{ width: '33.333%', height: '100%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              Slide 2
            </div>
            <div className="carousel-slide" style={{ width: '33.333%', height: '100%', backgroundColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              Slide 3
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.8 }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.5 }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.5 }}></div>
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div
          className={`pricing-card ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>Plan Standard</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '10px' }}>29€<span style={{ fontSize: '16px', color: '#6b7280' }}>/mois</span></div>
            <ul style={{ listStyle: 'none', padding: '0', margin: '0', fontSize: '14px', color: '#4b5563' }}>
              <li style={{ padding: '5px 0' }}>✓ 10 projets inclus</li>
              <li style={{ padding: '5px 0' }}>✓ Support prioritaire</li>
              <li style={{ padding: '5px 0' }}>✓ Analytics avancées</li>
            </ul>
            <button style={{ marginTop: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer' }}>
              Choisir ce plan
            </button>
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div
          className={`testimonial ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#d1d5db', marginBottom: '10px' }}>"</div>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px', fontStyle: 'italic' }}>
              Ce service a transformé notre façon de travailler. Vraiment exceptionnel !
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5e7eb' }}></div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>Marie Dubois</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Directrice Marketing</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'team':
      return (
        <div
          className={`team-member ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e5e7eb', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#9ca3af' }}>
              👤
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', color: '#1f2937' }}>Jean Martin</h3>
            <p style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '10px' }}>Développeur Senior</p>
            <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
              Expert en développement web avec 8 ans d'expérience en React et Node.js.
            </p>
          </div>
        </div>
      );

    case 'stats':
      return (
        <div
          className={`stats-card ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px' }}>1,247</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Projets créés</div>
          </div>
        </div>
      );

    case 'faq':
      return (
        <div
          className={`faq-item ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Comment ça fonctionne ?</h4>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>+</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
              Notre plateforme vous permet de créer des sites web professionnels en quelques clics grâce à notre éditeur visuel intuitif.
            </p>
          </div>
        </div>
      );

    case 'weather':
      return (
        <div
          className={`weather-widget ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>☀️</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>22°C</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>Paris, France</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Ensoleillé</div>
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div
          className={`gallery-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937', textAlign: 'center' }}>Galerie Photos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', height: '200px' }}>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🖼️</div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🖼️</div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🖼️</div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🖼️</div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🖼️</div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🖼️</div>
          </div>
        </div>
      );

    case 'chart':
      return (
        <div
          className={`chart-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>Ventes mensuelles</h3>
            <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: '120px', gap: '8px' }}>
              <div style={{ backgroundColor: '#3b82f6', width: '20px', height: '60px', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#10b981', width: '20px', height: '80px', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#f59e0b', width: '20px', height: '100px', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#ef4444', width: '20px', height: '70px', borderRadius: '2px' }}></div>
              <div style={{ backgroundColor: '#8b5cf6', width: '20px', height: '90px', borderRadius: '2px' }}></div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>Jan - Mai 2024</div>
          </div>
        </div>
      );

    case 'video':
      return (
        <div
          className={`video-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>▶️</div>
              <div style={{ fontSize: '14px' }}>Vidéo de démonstration</div>
            </div>
          </div>
        </div>
      );

    case 'audio':
      return (
        <div
          className={`audio-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px' }}>🎵</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Musique d'ambiance</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>3:45 / 5:20</div>
            </div>
            <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>
              ▶️
            </button>
          </div>
        </div>
      );

    case 'icon':
      return (
        <div
          className={`icon-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <span style={{ fontSize: '32px' }}>{content || '⭐'}</span>
          </div>
        </div>
      );

    case 'link':
      return (
        <a
          href="#"
          className={`link-component ${className || ''}`}
          style={{ ...inlineStyles, textDecoration: 'underline', color: '#3b82f6', cursor: 'pointer' }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Lien vers la page'}
        </a>
      );

    case 'modal':
      return (
        <div
          className={`modal-preview ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ border: '2px dashed #d1d5db', padding: '20px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🪟</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Modal Dialog</div>
            <button style={{ marginTop: '10px', padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>
              Ouvrir
            </button>
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div
          className={`dropdown-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '8px 12px', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px' }}>Sélectionner une option</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>▼</span>
          </div>
        </div>
      );

    case 'accordion':
      return (
        <div
          className={`accordion-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Section 1</span>
              <span>+</span>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Section 2</span>
              <span>+</span>
            </div>
            <div style={{ padding: '12px 16px', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Section 3</span>
              <span>+</span>
            </div>
          </div>
        </div>
      );

    case 'table':
      return (
        <div
          className={`table-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '8px', border: '1px solid #d1d5db', textAlign: 'left' }}>Nom</th>
                <th style={{ padding: '8px', border: '1px solid #d1d5db', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '8px', border: '1px solid #d1d5db', textAlign: 'left' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #d1d5db' }}>Jean Dupont</td>
                <td style={{ padding: '8px', border: '1px solid #d1d5db' }}>jean@example.com</td>
                <td style={{ padding: '8px', border: '1px solid #d1d5db' }}>Actif</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #d1d5db' }}>Marie Martin</td>
                <td style={{ padding: '8px', border: '1px solid #d1d5db' }}>marie@example.com</td>
                <td style={{ padding: '8px', border: '1px solid #d1d5db' }}>Inactif</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

    case 'list':
      return (
        <div
          className={`list-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <ul style={{ margin: '0', padding: '0 0 0 20px', fontSize: '14px', color: '#374151' }}>
            <li style={{ marginBottom: '8px' }}>Premier élément de la liste</li>
            <li style={{ marginBottom: '8px' }}>Deuxième élément important</li>
            <li style={{ marginBottom: '8px' }}>Troisième point à retenir</li>
            <li>Dernier élément conclusif</li>
          </ul>
        </div>
      );

    case 'card':
      return (
        <div
          className={`card-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Titre de la carte</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
              Description de la carte avec du contenu informatif et pertinent pour l'utilisateur.
            </p>
            <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}>
              En savoir plus
            </button>
          </div>
        </div>
      );

    // Layout Components
    case 'container':
      return (
        <div
          className={`container ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '20px', border: '2px dashed #d1d5db', borderRadius: '8px', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Conteneur - Glissez des composants ici</span>
          </div>
          {renderChildren()}
        </div>
      );

    case 'section':
      return (
        <section
          className={`section ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>Section Titre</h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              Contenu de la section avec du texte descriptif et informatif pour présenter cette partie de la page.
            </p>
          </div>
          {renderChildren()}
        </section>
      );

    case 'header':
      return (
        <header
          className={`header ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '16px 24px', backgroundColor: '#1f2937', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Mon Site Web</div>
            <nav style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Accueil</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>À propos</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
            </nav>
          </div>
        </header>
      );

    case 'footer':
      return (
        <footer
          className={`footer ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '24px', backgroundColor: '#374151', color: 'white', textAlign: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Mon Entreprise</div>
              <div style={{ fontSize: '14px', color: '#d1d5db' }}>© 2024 Tous droits réservés</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '14px' }}>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Mentions légales</a>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Confidentialité</a>
              <a href="#" style={{ color: '#d1d5db', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
        </footer>
      );

    case 'grid':
      return (
        <div
          className={`grid-layout ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '16px' }}>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Grille 1</span>
            </div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Grille 2</span>
            </div>
            <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '16px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Grille 3</span>
            </div>
          </div>
        </div>
      );

    case 'flexbox':
      return (
        <div
          className={`flexbox-layout ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', gap: '16px', padding: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, backgroundColor: '#fef3c7', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#92400e' }}>Flex 1</span>
            </div>
            <div style={{ flex: 2, backgroundColor: '#dbeafe', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#1e40af' }}>Flex 2 (plus large)</span>
            </div>
            <div style={{ flex: 1, backgroundColor: '#dcfce7', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#166534' }}>Flex 3</span>
            </div>
          </div>
        </div>
      );

    // Text Components
    case 'heading':
      return (
        <div
          className={`heading ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          {React.createElement(
            component.tag || 'h1',
            {
              style: {
                fontSize: styles.fontSize || '28px',
                fontWeight: styles.fontWeight || 'bold',
                color: styles.color || '#1a202c',
                margin: '0',
                padding: '0',
                lineHeight: '1.2',
                letterSpacing: '-0.025em'
              }
            },
            content || 'Titre principal'
          )}
        </div>
      );

    case 'paragraph':
      return (
        <p
          className={`text-paragraph ${className || ''}`}
          style={{
            ...inlineStyles,
            fontSize: styles.fontSize || '16px',
            lineHeight: '1.6',
            color: styles.color || '#4a5568',
            margin: '0',
            padding: '0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
        </p>
      );

    case 'button':
      return (
        <button
          className={`btn-primary ${className || ''}`}
          style={{
            ...inlineStyles,
            backgroundColor: styles.backgroundColor || '#3b82f6',
            color: styles.color || '#ffffff',
            border: 'none',
            borderRadius: styles.borderRadius || '8px',
            padding: styles.padding || '12px 24px',
            cursor: 'pointer',
            fontSize: styles.fontSize || '14px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            outline: 'none',
            userSelect: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Cliquez ici'}
        </button>
      );

    // Forms Components  
    case 'input':
      return (
        <input
          type={attributes.type as string || 'text'}
          placeholder={attributes.placeholder as string || 'Entrez votre texte...'}
          className={`form-input ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        />
      );

    case 'textarea':
      return (
        <textarea
          placeholder={attributes.placeholder as string || 'Entrez votre message...'}
          className={`form-textarea ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            resize: 'vertical',
            outline: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content}
        </textarea>
      );

    case 'checkbox':
      return (
        <label
          className={`checkbox-label ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" style={{ margin: '0' }} />
            <span style={{ fontSize: '14px' }}>{content || 'Case à cocher'}</span>
          </div>
        </label>
      );

    case 'radio':
      return (
        <div
          className={`radio-group ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="radio" name="radio-group" />
              <span>Option 1</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="radio" name="radio-group" />
              <span>Option 2</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="radio" name="radio-group" />
              <span>Option 3</span>
            </label>
          </div>
        </div>
      );

    case 'select':
      return (
        <select
          className={`form-select ${className || ''}`}
          style={{
            ...inlineStyles,
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          <option>Sélectionnez une option</option>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      );

    // Navigation & E-commerce Components
    case 'breadcrumb':
      return (
        <nav
          className={`breadcrumb ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <ol style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
            <li><a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Accueil</a></li>
            <li style={{ color: '#d1d5db' }}>{'>'}</li>
            <li><a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Catégorie</a></li>
            <li style={{ color: '#d1d5db' }}>{'>'}</li>
            <li style={{ color: '#374151' }}>Page actuelle</li>
          </ol>
        </nav>
      );

    case 'navbar':
      return (
        <nav
          className={`navbar ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Logo</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Accueil</a>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Produits</a>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>À propos</a>
              <a href="#" style={{ color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Contact</a>
            </div>
          </div>
        </nav>
      );

    case 'menu':
      return (
        <div
          className={`menu ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', marginBottom: '4px', fontSize: '14px' }}>
              Menu principal
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
              Option 1
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
              Option 2
            </div>
            <div style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
              Option 3
            </div>
          </div>
        </div>
      );

    case 'pagination':
      return (
        <nav
          className={`pagination ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#6b7280', cursor: 'pointer' }}>
              Précédent
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white' }}>
              1
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}>
              2
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}>
              3
            </button>
            <button style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', color: '#374151', cursor: 'pointer' }}>
              Suivant
            </button>
          </div>
        </nav>
      );

    case 'tabs':
      return (
        <div
          className={`tabs ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '0' }}>
              <button style={{ padding: '12px 24px', borderBottom: '2px solid #3b82f6', backgroundColor: 'transparent', border: 'none', color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                Onglet 1
              </button>
              <button style={{ padding: '12px 24px', borderBottom: '2px solid transparent', backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Onglet 2
              </button>
              <button style={{ padding: '12px 24px', borderBottom: '2px solid transparent', backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Onglet 3
              </button>
            </div>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <p style={{ fontSize: '14px', color: '#374151', margin: '0' }}>Contenu de l'onglet actif</p>
          </div>
        </div>
      );

    case 'sidebar':
      return (
        <aside
          className={`sidebar ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '24px', backgroundColor: '#1f2937', color: 'white', height: '100%', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', marginTop: '0' }}>Navigation</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#" style={{ padding: '12px 16px', color: 'white', textDecoration: 'none', borderRadius: '6px', backgroundColor: '#374151', fontSize: '14px' }}>
                🏠 Accueil
              </a>
              <a href="#" style={{ padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                📊 Tableau de bord
              </a>
              <a href="#" style={{ padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                👥 Utilisateurs
              </a>
              <a href="#" style={{ padding: '12px 16px', color: '#d1d5db', textDecoration: 'none', borderRadius: '6px', fontSize: '14px' }}>
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>
      );

    // Business & E-commerce
    case 'product':
      return (
        <div
          className={`product-card ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '160px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '48px' }}>📦</span>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Produit Premium</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.4' }}>
                Description détaillée du produit avec ses principales caractéristiques.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>49,99 €</span>
                <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}>
                  Acheter
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'cart':
      return (
        <div
          className={`shopping-cart ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Panier d'achat</h3>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Produit 1 × 2</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>99,98 €</span>
              </div>
            </div>
            <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Produit 2 × 1</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>29,99 €</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Total:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>129,97 €</span>
            </div>
            <button style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Procéder au paiement
            </button>
          </div>
        </div>
      );

    case 'form':
      return (
        <form
          className={`contact-form ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>Formulaire de contact</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Nom complet</label>
              <input type="text" placeholder="Votre nom..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email</label>
              <input type="email" placeholder="votre@email.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Message</label>
              <textarea placeholder="Votre message..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical', minHeight: '80px' }}></textarea>
            </div>
            <button type="submit" style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Envoyer le message
            </button>
          </div>
        </form>
      );

    // Content & Media Components
    case 'blog':
      return (
        <article
          className={`blog-post ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '120px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '32px' }}>📝</span>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>2 janvier 2024</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Titre de l'article de blog</h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
                Extrait de l'article de blog avec les premières lignes du contenu pour donner un aperçu...
              </p>
              <a href="#" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Lire la suite →
              </a>
            </div>
          </div>
        </article>
      );

    case 'timeline':
      return (
        <div
          className={`timeline ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ position: 'relative', padding: '20px' }}>
            <div style={{ position: 'absolute', left: '20px', top: '20px', bottom: '20px', width: '2px', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ marginLeft: '40px' }}>
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2024</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Lancement du projet</div>
              </div>
              <div style={{ marginBottom: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2023</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Première version stable</div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-30px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>2022</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Début du développement</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'progress':
      return (
        <div
          className={`progress-bar ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Progression du projet</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>75%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
            </div>
          </div>
        </div>
      );

    case 'map':
      return (
        <div
          className={`map-component ${className || ''}`}
          style={inlineStyles}
          onClick={onClick}
          {...otherAttributes}
        >
          <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>Carte interactive</div>
            <div style={{ fontSize: '12px', color: '#0284c7' }}>Paris, France</div>
          </div>
        </div>
      );

    case 'text':
      return (
        <span
          className={`text-element ${className || ''}`}
          style={{
            ...inlineStyles,
            fontSize: styles.fontSize || '16px',
            fontWeight: styles.fontWeight || 'normal',
            color: styles.color || '#374151',
            fontFamily: styles.fontFamily || 'inherit',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
          onClick={onClick}
          {...otherAttributes}
        >
          {content || 'Texte modifiable'}
        </span>
      );

    default:
      // Rendu par défaut pour tous les autres composants
      // Éléments vides (void elements) ne peuvent pas avoir d'enfants
      const voidElements = ['input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
      const isVoidElement = voidElements.includes(Tag.toLowerCase());
      
      if (isVoidElement) {
        return React.createElement(
          Tag as any,
          {
            className: className as string,
            style: inlineStyles,
            onClick: onClick,
            ...otherAttributes
          }
        );
      }
      
      return React.createElement(
        Tag as any,
        {
          className: className as string,
          style: inlineStyles,
          onClick: onClick,
          ...otherAttributes
        },
        content,
        renderChildren()
      );
  }
}