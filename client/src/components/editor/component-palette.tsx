import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Layers, 
  Layout,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  Video,
  Music,
  Download,
  Upload,
  Search,
  Menu,
  User,
  Lock
} from 'lucide-react';

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: React.ReactElement;
  color: string;
  description?: string;
}

function DraggableComponent({ type, label, icon, color, description }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`group relative p-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-grab hover:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 hover:scale-105'
      } hover:border-solid hover:shadow-lg bg-white`}
      style={{ 
        borderColor: color,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
      }}
      title={description}
    >
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="p-3 rounded-lg transition-colors"
          style={{ 
            backgroundColor: `${color}15`,
            color: color
          }}
        >
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className="text-sm font-medium text-gray-700 text-center leading-tight">
          {label}
        </span>
      </div>

      {/* Effet de survol */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

const componentCategories = [
  {
    name: "Texte & Contenu",
    components: [
      { type: 'heading', label: 'Titre', icon: <Type />, color: '#3b82f6', description: 'Titre principal ou secondaire' },
      { type: 'text', label: 'Texte', icon: <FileText />, color: '#64748b', description: 'Paragraphe de texte' },
      { type: 'list', label: 'Liste', icon: <Menu />, color: '#8b5cf6', description: 'Liste à puces ou numérotée' },
      { type: 'quote', label: 'Citation', icon: <Type />, color: '#10b981', description: 'Citation ou témoignage' },
    ]
  },
  {
    name: "Interactions",
    components: [
      { type: 'button', label: 'Bouton', icon: <MousePointer />, color: '#ef4444', description: 'Bouton d\'action' },
      { type: 'input', label: 'Champ de saisie', icon: <Square />, color: '#f59e0b', description: 'Zone de saisie de texte' },
      { type: 'textarea', label: 'Zone de texte', icon: <FileText />, color: '#84cc16', description: 'Zone de texte multi-lignes' },
      { type: 'select', label: 'Sélection', icon: <Menu />, color: '#06b6d4', description: 'Menu déroulant' },
      { type: 'checkbox', label: 'Case à cocher', icon: <Square />, color: '#8b5cf6', description: 'Case à cocher' },
      { type: 'radio', label: 'Bouton radio', icon: <MousePointer />, color: '#ec4899', description: 'Sélection unique' },
    ]
  },
  {
    name: "Médias",
    components: [
      { type: 'image', label: 'Image', icon: <Image />, color: '#10b981', description: 'Image ou photo' },
      { type: 'video', label: 'Vidéo', icon: <Video />, color: '#f59e0b', description: 'Lecteur vidéo' },
      { type: 'audio', label: 'Audio', icon: <Music />, color: '#8b5cf6', description: 'Lecteur audio' },
      { type: 'gallery', label: 'Galerie', icon: <Layers />, color: '#06b6d4', description: 'Galerie d\'images' },
    ]
  },
  {
    name: "Structure",
    components: [
      { type: 'container', label: 'Conteneur', icon: <Square />, color: '#6b7280', description: 'Conteneur générique' },
      { type: 'section', label: 'Section', icon: <Layout />, color: '#3b82f6', description: 'Section de page' },
      { type: 'header', label: 'En-tête', icon: <Layout />, color: '#10b981', description: 'En-tête de page' },
      { type: 'footer', label: 'Pied de page', icon: <Layout />, color: '#64748b', description: 'Pied de page' },
      { type: 'sidebar', label: 'Barre latérale', icon: <Layers />, color: '#8b5cf6', description: 'Barre latérale' },
      { type: 'card', label: 'Carte', icon: <Square />, color: '#f59e0b', description: 'Carte d\'information' },
    ]
  },
  {
    name: "Navigation",
    components: [
      { type: 'navbar', label: 'Barre de navigation', icon: <Menu />, color: '#3b82f6', description: 'Menu de navigation' },
      { type: 'breadcrumb', label: 'Fil d\'Ariane', icon: <FileText />, color: '#64748b', description: 'Navigation hiérarchique' },
      { type: 'tabs', label: 'Onglets', icon: <Layers />, color: '#8b5cf6', description: 'Navigation par onglets' },
      { type: 'pagination', label: 'Pagination', icon: <Menu />, color: '#10b981', description: 'Navigation de pages' },
    ]
  },
  {
    name: "E-commerce",
    components: [
      { type: 'product-card', label: 'Fiche produit', icon: <ShoppingCart />, color: '#ef4444', description: 'Carte produit' },
      { type: 'price', label: 'Prix', icon: <Star />, color: '#f59e0b', description: 'Affichage de prix' },
      { type: 'cart', label: 'Panier', icon: <ShoppingCart />, color: '#10b981', description: 'Icône panier' },
      { type: 'rating', label: 'Note', icon: <Star />, color: '#fbbf24', description: 'Système de notation' },
    ]
  },
  {
    name: "Contact & Social",
    components: [
      { type: 'contact-form', label: 'Formulaire contact', icon: <Mail />, color: '#3b82f6', description: 'Formulaire de contact' },
      { type: 'phone', label: 'Téléphone', icon: <Phone />, color: '#10b981', description: 'Numéro de téléphone' },
      { type: 'email', label: 'Email', icon: <Mail />, color: '#ef4444', description: 'Adresse email' },
      { type: 'address', label: 'Adresse', icon: <MapPin />, color: '#8b5cf6', description: 'Adresse postale' },
      { type: 'social-icons', label: 'Réseaux sociaux', icon: <Heart />, color: '#ec4899', description: 'Icônes sociales' },
    ]
  },
  {
    name: "Avancé",
    components: [
      { type: 'calendar', label: 'Calendrier', icon: <Calendar />, color: '#06b6d4', description: 'Widget calendrier' },
      { type: 'search', label: 'Recherche', icon: <Search />, color: '#64748b', description: 'Barre de recherche' },
      { type: 'upload', label: 'Upload', icon: <Upload />, color: '#10b981', description: 'Zone d\'upload' },
      { type: 'download', label: 'Téléchargement', icon: <Download />, color: '#f59e0b', description: 'Bouton de téléchargement' },
      { type: 'login', label: 'Connexion', icon: <User />, color: '#8b5cf6', description: 'Formulaire de connexion' },
      { type: 'security', label: 'Sécurité', icon: <Lock />, color: '#ef4444', description: 'Élément sécurisé' },
    ]
  }
];

export default function ComponentPalette() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-4">
        {componentCategories.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.components.map((component) => (
                <DraggableComponent
                  key={component.type}
                  type={component.type}
                  label={component.label}
                  icon={component.icon}
                  color={component.color}
                  description={component.description}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Aide en bas */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600 leading-relaxed">
          💡 <strong>Astuce :</strong> Glissez-déposez les composants sur la zone d'édition pour les ajouter à votre page
        </p>
      </div>
    </div>
  );
}