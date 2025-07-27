import type { ComponentDefinition } from "@shared/schema";

export interface ComponentPaletteItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  category: string;
  description: string;
  defaultTag: string;
  defaultContent?: string;
  defaultAttributes?: Record<string, any>;
  defaultStyles?: Record<string, any>;
}

export const componentCategories = [
  { id: "layout", name: "Layout", icon: "layout" },
  { id: "text", name: "Texte", icon: "type" },
  { id: "interactive", name: "Interactif", icon: "mouse-pointer" },
  { id: "media", name: "Média", icon: "image" },
  { id: "navigation", name: "Navigation", icon: "navigation" },
  { id: "forms", name: "Formulaires", icon: "form-input" },
  { id: "advanced", name: "Avancé", icon: "settings" },
];

export const paletteComponents: ComponentPaletteItem[] = [
  // Layout
  {
    id: "container",
    name: "Conteneur",
    type: "container",
    icon: "square",
    category: "layout",
    description: "Conteneur flexible pour organiser le contenu",
    defaultTag: "div",
    defaultAttributes: { class: "container" },
    defaultStyles: {
      padding: "1rem",
      margin: "0 auto",
      maxWidth: "1200px",
      minHeight: "50px",
    },
  },
  {
    id: "section",
    name: "Section",
    type: "section",
    icon: "layers",
    category: "layout",
    description: "Section thématique de contenu",
    defaultTag: "section",
    defaultAttributes: { class: "section" },
    defaultStyles: {
      padding: "2rem 1rem",
      minHeight: "100px",
    },
  },
  {
    id: "grid",
    name: "Grille",
    type: "grid",
    icon: "grid",
    category: "layout",
    description: "Système de grille CSS",
    defaultTag: "div",
    defaultAttributes: { class: "grid" },
    defaultStyles: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1rem",
      padding: "1rem",
    },
  },

  // Text
  {
    id: "heading",
    name: "Titre",
    type: "heading",
    icon: "type",
    category: "text",
    description: "Titre de section (H1-H6)",
    defaultTag: "h1",
    defaultContent: "Nouveau titre",
    defaultAttributes: { class: "heading" },
    defaultStyles: {
      fontSize: "2rem",
      fontWeight: "bold",
      margin: "0 0 1rem 0",
      color: "#333",
    },
  },
  {
    id: "paragraph",
    name: "Paragraphe",
    type: "text",
    icon: "align-left",
    category: "text",
    description: "Bloc de texte",
    defaultTag: "p",
    defaultContent: "Votre texte ici...",
    defaultAttributes: { class: "paragraph" },
    defaultStyles: {
      fontSize: "1rem",
      lineHeight: "1.6",
      margin: "0 0 1rem 0",
      color: "#666",
    },
  },

  // Interactive
  {
    id: "button",
    name: "Bouton",
    type: "button",
    icon: "mouse-pointer",
    category: "interactive",
    description: "Bouton cliquable",
    defaultTag: "button",
    defaultContent: "Cliquez ici",
    defaultAttributes: { 
      class: "btn btn-primary",
      type: "button"
    },
    defaultStyles: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "500",
    },
  },
  {
    id: "link",
    name: "Lien",
    type: "link",
    icon: "external-link",
    category: "interactive",
    description: "Lien hypertexte",
    defaultTag: "a",
    defaultContent: "Lien vers...",
    defaultAttributes: { 
      class: "link",
      href: "#"
    },
    defaultStyles: {
      color: "#007bff",
      textDecoration: "underline",
    },
  },

  // Media
  {
    id: "image",
    name: "Image",
    type: "image",
    icon: "image",
    category: "media",
    description: "Image responsive",
    defaultTag: "img",
    defaultAttributes: {
      class: "image",
      src: "https://via.placeholder.com/400x300",
      alt: "Image description",
    },
    defaultStyles: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "0.375rem",
    },
  },

  // Forms
  {
    id: "input",
    name: "Champ texte",
    type: "input",
    icon: "edit",
    category: "forms",
    description: "Champ de saisie de texte",
    defaultTag: "input",
    defaultAttributes: {
      class: "form-input",
      type: "text",
      placeholder: "Entrez votre texte...",
    },
    defaultStyles: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      fontSize: "1rem",
    },
  },
];

