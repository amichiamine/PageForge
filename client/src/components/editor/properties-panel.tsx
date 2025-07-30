import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import type { ComponentDefinition, Project } from '@shared/schema';

interface PropertiesPanelProps {
  component: ComponentDefinition | null;
  onComponentUpdate: (component: ComponentDefinition) => void;
  project: Project;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentDelete: (componentId: string) => void;
}

export default function PropertiesPanel({
  component,
  onComponentUpdate,
  project,
  onComponentSelect,
  onComponentDelete
}: PropertiesPanelProps) {
  const [localComponent, setLocalComponent] = useState<ComponentDefinition | null>(null);

  // Synchroniser le composant local avec le prop
  useEffect(() => {
    console.log('PropertiesPanel - component prop changed:', component?.id, component?.type);
    setLocalComponent(component);
  }, [component]);

  const updateProperty = (path: string, value: any) => {
    if (!localComponent) return;

    console.log(`PropertiesPanel - Updating property ${path} to:`, value);

    const updatedComponent = { ...localComponent };

    if (path.startsWith('styles.')) {
      const styleProp = path.replace('styles.', '');
      updatedComponent.styles = {
        ...updatedComponent.styles,
        [styleProp]: value
      };
    } else if (path.startsWith('attributes.')) {
      const attrProp = path.replace('attributes.', '');
      updatedComponent.attributes = {
        ...updatedComponent.attributes,
        [attrProp]: value
      };
    } else {
      (updatedComponent as any)[path] = value;
    }

    console.log('PropertiesPanel - Updated component:', updatedComponent);
    setLocalComponent(updatedComponent);
    onComponentUpdate(updatedComponent);
  };

  const duplicateComponent = () => {
    if (!localComponent) return;

    const duplicated = {
      ...localComponent,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      styles: {
        ...localComponent.styles,
        left: `${parseInt(localComponent.styles?.left?.replace('px', '') || '0') + 20}px`,
        top: `${parseInt(localComponent.styles?.top?.replace('px', '') || '0') + 20}px`
      }
    };

    onComponentUpdate(duplicated);
  };

  const toggleVisibility = () => {
    if (!localComponent) return;

    const currentDisplay = localComponent.styles?.display || 'block';
    const newDisplay = currentDisplay === 'none' ? 'block' : 'none';
    updateProperty('styles.display', newDisplay);
  };

  // Obtenir tous les composants de la page
  const getAllComponents = (components: ComponentDefinition[]): ComponentDefinition[] => {
    const allComponents: ComponentDefinition[] = [];
    
    const traverse = (comps: ComponentDefinition[]) => {
      comps.forEach(comp => {
        allComponents.push(comp);
        if (comp.children && comp.children.length > 0) {
          traverse(comp.children);
        }
      });
    };
    
    traverse(components);
    return allComponents;
  };

  const allComponents = project?.content?.pages?.[0]?.content?.structure ? 
    getAllComponents(project.content.pages[0].content.structure) : [];

  if (!localComponent) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Liste des composants */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
              Composants sur la page ({allComponents.length})
            </h3>
            
            {allComponents.length > 0 ? (
              <div className="space-y-2">
                {allComponents.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => onComponentSelect(comp)}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {comp.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {comp.content || comp.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{comp.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onComponentDelete(comp.id);
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun composant</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Glissez des composants depuis la palette pour commencer
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Message de sélection */}
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl text-blue-600">✨</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Propriétés</h3>
            <p className="text-xs text-gray-600">
              Sélectionnez un composant pour modifier ses propriétés
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isVisible = localComponent.styles?.display !== 'none';

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* En-tête du composant */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {localComponent.type}
              </Badge>
              <span className="text-sm text-gray-600">#{localComponent.id.slice(-8)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVisibility}
                className="h-8 w-8 p-0"
                title={isVisible ? 'Masquer' : 'Afficher'}
              >
                {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={duplicateComponent}
                className="h-8 w-8 p-0"
                title="Dupliquer"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComponentDelete(localComponent.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />
        </div>

        {/* Contenu */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="content" className="text-sm font-medium">Contenu</Label>
            <Textarea
              id="content"
              value={localComponent.content || ''}
              onChange={(e) => updateProperty('content', e.target.value)}
              placeholder="Contenu du composant"
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Tag HTML */}
          <div>
            <Label htmlFor="tag" className="text-sm font-medium">Balise HTML</Label>
            <Select
              value={localComponent.tag || 'div'}
              onValueChange={(value) => updateProperty('tag', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="div">div</SelectItem>
                <SelectItem value="span">span</SelectItem>
                <SelectItem value="p">p</SelectItem>
                <SelectItem value="h1">h1</SelectItem>
                <SelectItem value="h2">h2</SelectItem>
                <SelectItem value="h3">h3</SelectItem>
                <SelectItem value="h4">h4</SelectItem>
                <SelectItem value="h5">h5</SelectItem>
                <SelectItem value="h6">h6</SelectItem>
                <SelectItem value="button">button</SelectItem>
                <SelectItem value="a">a</SelectItem>
                <SelectItem value="section">section</SelectItem>
                <SelectItem value="article">article</SelectItem>
                <SelectItem value="header">header</SelectItem>
                <SelectItem value="footer">footer</SelectItem>
                <SelectItem value="nav">nav</SelectItem>
                <SelectItem value="main">main</SelectItem>
                <SelectItem value="aside">aside</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
        </div>

        {/* Position et Dimensions */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Position & Dimensions</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="left" className="text-xs text-gray-600">Position X</Label>
              <Input
                id="left"
                type="text"
                value={localComponent.styles?.left || '0px'}
                onChange={(e) => updateProperty('styles.left', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="top" className="text-xs text-gray-600">Position Y</Label>
              <Input
                id="top"
                type="text"
                value={localComponent.styles?.top || '0px'}
                onChange={(e) => updateProperty('styles.top', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-xs text-gray-600">Largeur</Label>
              <Input
                id="width"
                type="text"
                value={localComponent.styles?.width || 'auto'}
                onChange={(e) => updateProperty('styles.width', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs text-gray-600">Hauteur</Label>
              <Input
                id="height"
                type="text"
                value={localComponent.styles?.height || 'auto'}
                onChange={(e) => updateProperty('styles.height', e.target.value)}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="zIndex" className="text-xs text-gray-600">Z-Index</Label>
            <Input
              id="zIndex"
              type="number"
              value={localComponent.styles?.zIndex || '1000'}
              onChange={(e) => updateProperty('styles.zIndex', e.target.value)}
              className="mt-1 text-sm"
            />
          </div>

          <Separator />
        </div>

        {/* Apparence */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Apparence</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="backgroundColor" className="text-xs text-gray-600">Couleur de fond</Label>
              <div className="flex mt-1">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={localComponent.styles?.backgroundColor || '#transparent'}
                  onChange={(e) => updateProperty('styles.backgroundColor', e.target.value)}
                  className="w-12 h-9 p-1 rounded-l border-r-0"
                />
                <Input
                  type="text"
                  value={localComponent.styles?.backgroundColor || 'transparent'}
                  onChange={(e) => updateProperty('styles.backgroundColor', e.target.value)}
                  className="flex-1 text-sm rounded-l-none"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="color" className="text-xs text-gray-600">Couleur du texte</Label>
              <div className="flex mt-1">
                <Input
                  id="color"
                  type="color"
                  value={localComponent.styles?.color || '#000000'}
                  onChange={(e) => updateProperty('styles.color', e.target.value)}
                  className="w-12 h-9 p-1 rounded-l border-r-0"
                />
                <Input
                  type="text"
                  value={localComponent.styles?.color || 'inherit'}
                  onChange={(e) => updateProperty('styles.color', e.target.value)}
                  className="flex-1 text-sm rounded-l-none"
                  placeholder="inherit"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fontSize" className="text-xs text-gray-600">Taille de police</Label>
              <Select
                value={localComponent.styles?.fontSize || '1rem'}
                onValueChange={(value) => updateProperty('styles.fontSize', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.75rem">Très petit</SelectItem>
                  <SelectItem value="0.875rem">Petit</SelectItem>
                  <SelectItem value="1rem">Normal</SelectItem>
                  <SelectItem value="1.125rem">Grand</SelectItem>
                  <SelectItem value="1.25rem">Très grand</SelectItem>
                  <SelectItem value="1.5rem">XXL</SelectItem>
                  <SelectItem value="2rem">XXXL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fontWeight" className="text-xs text-gray-600">Poids de police</Label>
              <Select
                value={localComponent.styles?.fontWeight || 'normal'}
                onValueChange={(value) => updateProperty('styles.fontWeight', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Gras</SelectItem>
                  <SelectItem value="lighter">Léger</SelectItem>
                  <SelectItem value="bolder">Très gras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="textAlign" className="text-xs text-gray-600">Alignement du texte</Label>
            <Select
              value={localComponent.styles?.textAlign || 'left'}
              onValueChange={(value) => updateProperty('styles.textAlign', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Gauche</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="right">Droite</SelectItem>
                <SelectItem value="justify">Justifié</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
        </div>

        {/* Espacement */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Espacement</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="padding" className="text-xs text-gray-600">Padding interne</Label>
              <Input
                id="padding"
                type="text"
                value={localComponent.styles?.padding || '0'}
                onChange={(e) => updateProperty('styles.padding', e.target.value)}
                placeholder="ex: 10px 20px"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="margin" className="text-xs text-gray-600">Margin externe</Label>
              <Input
                id="margin"
                type="text"
                value={localComponent.styles?.margin || '0'}
                onChange={(e) => updateProperty('styles.margin', e.target.value)}
                placeholder="ex: 10px 20px"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <Separator />
        </div>

        {/* Bordure et Effets */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Bordure & Effets</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="border" className="text-xs text-gray-600">Bordure</Label>
              <Input
                id="border"
                type="text"
                value={localComponent.styles?.border || 'none'}
                onChange={(e) => updateProperty('styles.border', e.target.value)}
                placeholder="ex: 1px solid #000"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="borderRadius" className="text-xs text-gray-600">Coins arrondis</Label>
              <Input
                id="borderRadius"
                type="text"
                value={localComponent.styles?.borderRadius || '0'}
                onChange={(e) => updateProperty('styles.borderRadius', e.target.value)}
                placeholder="ex: 8px"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="boxShadow" className="text-xs text-gray-600">Ombre</Label>
            <Input
              id="boxShadow"
              type="text"
              value={localComponent.styles?.boxShadow || 'none'}
              onChange={(e) => updateProperty('styles.boxShadow', e.target.value)}
              placeholder="ex: 0 2px 4px rgba(0,0,0,0.1)"
              className="mt-1 text-sm"
            />
          </div>

          <Separator />
        </div>

        {/* Attributs spécifiques */}
        {(localComponent.type === 'image' || localComponent.type === 'input' || localComponent.type === 'button') && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Attributs spécifiques</h4>

            {localComponent.type === 'image' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="src" className="text-xs text-gray-600">URL de l'image</Label>
                  <Input
                    id="src"
                    type="url"
                    value={localComponent.attributes?.src || ''}
                    onChange={(e) => updateProperty('attributes.src', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="alt" className="text-xs text-gray-600">Texte alternatif</Label>
                  <Input
                    id="alt"
                    type="text"
                    value={localComponent.attributes?.alt || ''}
                    onChange={(e) => updateProperty('attributes.alt', e.target.value)}
                    placeholder="Description de l'image"
                    className="mt-1 text-sm"
                  />
                </div>
              </div>
            )}

            {localComponent.type === 'input' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="inputType" className="text-xs text-gray-600">Type de champ</Label>
                  <Select
                    value={localComponent.attributes?.type || 'text'}
                    onValueChange={(value) => updateProperty('attributes.type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="password">Mot de passe</SelectItem>
                      <SelectItem value="number">Nombre</SelectItem>
                      <SelectItem value="tel">Téléphone</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="placeholder" className="text-xs text-gray-600">Placeholder</Label>
                  <Input
                    id="placeholder"
                    type="text"
                    value={localComponent.attributes?.placeholder || ''}
                    onChange={(e) => updateProperty('attributes.placeholder', e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={localComponent.attributes?.required || false}
                    onCheckedChange={(checked) => updateProperty('attributes.required', checked)}
                  />
                  <Label htmlFor="required" className="text-xs text-gray-600">Champ obligatoire</Label>
                </div>
              </div>
            )}

            {localComponent.type === 'button' && (
              <div>
                <Label htmlFor="buttonType" className="text-xs text-gray-600">Type de bouton</Label>
                <Select
                  value={localComponent.attributes?.type || 'button'}
                  onValueChange={(value) => updateProperty('attributes.type', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="button">Bouton</SelectItem>
                    <SelectItem value="submit">Soumettre</SelectItem>
                    <SelectItem value="reset">Réinitialiser</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />
          </div>
        )}

        {/* Classes CSS */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Classes CSS</h4>
          <div>
            <Label htmlFor="className" className="text-xs text-gray-600">Classes CSS</Label>
            <Input
              id="className"
              type="text"
              value={localComponent.attributes?.className || ''}
              onChange={(e) => updateProperty('attributes.className', e.target.value)}
              placeholder="ex: btn btn-primary"
              className="mt-1 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}