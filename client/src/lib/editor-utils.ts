import { nanoid } from "nanoid";
import type { ComponentDefinition } from "@shared/schema";

export function createComponent(type: string): ComponentDefinition {
  const baseId = nanoid();

  const baseComponent: ComponentDefinition = {
    id: baseId,
    type,
    content: '',
    styles: {
      position: 'absolute',
      left: '50px',
      top: '50px',
      zIndex: '1000'
    },
    attributes: {},
    children: []
  };

  switch (type) {
    case 'text':
      return {
        ...baseComponent,
        content: 'Votre texte ici...',
        tag: 'p',
        styles: {
          ...baseComponent.styles,
          width: '200px',
          height: 'auto',
          minHeight: '24px',
          padding: '8px',
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#333',
          backgroundColor: 'transparent'
        },
        attributes: {
          className: 'text-paragraph'
        }
      };

    case 'heading':
      return {
        ...baseComponent,
        content: 'Titre principal',
        tag: 'h1',
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: 'auto',
          minHeight: '32px',
          padding: '8px',
          fontSize: '24px',
          fontWeight: 'bold',
          lineHeight: '1.2',
          color: '#222',
          backgroundColor: 'transparent'
        },
        attributes: {
          className: 'heading'
        }
      };

    case 'button':
      return {
        ...baseComponent,
        content: 'Cliquez ici',
        tag: 'button',
        styles: {
          ...baseComponent.styles,
          width: '120px',
          height: '40px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#fff',
          backgroundColor: '#3b82f6',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        },
        attributes: {
          className: 'btn-primary',
          type: 'button'
        }
      };

    case 'image':
      return {
        ...baseComponent,
        content: '',
        tag: 'img',
        styles: {
          ...baseComponent.styles,
          width: '200px',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '4px'
        },
        attributes: {
          src: 'https://via.placeholder.com/400x200',
          alt: 'Image de démonstration',
          className: 'responsive-image'
        }
      };

    case 'container':
      return {
        ...baseComponent,
        content: '',
        tag: 'div',
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '200px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        },
        attributes: {
          className: 'container'
        }
      };

    case 'input':
      return {
        ...baseComponent,
        content: '',
        tag: 'input',
        styles: {
          ...baseComponent.styles,
          width: '200px',
          height: '40px',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#fff'
        },
        attributes: {
          type: 'text',
          placeholder: 'Saisir du texte...',
          className: 'form-input'
        }
      };

    case 'textarea':
      return {
        ...baseComponent,
        content: '',
        tag: 'textarea',
        styles: {
          ...baseComponent.styles,
          width: '300px',
          height: '100px',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#fff',
          resize: 'both'
        },
        attributes: {
          placeholder: 'Saisir du texte...',
          className: 'form-textarea'
        }
      };

    default:
      return {
        ...baseComponent,
        content: type,
        tag: 'div',
        styles: {
          ...baseComponent.styles,
          width: '150px',
          height: '50px',
          padding: '8px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '4px'
        },
        attributes: {
          className: `component-${type}`
        }
      };
  }
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