export function createComponentFromType(type: string): ComponentDefinition {
  const paletteItem = paletteComponents.find(item => item.type === type);
  
  if (!paletteItem) {
    throw new Error(`Unknown component type: ${type}`);
  }

  return {
    id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: paletteItem.type,
    tag: paletteItem.defaultTag,
    content: paletteItem.defaultContent || "",
    attributes: paletteItem.defaultAttributes ? { ...paletteItem.defaultAttributes } : {},
    styles: paletteItem.defaultStyles ? { ...paletteItem.defaultStyles } : {},
    children: [],
  };
}

export function findComponentById(components: ComponentDefinition[], id: string): ComponentDefinition | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateComponentInStructure(
  components: ComponentDefinition[], 
  updatedComponent: ComponentDefinition
): ComponentDefinition[] {
  return components.map(component => {
    if (component.id === updatedComponent.id) {
      return updatedComponent;
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentInStructure(component.children, updatedComponent)
      };
    }
    return component;
  });
}

export function removeComponentFromStructure(
  components: ComponentDefinition[], 
  componentId: string
): ComponentDefinition[] {
  return components.filter(component => component.id !== componentId)
    .map(component => ({
      ...component,
      children: component.children ? removeComponentFromStructure(component.children, componentId) : undefined
    }));
}

export function addComponentToStructure(
  components: ComponentDefinition[],
  newComponent: ComponentDefinition,
  parentId?: string,
  index?: number
): ComponentDefinition[] {
  if (!parentId) {
    // Add to root level
    if (typeof index === 'number') {
      const newComponents = [...components];
      newComponents.splice(index, 0, newComponent);
      return newComponents;
    }
    return [...components, newComponent];
  }

  return components.map(component => {
    if (component.id === parentId) {
      const children = component.children || [];
      if (typeof index === 'number') {
        const newChildren = [...children];
        newChildren.splice(index, 0, newComponent);
        return { ...component, children: newChildren };
      }
      return { ...component, children: [...children, newComponent] };
    }
    if (component.children) {
      return {
        ...component,
        children: addComponentToStructure(component.children, newComponent, parentId, index)
      };
    }
    return component;
  });
}

export function duplicateComponent(component: ComponentDefinition): ComponentDefinition {
  const duplicateChildren = (children?: ComponentDefinition[]): ComponentDefinition[] | undefined => {
    if (!children) return undefined;
    return children.map(child => duplicateComponent(child));
  };

  return {
    ...component,
    id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    children: duplicateChildren(component.children),
  };
}

export function validateComponentStructure(component: ComponentDefinition): string[] {
  const errors: string[] = [];

  if (!component.id) {
    errors.push("Component must have an ID");
  }

  if (!component.type) {
    errors.push("Component must have a type");
  }

  if (!component.tag) {
    errors.push("Component must have a tag");
  }

  // Validate HTML tag
  const validTags = [
    'div', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button',
    'img', 'video', 'audio', 'canvas', 'svg',
    'form', 'input', 'textarea', 'select', 'option', 'label',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd'
  ];

  if (component.tag && !validTags.includes(component.tag)) {
    errors.push(`Invalid HTML tag: ${component.tag}`);
  }

  // Validate children recursively
  if (component.children) {
    component.children.forEach((child, index) => {
      const childErrors = validateComponentStructure(child);
      childErrors.forEach(error => {
        errors.push(`Child ${index}: ${error}`);
      });
    });
  }

  return errors;
}

export function generateComponentCSS(component: ComponentDefinition, selector?: string): string {
  if (!component.styles) return "";

  const cssSelector = selector || `#${component.id}`;
  const styleEntries = Object.entries(component.styles);

  if (styleEntries.length === 0) return "";

  const cssProperties = styleEntries
    .map(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssProperty}: ${value};`;
    })
    .join('\n');

  return `${cssSelector} {\n${cssProperties}\n}`;
}

export function generateStructureCSS(components: ComponentDefinition[]): string {
  let css = "";

  const processComponent = (component: ComponentDefinition) => {
    css += generateComponentCSS(component) + "\n";
    
    if (component.children) {
      component.children.forEach(processComponent);
    }
  };

  components.forEach(processComponent);
  
  return css;
}
