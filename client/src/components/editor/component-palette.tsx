import React from "react";
import { useDrag } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Link, 
  Layout, 
  AlignLeft,
  List,
  Grid3X3,
  Calendar,
  BarChart3,
  Play,
  Star,
  ShoppingCart,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Tag,
  FileText,
  Video,
  Music,
  Camera,
  Share2,
  Heart,
  MessageCircle,
  ThumbsUp,
  Search,
  Filter,
  Settings,
  Bell,
  Shield,
  Zap,
  TrendingUp,
  Award,
  Gift,
  CreditCard,
  Briefcase,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

interface ComponentPaletteProps {}

interface ComponentType {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  color: string;
}

const componentTypes: ComponentType[] = [
  // Texte et Contenu
  { type: "text", label: "Texte", icon: <Type className="w-4 h-4" />, category: "Texte", description: "Paragraphe de texte", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { type: "header", label: "Titre", icon: <AlignLeft className="w-4 h-4" />, category: "Texte", description: "Titre principal", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { type: "paragraph", label: "Paragraphe", icon: <FileText className="w-4 h-4" />, category: "Texte", description: "Bloc de texte", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { type: "quote", label: "Citation", icon: <MessageCircle className="w-4 h-4" />, category: "Texte", description: "Citation avec style", color: "bg-blue-50 border-blue-200 text-blue-700" },

  // Interactif
  { type: "button", label: "Bouton", icon: <MousePointer className="w-4 h-4" />, category: "Interactif", description: "Bouton cliquable", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "link", label: "Lien", icon: <Link className="w-4 h-4" />, category: "Interactif", description: "Lien hypertexte", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "form", label: "Formulaire", icon: <Square className="w-4 h-4" />, category: "Interactif", description: "Formulaire de saisie", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "input", label: "Champ de saisie", icon: <Type className="w-4 h-4" />, category: "Interactif", description: "Zone de texte", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "checkbox", label: "Case à cocher", icon: <Square className="w-4 h-4" />, category: "Interactif", description: "Sélection multiple", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "radio", label: "Bouton radio", icon: <Square className="w-4 h-4" />, category: "Interactif", description: "Sélection unique", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "select", label: "Liste déroulante", icon: <List className="w-4 h-4" />, category: "Interactif", description: "Menu de sélection", color: "bg-green-50 border-green-200 text-green-700" },
  { type: "search", label: "Recherche", icon: <Search className="w-4 h-4" />, category: "Interactif", description: "Barre de recherche", color: "bg-green-50 border-green-200 text-green-700" },

  // Média
  { type: "image", label: "Image", icon: <Image className="w-4 h-4" />, category: "Média", description: "Image ou photo", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { type: "video", label: "Vidéo", icon: <Video className="w-4 h-4" />, category: "Média", description: "Lecteur vidéo", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { type: "audio", label: "Audio", icon: <Music className="w-4 h-4" />, category: "Média", description: "Lecteur audio", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { type: "gallery", label: "Galerie", icon: <Camera className="w-4 h-4" />, category: "Média", description: "Galerie d'images", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { type: "carousel", label: "Carrousel", icon: <Play className="w-4 h-4" />, category: "Média", description: "Défilement d'images", color: "bg-purple-50 border-purple-200 text-purple-700" },

  // Mise en page
  { type: "container", label: "Conteneur", icon: <Square className="w-4 h-4" />, category: "Mise en page", description: "Zone de contenu", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "section", label: "Section", icon: <Layout className="w-4 h-4" />, category: "Mise en page", description: "Section de page", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "grid", label: "Grille", icon: <Grid3X3 className="w-4 h-4" />, category: "Mise en page", description: "Disposition en grille", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "flex", label: "Flexbox", icon: <Layout className="w-4 h-4" />, category: "Mise en page", description: "Disposition flexible", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "card", label: "Carte", icon: <Square className="w-4 h-4" />, category: "Mise en page", description: "Carte de contenu", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "modal", label: "Modal", icon: <Square className="w-4 h-4" />, category: "Mise en page", description: "Fenêtre modale", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "tabs", label: "Onglets", icon: <Square className="w-4 h-4" />, category: "Mise en page", description: "Navigation par onglets", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { type: "accordion", label: "Accordéon", icon: <List className="w-4 h-4" />, category: "Mise en page", description: "Contenu pliable", color: "bg-orange-50 border-orange-200 text-orange-700" },

  // Navigation
  { type: "navbar", label: "Barre de navigation", icon: <Layout className="w-4 h-4" />, category: "Navigation", description: "Menu principal", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { type: "menu", label: "Menu", icon: <List className="w-4 h-4" />, category: "Navigation", description: "Liste de liens", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { type: "breadcrumb", label: "Fil d'Ariane", icon: <Share2 className="w-4 h-4" />, category: "Navigation", description: "Chemin de navigation", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { type: "pagination", label: "Pagination", icon: <List className="w-4 h-4" />, category: "Navigation", description: "Navigation par pages", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { type: "sidebar", label: "Barre latérale", icon: <Layout className="w-4 h-4" />, category: "Navigation", description: "Menu latéral", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },

  // Commerce
  { type: "product", label: "Produit", icon: <ShoppingCart className="w-4 h-4" />, category: "Commerce", description: "Fiche produit", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { type: "price", label: "Prix", icon: <Tag className="w-4 h-4" />, category: "Commerce", description: "Affichage de prix", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { type: "cart", label: "Panier", icon: <ShoppingCart className="w-4 h-4" />, category: "Commerce", description: "Panier d'achat", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { type: "checkout", label: "Commande", icon: <CreditCard className="w-4 h-4" />, category: "Commerce", description: "Processus de commande", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { type: "review", label: "Avis", icon: <Star className="w-4 h-4" />, category: "Commerce", description: "Note et commentaire", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },

  // Social
  { type: "profile", label: "Profil", icon: <User className="w-4 h-4" />, category: "Social", description: "Profil utilisateur", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { type: "comment", label: "Commentaire", icon: <MessageCircle className="w-4 h-4" />, category: "Social", description: "Section commentaires", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { type: "like", label: "J'aime", icon: <Heart className="w-4 h-4" />, category: "Social", description: "Bouton j'aime", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { type: "share", label: "Partage", icon: <Share2 className="w-4 h-4" />, category: "Social", description: "Boutons de partage", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { type: "follow", label: "Suivre", icon: <User className="w-4 h-4" />, category: "Social", description: "Bouton suivre", color: "bg-pink-50 border-pink-200 text-pink-700" },

  // Contact
  { type: "contact", label: "Contact", icon: <Phone className="w-4 h-4" />, category: "Contact", description: "Informations de contact", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { type: "email", label: "Email", icon: <Mail className="w-4 h-4" />, category: "Contact", description: "Adresse email", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { type: "phone", label: "Téléphone", icon: <Phone className="w-4 h-4" />, category: "Contact", description: "Numéro de téléphone", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { type: "address", label: "Adresse", icon: <MapPin className="w-4 h-4" />, category: "Contact", description: "Adresse postale", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { type: "map", label: "Carte", icon: <MapPin className="w-4 h-4" />, category: "Contact", description: "Carte interactive", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },

  // Données
  { type: "table", label: "Tableau", icon: <Grid3X3 className="w-4 h-4" />, category: "Données", description: "Tableau de données", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { type: "chart", label: "Graphique", icon: <BarChart3 className="w-4 h-4" />, category: "Données", description: "Graphique de données", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { type: "list", label: "Liste", icon: <List className="w-4 h-4" />, category: "Données", description: "Liste d'éléments", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { type: "counter", label: "Compteur", icon: <TrendingUp className="w-4 h-4" />, category: "Données", description: "Compteur animé", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { type: "progress", label: "Progression", icon: <BarChart3 className="w-4 h-4" />, category: "Données", description: "Barre de progression", color: "bg-yellow-50 border-yellow-200 text-yellow-700" }
];

interface DraggableComponentProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

function DraggableComponent({ type, label, icon, description, color }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "palette-item",
    item: { type, fromPalette: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`
        group relative p-3 rounded-xl border-2 cursor-grab transition-all duration-200 hover:shadow-md hover:scale-105
        ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
        ${color}
      `}
      title={description}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs opacity-75 truncate">{description}</p>
        </div>
      </div>

      {/* Drag indicator */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-current rounded-full"></div>
      </div>
    </div>
  );
}

export default function ComponentPalette({}: ComponentPaletteProps) {
  const categories = [...new Set(componentTypes.map(comp => comp.category))];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Palette de composants</h3>
        <p className="text-sm text-gray-600">Glissez les composants vers l'éditeur</p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-700">{category}</h4>
            <Badge variant="outline" className="text-xs">
              {componentTypes.filter(comp => comp.category === category).length}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {componentTypes
              .filter(comp => comp.category === category)
              .map((component) => (
                <DraggableComponent
                  key={component.type}
                  type={component.type}
                  label={component.label}
                  icon={component.icon}
                  description={component.description}
                  color={component.color}
                />
              ))}
          </div>

          {category !== categories[categories.length - 1] && (
            <Separator className="my-4" />
          )}
        </div>
      ))}

      {/* Quick Stats */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">{componentTypes.length}</span> composants disponibles
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-semibold">{categories.length}</span> catégories
          </p>
        </div>
      </div>
    </div>
  );
}