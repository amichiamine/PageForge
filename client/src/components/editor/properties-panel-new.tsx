import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Trash2, Copy, Eye, EyeOff, Lock, Unlock, PanelLeftOpen, PanelLeftClose, 
  Plus, Minus, ChevronDown, ChevronRight, Layers, Settings, Palette,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline,
  Pipette, FileImage, Sliders, Type, Layout, Square, Move, Flex, Grid, 
  Border, Shadow, RotateCcw, Zap, MousePointer, Paintbrush
} from 'lucide-react';
import type { ComponentDefinition, Project } from '@shared/schema';

interface PropertiesPanelProps {
  component: ComponentDefinition | null;
  onComponentUpdate: (component: ComponentDefinition) => void;
  project: Project;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentDelete: (componentId: string) => void;
  hideMainSidebar?: boolean;
  setHideMainSidebar?: (hide: boolean) => void;
}

export default function PropertiesPanel({
  component,
  onComponentUpdate,
  project,
  onComponentSelect,
  onComponentDelete,
  hideMainSidebar,
  setHideMainSidebar
}: PropertiesPanelProps) {
  const [localComponent, setLocalComponent] = useState<ComponentDefinition | null>(null);
  const [openSections, setOpenSections] = useState({
    elements: true,
    properties: true,
    configuration: true
  });

  // State pour les outils WYSIWYG
  const [gradientSettings, setGradientSettings] = useState({
    type: 'linear',
    angle: '90deg',
    colors: ['#3b82f6', '#8b5cf6'],
    transparency: '100%'
  });

  // Composant Color Picker avancé
  const renderAdvancedColorPicker = (property: string, value: string | undefined) => {
    const [colorType, setColorType] = useState('solid');
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-600 capitalize">{property.replace('styles.', '')}</Label>
          <Select value={colorType} onValueChange={setColorType}>
            <SelectTrigger className="w-24 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">
                <div className="flex items-center gap-2">
                  <Pipette className="w-3 h-3" />
                  <span>Solide</span>
                </div>
              </SelectItem>
              <SelectItem value="gradient">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3 h-3" />
                  <span>Gradient</span>
                </div>
              </SelectItem>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <FileImage className="w-3 h-3" />
                  <span>Image</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {colorType === 'solid' && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                value={value || '#000000'}
                onChange={(e) => updateProperty(property, e.target.value)}
                className="h-8 text-xs"
                placeholder="#000000"
              />
            </div>
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer flex items-center justify-center relative"
              style={{ backgroundColor: value || '#000000' }}
            >
              <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => updateProperty(property, e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
              />
            </div>
          </div>
        )}

        {colorType === 'gradient' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={gradientSettings.type} onValueChange={(val) => setGradientSettings({...gradientSettings, type: val})}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linéaire</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Angle</Label>
                <Select value={gradientSettings.angle} onValueChange={(val) => setGradientSettings({...gradientSettings, angle: val})}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0deg">0°</SelectItem>
                    <SelectItem value="45deg">45°</SelectItem>
                    <SelectItem value="90deg">90°</SelectItem>
                    <SelectItem value="180deg">180°</SelectItem>
                    <SelectItem value="270deg">270°</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {colorType === 'image' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs flex-1"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const imageUrl = e.target?.result as string;
                        updateProperty(property, `url(${imageUrl})`);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                <FileImage className="w-3 h-3 mr-1" />
                Parcourir
              </Button>
            </div>
            <Input
              value={value?.replace('url(', '').replace(')', '') || ''}
              onChange={(e) => updateProperty(property, `url(${e.target.value})`)}
              placeholder="URL de l'image"
              className="h-7 text-xs"
            />
          </div>
        )}
      </div>
    );
  };

  // Fonction pour s'assurer qu'une valeur Select n'est jamais vide
  const ensureSelectValue = (value: string | undefined | null, defaultValue: string): string => {
    return (value && value.trim() !== '') ? value : defaultValue;
  };

  // Effect pour détecter les changements de composant
  useEffect(() => {
    if (component) {
      setLocalComponent(component);
    } else {
      setLocalComponent(null);
    }
  }, [component]);

  const updateProperty = (path: string, value: any) => {
    if (!localComponent) return;

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
    } else if (path.startsWith('componentData.')) {
      const dataProp = path.replace('componentData.', '');
      updatedComponent.componentData = {
        ...updatedComponent.componentData,
        [dataProp]: value
      };
    } else {
      (updatedComponent as any)[path] = value;
    }

    setLocalComponent(updatedComponent);
    onComponentUpdate(updatedComponent);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Fonction pour obtenir tous les composants de la page
  const getAllPageComponents = (): ComponentDefinition[] => {
    const components: ComponentDefinition[] = [];
    const currentPage = project.content?.pages?.[0];
    const pageStructure = currentPage?.content?.structure || [];

    const extractComponents = (componentList: ComponentDefinition[]) => {
      componentList.forEach(comp => {
        components.push(comp);
        if (comp.children && comp.children.length > 0) {
          extractComponents(comp.children);
        }
      });
    };

    extractComponents(pageStructure);
    return components;
  };

  // Section 1: Éléments présents sur la page
  const renderElementsSection = () => {
    const allComponents = getAllPageComponents();
    
    return (
      <Collapsible open={openSections.elements} onOpenChange={() => toggleSection('elements')}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Éléments de la page</span>
              <Badge variant="secondary" className="text-xs">
                {allComponents.length}
              </Badge>
            </div>
            {openSections.elements ? 
              <ChevronDown className="w-4 h-4 text-blue-600" /> : 
              <ChevronRight className="w-4 h-4 text-blue-600" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {allComponents.map((comp) => (
              <div 
                key={comp.id} 
                className={`p-2 border rounded cursor-pointer transition-colors flex items-center justify-between ${
                  localComponent?.id === comp.id ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => onComponentSelect(comp)}
              >
                <div>
                  <div className="text-sm font-medium">{comp.type}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {comp.content || comp.attributes?.alt || comp.attributes?.placeholder || 'Sans contenu'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentDelete(comp.id);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {allComponents.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Aucun élément sur la page
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Section 2: Propriétés CSS complètes
  const renderPropertiesSection = () => {
    if (!localComponent) return null;

    return (
      <Collapsible open={openSections.properties} onOpenChange={() => toggleSection('properties')}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md cursor-pointer hover:bg-green-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Propriétés CSS</span>
            </div>
            {openSections.properties ? 
              <ChevronDown className="w-4 h-4 text-green-600" /> : 
              <ChevronRight className="w-4 h-4 text-green-600" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2 pb-4">
            {renderLayoutProperties()}
            {renderTypographyProperties()}
            {renderAppearanceProperties()}
            {renderSpacingProperties()}
            {renderPositionProperties()}
            {renderFlexboxProperties()}
            {renderGridProperties()}
            {renderBorderProperties()}
            {renderShadowProperties()}
            {renderTransformProperties()}
            {renderTransitionProperties()}
            {renderInteractionProperties()}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Section 3: Configuration spécifique au composant
  const renderConfigurationSection = () => {
    if (!localComponent) return null;

    return (
      <Collapsible open={openSections.configuration} onOpenChange={() => toggleSection('configuration')}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-md cursor-pointer hover:bg-purple-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Configuration</span>
              <Badge variant="outline" className="text-xs text-purple-600">
                {localComponent.type}
              </Badge>
            </div>
            {openSections.configuration ? 
              <ChevronDown className="w-4 h-4 text-purple-600" /> : 
              <ChevronRight className="w-4 h-4 text-purple-600" />
            }
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2 pb-4">
            {renderComponentSpecificConfiguration()}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  // Propriétés de layout
  const renderLayoutProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Layout</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Display</Label>
          <Select value={localComponent?.styles?.display || 'block'} onValueChange={(value) => updateProperty('styles.display', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="inline">Inline</SelectItem>
              <SelectItem value="inline-block">Inline-block</SelectItem>
              <SelectItem value="flex">Flex</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="table-cell">Table-cell</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Overflow</Label>
          <Select value={localComponent?.styles?.overflow || 'visible'} onValueChange={(value) => updateProperty('styles.overflow', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="scroll">Scroll</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Width</Label>
          <Input
            value={localComponent?.styles?.width || ''}
            onChange={(e) => updateProperty('styles.width', e.target.value)}
            placeholder="auto, 100px, 100%"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Height</Label>
          <Input
            value={localComponent?.styles?.height || ''}
            onChange={(e) => updateProperty('styles.height', e.target.value)}
            placeholder="auto, 100px, 100%"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Min Width</Label>
          <Input
            value={localComponent?.styles?.minWidth || ''}
            onChange={(e) => updateProperty('styles.minWidth', e.target.value)}
            placeholder="0, 100px"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Max Width</Label>
          <Input
            value={localComponent?.styles?.maxWidth || ''}
            onChange={(e) => updateProperty('styles.maxWidth', e.target.value)}
            placeholder="none, 100px"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Min Height</Label>
          <Input
            value={localComponent?.styles?.minHeight || ''}
            onChange={(e) => updateProperty('styles.minHeight', e.target.value)}
            placeholder="0, 100px"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Max Height</Label>
          <Input
            value={localComponent?.styles?.maxHeight || ''}
            onChange={(e) => updateProperty('styles.maxHeight', e.target.value)}
            placeholder="none, 100px"
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );

  // Propriétés de typographie
  const renderTypographyProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Typographie</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Font Family</Label>
          <Select value={localComponent?.styles?.fontFamily || 'Arial'} onValueChange={(value) => updateProperty('styles.fontFamily', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
              <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
              <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
              <SelectItem value="'Helvetica Neue', sans-serif">Helvetica Neue</SelectItem>
              <SelectItem value="Georgia, serif">Georgia</SelectItem>
              <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
              <SelectItem value="Inter, sans-serif">Inter</SelectItem>
              <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Font Size</Label>
          <Input
            value={localComponent?.styles?.fontSize || ''}
            onChange={(e) => updateProperty('styles.fontSize', e.target.value)}
            placeholder="16px, 1em, 100%"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Font Weight</Label>
          <Select value={localComponent?.styles?.fontWeight || 'normal'} onValueChange={(value) => updateProperty('styles.fontWeight', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100 - Thin</SelectItem>
              <SelectItem value="200">200 - Extra Light</SelectItem>
              <SelectItem value="300">300 - Light</SelectItem>
              <SelectItem value="400">400 - Normal</SelectItem>
              <SelectItem value="500">500 - Medium</SelectItem>
              <SelectItem value="600">600 - Semi Bold</SelectItem>
              <SelectItem value="700">700 - Bold</SelectItem>
              <SelectItem value="800">800 - Extra Bold</SelectItem>
              <SelectItem value="900">900 - Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Line Height</Label>
          <Input
            value={localComponent?.styles?.lineHeight || ''}
            onChange={(e) => updateProperty('styles.lineHeight', e.target.value)}
            placeholder="1.5, 24px, normal"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Text Align</Label>
          <div className="flex space-x-1">
            {[
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight },
              { value: 'justify', icon: AlignJustify }
            ].map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={localComponent?.styles?.textAlign === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('styles.textAlign', value)}
                className="h-8 w-8 p-0"
              >
                <Icon className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>
        <div>
          {renderAdvancedColorPicker('styles.color', localComponent?.styles?.color)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Letter Spacing</Label>
          <Input
            value={localComponent?.styles?.letterSpacing || ''}
            onChange={(e) => updateProperty('styles.letterSpacing', e.target.value)}
            placeholder="normal, 1px, 0.1em"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Text Transform</Label>
          <Select value={localComponent?.styles?.textTransform || 'none'} onValueChange={(value) => updateProperty('styles.textTransform', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Text Decoration</Label>
          <div className="flex space-x-1">
            {[
              { value: 'none', label: 'None' },
              { value: 'underline', icon: Underline },
              { value: 'line-through', label: 'Strike' }
            ].map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={localComponent?.styles?.textDecoration === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('styles.textDecoration', value)}
                className="h-8 px-2 text-xs"
              >
                {Icon ? <Icon className="h-3 w-3" /> : label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs">Font Style</Label>
          <div className="flex space-x-1">
            <Button
              variant={localComponent?.styles?.fontStyle === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateProperty('styles.fontStyle', 'normal')}
              className="h-8 px-2 text-xs"
            >
              Normal
            </Button>
            <Button
              variant={localComponent?.styles?.fontStyle === 'italic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateProperty('styles.fontStyle', 'italic')}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Propriétés d'apparence
  const renderAppearanceProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Apparence</h5>
      <div className="space-y-3">
        <div>
          {renderAdvancedColorPicker('styles.backgroundColor', localComponent?.styles?.backgroundColor)}
        </div>
        <div>
          <Label className="text-xs">Opacité</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localComponent?.styles?.opacity || '1'}
              onChange={(e) => updateProperty('styles.opacity', e.target.value)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-10">{Math.round((parseFloat(localComponent?.styles?.opacity || '1')) * 100)}%</span>
          </div>
        </div>
      </div>
      <div>
        {renderAdvancedColorPicker('styles.backgroundImage', localComponent?.styles?.backgroundImage)}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Background Size</Label>
          <Select value={localComponent?.styles?.backgroundSize || 'auto'} onValueChange={(value) => updateProperty('styles.backgroundSize', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="100% 100%">Stretch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Background Repeat</Label>
          <Select value={localComponent?.styles?.backgroundRepeat || 'repeat'} onValueChange={(value) => updateProperty('styles.backgroundRepeat', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repeat">Repeat</SelectItem>
              <SelectItem value="no-repeat">No Repeat</SelectItem>
              <SelectItem value="repeat-x">Repeat X</SelectItem>
              <SelectItem value="repeat-y">Repeat Y</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs">Background Position</Label>
        <Input
          value={localComponent?.styles?.backgroundPosition || ''}
          onChange={(e) => updateProperty('styles.backgroundPosition', e.target.value)}
          placeholder="center, top left, 50% 50%"
          className="h-8 text-xs"
        />
      </div>
    </div>
  );

  // Propriétés d'espacement
  const renderSpacingProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Espacement</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Padding</Label>
          <Input
            value={localComponent?.styles?.padding || ''}
            onChange={(e) => updateProperty('styles.padding', e.target.value)}
            placeholder="10px, 10px 20px"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Margin</Label>
          <Input
            value={localComponent?.styles?.margin || ''}
            onChange={(e) => updateProperty('styles.margin', e.target.value)}
            placeholder="10px, 10px 20px"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div>
          <Label className="text-xs">Padding Top</Label>
          <Input
            value={localComponent?.styles?.paddingTop || ''}
            onChange={(e) => updateProperty('styles.paddingTop', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Padding Right</Label>
          <Input
            value={localComponent?.styles?.paddingRight || ''}
            onChange={(e) => updateProperty('styles.paddingRight', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Padding Bottom</Label>
          <Input
            value={localComponent?.styles?.paddingBottom || ''}
            onChange={(e) => updateProperty('styles.paddingBottom', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Padding Left</Label>
          <Input
            value={localComponent?.styles?.paddingLeft || ''}
            onChange={(e) => updateProperty('styles.paddingLeft', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div>
          <Label className="text-xs">Margin Top</Label>
          <Input
            value={localComponent?.styles?.marginTop || ''}
            onChange={(e) => updateProperty('styles.marginTop', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Margin Right</Label>
          <Input
            value={localComponent?.styles?.marginRight || ''}
            onChange={(e) => updateProperty('styles.marginRight', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Margin Bottom</Label>
          <Input
            value={localComponent?.styles?.marginBottom || ''}
            onChange={(e) => updateProperty('styles.marginBottom', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Margin Left</Label>
          <Input
            value={localComponent?.styles?.marginLeft || ''}
            onChange={(e) => updateProperty('styles.marginLeft', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );

  // Propriétés de position
  const renderPositionProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Position</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Position</Label>
          <Select value={localComponent?.styles?.position || 'static'} onValueChange={(value) => updateProperty('styles.position', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="static">Static</SelectItem>
              <SelectItem value="relative">Relative</SelectItem>
              <SelectItem value="absolute">Absolute</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="sticky">Sticky</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Z-Index</Label>
          <Input
            type="number"
            value={localComponent?.styles?.zIndex || ''}
            onChange={(e) => updateProperty('styles.zIndex', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div>
          <Label className="text-xs">Top</Label>
          <Input
            value={localComponent?.styles?.top || ''}
            onChange={(e) => updateProperty('styles.top', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Right</Label>
          <Input
            value={localComponent?.styles?.right || ''}
            onChange={(e) => updateProperty('styles.right', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Bottom</Label>
          <Input
            value={localComponent?.styles?.bottom || ''}
            onChange={(e) => updateProperty('styles.bottom', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Left</Label>
          <Input
            value={localComponent?.styles?.left || ''}
            onChange={(e) => updateProperty('styles.left', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );

  // Propriétés Flexbox
  const renderFlexboxProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Flexbox</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Flex Direction</Label>
          <Select value={localComponent?.styles?.flexDirection || 'row'} onValueChange={(value) => updateProperty('styles.flexDirection', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Row</SelectItem>
              <SelectItem value="column">Column</SelectItem>
              <SelectItem value="row-reverse">Row Reverse</SelectItem>
              <SelectItem value="column-reverse">Column Reverse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Flex Wrap</Label>
          <Select value={localComponent?.styles?.flexWrap || 'nowrap'} onValueChange={(value) => updateProperty('styles.flexWrap', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nowrap">No Wrap</SelectItem>
              <SelectItem value="wrap">Wrap</SelectItem>
              <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Justify Content</Label>
          <Select value={localComponent?.styles?.justifyContent || 'flex-start'} onValueChange={(value) => updateProperty('styles.justifyContent', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flex-start">Flex Start</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="flex-end">Flex End</SelectItem>
              <SelectItem value="space-between">Space Between</SelectItem>
              <SelectItem value="space-around">Space Around</SelectItem>
              <SelectItem value="space-evenly">Space Evenly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Align Items</Label>
          <Select value={localComponent?.styles?.alignItems || 'stretch'} onValueChange={(value) => updateProperty('styles.alignItems', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stretch">Stretch</SelectItem>
              <SelectItem value="flex-start">Flex Start</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="flex-end">Flex End</SelectItem>
              <SelectItem value="baseline">Baseline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">Flex Grow</Label>
          <Input
            type="number"
            min="0"
            value={localComponent?.styles?.flexGrow || ''}
            onChange={(e) => updateProperty('styles.flexGrow', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Flex Shrink</Label>
          <Input
            type="number"
            min="0"
            value={localComponent?.styles?.flexShrink || ''}
            onChange={(e) => updateProperty('styles.flexShrink', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Flex Basis</Label>
          <Input
            value={localComponent?.styles?.flexBasis || ''}
            onChange={(e) => updateProperty('styles.flexBasis', e.target.value)}
            placeholder="auto, 100px"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div>
        <Label className="text-xs">Gap</Label>
        <Input
          value={localComponent?.styles?.gap || ''}
          onChange={(e) => updateProperty('styles.gap', e.target.value)}
          placeholder="10px, 1rem"
          className="h-8 text-xs"
        />
      </div>
    </div>
  );

  // Propriétés Grid
  const renderGridProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Grid</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Grid Template Columns</Label>
          <Input
            value={localComponent?.styles?.gridTemplateColumns || ''}
            onChange={(e) => updateProperty('styles.gridTemplateColumns', e.target.value)}
            placeholder="1fr 1fr, repeat(3, 1fr)"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Grid Template Rows</Label>
          <Input
            value={localComponent?.styles?.gridTemplateRows || ''}
            onChange={(e) => updateProperty('styles.gridTemplateRows', e.target.value)}
            placeholder="auto, 100px 200px"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Grid Column Gap</Label>
          <Input
            value={localComponent?.styles?.columnGap || ''}
            onChange={(e) => updateProperty('styles.columnGap', e.target.value)}
            placeholder="10px, 1rem"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Grid Row Gap</Label>
          <Input
            value={localComponent?.styles?.rowGap || ''}
            onChange={(e) => updateProperty('styles.rowGap', e.target.value)}
            placeholder="10px, 1rem"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Grid Column</Label>
          <Input
            value={localComponent?.styles?.gridColumn || ''}
            onChange={(e) => updateProperty('styles.gridColumn', e.target.value)}
            placeholder="1 / 3, span 2"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Grid Row</Label>
          <Input
            value={localComponent?.styles?.gridRow || ''}
            onChange={(e) => updateProperty('styles.gridRow', e.target.value)}
            placeholder="1 / 3, span 2"
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );

  // Propriétés de bordure
  const renderBorderProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Bordures</h5>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">Border Width</Label>
          <Input
            value={localComponent?.styles?.borderWidth || ''}
            onChange={(e) => updateProperty('styles.borderWidth', e.target.value)}
            placeholder="1px, thin"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Border Style</Label>
          <Select value={localComponent?.styles?.borderStyle || 'solid'} onValueChange={(value) => updateProperty('styles.borderStyle', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="groove">Groove</SelectItem>
              <SelectItem value="ridge">Ridge</SelectItem>
              <SelectItem value="inset">Inset</SelectItem>
              <SelectItem value="outset">Outset</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Border Color</Label>
          <Input
            type="color"
            value={localComponent?.styles?.borderColor || '#000000'}
            onChange={(e) => updateProperty('styles.borderColor', e.target.value)}
            className="h-8 w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <div>
          <Label className="text-xs">Border Radius</Label>
          <Input
            value={localComponent?.styles?.borderRadius || ''}
            onChange={(e) => updateProperty('styles.borderRadius', e.target.value)}
            placeholder="0px, 5px"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Top Left</Label>
          <Input
            value={localComponent?.styles?.borderTopLeftRadius || ''}
            onChange={(e) => updateProperty('styles.borderTopLeftRadius', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Top Right</Label>
          <Input
            value={localComponent?.styles?.borderTopRightRadius || ''}
            onChange={(e) => updateProperty('styles.borderTopRightRadius', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Bottom</Label>
          <Input
            value={localComponent?.styles?.borderBottomLeftRadius || ''}
            onChange={(e) => updateProperty('styles.borderBottomLeftRadius', e.target.value)}
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );

  // Propriétés d'ombre
  const renderShadowProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Ombres & Effets</h5>
      <div>
        <Label className="text-xs">Box Shadow</Label>
        <Input
          value={localComponent?.styles?.boxShadow || ''}
          onChange={(e) => updateProperty('styles.boxShadow', e.target.value)}
          placeholder="0 2px 4px rgba(0,0,0,0.1)"
          className="h-8 text-xs"
        />
      </div>
      <div>
        <Label className="text-xs">Text Shadow</Label>
        <Input
          value={localComponent?.styles?.textShadow || ''}
          onChange={(e) => updateProperty('styles.textShadow', e.target.value)}
          placeholder="1px 1px 1px rgba(0,0,0,0.5)"
          className="h-8 text-xs"
        />
      </div>
      <div>
        <Label className="text-xs">Filter</Label>
        <Input
          value={localComponent?.styles?.filter || ''}
          onChange={(e) => updateProperty('styles.filter', e.target.value)}
          placeholder="blur(5px), brightness(0.8)"
          className="h-8 text-xs"
        />
      </div>
    </div>
  );

  // Propriétés de transformation
  const renderTransformProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Transformations</h5>
      <div>
        <Label className="text-xs">Transform</Label>
        <Input
          value={localComponent?.styles?.transform || ''}
          onChange={(e) => updateProperty('styles.transform', e.target.value)}
          placeholder="rotate(45deg), scale(1.2)"
          className="h-8 text-xs"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Transform Origin</Label>
          <Input
            value={localComponent?.styles?.transformOrigin || ''}
            onChange={(e) => updateProperty('styles.transformOrigin', e.target.value)}
            placeholder="center, top left"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Transform Style</Label>
          <Select value={localComponent?.styles?.transformStyle || 'flat'} onValueChange={(value) => updateProperty('styles.transformStyle', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="preserve-3d">Preserve 3D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Propriétés de transition
  const renderTransitionProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Transitions & Animations</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Transition Property</Label>
          <Input
            value={localComponent?.styles?.transitionProperty || ''}
            onChange={(e) => updateProperty('styles.transitionProperty', e.target.value)}
            placeholder="all, opacity, transform"
            className="h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Transition Duration</Label>
          <Input
            value={localComponent?.styles?.transitionDuration || ''}
            onChange={(e) => updateProperty('styles.transitionDuration', e.target.value)}
            placeholder="0.3s, 300ms"
            className="h-8 text-xs"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Transition Timing</Label>
          <Select value={localComponent?.styles?.transitionTimingFunction || 'ease'} onValueChange={(value) => updateProperty('styles.transitionTimingFunction', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ease">Ease</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="ease-in">Ease In</SelectItem>
              <SelectItem value="ease-out">Ease Out</SelectItem>
              <SelectItem value="ease-in-out">Ease In Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Transition Delay</Label>
          <Input
            value={localComponent?.styles?.transitionDelay || ''}
            onChange={(e) => updateProperty('styles.transitionDelay', e.target.value)}
            placeholder="0s, 100ms"
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );

  // Propriétés d'interaction
  const renderInteractionProperties = () => (
    <div className="space-y-3">
      <h5 className="text-sm font-semibold text-gray-700 border-b pb-1">Interaction</h5>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Cursor</Label>
          <Select value={localComponent?.styles?.cursor || 'default'} onValueChange={(value) => updateProperty('styles.cursor', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="pointer">Pointer</SelectItem>
              <SelectItem value="crosshair">Crosshair</SelectItem>
              <SelectItem value="move">Move</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="wait">Wait</SelectItem>
              <SelectItem value="help">Help</SelectItem>
              <SelectItem value="not-allowed">Not Allowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">User Select</Label>
          <Select value={localComponent?.styles?.userSelect || 'auto'} onValueChange={(value) => updateProperty('styles.userSelect', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs">Pointer Events</Label>
        <Select value={localComponent?.styles?.pointerEvents || 'auto'} onValueChange={(value) => updateProperty('styles.pointerEvents', value)}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="visiblePainted">Visible Painted</SelectItem>
            <SelectItem value="visibleFill">Visible Fill</SelectItem>
            <SelectItem value="visibleStroke">Visible Stroke</SelectItem>
            <SelectItem value="visible">Visible</SelectItem>
            <SelectItem value="painted">Painted</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
            <SelectItem value="stroke">Stroke</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Configuration spécifique au composant
  const renderComponentSpecificConfiguration = () => {
    if (!localComponent) return null;

    switch (localComponent.type) {
      case 'carousel':
        return renderCarouselConfiguration();
      case 'button':
        return renderButtonConfiguration();
      case 'image':
        return renderImageConfiguration();
      case 'form':
        return renderFormConfiguration();
      case 'table':
        return renderTableConfiguration();
      case 'video':
        return renderVideoConfiguration();
      case 'audio':
        return renderAudioConfiguration();
      case 'link':
        return renderLinkConfiguration();
      case 'list':
        return renderListConfiguration();
      case 'pricing':
        return renderPricingConfiguration();
      case 'testimonial':
        return renderTestimonialConfiguration();
      default:
        return renderGenericConfiguration();
    }
  };

  // Configuration du carrousel
  const renderCarouselConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Carrousel</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Vitesse d'animation (ms)</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.animationSpeed || 3000}
            onChange={(e) => updateProperty('componentData.animationSpeed', parseInt(e.target.value))}
            className="mt-1 text-sm"
            min="500"
            max="10000"
            step="500"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Défilement automatique</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.autoplay, 'true')}
            onValueChange={(value) => updateProperty('componentData.autoplay', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Activé</SelectItem>
              <SelectItem value="false">Désactivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showDots"
            checked={localComponent?.componentData?.showDots !== false}
            onCheckedChange={(checked) => updateProperty('componentData.showDots', checked)}
          />
          <Label htmlFor="showDots" className="text-xs">Afficher les points</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showArrows"
            checked={localComponent?.componentData?.showArrows !== false}
            onCheckedChange={(checked) => updateProperty('componentData.showArrows', checked)}
          />
          <Label htmlFor="showArrows" className="text-xs">Afficher les flèches</Label>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Slides du carrousel</Label>
        <div className="space-y-2 mt-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {(localComponent?.componentData?.slides || []).map((slide: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Slide {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const slides = [...(localComponent?.componentData?.slides || [])];
                    slides.splice(index, 1);
                    updateProperty('componentData.slides', slides);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                type="url"
                placeholder="URL de l'image"
                value={slide.image || ''}
                onChange={(e) => {
                  const slides = [...(localComponent?.componentData?.slides || [])];
                  slides[index] = { ...slide, image: e.target.value };
                  updateProperty('componentData.slides', slides);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Titre du slide"
                value={slide.title || ''}
                onChange={(e) => {
                  const slides = [...(localComponent?.componentData?.slides || [])];
                  slides[index] = { ...slide, title: e.target.value };
                  updateProperty('componentData.slides', slides);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Description du slide"
                value={slide.description || ''}
                onChange={(e) => {
                  const slides = [...(localComponent?.componentData?.slides || [])];
                  slides[index] = { ...slide, description: e.target.value };
                  updateProperty('componentData.slides', slides);
                }}
                className="text-sm resize-none"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Texte du bouton"
                  value={slide.buttonText || ''}
                  onChange={(e) => {
                    const slides = [...(localComponent?.componentData?.slides || [])];
                    slides[index] = { ...slide, buttonText: e.target.value };
                    updateProperty('componentData.slides', slides);
                  }}
                  className="text-sm"
                />
                <Input
                  placeholder="Lien du bouton"
                  value={slide.buttonLink || ''}
                  onChange={(e) => {
                    const slides = [...(localComponent?.componentData?.slides || [])];
                    slides[index] = { ...slide, buttonLink: e.target.value };
                    updateProperty('componentData.slides', slides);
                  }}
                  className="text-sm"
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const slides = [...(localComponent?.componentData?.slides || [])];
              slides.push({ 
                image: '', 
                title: `Slide ${slides.length + 1}`,
                description: '',
                buttonText: '',
                buttonLink: ''
              });
              updateProperty('componentData.slides', slides);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un slide
          </Button>
        </div>
      </div>
    </div>
  );

  // Configuration du bouton
  const renderButtonConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Bouton</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Texte du bouton</Label>
        <Input
          value={localComponent?.content || ''}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type de bouton</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.variant, 'primary')}
            onValueChange={(value) => updateProperty('componentData.variant', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primaire</SelectItem>
              <SelectItem value="secondary">Secondaire</SelectItem>
              <SelectItem value="outline">Contour</SelectItem>
              <SelectItem value="ghost">Fantôme</SelectItem>
              <SelectItem value="destructive">Destructeur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.size, 'medium')}
            onValueChange={(value) => updateProperty('componentData.size', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petit</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="large">Grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Lien du bouton</Label>
        <Input
          value={localComponent?.componentData?.href || ''}
          onChange={(e) => updateProperty('componentData.href', e.target.value)}
          placeholder="https://example.com"
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="disabled"
            checked={localComponent?.componentData?.disabled || false}
            onCheckedChange={(checked) => updateProperty('componentData.disabled', checked)}
          />
          <Label htmlFor="disabled" className="text-xs">Désactivé</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fullWidth"
            checked={localComponent?.componentData?.fullWidth || false}
            onCheckedChange={(checked) => updateProperty('componentData.fullWidth', checked)}
          />
          <Label htmlFor="fullWidth" className="text-xs">Pleine largeur</Label>
        </div>
      </div>
    </div>
  );

  // Configuration de l'image
  const renderImageConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de l'Image</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL de l'image</Label>
        <Input
          value={localComponent?.attributes?.src || ''}
          onChange={(e) => updateProperty('attributes.src', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Texte alternatif</Label>
        <Input
          value={localComponent?.attributes?.alt || ''}
          onChange={(e) => updateProperty('attributes.alt', e.target.value)}
          placeholder="Description de l'image"
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Object Fit</Label>
          <Select
            value={ensureSelectValue(localComponent?.styles?.objectFit, 'cover')}
            onValueChange={(value) => updateProperty('styles.objectFit', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="fill">Fill</SelectItem>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="scale-down">Scale Down</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lazy Loading</Label>
          <Select
            value={ensureSelectValue(localComponent?.attributes?.loading, 'lazy')}
            onValueChange={(value) => updateProperty('attributes.loading', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lazy">Lazy</SelectItem>
              <SelectItem value="eager">Eager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="responsive"
          checked={localComponent?.componentData?.responsive !== false}
          onCheckedChange={(checked) => updateProperty('componentData.responsive', checked)}
        />
        <Label htmlFor="responsive" className="text-xs">Image responsive</Label>
      </div>
    </div>
  );

  // Configuration du formulaire
  const renderFormConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Formulaire</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Méthode</Label>
          <Select
            value={ensureSelectValue(localComponent?.attributes?.method, 'post')}
            onValueChange={(value) => updateProperty('attributes.method', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="get">GET</SelectItem>
              <SelectItem value="post">POST</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Action</Label>
          <Input
            value={localComponent?.attributes?.action || ''}
            onChange={(e) => updateProperty('attributes.action', e.target.value)}
            placeholder="/submit"
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Champs du formulaire</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.fields || []).map((field: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Champ {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const fields = [...(localComponent?.componentData?.fields || [])];
                    fields.splice(index, 1);
                    updateProperty('componentData.fields', fields);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Nom du champ"
                  value={field.name || ''}
                  onChange={(e) => {
                    const fields = [...(localComponent?.componentData?.fields || [])];
                    fields[index] = { ...field, name: e.target.value };
                    updateProperty('componentData.fields', fields);
                  }}
                  className="text-sm"
                />
                <Select
                  value={ensureSelectValue(field.type, 'text')}
                  onValueChange={(value) => {
                    const fields = [...(localComponent?.componentData?.fields || [])];
                    fields[index] = { ...field, type: value };
                    updateProperty('componentData.fields', fields);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="password">Mot de passe</SelectItem>
                    <SelectItem value="tel">Téléphone</SelectItem>
                    <SelectItem value="number">Nombre</SelectItem>
                    <SelectItem value="textarea">Zone de texte</SelectItem>
                    <SelectItem value="select">Liste déroulante</SelectItem>
                    <SelectItem value="checkbox">Case à cocher</SelectItem>
                    <SelectItem value="radio">Bouton radio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Placeholder"
                value={field.placeholder || ''}
                onChange={(e) => {
                  const fields = [...(localComponent?.componentData?.fields || [])];
                  fields[index] = { ...field, placeholder: e.target.value };
                  updateProperty('componentData.fields', fields);
                }}
                className="text-sm"
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${index}`}
                  checked={field.required || false}
                  onCheckedChange={(checked) => {
                    const fields = [...(localComponent?.componentData?.fields || [])];
                    fields[index] = { ...field, required: checked };
                    updateProperty('componentData.fields', fields);
                  }}
                />
                <Label htmlFor={`required-${index}`} className="text-xs">Obligatoire</Label>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const fields = [...(localComponent?.componentData?.fields || [])];
              fields.push({ 
                name: `field${fields.length + 1}`,
                type: 'text',
                placeholder: '',
                required: false
              });
              updateProperty('componentData.fields', fields);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un champ
          </Button>
        </div>
      </div>
    </div>
  );

  // Configuration du tableau
  const renderTableConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Tableau</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="striped"
            checked={localComponent?.componentData?.striped !== false}
            onCheckedChange={(checked) => updateProperty('componentData.striped', checked)}
          />
          <Label htmlFor="striped" className="text-xs">Lignes alternées</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bordered"
            checked={localComponent?.componentData?.bordered !== false}
            onCheckedChange={(checked) => updateProperty('componentData.bordered', checked)}
          />
          <Label htmlFor="bordered" className="text-xs">Bordures</Label>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Colonnes du tableau</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.columns || []).map((column: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Nom de colonne"
                value={column.name || ''}
                onChange={(e) => {
                  const columns = [...(localComponent?.componentData?.columns || [])];
                  columns[index] = { ...column, name: e.target.value };
                  updateProperty('componentData.columns', columns);
                }}
                className="flex-1 text-sm"
              />
              <Select
                value={ensureSelectValue(column.type, 'text')}
                onValueChange={(value) => {
                  const columns = [...(localComponent?.componentData?.columns || [])];
                  columns[index] = { ...column, type: value };
                  updateProperty('componentData.columns', columns);
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="number">Nombre</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Booléen</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const columns = [...(localComponent?.componentData?.columns || [])];
                  columns.splice(index, 1);
                  updateProperty('componentData.columns', columns);
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const columns = [...(localComponent?.componentData?.columns || [])];
              columns.push({ name: `Colonne ${columns.length + 1}`, type: 'text' });
              updateProperty('componentData.columns', columns);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une colonne
          </Button>
        </div>
      </div>
    </div>
  );

  // Configuration vidéo
  const renderVideoConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Vidéo</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL de la vidéo</Label>
        <Input
          value={localComponent?.attributes?.src || ''}
          onChange={(e) => updateProperty('attributes.src', e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoplay"
            checked={localComponent?.attributes?.autoplay || false}
            onCheckedChange={(checked) => updateProperty('attributes.autoplay', checked)}
          />
          <Label htmlFor="autoplay" className="text-xs">Lecture automatique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="loop"
            checked={localComponent?.attributes?.loop || false}
            onCheckedChange={(checked) => updateProperty('attributes.loop', checked)}
          />
          <Label htmlFor="loop" className="text-xs">Lecture en boucle</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="muted"
            checked={localComponent?.attributes?.muted || false}
            onCheckedChange={(checked) => updateProperty('attributes.muted', checked)}
          />
          <Label htmlFor="muted" className="text-xs">Muet</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="controls"
            checked={localComponent?.attributes?.controls !== false}
            onCheckedChange={(checked) => updateProperty('attributes.controls', checked)}
          />
          <Label htmlFor="controls" className="text-xs">Contrôles</Label>
        </div>
      </div>
    </div>
  );

  // Configuration audio
  const renderAudioConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Audio</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL de l'audio</Label>
        <Input
          value={localComponent?.attributes?.src || ''}
          onChange={(e) => updateProperty('attributes.src', e.target.value)}
          placeholder="https://example.com/audio.mp3"
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoplay-audio"
            checked={localComponent?.attributes?.autoplay || false}
            onCheckedChange={(checked) => updateProperty('attributes.autoplay', checked)}
          />
          <Label htmlFor="autoplay-audio" className="text-xs">Lecture automatique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="loop-audio"
            checked={localComponent?.attributes?.loop || false}
            onCheckedChange={(checked) => updateProperty('attributes.loop', checked)}
          />
          <Label htmlFor="loop-audio" className="text-xs">Lecture en boucle</Label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="controls-audio"
          checked={localComponent?.attributes?.controls !== false}
          onCheckedChange={(checked) => updateProperty('attributes.controls', checked)}
        />
        <Label htmlFor="controls-audio" className="text-xs">Contrôles</Label>
      </div>
    </div>
  );

  // Configuration lien
  const renderLinkConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Lien</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL du lien</Label>
        <Input
          value={localComponent?.attributes?.href || ''}
          onChange={(e) => updateProperty('attributes.href', e.target.value)}
          placeholder="https://example.com"
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Texte du lien</Label>
        <Input
          value={localComponent?.content || ''}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Target</Label>
          <Select
            value={ensureSelectValue(localComponent?.attributes?.target, '_self')}
            onValueChange={(value) => updateProperty('attributes.target', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_self">Même onglet</SelectItem>
              <SelectItem value="_blank">Nouvel onglet</SelectItem>
              <SelectItem value="_parent">Parent</SelectItem>
              <SelectItem value="_top">Top</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Rel</Label>
          <Select
            value={ensureSelectValue(localComponent?.attributes?.rel, '')}
            onValueChange={(value) => updateProperty('attributes.rel', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Aucun</SelectItem>
              <SelectItem value="nofollow">Nofollow</SelectItem>
              <SelectItem value="noopener">Noopener</SelectItem>
              <SelectItem value="noreferrer">Noreferrer</SelectItem>
              <SelectItem value="noopener noreferrer">Noopener Noreferrer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Configuration liste
  const renderListConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de la Liste</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Type de liste</Label>
        <Select
          value={ensureSelectValue(localComponent?.tag, 'ul')}
          onValueChange={(value) => updateProperty('tag', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ul">Liste à puces</SelectItem>
            <SelectItem value="ol">Liste numérotée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Éléments de la liste</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder={`Élément ${index + 1}`}
                value={item.text || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, text: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items.splice(index, 1);
                  updateProperty('componentData.items', items);
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const items = [...(localComponent?.componentData?.items || [])];
              items.push({ text: `Élément ${items.length + 1}` });
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un élément
          </Button>
        </div>
      </div>
    </div>
  );

  // Configuration pricing
  const renderPricingConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Tarification</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Prix</Label>
          <Input
            value={localComponent?.componentData?.price || ''}
            onChange={(e) => updateProperty('componentData.price', e.target.value)}
            placeholder="29"
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Devise</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.currency, 'EUR')}
            onValueChange={(value) => updateProperty('componentData.currency', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">€ Euro</SelectItem>
              <SelectItem value="USD">$ Dollar</SelectItem>
              <SelectItem value="GBP">£ Livre</SelectItem>
              <SelectItem value="JPY">¥ Yen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Période</Label>
        <Input
          value={localComponent?.componentData?.period || ''}
          onChange={(e) => updateProperty('componentData.period', e.target.value)}
          placeholder="/mois"
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Fonctionnalités incluses</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.features || []).map((feature: any, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder={`Fonctionnalité ${index + 1}`}
                value={feature.text || ''}
                onChange={(e) => {
                  const features = [...(localComponent?.componentData?.features || [])];
                  features[index] = { ...feature, text: e.target.value };
                  updateProperty('componentData.features', features);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const features = [...(localComponent?.componentData?.features || [])];
                  features.splice(index, 1);
                  updateProperty('componentData.features', features);
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const features = [...(localComponent?.componentData?.features || [])];
              features.push({ text: `Fonctionnalité ${features.length + 1}` });
              updateProperty('componentData.features', features);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une fonctionnalité
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="highlighted"
          checked={localComponent?.componentData?.highlighted || false}
          onCheckedChange={(checked) => updateProperty('componentData.highlighted', checked)}
        />
        <Label htmlFor="highlighted" className="text-xs">Plan mis en avant</Label>
      </div>
    </div>
  );

  // Configuration testimonial
  const renderTestimonialConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Témoignage</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Citation</Label>
        <Textarea
          value={localComponent?.componentData?.quote || ''}
          onChange={(e) => updateProperty('componentData.quote', e.target.value)}
          placeholder="Entrez le témoignage..."
          className="mt-1 text-sm resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Nom de l'auteur</Label>
          <Input
            value={localComponent?.componentData?.author || ''}
            onChange={(e) => updateProperty('componentData.author', e.target.value)}
            placeholder="John Doe"
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Poste/Entreprise</Label>
          <Input
            value={localComponent?.componentData?.position || ''}
            onChange={(e) => updateProperty('componentData.position', e.target.value)}
            placeholder="CEO, Entreprise"
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Photo de l'auteur</Label>
        <Input
          value={localComponent?.componentData?.avatar || ''}
          onChange={(e) => updateProperty('componentData.avatar', e.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Note (sur 5)</Label>
        <Input
          type="number"
          min="1"
          max="5"
          value={localComponent?.componentData?.rating || '5'}
          onChange={(e) => updateProperty('componentData.rating', parseInt(e.target.value))}
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  // Configuration générique pour les composants non spécifiés
  const renderGenericConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration {localComponent?.type}</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Contenu</Label>
        <Textarea
          value={localComponent?.content || ''}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm resize-none"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Classes CSS</Label>
        <Input
          value={localComponent?.attributes?.className || ''}
          onChange={(e) => updateProperty('attributes.className', e.target.value)}
          placeholder="my-class another-class"
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">ID</Label>
        <Input
          value={localComponent?.attributes?.id || ''}
          onChange={(e) => updateProperty('attributes.id', e.target.value)}
          placeholder="my-element-id"
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  if (!localComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Propriétés</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-500">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun élément sélectionné</h3>
            <p className="text-sm">Sélectionnez un élément sur la page pour modifier ses propriétés.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Propriétés</h2>
          <Badge variant="outline" className="text-xs">
            {localComponent.type}
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-8">
          {renderElementsSection()}
          {renderPropertiesSection()}
          {renderConfigurationSection()}
        </div>
      </div>
    </div>
  );
}