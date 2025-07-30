import { nanoid } from "nanoid";
import type { ComponentDefinition } from "@shared/schema";

export function createComponent(type: string): ComponentDefinition {
  const baseComponent: ComponentDefinition = {
    id: `component-${nanoid()}`,
    type,
    content: '',
    attributes: {},
    styles: {
      position: 'absolute',
      left: '50px',
      top: '50px',
      width: '200px',
      height: '100px',
      backgroundColor: 'transparent',
      color: '#000000',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      margin: '0px',
      border: 'none',
      borderRadius: '0px',
      zIndex: '1000'
    },
  };

  switch (type) {
    case 'heading':
      return {
        ...baseComponent,
        tag: 'h1',
        content: 'Titre principal',
        attributes: { className: 'heading' },
        styles: {
          ...baseComponent.styles,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          height: '60px',
          width: '300px',
        },
      };

    case 'paragraph':
      return {
        ...baseComponent,
        tag: 'p',
        content: 'Votre texte ici...',
        attributes: { className: 'text-paragraph' },
        styles: {
          ...baseComponent.styles,
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#666666',
          height: '80px',
          width: '400px',
        },
      };

    case 'button':
      return {
        ...baseComponent,
        tag: 'button',
        content: 'Cliquez ici',
        attributes: { className: 'btn-primary', type: 'button' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#007bff',
          color: '#ffffff',
          border: '1px solid #007bff',
          borderRadius: '4px',
          padding: '10px 20px',
          cursor: 'pointer',
          width: '150px',
          height: '50px',
        },
      };

    case 'image':
      return {
        ...baseComponent,
        tag: 'img',
        attributes: {
          src: 'https://via.placeholder.com/400x200',
          alt: 'Image de démonstration',
          className: 'responsive-image',
        },
        styles: {
          ...baseComponent.styles,
          width: '400px',
          height: '200px',
          objectFit: 'cover',
          border: '1px solid #ddd',
        },
      };

    case 'container':
      return {
        ...baseComponent,
        tag: 'div',
        attributes: { className: 'container' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '20px',
          width: '300px',
          height: '200px',
        },
      };

    case 'list':
      return {
        ...baseComponent,
        tag: 'ul',
        content: '',
        attributes: { className: 'list-unstyled' },
        styles: {
          ...baseComponent.styles,
          listStyle: 'none',
          padding: '10px',
          height: '120px',
          width: '250px',
        },
        children: [
          {
            id: `component-${nanoid()}`,
            type: 'list-item',
            tag: 'li',
            content: 'Élément de liste 1',
            attributes: {},
            styles: { padding: '5px 0' },
          },
          {
            id: `component-${nanoid()}`,
            type: 'list-item',
            tag: 'li',
            content: 'Élément de liste 2',
            attributes: {},
            styles: { padding: '5px 0' },
          },
        ],
      };

    case 'form':
      return {
        ...baseComponent,
        tag: 'form',
        attributes: { className: 'form' },
        styles: {
          ...baseComponent.styles,
          backgroundColor: '#ffffff',
          border: '1px solid #cccccc',
          borderRadius: '4px',
          padding: '20px',
          width: '350px',
          height: '250px',
        },
        children: [
          {
            id: `component-${nanoid()}`,
            type: 'input',
            tag: 'input',
            attributes: { type: 'text', placeholder: 'Votre nom', className: 'form-input' },
            styles: {
              width: '280px',
              height: '40px',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #dddddd',
              borderRadius: '4px',
            },
          },
          {
            id: `component-${nanoid()}`,
            type: 'textarea',
            tag: 'textarea',
            attributes: { placeholder: 'Votre message', className: 'form-textarea' },
            styles: {
              width: '280px',
              height: '100px',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #dddddd',
              borderRadius: '4px',
            },
          },
        ],
      };

    case 'input':
      return {
        ...baseComponent,
        tag: 'input',
        attributes: { type: 'text', placeholder: 'Tapez ici...', className: 'form-input' },
        styles: {
          ...baseComponent.styles,
          padding: '10px',
          border: '1px solid #dddddd',
          borderRadius: '4px',
          fontSize: '16px',
          width: '250px',
          height: '40px',
        },
      };

    case 'textarea':
      return {
        ...baseComponent,
        tag: 'textarea',
        content: 'Contenu du composant',
        attributes: { placeholder: 'Tapez votre texte ici...', className: 'form-textarea' },
        styles: {
          ...baseComponent.styles,
          padding: '10px',
          border: '1px solid #dddddd',
          borderRadius: '4px',
          fontSize: '16px',
          resize: 'vertical',
          width: '300px',
          height: '120px',
        },
      };

    default:
      return {
        ...baseComponent,
        tag: 'div',
        content: 'Nouveau composant',
        attributes: { className: '' },
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