import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend } from 'react-dnd-multi-backend';
import { useCollaboration } from '@/hooks/useCollaboration';
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/header";
import { Save, Eye, Download, Code, ArrowLeft, Wifi, Undo, Redo, Grid, Settings, Plus, X, Menu, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project, ComponentDefinition } from "@shared/schema";
import { createComponent } from "@/lib/editor-utils";
import { useLocation } from "wouter";
import { useSidebarContext } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FloatingButton } from "@/components/ui/floating-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDrop, useDrag } from "react-dnd";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import ColorPicker from "@/components/editor/color-picker";
import ImageSelector from "@/components/editor/image-selector";
import TouchComponentPalette from "@/components/editor/touch-component-palette";
import EnhancedTouchPalette from "@/components/editor/enhanced-touch-palette";
import FreeDragComponent from "@/components/editor/free-drag-component";
import { EnhancedImageSelector } from "@/components/editor/enhanced-image-selector";

// Configuration multi-backend pour drag and drop
const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: (event: any) => !event.nativeEvent?.touches?.length
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: (event: any) => event.nativeEvent?.touches?.length > 0
    }
  ]
};

// Composants disponibles - LISTE COMPLÈTE ENRICHIE
const componentTypes = [
  // Text Components
  { type: 'heading', name: 'Titre', category: 'Text', icon: '📝' },
  { type: 'paragraph', name: 'Paragraphe', category: 'Text', icon: '📄' },
  { type: 'text', name: 'Texte', category: 'Text', icon: '📄' },
  { type: 'blockquote', name: 'Citation', category: 'Text', icon: '💬' },
  { type: 'code', name: 'Code', category: 'Text', icon: '💻' },
  { type: 'preformatted', name: 'Texte préformaté', category: 'Text', icon: '📝' },
  
  // Interactive Components
  { type: 'button', name: 'Bouton', category: 'Interactive', icon: '🔘' },
  { type: 'input', name: 'Champ de saisie', category: 'Interactive', icon: '📝' },
  { type: 'textarea', name: 'Zone de texte', category: 'Interactive', icon: '📝' },
  { type: 'select', name: 'Liste déroulante', category: 'Interactive', icon: '📋' },
  { type: 'checkbox', name: 'Case à cocher', category: 'Interactive', icon: '☑️' },
  { type: 'radio', name: 'Bouton radio', category: 'Interactive', icon: '⚪' },
  { type: 'form', name: 'Formulaire', category: 'Interactive', icon: '📝' },
  { type: 'link', name: 'Lien', category: 'Interactive', icon: '🔗' },
  { type: 'toggle', name: 'Commutateur', category: 'Interactive', icon: '🔘' },
  { type: 'slider', name: 'Curseur', category: 'Interactive', icon: '🎚️' },
  { type: 'progress', name: 'Barre de progression', category: 'Interactive', icon: '📊' },
  { type: 'rating', name: 'Notation', category: 'Interactive', icon: '⭐' },
  
  // Media Components
  { type: 'image', name: 'Image', category: 'Media', icon: '🖼️' },
  { type: 'video', name: 'Vidéo', category: 'Media', icon: '🎥' },
  { type: 'audio', name: 'Audio', category: 'Media', icon: '🎵' },
  { type: 'iframe', name: 'iFrame', category: 'Media', icon: '🖥️' },
  { type: 'gallery', name: 'Galerie', category: 'Media', icon: '🖼️' },
  { type: 'carousel', name: 'Carrousel', category: 'Media', icon: '🎠' },
  { type: 'map', name: 'Carte', category: 'Media', icon: '🗺️' },
  
  // Layout Components
  { type: 'container', name: 'Container', category: 'Layout', icon: '📦' },
  { type: 'section', name: 'Section', category: 'Layout', icon: '📄' },
  { type: 'article', name: 'Article', category: 'Layout', icon: '📰' },
  { type: 'header', name: 'En-tête', category: 'Layout', icon: '🔝' },
  { type: 'footer', name: 'Pied de page', category: 'Layout', icon: '🔚' },
  { type: 'sidebar', name: 'Barre latérale', category: 'Layout', icon: '📌' },
  { type: 'grid', name: 'Grille', category: 'Layout', icon: '⚏' },
  { type: 'flexbox', name: 'Flex Container', category: 'Layout', icon: '📐' },
  { type: 'column', name: 'Colonne', category: 'Layout', icon: '📏' },
  { type: 'row', name: 'Ligne', category: 'Layout', icon: '↔️' },
  { type: 'spacer', name: 'Espacement', category: 'Layout', icon: '⬜' },
  { type: 'divider', name: 'Séparateur', category: 'Layout', icon: '➖' },
  
  // Content Components
  { type: 'card', name: 'Card', category: 'Content', icon: '🗃️' },
  { type: 'list', name: 'Liste', category: 'Content', icon: '📋' },
  { type: 'table', name: 'Tableau', category: 'Content', icon: '📊' },
  { type: 'accordion', name: 'Accordéon', category: 'Content', icon: '🪗' },
  { type: 'tabs', name: 'Onglets', category: 'Content', icon: '📑' },
  { type: 'modal', name: 'Modal', category: 'Content', icon: '🔲' },
  { type: 'tooltip', name: 'Info-bulle', category: 'Content', icon: '💭' },
  { type: 'alert', name: 'Alerte', category: 'Content', icon: '⚠️' },
  { type: 'badge', name: 'Badge', category: 'Content', icon: '🏷️' },
  { type: 'timeline', name: 'Timeline', category: 'Content', icon: '⏰' },
  { type: 'testimonial', name: 'Témoignage', category: 'Content', icon: '💬' },
  { type: 'pricing', name: 'Tarification', category: 'Content', icon: '💰' },
  { type: 'feature', name: 'Fonctionnalité', category: 'Content', icon: '✨' },
  { type: 'stats', name: 'Statistiques', category: 'Content', icon: '📈' },
  
  // Navigation Components
  { type: 'navigation', name: 'Navigation', category: 'Navigation', icon: '🧭' },
  { type: 'navbar', name: 'Barre de navigation', category: 'Navigation', icon: '📶' },
  { type: 'menu', name: 'Menu', category: 'Navigation', icon: '☰' },
  { type: 'breadcrumb', name: 'Fil d\'Ariane', category: 'Navigation', icon: '🍞' },
  { type: 'pagination', name: 'Pagination', category: 'Navigation', icon: '📄' },
  { type: 'sitemap', name: 'Plan du site', category: 'Navigation', icon: '🗺️' },
  
  // E-commerce Components
  { type: 'product', name: 'Produit', category: 'E-commerce', icon: '🛍️' },
  { type: 'cart', name: 'Panier', category: 'E-commerce', icon: '🛒' },
  { type: 'checkout', name: 'Commande', category: 'E-commerce', icon: '💳' },
  { type: 'wishlist', name: 'Liste de souhaits', category: 'E-commerce', icon: '❤️' },
  { type: 'search', name: 'Recherche', category: 'E-commerce', icon: '🔍' },
  { type: 'filter', name: 'Filtre', category: 'E-commerce', icon: '🔽' },
  
  // Social Components
  { type: 'social', name: 'Réseaux sociaux', category: 'Social', icon: '📱' },
  { type: 'share', name: 'Partage', category: 'Social', icon: '📤' },
  { type: 'comments', name: 'Commentaires', category: 'Social', icon: '💬' },
  { type: 'likes', name: 'J\'aime', category: 'Social', icon: '👍' },
  { type: 'follow', name: 'Suivre', category: 'Social', icon: '➕' },
  
  // Chart Components
  { type: 'chart', name: 'Graphique', category: 'Chart', icon: '📊' },
  { type: 'pie-chart', name: 'Graphique circulaire', category: 'Chart', icon: '🥧' },
  { type: 'bar-chart', name: 'Graphique en barres', category: 'Chart', icon: '📊' },
  { type: 'line-chart', name: 'Graphique linéaire', category: 'Chart', icon: '📈' },
  { type: 'area-chart', name: 'Graphique en aires', category: 'Chart', icon: '🏔️' },
  
  // Advanced Components
  { type: 'calendar', name: 'Calendrier', category: 'Advanced', icon: '📅' },
  { type: 'datepicker', name: 'Sélecteur de date', category: 'Advanced', icon: '📅' },
  { type: 'color-picker', name: 'Sélecteur de couleur', category: 'Advanced', icon: '🎨' },
  { type: 'file-upload', name: 'Upload de fichier', category: 'Advanced', icon: '📁' },
  { type: 'drag-drop', name: 'Glisser-déposer', category: 'Advanced', icon: '↕️' },
  { type: 'code-editor', name: 'Éditeur de code', category: 'Advanced', icon: '⌨️' },
  { type: 'wysiwyg', name: 'Éditeur WYSIWYG', category: 'Advanced', icon: '✏️' },
  { type: 'signature', name: 'Signature', category: 'Advanced', icon: '✍️' }
];

