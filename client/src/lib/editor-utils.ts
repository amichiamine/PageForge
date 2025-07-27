import { nanoid } from "nanoid";
import type { ComponentDefinition } from "@shared/schema";

export function createComponent(type: string, content?: string): ComponentDefinition {
  const id = nanoid();
  
  const componentMap: Record<string, Partial<ComponentDefinition>> = {
    container: {
      tag: "div",
      styles: {
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        minHeight: "100px"
      },
      attributes: { className: "container" }
    },
    section: {
      tag: "section",
      styles: {
        padding: "40px 0",
        minHeight: "200px"
      },
      attributes: { className: "section" }
    },
    heading: {
      tag: "h1",
      content: content || "Titre principal",
      styles: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1rem"
      }
    },
    text: {
      tag: "p",
      content: content || "Votre texte ici...",
      styles: {
        fontSize: "1rem",
        lineHeight: "1.5",
        marginBottom: "1rem"
      }
    },
    button: {
      tag: "button",
      content: content || "Cliquez ici",
      styles: {
        padding: "12px 24px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1rem"
      },
      attributes: { type: "button" }
    },
    image: {
      tag: "img",
      attributes: {
        src: "https://via.placeholder.com/400x200",
        alt: "Image de démonstration"
      },
      styles: {
        maxWidth: "100%",
        height: "auto",
        borderRadius: "8px"
      }
    },
    link: {
      tag: "a",
      content: content || "Lien",
      attributes: {
        href: "#",
        target: "_blank"
      },
      styles: {
        color: "#007bff",
        textDecoration: "underline"
      }
    },
    list: {
      tag: "ul",
      children: [
        {
          id: nanoid(),
          type: "listitem",
          tag: "li",
          content: "Élément 1"
        },
        {
          id: nanoid(),
          type: "listitem",
          tag: "li",
          content: "Élément 2"
        },
        {
          id: nanoid(),
          type: "listitem",
          tag: "li",
          content: "Élément 3"
        }
      ],
      styles: {
        paddingLeft: "20px"
      }
    },
    carousel: {
      tag: "div",
      attributes: { className: "carousel" },
      styles: {
        position: "relative",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        overflow: "hidden"
      },
      children: [
        {
          id: nanoid(),
          type: "carousel-item",
          tag: "div",
          attributes: { className: "carousel-item active" },
          styles: {
            display: "block",
            textAlign: "center",
            padding: "60px 20px"
          },
          content: "Image 1"
        },
        {
          id: nanoid(),
          type: "carousel-item",
          tag: "div",
          attributes: { className: "carousel-item" },
          styles: {
            display: "none",
            textAlign: "center",
            padding: "60px 20px"
          },
          content: "Image 2"
        },
        {
          id: nanoid(),
          type: "carousel-controls",
          tag: "div",
          attributes: { className: "carousel-controls" },
          styles: {
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px"
          },
          children: [
            {
              id: nanoid(),
              type: "carousel-dot",
              tag: "button",
              attributes: { className: "carousel-dot active" },
              styles: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#007bff",
                cursor: "pointer"
              }
            },
            {
              id: nanoid(),
              type: "carousel-dot",
              tag: "button",
              attributes: { className: "carousel-dot" },
              styles: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#dee2e6",
                cursor: "pointer"
              }
            }
          ]
        }
      ]
    },
    calendar: {
      tag: "div",
      attributes: { className: "calendar" },
      styles: {
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "300px",
        backgroundColor: "white"
      },
      children: [
        {
          id: nanoid(),
          type: "calendar-header",
          tag: "div",
          attributes: { className: "calendar-header" },
          styles: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          },
          children: [
            {
              id: nanoid(),
              type: "calendar-nav",
              tag: "button",
              content: "‹",
              styles: {
                border: "none",
                background: "none",
                fontSize: "1.5rem",
                cursor: "pointer"
              }
            },
            {
              id: nanoid(),
              type: "calendar-title",
              tag: "h3",
              content: "Janvier 2024",
              styles: { margin: 0 }
            },
            {
              id: nanoid(),
              type: "calendar-nav",
              tag: "button",
              content: "›",
              styles: {
                border: "none",
                background: "none",
                fontSize: "1.5rem",
                cursor: "pointer"
              }
            }
          ]
        },
        {
          id: nanoid(),
          type: "calendar-grid",
          tag: "div",
          attributes: { className: "calendar-grid" },
          styles: {
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            textAlign: "center"
          },
          content: "Grille du calendrier"
        }
      ]
    },
    form: {
      tag: "form",
      styles: {
        padding: "20px",
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        backgroundColor: "white"
      },
      children: []
    },
    input: {
      tag: "input",
      attributes: {
        type: "text",
        placeholder: "Saisissez votre texte"
      },
      styles: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        fontSize: "1rem"
      }
    },
    textarea: {
      tag: "textarea",
      attributes: {
        placeholder: "Saisissez votre message",
        rows: "4"
      },
      styles: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        fontSize: "1rem",
        resize: "vertical"
      }
    }
  };

  const baseComponent = componentMap[type] || {};
  
  return {
    id,
    type,
    tag: baseComponent.tag || "div",
    content: baseComponent.content || content || "",
    styles: baseComponent.styles || {},
    attributes: baseComponent.attributes || {},
    children: baseComponent.children || []
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

export function updateComponentInTree(
  components: ComponentDefinition[],
  id: string,
  updates: Partial<ComponentDefinition>
): ComponentDefinition[] {
  return components.map(component => {
    if (component.id === id) {
      return { ...component, ...updates };
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentInTree(component.children, id, updates)
      };
    }
    return component;
  });
}

export function removeComponentFromTree(components: ComponentDefinition[], id: string): ComponentDefinition[] {
  return components.filter(component => {
    if (component.id === id) {
      return false;
    }
    if (component.children) {
      component.children = removeComponentFromTree(component.children, id);
    }
    return true;
  });
}

export function addComponentToTree(
  components: ComponentDefinition[],
  parentId: string | null,
  newComponent: ComponentDefinition,
  index?: number
): ComponentDefinition[] {
  if (!parentId) {
    // Add to root level
    if (index !== undefined) {
      const newComponents = [...components];
      newComponents.splice(index, 0, newComponent);
      return newComponents;
    }
    return [...components, newComponent];
  }

  return components.map(component => {
    if (component.id === parentId) {
      const children = component.children || [];
      if (index !== undefined) {
        const newChildren = [...children];
        newChildren.splice(index, 0, newComponent);
        return { ...component, children: newChildren };
      }
      return { ...component, children: [...children, newComponent] };
    }
    if (component.children) {
      return {
        ...component,
        children: addComponentToTree(component.children, parentId, newComponent, index)
      };
    }
    return component;
  });
}