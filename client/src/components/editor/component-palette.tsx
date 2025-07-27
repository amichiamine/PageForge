import { useDrag } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Type, 
  Square, 
  Image, 
  MousePointer, 
  Container, 
  Layout, 
  Navigation,
  Heading5,
  FileText,
  FormInput,
  List,
  Table,
  Video,
  Map,
  ChevronLeft,
  ChevronRight,
  Calendar
} from "lucide-react";

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  category: string;
  description: string;
}

interface DraggableComponentProps {
  component: ComponentItem;
}

function DraggableComponent({ component }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "palette-item",
    item: { type: component.type, fromPalette: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const Icon = component.icon;

  return (
    <div
      ref={drag}
      className={cn(
        "p-3 border border-gray-200 rounded-lg cursor-grab hover:border-primary hover:shadow-sm transition-all duration-200",
        isDragging && "opacity-50 cursor-grabbing"
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {component.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {component.description}
          </p>
        </div>
      </div>
    </div>
  );
}

const components: ComponentItem[] = [
  // Layout Components
  {
    id: "container",
    name: "Conteneur",
    type: "container",
    icon: Container,
    category: "Layout",
    description: "Conteneur flexible"
  },
  {
    id: "section",
    name: "Section",
    type: "section",
    icon: Layout,
    category: "Layout",
    description: "Section de page"
  },
  {
    id: "grid",
    name: "Grille",
    type: "grid",
    icon: Square,
    category: "Layout",
    description: "Système de grille"
  },

  // Text Components
  {
    id: "heading",
    name: "Titre",
    type: "heading",
    icon: Type,
    category: "Text",
    description: "Titre H1-H6"
  },
  {
    id: "text",
    name: "Paragraphe",
    type: "text",
    icon: FileText,
    category: "Text",
    description: "Texte de contenu"
  },
  {
    id: "list",
    name: "Liste",
    type: "list",
    icon: List,
    category: "Text",
    description: "Liste à puces"
  },

  // Interactive Components
  {
    id: "button",
    name: "Bouton",
    type: "button",
    icon: MousePointer,
    category: "Interactive",
    description: "Bouton cliquable"
  },
  {
    id: "link",
    name: "Lien",
    type: "link",
    icon: MousePointer,
    category: "Interactive",
    description: "Lien hypertexte"
  },

  // Media Components
  {
    id: "image",
    name: "Image",
    type: "image",
    icon: Image,
    category: "Media",
    description: "Image responsive"
  },
  {
    id: "video",
    name: "Vidéo",
    type: "video",
    icon: Video,
    category: "Media",
    description: "Lecteur vidéo"
  },

  // Navigation Components
  {
    id: "navigation",
    name: "Navigation",
    type: "navigation",
    icon: Navigation,
    category: "Navigation",
    description: "Menu de navigation"
  },
  {
    id: "header",
    name: "En-tête",
    type: "header",
    icon: Heading5,
    category: "Navigation",
    description: "En-tête de page"
  },
  {
    id: "footer",
    name: "Pied de page",
    type: "footer",
    icon: Heading5,
    category: "Navigation",
    description: "Pied de page"
  },

  // Form Components
  {
    id: "form",
    name: "Formulaire",
    type: "form",
    icon: FormInput,
    category: "Forms",
    description: "Conteneur de formulaire"
  },
  {
    id: "input",
    name: "Champ texte",
    type: "input",
    icon: FormInput,
    category: "Forms",
    description: "Champ de saisie"
  },
  {
    id: "textarea",
    name: "Zone de texte",
    type: "textarea",
    icon: FormInput,
    category: "Forms",
    description: "Zone de texte multiligne"
  },
  {
    id: "select",
    name: "Liste déroulante",
    type: "select",
    icon: FormInput,
    category: "Forms",
    description: "Menu déroulant"
  },

  // Advanced Components
  {
    id: "table",
    name: "Tableau",
    type: "table",
    icon: Table,
    category: "Advanced",
    description: "Tableau de données"
  },
  {
    id: "card",
    name: "Carte",
    type: "card",
    icon: Square,
    category: "Advanced",
    description: "Carte de contenu"
  },
  {
    id: "map",
    name: "Carte géographique",
    type: "map",
    icon: Map,
    category: "Advanced",
    description: "Carte interactive"
  },
  
  // Carousel Component
  {
    id: "carousel",
    name: "Carrousel",
    type: "carousel",
    icon: ChevronRight,
    category: "Media",
    description: "Carrousel d'images ou contenu"
  },
  
  // Calendar Component  
  {
    id: "calendar",
    name: "Calendrier",
    type: "calendar",
    icon: Calendar,
    category: "Interactive",
    description: "Sélecteur de date"
  }
];

const categories = [
  "Layout",
  "Text", 
  "Interactive",
  "Media",
  "Navigation",
  "Forms",
  "Advanced"
];

export default function ComponentPalette() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Composants</h2>
        <p className="text-sm text-gray-600 mt-1">
          Glissez et déposez pour ajouter
        </p>
      </div>

      <div className="p-4 space-y-6">
        {categories.map((category) => {
          const categoryComponents = components.filter(c => c.category === category);
          
          if (categoryComponents.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryComponents.map((component) => (
                  <DraggableComponent 
                    key={component.id} 
                    component={component} 
                  />
                ))}
              </div>
              {category !== categories[categories.length - 1] && (
                <Separator className="mt-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          💡 Conseils rapides
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Glissez les composants dans l'éditeur</li>
          <li>• Cliquez pour sélectionner et modifier</li>
          <li>• Utilisez les conteneurs pour structurer</li>
          <li>• Testez sur différentes tailles d'écran</li>
        </ul>
      </div>
    </div>
  );
}