// Composant draggable de la palette
interface DraggableComponentProps {
  component: typeof componentTypes[0];
}

function DraggableComponent({ component }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type: component.type, componentType: component.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDoubleClick = () => {
    // Double-click to add component at canvas center with random offset
    const centerX = 250 + Math.random() * 100;
    const centerY = 100 + Math.random() * 100;
    
    // Dispatch a custom event to add component
    window.dispatchEvent(new CustomEvent('addComponentByDoubleClick', {
      detail: { componentType: component.type, position: { x: centerX, y: centerY } }
    }));
  };

  return (
    <div
      ref={drag}
      className={`component-item p-1 border rounded cursor-move transition-all hover:shadow-md touch-feedback ${
        isDragging ? 'opacity-50' : ''
      }`}
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="flex items-center gap-1">
        <span className="text-xs">{component.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-xs truncate">{component.name}</p>
        </div>
      </div>
    </div>
  );
}

// Zone de drop principale (éditeur visuel)
interface DropZoneProps {
  components: ComponentDefinition[];
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentAdd: (type: string, position: { x: number; y: number }) => void;
  onComponentMove: (id: string, position: { x: number; y: number }) => void;
  onComponentUpdate: (component: ComponentDefinition) => void;
  onComponentDelete: (id: string) => void;
}

function DropZone({ 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onComponentAdd, 
  onComponentMove,
  onComponentUpdate,
  onComponentDelete
}: DropZoneProps) {
  const dropRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'existing-component'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const dropRect = dropRef.current?.getBoundingClientRect();
      
      if (!offset || !dropRect) return;
      
      const x = offset.x - dropRect.left;
      const y = offset.y - dropRect.top;
      
      if (item.id) {
        // Moving existing component
        onComponentMove(item.id, { x, y });
      } else {
        // Adding new component
        onComponentAdd(item.type || item.componentType, { x, y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`drop-zone relative w-full h-full min-h-96 bg-white border-2 border-dashed transition-all ${
        isOver ? 'drag-over border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Drop hint with touch support */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-lg font-medium">Glissez des composants ici</p>
            <p className="text-sm">Ou double-cliquez sur un composant pour l'ajouter</p>
            {isMobile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Mode tactile détecté</p>
                <p className="text-xs text-blue-500">Double-cliquez pour ajouter des composants</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Point 1 CORRIGÉ - FreeDragComponent pour TOUS les écrans */}
      {components.map((component) => (
        <FreeDragComponent
          key={component.id}
          component={component}
          isSelected={selectedComponent?.id === component.id}
          onSelect={onComponentSelect}
          onMove={onComponentMove}
          onUpdate={onComponentUpdate}
          onDelete={onComponentDelete}
          onDuplicate={(comp) => {
            const duplicatedComponent = {
              ...comp,
              id: `${comp.type}-${Date.now()}`,
              position: {
                x: (comp.position?.x || 0) + 20,
                y: (comp.position?.y || 0) + 20,
                width: comp.position?.width || 200,
                height: comp.position?.height || 100
              }
            };
            onComponentAdd(duplicatedComponent.type, duplicatedComponent.position || { x: 0, y: 0 });
          }}
          containerRef={dropRef}
        />
      ))}
    </div>
  );
}

// Composant rendu et draggable dans l'éditeur
interface DraggableRenderedComponentProps {
  component: ComponentDefinition;
  isSelected: boolean;
  onSelect: (component: ComponentDefinition | null) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}

function DraggableRenderedComponent({ 
  component, 
  isSelected, 
  onSelect,
  onMove 
}: DraggableRenderedComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'existing-component',
    item: { id: component.id, type: 'existing-component' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Touch drag functionality
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragActive, setIsDragActive] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragActive(true);
    const touch = e.touches[0];
    setDragPosition({
      x: touch.clientX - (component.position?.x || 0),
      y: touch.clientY - (component.position?.y || 0)
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newX = touch.clientX - dragPosition.x;
    const newY = touch.clientY - dragPosition.y;
    onMove(component.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handleTouchEnd = () => {
    setIsDragActive(false);
  };

  const renderComponentContent = () => {
    const content = component.content || 'Nouveau composant';
    const styles = component.styles || {};
    const attributes = component.attributes || {};
    
    switch (component.type) {
      // Text Components
      case 'heading':
        const level = attributes.level || 2;
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        return <HeadingTag className="font-bold" style={styles}>{content}</HeadingTag>;
      case 'paragraph':
        return <p style={styles}>{content}</p>;
      case 'text':
        return <span style={styles}>{content}</span>;
      case 'blockquote':
        return <blockquote className="border-l-4 border-gray-300 pl-4 italic" style={styles}>{content}</blockquote>;
      case 'code':
        return <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm" style={styles}>{content}</code>;
      case 'preformatted':
        return <pre className="bg-gray-100 p-3 rounded overflow-x-auto font-mono text-sm" style={styles}>{content}</pre>;
      
      // Interactive Components  
      case 'button':
        return <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" style={styles}>{content}</button>;
      case 'input':
        return <input type={attributes.type || 'text'} placeholder={content} className="border rounded px-3 py-2" style={styles} />;
      case 'textarea':
        return <textarea placeholder={content} className="border rounded px-3 py-2 resize-none" rows={attributes.rows || 3} style={styles}></textarea>;
      case 'select':
        return <select className="border rounded px-3 py-2" style={styles}>
          <option>{content}</option>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>;
      case 'checkbox':
        return <label className="flex items-center gap-2" style={styles}>
          <input type="checkbox" className="rounded" />
          <span>{content}</span>
        </label>;
      case 'radio':
        return <label className="flex items-center gap-2" style={styles}>
          <input type="radio" className="rounded-full" />
          <span>{content}</span>
        </label>;
      case 'link':
        return <a href={attributes.href || '#'} className="text-blue-500 underline hover:text-blue-600" style={styles}>{content}</a>;
      case 'toggle':
        return <label className="flex items-center gap-2" style={styles}>
          <input type="checkbox" className="sr-only" />
          <div className="w-10 h-6 bg-gray-200 rounded-full p-1">
            <div className="w-4 h-4 bg-white rounded-full shadow transform transition"></div>
          </div>
          <span>{content}</span>
        </label>;
      case 'slider':
        return <input type="range" min={attributes.min || 0} max={attributes.max || 100} className="w-full" style={styles} />;
      case 'progress':
        return <div className="w-full bg-gray-200 rounded-full h-2" style={styles}>
          <div className="bg-blue-500 h-2 rounded-full" style={{width: `${attributes.value || 50}%`}}></div>
        </div>;
      case 'rating':
        return <div className="flex gap-1" style={styles}>
          {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
        </div>;
      
      // Media Components
      case 'image':
        const imageSrc = attributes.src;
        return imageSrc ? (
          <img src={imageSrc} alt={attributes.alt || 'Image'} className="max-w-32 max-h-20 object-cover rounded" style={styles} />
        ) : (
          <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded" style={styles}>📷 Image</div>
        );
      case 'video':
        return <div className="w-32 h-20 bg-gray-800 flex items-center justify-center rounded text-white" style={styles}>🎥 Vidéo</div>;
      case 'audio':
        return <div className="w-32 h-12 bg-gray-100 flex items-center justify-center rounded border" style={styles}>🎵 Audio</div>;
      case 'iframe':
        return <div className="w-32 h-20 bg-gray-100 flex items-center justify-center rounded border" style={styles}>🖥️ iFrame</div>;
      case 'gallery':
        return <div className="grid grid-cols-2 gap-1 w-32" style={styles}>
          {[1,2,3,4].map(i => <div key={i} className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-xs">📷</div>)}
        </div>;
      case 'carousel':
        return <div className="w-32 h-20 bg-gray-100 flex items-center justify-center rounded border" style={styles}>🎠 Carrousel</div>;
      case 'map':
        return <div className="w-32 h-20 bg-green-100 flex items-center justify-center rounded border" style={styles}>🗺️ Map</div>;
      
      // Layout Components
      case 'container':
        return <div className="p-4 border border-dashed border-gray-300 min-h-20 bg-gray-50" style={styles}>📦 Container</div>;
      case 'section':
        return <section className="p-4 border border-dashed border-blue-300 min-h-16 bg-blue-50" style={styles}>📄 Section</section>;
      case 'article':
        return <article className="p-3 border rounded bg-white shadow-sm" style={styles}>📰 {content}</article>;
      case 'header':
        return <header className="p-3 bg-gray-800 text-white text-center rounded-t" style={styles}>🔝 Header</header>;
      case 'footer':
        return <footer className="p-3 bg-gray-800 text-white text-center rounded-b text-sm" style={styles}>🔚 Footer</footer>;
      case 'sidebar':
        return <aside className="p-3 bg-gray-100 border rounded min-h-16" style={styles}>📌 Sidebar</aside>;
      case 'grid':
        return <div className="grid grid-cols-2 gap-2" style={styles}>
          <div className="bg-gray-200 h-8 rounded flex items-center justify-center text-xs">1</div>
          <div className="bg-gray-200 h-8 rounded flex items-center justify-center text-xs">2</div>
        </div>;
      case 'flexbox':
        return <div className="flex gap-2" style={styles}>
          <div className="flex-1 bg-gray-200 h-8 rounded flex items-center justify-center text-xs">Flex 1</div>
          <div className="flex-1 bg-gray-200 h-8 rounded flex items-center justify-center text-xs">Flex 2</div>
        </div>;
      case 'column':
        return <div className="w-16 h-20 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-xs" style={styles}>📏 Col</div>;
      case 'row':
        return <div className="w-32 h-8 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-xs" style={styles}>↔️ Row</div>;
      case 'spacer':
        return <div className="w-32 h-4 bg-gray-100 border border-dashed border-gray-300 rounded" style={styles}></div>;
      case 'divider':
        return <hr className="border-gray-300 my-2" style={styles} />;
      
      // Content Components
      case 'card':
        return <div className="p-4 border rounded-lg shadow-sm bg-white max-w-32" style={styles}>
          <div className="text-sm font-medium">{content}</div>
        </div>;
      case 'list':
        return <ul className="list-disc list-inside space-y-1" style={styles}>
          <li className="text-sm">Item 1</li>
          <li className="text-sm">Item 2</li>
          <li className="text-sm">Item 3</li>
        </ul>;
      case 'table':
        return <table className="min-w-full border border-gray-300 text-xs" style={styles}>
          <tr><th className="border border-gray-300 p-1">Col 1</th><th className="border border-gray-300 p-1">Col 2</th></tr>
          <tr><td className="border border-gray-300 p-1">Data 1</td><td className="border border-gray-300 p-1">Data 2</td></tr>
        </table>;
      case 'accordion':
        return <div className="border rounded" style={styles}>
          <div className="p-2 bg-gray-100 border-b text-sm font-medium">🪗 {content}</div>
          <div className="p-2 text-xs">Contenu de l'accordéon</div>
        </div>;
      case 'tabs':
        return <div style={styles}>
          <div className="flex border-b">
            <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-t">Tab 1</div>
            <div className="px-3 py-1 bg-gray-200 text-xs rounded-t">Tab 2</div>
          </div>
          <div className="p-2 text-xs">Contenu de l'onglet</div>
        </div>;
      case 'modal':
        return <div className="bg-white border shadow-lg rounded p-3 max-w-32" style={styles}>
          <div className="text-sm font-medium mb-2">🔲 Modal</div>
          <div className="text-xs">{content}</div>
        </div>;
      case 'tooltip':
        return <div className="relative inline-block" style={styles}>
          <span className="text-blue-500 cursor-help">💭 Hover</span>
        </div>;
      case 'alert':
        return <div className="p-2 bg-yellow-100 border border-yellow-400 rounded text-xs" style={styles}>
          ⚠️ {content}
        </div>;
      case 'badge':
        return <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full" style={styles}>🏷️ {content}</span>;
      case 'timeline':
        return <div className="flex items-center gap-2" style={styles}>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="text-xs">{content}</div>
        </div>;
      case 'testimonial':
        return <div className="p-3 bg-gray-50 border rounded italic text-xs" style={styles}>
          "💬 {content}"
          <div className="text-right mt-1 font-medium">- Auteur</div>
        </div>;
      case 'pricing':
        return <div className="p-3 border rounded text-center" style={styles}>
          <div className="text-lg font-bold">💰 29€</div>
          <div className="text-xs">{content}</div>
        </div>;
      case 'feature':
        return <div className="flex items-center gap-2" style={styles}>
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
          <div className="text-xs">{content}</div>
        </div>;
      case 'stats':
        return <div className="text-center" style={styles}>
          <div className="text-xl font-bold text-blue-500">123</div>
          <div className="text-xs text-gray-600">{content}</div>
        </div>;
      
      // Navigation Components
      case 'navigation':
      case 'navbar':
        return <nav className="flex gap-4 p-2 bg-gray-800 text-white rounded text-xs" style={styles}>
          <a href="#" className="hover:text-gray-300">Accueil</a>
          <a href="#" className="hover:text-gray-300">À propos</a>
          <a href="#" className="hover:text-gray-300">Contact</a>
        </nav>;
      case 'menu':
        return <div className="bg-white border shadow rounded" style={styles}>
          <div className="p-2 hover:bg-gray-100 text-xs cursor-pointer">☰ Option 1</div>
          <div className="p-2 hover:bg-gray-100 text-xs cursor-pointer">☰ Option 2</div>
        </div>;
      case 'breadcrumb':
        return <nav className="text-xs text-gray-600" style={styles}>
          <span>Accueil</span> › <span>Page</span> › <span className="text-gray-900">Actuel</span>
        </nav>;
      case 'pagination':
        return <div className="flex gap-1" style={styles}>
          <button className="px-2 py-1 border rounded text-xs">‹</button>
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs">1</button>
          <button className="px-2 py-1 border rounded text-xs">2</button>
          <button className="px-2 py-1 border rounded text-xs">›</button>
        </div>;
      
      // E-commerce Components
      case 'product':
        return <div className="border rounded p-2 bg-white shadow-sm max-w-32" style={styles}>
          <div className="w-full h-16 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs">📷</div>
          <div className="text-xs font-medium">{content}</div>
          <div className="text-sm font-bold text-green-600">29,99€</div>
        </div>;
      case 'cart':
        return <div className="flex items-center gap-2 p-2 border rounded" style={styles}>
          <span className="text-lg">🛒</span>
          <span className="text-xs">Panier (3)</span>
        </div>;
      case 'search':
        return <div className="flex border rounded" style={styles}>
          <input type="text" placeholder="Rechercher..." className="flex-1 px-2 py-1 text-xs" />
          <button className="px-2 py-1 bg-blue-500 text-white text-xs">🔍</button>
        </div>;
      
      // Chart Components
      case 'chart':
      case 'bar-chart':
        return <div className="w-32 h-20 bg-gray-50 border rounded flex items-end justify-center gap-1 p-2" style={styles}>
          <div className="w-3 h-8 bg-blue-500 rounded-t"></div>
          <div className="w-3 h-12 bg-blue-500 rounded-t"></div>
          <div className="w-3 h-6 bg-blue-500 rounded-t"></div>
        </div>;
      case 'pie-chart':
        return <div className="w-20 h-20 rounded-full border-8 border-blue-500 border-r-red-500 border-b-green-500 border-l-yellow-500" style={styles}></div>;
      case 'line-chart':
        return <div className="w-32 h-20 bg-gray-50 border rounded flex items-center justify-center" style={styles}>
          <div className="text-xs">📈 Graphique</div>
        </div>;
      
      // Advanced Components  
      case 'calendar':
        return <div className="border rounded p-2 bg-white" style={styles}>
          <div className="text-xs font-medium mb-1">📅 Jan 2024</div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
            <div className="bg-blue-500 text-white rounded text-center">1</div>
            <div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
          </div>
        </div>;
      case 'datepicker':
        return <input type="date" className="border rounded px-2 py-1 text-xs" style={styles} />;
      case 'color-picker':
        return <div className="flex items-center gap-2" style={styles}>
          <div className="w-6 h-6 bg-blue-500 border rounded"></div>
          <span className="text-xs">Couleur</span>
        </div>;
      case 'file-upload':
        return <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center" style={styles}>
          <div className="text-xs">📁 Glisser fichiers ici</div>
        </div>;
      
      // Form Components
      case 'form':
        return <form className="space-y-2 p-3 border rounded bg-gray-50" style={styles}>
          <input type="text" placeholder="Nom" className="w-full border rounded px-2 py-1 text-xs" />
          <input type="email" placeholder="Email" className="w-full border rounded px-2 py-1 text-xs" />
          <button type="submit" className="w-full bg-blue-500 text-white rounded px-2 py-1 text-xs">Envoyer</button>
        </form>;
      
      default:
        return <div className="p-2 border border-dashed border-gray-400 rounded bg-gray-50 text-xs" style={styles}>
          <div className="flex items-center justify-center min-h-8">
            <span className="text-gray-600">{component.type}: {content}</span>
          </div>
        </div>;
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute cursor-move transition-all touch-manipulation ${
        isDragging || isDragActive ? 'opacity-70 z-50' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        touchAction: 'none',
        transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderComponentContent()}
      
      {/* Selection handles */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
        </>
      )}
    </div>
  );
}

export default function EditorComplete() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // States
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showTouchPalette, setShowTouchPalette] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [leftPanelVisible, setLeftPanelVisible] = useState(false);
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const [pageBackgroundType, setPageBackgroundType] = useState<'solid' | 'gradient' | 'image'>('solid');
  const [pageBackground, setPageBackground] = useState('#ffffff');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sidebar context
  const { setHideMainSidebar } = useSidebarContext();

  // Hide main sidebar when in editor
  useEffect(() => {
    setHideMainSidebar(true);
    return () => setHideMainSidebar(false);
  }, [setHideMainSidebar]);

  // Project query
  const { 
    data: project, 
    isLoading, 
    error,
    refetch 
  } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Collaboration hook
  const collaboration = useCollaboration({
    projectId: projectId || '',
    userId: 'current-user',
    userName: 'Utilisateur',
    enabled: !!projectId && !!project
  });

  // Load components from project
  useEffect(() => {
    if (project?.content?.pages?.[0]?.content?.structure) {
      setComponents(project.content.pages[0].content.structure);
    } else {
      setComponents([]);
    }
  }, [project]);

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setIsDirty(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de sauvegarde",
        description: error.message || "Impossible de sauvegarder le projet",
        variant: "destructive"
      });
    }
  });

  // Component handlers
  const handleComponentAdd = useCallback((type: string, position?: { x: number; y: number }) => {
    if (!project) return;

    const defaultPosition = position || { x: 100, y: 100 };
    const newComponent = createComponent(type);
    // Set position for drag components
    if (defaultPosition) {
      newComponent.position = {
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: 200,
        height: 100
      };
    }
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    setSelectedComponent(newComponent);
    setIsDirty(true);

    // Update project in database
    const updatedProject = { 
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content?.pages?.[0],
          id: project.content?.pages?.[0]?.id || 'main',
          name: project.content?.pages?.[0]?.name || 'Accueil',
          path: project.content?.pages?.[0]?.path || '/',
          content: {
            structure: updatedComponents
          }
        }]
      }
    };

    saveProjectMutation.mutate({ content: updatedProject.content });

    toast({
      title: "Composant ajouté",
      description: `${type} ajouté à la page`,
    });
  }, [components, project, saveProjectMutation, toast]);

  // Double-click event listener for adding components
  useEffect(() => {
    const handleDoubleClickAdd = (event: any) => {
      const { componentType, position } = event.detail;
      handleComponentAdd(componentType, position);
    };

    window.addEventListener('addComponentByDoubleClick', handleDoubleClickAdd);
    return () => {
      window.removeEventListener('addComponentByDoubleClick', handleDoubleClickAdd);
    };
  }, [handleComponentAdd]);



  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    const updatedComponents = components.map(comp =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    setComponents(updatedComponents);
    setSelectedComponent(updatedComponent);
    setIsDirty(true);

    // Broadcast change for collaboration
    if (collaboration.sendEvent) {
      collaboration.sendEvent({
        type: 'component_update',
        data: { component: updatedComponent }
      });
    }
  }, [components, collaboration]);

  const handleComponentMove = useCallback((componentId: string, position: { x: number; y: number }) => {
    const updatedComponents = components.map(comp =>
      comp.id === componentId ? { 
        ...comp, 
        position: { x: position.x, y: position.y, width: comp.position?.width || 200, height: comp.position?.height || 100 }
      } : comp
    );
    setComponents(updatedComponents);
    setIsDirty(true);
  }, [components]);

  const handleComponentDelete = useCallback((componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
    setIsDirty(true);
  }, [components, selectedComponent]);

  const handleSave = useCallback(() => {
    if (!project) return;

    const updatedProject = { 
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content?.pages?.[0],
          id: project.content?.pages?.[0]?.id || 'main',
          name: project.content?.pages?.[0]?.name || 'Accueil',
          path: project.content?.pages?.[0]?.path || '/',
          content: {
            structure: components
          }
        }]
      }
    };

    saveProjectMutation.mutate({ content: updatedProject.content });
  }, [project, components, saveProjectMutation]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">Impossible de charger le projet</p>
          <Button onClick={() => refetch()} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <Header 
          title={project.name}
          subtitle={`${project.type} • ${components.length} composant(s)`}
          actions={
            <div className="flex items-center gap-2">
              {/* Point 5 - Menu burger POUR TOUS les écrans */}
              {/* Badge toujours visible */}
              <Badge variant="secondary">
                {project.type === 'single-page' && 'Page unique'}
                {project.type === 'multi-page' && 'Multi-pages'}
                {project.type === 'ftp-sync' && 'Sync FTP'}
                {project.type === 'ftp-upload' && 'Upload FTP'}
              </Badge>

              <Separator orientation="vertical" className="h-6" />

              {/* Contrôles des volets POUR TOUS - Point 4 */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                title="Basculer palette composants"
              >
                <Menu className="w-4 h-4 mr-2" />
                Palette
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRightPanelVisible(!rightPanelVisible)}
                title="Basculer propriétés"
              >
                <Settings className="w-4 h-4 mr-2" />
                Props
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Menu burger POUR TOUS - Point 5 */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                title="Menu principal"
              >
                <Menu className="w-4 h-4 mr-2" />
                Menu
              </Button>


            </div>
          }
        />

        {/* Main editor content - Responsive layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Component palette (LARGEUR AUGMENTÉE 64px) */}
          <div className={`${isMobile && !leftPanelVisible ? 'hidden' : 'w-64'} border-r bg-white flex-shrink-0 overflow-y-auto`}>
            <div className="p-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Composants</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTouchPalette(true)}
                  className="h-6 w-6 p-0"
                  title="Ouvrir palette complète"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {componentTypes.slice(0, 6).map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                  />
                ))}
              </div>
              
              {isMobile && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-center">
                  <p className="text-xs text-blue-600">Appuyez 2× pour ajouter</p>
                </div>
              )}
            </div>
          </div>

          {/* Center - Visual editor (responsive padding) */}
          <div className="flex-1 flex flex-col relative">
            <div className={`flex-1 overflow-auto ${isMobile ? 'p-1' : 'p-4'}`}>
              <Card className="h-full min-h-[600px]">
                <DropZone
                  components={components}
                  selectedComponent={selectedComponent}
                  onComponentSelect={setSelectedComponent}
                  onComponentAdd={handleComponentAdd}
                  onComponentMove={handleComponentMove}
                  onComponentUpdate={handleComponentUpdate}
                  onComponentDelete={handleComponentDelete}
                />
              </Card>
            </div>

            {/* Point 4 CORRIGÉ - Plus de boutons flottants, tout dans le header */}
          </div>

          {/* Right sidebar - Properties panel (LARGEUR AUGMENTÉE 80px) */}
          <div className={`${isMobile && !rightPanelVisible ? 'hidden' : 'w-80'} border-l bg-white flex-shrink-0 overflow-y-auto`}>
            <div className="p-2">
              <Tabs defaultValue="component" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="component" className="text-sm">Composant</TabsTrigger>
                  <TabsTrigger value="page" className="text-sm">Page</TabsTrigger>
                </TabsList>
                
                <TabsContent value="component" className="mt-2 space-y-2">
                  <h2 className="text-sm font-semibold">Propriétés</h2>
                  {selectedComponent ? (
                <div className="space-y-4">
                  <Card className="p-3">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <span className="text-lg">{componentTypes.find(c => c.type === selectedComponent.type)?.icon}</span>
                      {componentTypes.find(c => c.type === selectedComponent.type)?.name || selectedComponent.type}
                    </h3>
                    <Badge variant="outline" className="mb-3">{selectedComponent.type}</Badge>
                    
                    {/* Content editor */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="content">Contenu</Label>
                        <Textarea
                          id="content"
                          value={selectedComponent.content || ''}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            content: e.target.value
                          })}
                          placeholder="Contenu du composant..."
                          className="mt-1"
                          rows={2}
                      />
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <Label>Position X</Label>
                        <Input
                          type="number"
                          value={selectedComponent.position?.x || 0}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            position: { 
                              x: parseInt(e.target.value) || 0,
                              y: selectedComponent.position?.y || 0,
                              width: selectedComponent.position?.width || 200,
                              height: selectedComponent.position?.height || 100
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Position Y</Label>
                        <Input
                          type="number"
                          value={selectedComponent.position?.y || 0}
                          onChange={(e) => handleComponentUpdate({
                            ...selectedComponent,
                            position: { 
                              x: selectedComponent.position?.x || 0,
                              y: parseInt(e.target.value) || 0,
                              width: selectedComponent.position?.width || 200,
                              height: selectedComponent.position?.height || 100
                            }
                          })}
                        />
                      </div>
                    </div>

                    {/* Enhanced styling with ColorPicker */}
                    <Tabs defaultValue="style" className="mt-4">
                      <TabsList className="grid w-full grid-cols-2 h-7">
                        <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                        <TabsTrigger value="layout" className="text-xs">Mise en page</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="style" className="space-y-3 mt-3">
                        {/* Enhanced Text Color */}
                        <div className="space-y-1">
                          <Label className="text-xs">Couleur du texte</Label>
                          <ColorPicker
                            value={selectedComponent.styles?.color || '#000000'}
                            onChange={(color) => handleComponentUpdate({
                              ...selectedComponent,
                              styles: { ...selectedComponent.styles, color }
                            })}
                            showBackgroundTypes={false}
                          />
                        </div>

                        {/* Enhanced Background with ColorPicker */}
                        <div className="space-y-1">
                          <Label className="text-xs">Arrière-plan</Label>
                          <ColorPicker
                            value={
                              selectedComponent.styles?.background || 
                              selectedComponent.styles?.backgroundColor || 
                              '#ffffff'
                            }
                            onChange={(background) => {
                              const isGradient = background.includes('gradient');
                              const isImage = background.includes('url(');
                              
                              if (isGradient || isImage) {
                                handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { 
                                    ...selectedComponent.styles, 
                                    background,
                                    backgroundColor: undefined
                                  }
                                });
                              } else {
                                handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { 
                                    ...selectedComponent.styles, 
                                    backgroundColor: background,
                                    background: undefined
                                  }
                                });
                              }
                            }}
                            type={
                              selectedComponent.styles?.background?.includes('gradient') ? 'gradient' :
                              selectedComponent.styles?.background?.includes('url(') ? 'image' : 'solid'
                            }
                            showBackgroundTypes={true}
                          />
                        </div>

                        {/* Keep original tabs for comparison */}
                        <div className="space-y-1">
                          <Label className="text-xs">Arrière-plan (Ancien)</Label>
                          <Tabs defaultValue="solid" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 h-6">
                              <TabsTrigger value="solid" className="text-xs">Uni</TabsTrigger>
                              <TabsTrigger value="gradient" className="text-xs">Dégradé</TabsTrigger>
                              <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="solid" className="mt-2">
                              <input
                                type="color"
                                value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  styles: { ...selectedComponent.styles, backgroundColor: e.target.value }
                                })}
                                className="w-full h-8 rounded border cursor-pointer"
                              />
                            </TabsContent>
                            
                            <TabsContent value="gradient" className="mt-2 space-y-2">
                              <div className="grid grid-cols-2 gap-1">
                                <input
                                  type="color"
                                  value={selectedComponent.styles?.gradientStart || '#3b82f6'}
                                  onChange={(e) => {
                                    const start = e.target.value;
                                    const end = selectedComponent.styles?.gradientEnd || '#8b5cf6';
                                    handleComponentUpdate({
                                      ...selectedComponent,
                                      styles: { 
                                        ...selectedComponent.styles, 
                                        background: `linear-gradient(135deg, ${start}, ${end})`,
                                        gradientStart: start,
                                        gradientEnd: end
                                      }
                                    });
                                  }}
                                  className="w-full h-6 rounded border cursor-pointer"
                                />
                                <input
                                  type="color"
                                  value={selectedComponent.styles?.gradientEnd || '#8b5cf6'}
                                  onChange={(e) => {
                                    const start = selectedComponent.styles?.gradientStart || '#3b82f6';
                                    const end = e.target.value;
                                    handleComponentUpdate({
                                      ...selectedComponent,
                                      styles: { 
                                        ...selectedComponent.styles, 
                                        background: `linear-gradient(135deg, ${start}, ${end})`,
                                        gradientStart: start,
                                        gradientEnd: end
                                      }
                                    });
                                  }}
                                  className="w-full h-6 rounded border cursor-pointer"
                                />
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="image" className="mt-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const imageSrc = event.target?.result as string;
                                      handleComponentUpdate({
                                        ...selectedComponent,
                                        styles: { 
                                          ...selectedComponent.styles, 
                                          backgroundImage: `url(${imageSrc})`,
                                          backgroundSize: 'cover',
                                          backgroundRepeat: 'no-repeat'
                                        }
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id="bg-image-upload"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-xs w-full"
                                onClick={() => document.getElementById('bg-image-upload')?.click()}
                              >
                                Choisir image
                              </Button>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-1">
                          <Label className="text-xs">Taille du texte</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[parseInt(selectedComponent.styles?.fontSize?.replace('px', '') || '16')]}
                              onValueChange={([value]) => handleComponentUpdate({
                                ...selectedComponent,
                                styles: { ...selectedComponent.styles, fontSize: `${value}px` }
                              })}
                              max={72}
                              min={8}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8 text-center">
                              {parseInt(selectedComponent.styles?.fontSize?.replace('px', '') || '16')}px
                            </span>
                          </div>
                        </div>

                        {/* Enhanced Image Selector for image components */}
                        {selectedComponent.type === 'image' && (
                          <div className="space-y-1">
                            <Label className="text-xs">Image</Label>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setShowImageSelector(true)}
                              >
                                {selectedComponent.attributes?.src ? 'Changer l\'image' : 'Sélectionner une image'}
                              </Button>
                              {selectedComponent.attributes?.src && (
                                <div className="w-full h-16 bg-gray-100 rounded overflow-hidden">
                                  <img
                                    src={selectedComponent.attributes.src}
                                    alt={selectedComponent.attributes?.alt || "Image sélectionnée"}
                                    className="w-full h-full object-cover"
                                    style={{
                                      filter: selectedComponent.attributes?.filter
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="layout" className="space-y-3 mt-3">
                        {/* Width & Height */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Largeur</Label>
                            <Input
                              type="number"
                              className="h-7 text-xs"
                              value={selectedComponent.position?.width || 200}
                              onChange={(e) => handleComponentUpdate({
                                ...selectedComponent,
                                position: { 
                                  x: selectedComponent.position?.x || 0,
                                  y: selectedComponent.position?.y || 0,
                                  width: parseInt(e.target.value) || 200,
                                  height: selectedComponent.position?.height || 100
                                }
                              })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Hauteur</Label>
                            <Input
                              type="number"
                              className="h-7 text-xs"
                              value={selectedComponent.position?.height || 100}
                              onChange={(e) => handleComponentUpdate({
                                ...selectedComponent,
                                position: { 
                                  x: selectedComponent.position?.x || 0,
                                  y: selectedComponent.position?.y || 0,
                                  width: selectedComponent.position?.width || 200,
                                  height: parseInt(e.target.value) || 100
                                }
                              })}
                            />
                          </div>
                        </div>

                        {/* Padding */}
                        <div className="space-y-1">
                          <Label className="text-xs">Espacement interne</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[parseInt(selectedComponent.styles?.padding?.replace('px', '') || '8')]}
                              onValueChange={([value]) => handleComponentUpdate({
                                ...selectedComponent,
                                styles: { ...selectedComponent.styles, padding: `${value}px` }
                              })}
                              max={50}
                              min={0}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8 text-center">
                              {parseInt(selectedComponent.styles?.padding?.replace('px', '') || '8')}px
                            </span>
                          </div>
                        </div>

                        {/* Border Radius */}
                        <div className="space-y-1">
                          <Label className="text-xs">Arrondi des coins</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[parseInt(selectedComponent.styles?.borderRadius?.replace('px', '') || '0')]}
                              onValueChange={([value]) => handleComponentUpdate({
                                ...selectedComponent,
                                styles: { ...selectedComponent.styles, borderRadius: `${value}px` }
                              })}
                              max={50}
                              min={0}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8 text-center">
                              {parseInt(selectedComponent.styles?.borderRadius?.replace('px', '') || '0')}px
                            </span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Delete button */}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => handleComponentDelete(selectedComponent.id)}
                    >
                      Supprimer le composant
                    </Button>
                  </Card>
                </div>
              ) : (
                <Card className="p-3">
                  <p className="text-xs text-gray-500">Aucun composant sélectionné</p>
                </Card>
              )}
                </TabsContent>
                
                <TabsContent value="page" className="mt-2 space-y-3">
                  <h2 className="text-xs font-semibold">Propriétés de la page</h2>
                  
                  {/* Point 3 - Page Background COMPLET avec ColorPicker amélioré */}
                  <div className="space-y-2">
                    <Label className="text-xs">Arrière-plan de la page</Label>
                    <ColorPicker
                      value={pageBackground}
                      onChange={(color) => {
                        setPageBackground(color);
                        // Appliquer immédiatement au style de la page
                        document.body.style.background = color;
                      }}
                      type={pageBackgroundType}
                      showBackgroundTypes={true}
                    />
                    
                    {/* Sélecteur de type d'arrière-plan */}
                    <div className="space-y-1">
                      <Label className="text-xs">Type d'arrière-plan</Label>
                      <Select 
                        value={pageBackgroundType} 
                        onValueChange={(value: 'solid' | 'gradient' | 'image') => setPageBackgroundType(value)}
                      >
                        <SelectTrigger className="h-6 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Couleur unie</SelectItem>
                          <SelectItem value="gradient">Dégradé</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sélecteur d'image si type = image */}
                    {pageBackgroundType === 'image' && (
                      <div className="space-y-1">
                        <Label className="text-xs">Image d'arrière-plan</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowImageSelector(true)}
                          className="w-full h-6 text-xs"
                        >
                          Choisir une image
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Page Settings */}
                  <div className="space-y-2">
                    <Label className="text-xs">Nom de la page</Label>
                    <Input
                      value={project?.content?.pages?.[0]?.name || 'Accueil'}
                      onChange={(e) => {
                        // Update page name logic here
                      }}
                      className="h-6 text-xs"
                      placeholder="Nom de la page"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={project?.description || ''}
                      onChange={(e) => {
                        // Update description logic here
                      }}
                      className="text-xs resize-none"
                      rows={2}
                      placeholder="Description de la page"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Largeur max</Label>
                    <Select defaultValue="1200">
                      <SelectTrigger className="h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="800">800px</SelectItem>
                        <SelectItem value="1000">1000px</SelectItem>
                        <SelectItem value="1200">1200px</SelectItem>
                        <SelectItem value="1440">1440px</SelectItem>
                        <SelectItem value="full">Pleine largeur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Code preview modal */}
        {showCodePreview && (
          <Dialog open={showCodePreview} onOpenChange={setShowCodePreview}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Aperçu du code</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(components, null, 2)}
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Collaboration panel */}
        {showCollaborationPanel && (
          <Card className="fixed top-20 right-4 w-80 bg-white border shadow-lg z-50">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">
                {collaboration.isConnected ? 'Connecté' : 'Déconnecté'}
              </p>
              <p className="text-sm text-gray-600">
                {collaboration.users.length} utilisateur(s) actif(s)
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setShowCollaborationPanel(false)}
              >
                Fermer
              </Button>
            </div>
          </Card>
        )}

        {/* Mobile Burger Menu */}
        {showMobileMenu && (
          <Card className="fixed top-16 right-4 w-64 bg-white border shadow-lg z-50">
            <div className="p-3 space-y-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setLocation("/projects");
                  setShowMobileMenu(false);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux projets
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setShowCollaborationPanel(!showCollaborationPanel);
                  setShowMobileMenu(false);
                }}
              >
                <Wifi className="w-4 h-4 mr-2" />
                {collaboration.isConnected ? 'Connecté' : 'Déconnecté'}
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setShowCodePreview(true);
                  setShowMobileMenu(false);
                }}
              >
                <Code className="w-4 h-4 mr-2" />
                Voir le code
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  handleSave();
                  setShowMobileMenu(false);
                }}
                disabled={saveProjectMutation.isPending || !isDirty}
              >
                <Save className="w-4 h-4 mr-2" />
                {saveProjectMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start text-gray-500"
                onClick={() => setShowMobileMenu(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Fermer
              </Button>
            </div>
          </Card>
        )}

        {/* Enhanced Touch Palette */}
        <EnhancedTouchPalette
          isOpen={showTouchPalette}
          onClose={() => setShowTouchPalette(false)}
          onComponentAdd={handleComponentAdd}
        />

        {/* Enhanced Image Selector */}
        <EnhancedImageSelector
          isOpen={showImageSelector}
          onClose={() => setShowImageSelector(false)}
          onImageSelect={(imageData) => {
            if (selectedComponent?.type === 'image') {
              handleComponentUpdate({
                ...selectedComponent,
                attributes: {
                  ...selectedComponent.attributes,
                  src: imageData.src,
                  alt: imageData.alt,
                  title: imageData.title,
                  filter: imageData.filter
                },
                position: {
                  x: selectedComponent.position?.x || 0,
                  y: selectedComponent.position?.y || 0,
                  width: imageData.size?.width || selectedComponent.position?.width || 400,
                  height: imageData.size?.height || selectedComponent.position?.height || 300
                }
              });
            }
          }}
          currentImage={selectedComponent?.attributes?.src}
        />
      </div>
    </DndProvider>
  );
}