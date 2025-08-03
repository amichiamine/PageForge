import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Trash2, Copy, Eye, EyeOff, Lock, Unlock, PanelLeftOpen, PanelLeftClose, 
  Plus, Minus, ChevronDown, ChevronRight, Layers, Settings, Palette,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline,
  Pipette, FileImage, Sliders, Type, Layout, Square, Move, Grid, 
  RotateCcw, Zap, MousePointer, Paintbrush
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
    elements: false,
    properties: false,
    configuration: false
  });

  // State pour les outils WYSIWYG
  const [gradientSettings, setGradientSettings] = useState({
    type: 'linear',
    angle: '90deg',
    colors: ['#3b82f6', '#8b5cf6'],
    transparency: '100%'
  });
  const [colorType, setColorType] = useState('solid');
  const [opacityValue, setOpacityValue] = useState(100);



  // Fonction pour s'assurer qu'une valeur Select n'est jamais vide
  const ensureSelectValue = (value: any, defaultValue: string): string => {
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
    return defaultValue;
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

    console.log('🔧 GRID UPDATE:', { path, value, componentType: localComponent.type });

    const updatedComponent = { ...localComponent };

    if (path.startsWith('styles.')) {
      const styleProp = path.replace('styles.', '');
      updatedComponent.styles = {
        ...updatedComponent.styles,
        [styleProp]: value
      };
      console.log('🎨 UPDATE STYLES:', { 
        path, 
        styleProp, 
        value, 
        newStyles: updatedComponent.styles 
      });
    } else if (path.startsWith('attributes.')) {
      const attrProp = path.replace('attributes.', '');
      updatedComponent.attributes = {
        ...updatedComponent.attributes,
        [attrProp]: value
      };
      console.log('🔧 UPDATE ATTRIBUTES:', { 
        path, 
        attrProp, 
        value, 
        newAttributes: updatedComponent.attributes 
      });
    } else if (path.startsWith('componentData.')) {
      const dataProp = path.replace('componentData.', '');
      updatedComponent.componentData = {
        ...updatedComponent.componentData,
        [dataProp]: value
      };
      console.log('📊 UPDATE COMPONENT DATA:', { 
        path, 
        dataProp, 
        value, 
        newComponentData: updatedComponent.componentData 
      });
    } else {
      (updatedComponent as any)[path] = value;
      console.log('🔄 UPDATE DIRECT PROPERTY:', { path, value });
    }

    // Mise à jour immédiate du composant local
    setLocalComponent(updatedComponent);
    
    // Déclencher immédiatement la mise à jour du parent pour la propagation temps réel
    onComponentUpdate(updatedComponent);
    
    console.log('✅ PROPERTY UPDATE COMPLETE:', { 
      componentId: updatedComponent.id, 
      componentType: updatedComponent.type,
      path, 
      value,
      fullComponent: updatedComponent 
    });
  };

  // Fonction utilitaire pour le système de couleur WYSIWYG complet
  const renderAdvancedColorPicker = (
    property: string,
    label: string,
    defaultValue: string = '#3b82f6',
    includeOpacity: boolean = true
  ) => {
    const currentValue = property.startsWith('styles.') 
      ? localComponent?.styles?.[property.replace('styles.', '')] 
      : localComponent?.attributes?.[property.replace('attributes.', '')];
    
    return (
      <div className="space-y-3">
        <Label className="text-xs">{label}</Label>
        
        {/* Sélecteur de mode */}
        <div className="flex items-center justify-between mb-2">
          <Select value={colorType} onValueChange={setColorType}>
            <SelectTrigger className="w-32 h-7 text-xs">
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

        {/* Mode Solide */}
        {colorType === 'solid' && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                value={currentValue || defaultValue}
                onChange={(e) => updateProperty(property, e.target.value)}
                className="h-8 text-xs"
                placeholder={defaultValue}
              />
            </div>
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer flex items-center justify-center relative"
              style={{ backgroundColor: currentValue || defaultValue }}
            >
              <input
                type="color"
                value={currentValue || defaultValue}
                onChange={(e) => updateProperty(property, e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
              />
            </div>
          </div>
        )}

        {/* Mode Gradient */}
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
                    <SelectItem value="135deg">135°</SelectItem>
                    <SelectItem value="180deg">180°</SelectItem>
                    <SelectItem value="225deg">225°</SelectItem>
                    <SelectItem value="270deg">270°</SelectItem>
                    <SelectItem value="315deg">315°</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Couleurs du gradient</Label>
              {gradientSettings.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...gradientSettings.colors];
                        newColors[index] = e.target.value;
                        setGradientSettings({...gradientSettings, colors: newColors});
                        const gradientValue = `${gradientSettings.type}-gradient(${gradientSettings.angle}, ${newColors.join(', ')})`;
                        updateProperty(property, gradientValue);
                      }}
                      className="w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <Input 
                    value={color}
                    onChange={(e) => {
                      const newColors = [...gradientSettings.colors];
                      newColors[index] = e.target.value;
                      setGradientSettings({...gradientSettings, colors: newColors});
                      const gradientValue = `${gradientSettings.type}-gradient(${gradientSettings.angle}, ${newColors.join(', ')})`;
                      updateProperty(property, gradientValue);
                    }}
                    className="h-6 text-xs flex-1"
                  />
                  {gradientSettings.colors.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColors = gradientSettings.colors.filter((_, i) => i !== index);
                        setGradientSettings({...gradientSettings, colors: newColors});
                      }}
                      className="h-6 w-6 p-0 text-red-600"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newColors = [...gradientSettings.colors, '#ffffff'];
                  setGradientSettings({...gradientSettings, colors: newColors});
                }}
                className="w-full h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter couleur
              </Button>
            </div>
          </div>
        )}

        {/* Mode Image */}
        {colorType === 'image' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
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
                        console.log('🖼️ IMAGE FILE UPLOAD:', { property, imageUrl: imageUrl.substring(0, 50) + '...' });
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
              <span className="text-xs text-gray-500">ou URL :</span>
            </div>
            <Input
              value={currentValue?.replace('url(', '').replace(')', '') || ''}
              onChange={(e) => {
                const value = e.target.value;
                console.log('🖼️ IMAGE URL INPUT CHANGE:', { property, value, currentValue });
                if (value) {
                  updateProperty(property, value.startsWith('url(') ? value : `url(${value})`);
                } else {
                  updateProperty(property, '');
                }
              }}
              placeholder="https://example.com/image.jpg"
              className="text-xs"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Répétition</Label>
                <Select onValueChange={(val) => updateProperty(property.replace('background', 'backgroundRepeat'), val)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="repeat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repeat">Répéter</SelectItem>
                    <SelectItem value="no-repeat">Ne pas répéter</SelectItem>
                    <SelectItem value="repeat-x">Répéter X</SelectItem>
                    <SelectItem value="repeat-y">Répéter Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Taille</Label>
                <Select onValueChange={(val) => updateProperty(property.replace('background', 'backgroundSize'), val)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="cover" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="100% 100%">Étirer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Slider d'opacité */}
        {includeOpacity && (
          <div className="space-y-2">
            <Label className="text-xs">Opacité</Label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={opacityValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setOpacityValue(value);
                  updateProperty('styles.opacity', value / 100);
                }}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500 w-12">{opacityValue}%</span>
            </div>
          </div>
        )}
      </div>
    );
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
      <Accordion type="single" collapsible defaultValue={openSections.elements ? "elements" : ""} className="w-full">
        <AccordionItem value="elements">
          <AccordionTrigger className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Éléments de la page</span>
              <Badge variant="secondary" className="text-xs">
                {allComponents.length}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-3">
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
        </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  // Section 2: Propriétés CSS complètes
  const renderPropertiesSection = () => {
    if (!localComponent) return null;

    return (
      <Accordion type="single" collapsible defaultValue={openSections.properties ? "properties" : ""} className="w-full">
        <AccordionItem value="properties">
          <AccordionTrigger className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md cursor-pointer hover:bg-green-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Propriétés CSS</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-3">
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
        </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  // Section 3: Configuration spécifique au composant
  const renderConfigurationSection = () => {
    if (!localComponent) return null;

    return (
      <Accordion type="single" collapsible defaultValue={openSections.configuration ? "configuration" : ""} className="w-full">
        <AccordionItem value="configuration">
          <AccordionTrigger className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-md cursor-pointer hover:bg-purple-100 transition-colors">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-purple-900">Configuration</span>
              <Badge variant="outline" className="text-xs text-purple-600">
                {localComponent.type}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2 pb-4">
              {renderComponentSpecificConfiguration()}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
          <Label className="text-xs">Couleur du texte</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                value={localComponent?.styles?.color || '#000000'}
                onChange={(e) => updateProperty('styles.color', e.target.value)}
                className="h-8 text-xs"
                placeholder="#000000"
              />
            </div>
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer flex items-center justify-center relative"
              style={{ backgroundColor: localComponent?.styles?.color || '#000000' }}
            >
              <input
                type="color"
                value={localComponent?.styles?.color || '#000000'}
                onChange={(e) => updateProperty('styles.color', e.target.value)}
                className="w-full h-full opacity-0 cursor-pointer absolute inset-0"
              />
            </div>
          </div>
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
          <Label className="text-xs">Couleur de fond</Label>
          <div className="flex items-center justify-between mb-2">
            <Select value={colorType} onValueChange={setColorType}>
              <SelectTrigger className="w-32 h-7 text-xs">
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
                  value={localComponent?.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateProperty('styles.backgroundColor', e.target.value)}
                  className="h-8 text-xs"
                  placeholder="#ffffff"
                />
              </div>
              <div 
                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer flex items-center justify-center relative"
                style={{ backgroundColor: localComponent?.styles?.backgroundColor || '#ffffff' }}
              >
                <input
                  type="color"
                  value={localComponent?.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateProperty('styles.backgroundColor', e.target.value)}
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
              <div className="space-y-2">
                <Label className="text-xs">Couleurs du gradient</Label>
                {gradientSettings.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...gradientSettings.colors];
                          newColors[index] = e.target.value;
                          setGradientSettings({...gradientSettings, colors: newColors});
                          const gradientValue = `${gradientSettings.type}-gradient(${gradientSettings.angle}, ${newColors.join(', ')})`;
                          updateProperty('styles.backgroundColor', gradientValue);
                        }}
                        className="w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <Input 
                      value={color}
                      onChange={(e) => {
                        const newColors = [...gradientSettings.colors];
                        newColors[index] = e.target.value;
                        setGradientSettings({...gradientSettings, colors: newColors});
                      }}
                      className="h-6 text-xs flex-1"
                    />
                    {gradientSettings.colors.length > 2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          const newColors = gradientSettings.colors.filter((_, i) => i !== index);
                          setGradientSettings({...gradientSettings, colors: newColors});
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-xs"
                  onClick={() => setGradientSettings({...gradientSettings, colors: [...gradientSettings.colors, '#000000']})}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Ajouter couleur
                </Button>
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
                          updateProperty('styles.backgroundImage', `url(${imageUrl})`);
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <FileImage className="w-3 h-3 mr-1" />
                  Parcourir les images
                </Button>
              </div>
              <Input
                value={localComponent?.styles?.backgroundImage?.replace('url(', '').replace(')', '') || ''}
                onChange={(e) => updateProperty('styles.backgroundImage', `url(${e.target.value})`)}
                placeholder="URL de l'image"
                className="h-7 text-xs"
              />
            </div>
          )}
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

  // Configuration Flexbox avancée
  const renderFlexboxProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Flexbox Avancée</h4>
      
      {/* Presets de layout */}
      <div>
        <Label className="text-xs text-gray-600">Presets de layout</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'navigation');
              updateProperty('componentData.layout.direction', 'row');
              updateProperty('componentData.layout.justify', 'space-between');
              updateProperty('componentData.layout.align', 'center');
              updateProperty('componentData.layout.gap', '20px');
              updateProperty('componentData.container.padding', '16px 24px');
            }}
            className="text-xs"
          >
            🧭 Navigation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'gallery');
              updateProperty('componentData.layout.direction', 'row');
              updateProperty('componentData.layout.justify', 'flex-start');
              updateProperty('componentData.layout.wrap', 'wrap');
              updateProperty('componentData.layout.gap', '16px');
            }}
            className="text-xs"
          >
            🖼️ Galerie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'dashboard');
              updateProperty('componentData.layout.direction', 'row');
              updateProperty('componentData.layout.justify', 'space-evenly');
              updateProperty('componentData.layout.align', 'stretch');
              updateProperty('componentData.layout.gap', '24px');
            }}
            className="text-xs"
          >
            📊 Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'sidebar');
              updateProperty('componentData.layout.direction', 'column');
              updateProperty('componentData.layout.justify', 'flex-start');
              updateProperty('componentData.layout.align', 'stretch');
              updateProperty('componentData.layout.gap', '12px');
            }}
            className="text-xs"
          >
            📑 Sidebar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'header');
              updateProperty('componentData.layout.direction', 'row');
              updateProperty('componentData.layout.justify', 'space-between');
              updateProperty('componentData.layout.align', 'center');
              updateProperty('componentData.container.minHeight', '60px');
            }}
            className="text-xs"
          >
            📰 Header
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'cards');
              updateProperty('componentData.layout.direction', 'row');
              updateProperty('componentData.layout.justify', 'center');
              updateProperty('componentData.layout.wrap', 'wrap');
              updateProperty('componentData.layout.gap', '20px');
            }}
            className="text-xs"
          >
            🃏 Cartes
          </Button>
        </div>
      </div>

      {/* Configuration principale du layout */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Configuration principale</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Direction</Label>
            <Select
              value={localComponent?.componentData?.layout?.direction || 'row'}
              onValueChange={(value) => updateProperty('componentData.layout.direction', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">→ Ligne</SelectItem>
                <SelectItem value="column">↓ Colonne</SelectItem>
                <SelectItem value="row-reverse">← Ligne inversée</SelectItem>
                <SelectItem value="column-reverse">↑ Colonne inversée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Wrap</Label>
            <Select
              value={localComponent?.componentData?.layout?.wrap || 'nowrap'}
              onValueChange={(value) => updateProperty('componentData.layout.wrap', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nowrap">Pas de retour</SelectItem>
                <SelectItem value="wrap">Retour à la ligne</SelectItem>
                <SelectItem value="wrap-reverse">Retour inversé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Alignement */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Alignement</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Justify Content</Label>
            <Select
              value={localComponent?.componentData?.layout?.justify || 'flex-start'}
              onValueChange={(value) => updateProperty('componentData.layout.justify', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flex-start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="flex-end">Fin</SelectItem>
                <SelectItem value="space-between">Espacement entre</SelectItem>
                <SelectItem value="space-around">Espacement autour</SelectItem>
                <SelectItem value="space-evenly">Espacement équitable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Align Items</Label>
            <Select
              value={localComponent?.componentData?.layout?.align || 'stretch'}
              onValueChange={(value) => updateProperty('componentData.layout.align', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="flex-start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="flex-end">Fin</SelectItem>
                <SelectItem value="baseline">Ligne de base</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {localComponent?.componentData?.layout?.wrap === 'wrap' && (
          <div>
            <Label className="text-xs">Align Content</Label>
            <Select
              value={localComponent?.componentData?.layout?.alignContent || 'stretch'}
              onValueChange={(value) => updateProperty('componentData.layout.alignContent', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="flex-start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="flex-end">Fin</SelectItem>
                <SelectItem value="space-between">Espacement entre</SelectItem>
                <SelectItem value="space-around">Espacement autour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Espacement et Gap */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Espacement</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Gap</Label>
            <Input
              value={localComponent?.componentData?.layout?.gap || '16px'}
              onChange={(e) => updateProperty('componentData.layout.gap', e.target.value)}
              placeholder="16px, 1rem"
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              value={localComponent?.componentData?.container?.padding || '16px'}
              onChange={(e) => updateProperty('componentData.container.padding', e.target.value)}
              placeholder="16px, 1rem 2rem"
              className="mt-1 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Options du conteneur */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Style du conteneur</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="background"
              checked={localComponent?.componentData?.container?.background ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.container.background', checked)}
            />
            <Label htmlFor="background" className="text-xs">Fond</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="border"
              checked={localComponent?.componentData?.container?.border ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.container.border', checked)}
            />
            <Label htmlFor="border" className="text-xs">Bordure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rounded"
              checked={localComponent?.componentData?.container?.rounded ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.container.rounded', checked)}
            />
            <Label htmlFor="rounded" className="text-xs">Arrondi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shadow"
              checked={localComponent?.componentData?.container?.shadow ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.container.shadow', checked)}
            />
            <Label htmlFor="shadow" className="text-xs">Ombre</Label>
          </div>
        </div>
      </div>

      {/* Contraintes avancées */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Contraintes avancées</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Min Height</Label>
            <Input
              value={localComponent?.componentData?.container?.minHeight || 'auto'}
              onChange={(e) => updateProperty('componentData.container.minHeight', e.target.value)}
              placeholder="auto, 100px"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Max Width</Label>
            <Input
              value={localComponent?.componentData?.container?.maxWidth || '100%'}
              onChange={(e) => updateProperty('componentData.container.maxWidth', e.target.value)}
              placeholder="100%, 1200px"
              className="text-xs"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Overflow</Label>
          <Select
            value={localComponent?.componentData?.container?.overflow || 'visible'}
            onValueChange={(value) => updateProperty('componentData.container.overflow', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Masqué</SelectItem>
              <SelectItem value="scroll">Défilement</SelectItem>
              <SelectItem value="auto">Automatique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Propriétés par défaut des éléments */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Propriétés par défaut des éléments</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">Flex Grow</Label>
            <Input
              type="number"
              min="0"
              value={localComponent?.componentData?.itemDefaults?.flexGrow || '0'}
              onChange={(e) => updateProperty('componentData.itemDefaults.flexGrow', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Flex Shrink</Label>
            <Input
              type="number"
              min="0"
              value={localComponent?.componentData?.itemDefaults?.flexShrink || '1'}
              onChange={(e) => updateProperty('componentData.itemDefaults.flexShrink', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Flex Basis</Label>
            <Input
              value={localComponent?.componentData?.itemDefaults?.flexBasis || 'auto'}
              onChange={(e) => updateProperty('componentData.itemDefaults.flexBasis', e.target.value)}
              placeholder="auto, 100px"
              className="text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Align Self</Label>
            <Select
              value={localComponent?.componentData?.itemDefaults?.alignSelf || 'auto'}
              onValueChange={(value) => updateProperty('componentData.itemDefaults.alignSelf', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="flex-start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="flex-end">Fin</SelectItem>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="baseline">Ligne de base</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Order</Label>
            <Input
              type="number"
              value={localComponent?.componentData?.itemDefaults?.order || '0'}
              onChange={(e) => updateProperty('componentData.itemDefaults.order', e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Configuration responsive */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Configuration responsive</Label>
        <div className="space-y-2">
          <div>
            <Label className="text-xs">📱 Mobile</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={localComponent?.componentData?.responsive?.mobile?.direction || 'column'}
                onValueChange={(value) => updateProperty('componentData.responsive.mobile.direction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Ligne</SelectItem>
                  <SelectItem value="column">Colonne</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={localComponent?.componentData?.responsive?.mobile?.gap || '12px'}
                onChange={(e) => updateProperty('componentData.responsive.mobile.gap', e.target.value)}
                placeholder="Gap"
                className="text-xs"
              />
              <Input
                value={localComponent?.componentData?.responsive?.mobile?.padding || '12px'}
                onChange={(e) => updateProperty('componentData.responsive.mobile.padding', e.target.value)}
                placeholder="Padding"
                className="text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">📱 Tablet</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={localComponent?.componentData?.responsive?.tablet?.direction || 'row'}
                onValueChange={(value) => updateProperty('componentData.responsive.tablet.direction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Ligne</SelectItem>
                  <SelectItem value="column">Colonne</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={localComponent?.componentData?.responsive?.tablet?.gap || '14px'}
                onChange={(e) => updateProperty('componentData.responsive.tablet.gap', e.target.value)}
                placeholder="Gap"
                className="text-xs"
              />
              <Input
                value={localComponent?.componentData?.responsive?.tablet?.padding || '14px'}
                onChange={(e) => updateProperty('componentData.responsive.tablet.padding', e.target.value)}
                placeholder="Padding"
                className="text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">🖥️ Desktop</Label>
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={localComponent?.componentData?.responsive?.desktop?.direction || 'row'}
                onValueChange={(value) => updateProperty('componentData.responsive.desktop.direction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Ligne</SelectItem>
                  <SelectItem value="column">Colonne</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={localComponent?.componentData?.responsive?.desktop?.gap || '16px'}
                onChange={(e) => updateProperty('componentData.responsive.desktop.gap', e.target.value)}
                placeholder="Gap"
                className="text-xs"
              />
              <Input
                value={localComponent?.componentData?.responsive?.desktop?.padding || '16px'}
                onChange={(e) => updateProperty('componentData.responsive.desktop.padding', e.target.value)}
                placeholder="Padding"
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Outils et guides */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Outils et guides</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-guides"
              checked={localComponent?.componentData?.templates?.showGuides ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.templates.showGuides', checked)}
            />
            <Label htmlFor="show-guides" className="text-xs">Guides visuels</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="snap-to-grid"
              checked={localComponent?.componentData?.templates?.snapToGrid ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.templates.snapToGrid', checked)}
            />
            <Label htmlFor="snap-to-grid" className="text-xs">Snap to grid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-distribute"
              checked={localComponent?.componentData?.templates?.autoDistribute ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.templates.autoDistribute', checked)}
            />
            <Label htmlFor="auto-distribute" className="text-xs">Distribution auto</Label>
          </div>
        </div>
      </div>

      {/* Accessibilité */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-600">Accessibilité</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Role</Label>
            <Select
              value={localComponent?.componentData?.accessibility?.role || 'group'}
              onValueChange={(value) => updateProperty('componentData.accessibility.role', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="navigation">Navigation</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="landmark"
              checked={localComponent?.componentData?.accessibility?.landmark ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.accessibility.landmark', checked)}
            />
            <Label htmlFor="landmark" className="text-xs">Landmark</Label>
          </div>
        </div>
        <Input
          value={localComponent?.componentData?.accessibility?.ariaLabel || ''}
          onChange={(e) => updateProperty('componentData.accessibility.ariaLabel', e.target.value)}
          placeholder="Aria-label pour lecteurs d'écran"
          className="text-xs"
        />
      </div>

      {/* Preview en temps réel */}
      <div className="border rounded p-3 bg-gray-50">
        <Label className="text-xs text-gray-600 mb-2 block">Aperçu temps réel</Label>
        <div className="flex items-center justify-center py-2">
          <div
            className="border border-dashed border-gray-300 flex transition-all duration-200"
            style={{
              flexDirection: localComponent?.componentData?.layout?.direction || 'row',
              justifyContent: localComponent?.componentData?.layout?.justify || 'space-between',
              alignItems: localComponent?.componentData?.layout?.align || 'center',
              flexWrap: localComponent?.componentData?.layout?.wrap || 'nowrap',
              gap: localComponent?.componentData?.layout?.gap || '16px',
              padding: localComponent?.componentData?.container?.padding || '16px',
              backgroundColor: localComponent?.componentData?.container?.background ? '#f8fafc' : 'transparent',
              borderRadius: localComponent?.componentData?.container?.rounded ? '8px' : '0',
              boxShadow: localComponent?.componentData?.container?.shadow ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              minHeight: '60px',
              minWidth: '200px'
            }}
          >
            <div className="w-8 h-8 bg-blue-200 rounded flex-shrink-0"></div>
            <div className="w-12 h-8 bg-green-200 rounded flex-shrink-0"></div>
            <div className="w-8 h-8 bg-red-200 rounded flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Configuration CSS Grid avancée
  const renderGridProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration CSS Grid Avancée</h4>
      
      {/* Presets de layout */}
      <div>
        <Label className="text-xs text-gray-600">Presets de layout</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'dashboard');
              updateProperty('componentData.layout.columns', '200px 1fr');
              updateProperty('componentData.layout.rows', 'auto 1fr auto');
              updateProperty('componentData.layout.areas.enabled', true);
              updateProperty('componentData.layout.areas.template', [
                'header header',
                'sidebar main',
                'footer footer'
              ]);
            }}
            className="text-xs"
          >
            📊 Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'gallery');
              updateProperty('componentData.layout.columns', 'repeat(auto-fit, minmax(200px, 1fr))');
              updateProperty('componentData.layout.rows', 'auto');
              updateProperty('componentData.layout.autoFlow', 'row dense');
              updateProperty('componentData.layout.gap', '16px');
            }}
            className="text-xs"
          >
            🖼️ Galerie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'blog');
              updateProperty('componentData.layout.columns', '1fr 300px');
              updateProperty('componentData.layout.rows', 'auto 1fr auto');
              updateProperty('componentData.layout.areas.enabled', true);
              updateProperty('componentData.layout.areas.template', [
                'header header',
                'content sidebar',
                'footer footer'
              ]);
            }}
            className="text-xs"
          >
            📝 Blog
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'portfolio');
              updateProperty('componentData.layout.columns', 'repeat(4, 1fr)');
              updateProperty('componentData.layout.rows', 'repeat(3, 200px)');
              updateProperty('componentData.layout.gap', '20px');
              updateProperty('componentData.layout.dense', true);
            }}
            className="text-xs"
          >
            🎨 Portfolio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'magazine');
              updateProperty('componentData.layout.columns', 'repeat(6, 1fr)');
              updateProperty('componentData.layout.rows', 'auto auto 1fr auto');
              updateProperty('componentData.layout.areas.enabled', true);
              updateProperty('componentData.layout.areas.template', [
                'header header header header header header',
                'nav nav nav nav nav nav',
                'article article article article aside aside',
                'footer footer footer footer footer footer'
              ]);
            }}
            className="text-xs"
          >
            📰 Magazine
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'ecommerce');
              updateProperty('componentData.layout.columns', 'repeat(auto-fill, minmax(250px, 1fr))');
              updateProperty('componentData.layout.rows', 'auto');
              updateProperty('componentData.layout.gap', '24px');
              updateProperty('componentData.alignment.justifyItems', 'center');
            }}
            className="text-xs"
          >
            🛒 E-commerce
          </Button>
        </div>
      </div>

      {/* Configuration principale du layout */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Structure de la grille</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Colonnes</Label>
            <Input
              value={localComponent?.componentData?.layout?.columns || 'repeat(3, 1fr)'}
              onChange={(e) => updateProperty('componentData.layout.columns', e.target.value)}
              placeholder="repeat(3, 1fr), 200px 1fr, auto 1fr auto"
              className="mt-1 text-xs"
            />
            <div className="text-xs text-gray-500 mt-1">
              Exemples: repeat(3, 1fr), 200px 1fr, minmax(200px, 1fr)
            </div>
          </div>
          <div>
            <Label className="text-xs">Lignes</Label>
            <Input
              value={localComponent?.componentData?.layout?.rows || 'repeat(2, 1fr)'}
              onChange={(e) => updateProperty('componentData.layout.rows', e.target.value)}
              placeholder="auto 1fr auto, repeat(3, 200px)"
              className="mt-1 text-xs"
            />
            <div className="text-xs text-gray-500 mt-1">
              Exemples: auto 1fr auto, repeat(3, 200px), minmax(100px, auto)
            </div>
          </div>
        </div>
      </div>

      {/* Configuration des zones nommées */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-gray-600">Zones nommées (Grid Areas)</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enable-areas"
              checked={localComponent?.componentData?.layout?.areas?.enabled ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.layout.areas.enabled', checked)}
            />
            <Label htmlFor="enable-areas" className="text-xs">Activer</Label>
          </div>
        </div>
        
        {localComponent?.componentData?.layout?.areas?.enabled && (
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Template des zones</Label>
              <textarea
                value={localComponent?.componentData?.layout?.areas?.template?.join('\n') || ''}
                onChange={(e) => updateProperty('componentData.layout.areas.template', e.target.value.split('\n').filter(line => line.trim()))}
                placeholder={`header header header\nsidebar main main\nfooter footer footer`}
                className="w-full mt-1 text-xs border rounded p-2 font-mono"
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                Chaque ligne représente une ligne de la grille. Utilisez des noms pour définir les zones.
              </div>
            </div>
            
            {/* Zones prédéfinies */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateProperty('componentData.layout.areas.template', [
                    'header header',
                    'sidebar main',
                    'footer footer'
                  ]);
                }}
                className="text-xs"
              >
                Layout Sidebar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateProperty('componentData.layout.areas.template', [
                    'header header header',
                    'nav content aside',
                    'footer footer footer'
                  ]);
                }}
                className="text-xs"
              >
                Layout 3 colonnes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Espacement et Gap */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Espacement</Label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Gap global</Label>
            <Input
              value={localComponent?.componentData?.layout?.gap || '16px'}
              onChange={(e) => updateProperty('componentData.layout.gap', e.target.value)}
              placeholder="16px, 1rem"
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Gap colonnes</Label>
            <Input
              value={localComponent?.componentData?.layout?.columnGap || ''}
              onChange={(e) => updateProperty('componentData.layout.columnGap', e.target.value)}
              placeholder="16px"
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Gap lignes</Label>
            <Input
              value={localComponent?.componentData?.layout?.rowGap || ''}
              onChange={(e) => updateProperty('componentData.layout.rowGap', e.target.value)}
              placeholder="16px"
              className="mt-1 text-xs"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Padding conteneur</Label>
          <Input
            value={localComponent?.componentData?.container?.padding || '16px'}
            onChange={(e) => updateProperty('componentData.container.padding', e.target.value)}
            placeholder="16px, 1rem 2rem"
            className="mt-1 text-xs"
          />
        </div>
      </div>

      {/* Flux automatique */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Flux automatique</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Auto Flow</Label>
            <Select
              value={localComponent?.componentData?.layout?.autoFlow || 'row'}
              onValueChange={(value) => updateProperty('componentData.layout.autoFlow', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Ligne</SelectItem>
                <SelectItem value="column">Colonne</SelectItem>
                <SelectItem value="row dense">Ligne dense</SelectItem>
                <SelectItem value="column dense">Colonne dense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="dense"
              checked={localComponent?.componentData?.layout?.dense ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.layout.dense', checked)}
            />
            <Label htmlFor="dense" className="text-xs">Placement dense</Label>
          </div>
        </div>
      </div>

      {/* Alignement */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Alignement</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Justify Items</Label>
            <Select
              value={localComponent?.componentData?.alignment?.justifyItems || 'stretch'}
              onValueChange={(value) => updateProperty('componentData.alignment.justifyItems', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Fin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Align Items</Label>
            <Select
              value={localComponent?.componentData?.alignment?.alignItems || 'stretch'}
              onValueChange={(value) => updateProperty('componentData.alignment.alignItems', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Fin</SelectItem>
                <SelectItem value="baseline">Ligne de base</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Justify Content</Label>
            <Select
              value={localComponent?.componentData?.alignment?.justifyContent || 'start'}
              onValueChange={(value) => updateProperty('componentData.alignment.justifyContent', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Fin</SelectItem>
                <SelectItem value="space-between">Espacement entre</SelectItem>
                <SelectItem value="space-around">Espacement autour</SelectItem>
                <SelectItem value="space-evenly">Espacement équitable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Align Content</Label>
            <Select
              value={localComponent?.componentData?.alignment?.alignContent || 'start'}
              onValueChange={(value) => updateProperty('componentData.alignment.alignContent', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Fin</SelectItem>
                <SelectItem value="space-between">Espacement entre</SelectItem>
                <SelectItem value="space-around">Espacement autour</SelectItem>
                <SelectItem value="space-evenly">Espacement équitable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Propriétés par défaut des éléments */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Propriétés par défaut des éléments</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Justify Self</Label>
            <Select
              value={localComponent?.componentData?.itemDefaults?.justifySelf || 'stretch'}
              onValueChange={(value) => updateProperty('componentData.itemDefaults.justifySelf', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Fin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Align Self</Label>
            <Select
              value={localComponent?.componentData?.itemDefaults?.alignSelf || 'stretch'}
              onValueChange={(value) => updateProperty('componentData.itemDefaults.alignSelf', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stretch">Étirement</SelectItem>
                <SelectItem value="start">Début</SelectItem>
                <SelectItem value="center">Centre</SelectItem>
                <SelectItem value="end">Fin</SelectItem>
                <SelectItem value="baseline">Ligne de base</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Grid Column</Label>
            <Input
              value={localComponent?.componentData?.itemDefaults?.gridColumn || 'auto'}
              onChange={(e) => updateProperty('componentData.itemDefaults.gridColumn', e.target.value)}
              placeholder="auto, 1/3, span 2"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Grid Row</Label>
            <Input
              value={localComponent?.componentData?.itemDefaults?.gridRow || 'auto'}
              onChange={(e) => updateProperty('componentData.itemDefaults.gridRow', e.target.value)}
              placeholder="auto, 1/3, span 2"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Options du conteneur */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Style du conteneur</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grid-background"
              checked={localComponent?.componentData?.container?.background ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.container.background', checked)}
            />
            <Label htmlFor="grid-background" className="text-xs">Fond</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grid-border"
              checked={localComponent?.componentData?.container?.border ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.container.border', checked)}
            />
            <Label htmlFor="grid-border" className="text-xs">Bordure</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grid-rounded"
              checked={localComponent?.componentData?.container?.rounded ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.container.rounded', checked)}
            />
            <Label htmlFor="grid-rounded" className="text-xs">Arrondi</Label>
          </div>
        </div>
      </div>

      {/* Contraintes avancées */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Contraintes avancées</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Min Height</Label>
            <Input
              value={localComponent?.componentData?.container?.minHeight || '300px'}
              onChange={(e) => updateProperty('componentData.container.minHeight', e.target.value)}
              placeholder="300px, 50vh"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Max Width</Label>
            <Input
              value={localComponent?.componentData?.container?.maxWidth || '100%'}
              onChange={(e) => updateProperty('componentData.container.maxWidth', e.target.value)}
              placeholder="100%, 1200px"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Configuration responsive */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Configuration responsive</Label>
        <div className="space-y-2">
          <div>
            <Label className="text-xs">📱 Mobile</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={localComponent?.componentData?.responsive?.mobile?.columns || '1fr'}
                onChange={(e) => updateProperty('componentData.responsive.mobile.columns', e.target.value)}
                placeholder="Colonnes"
                className="text-xs"
              />
              <Input
                value={localComponent?.componentData?.responsive?.mobile?.gap || '12px'}
                onChange={(e) => updateProperty('componentData.responsive.mobile.gap', e.target.value)}
                placeholder="Gap"
                className="text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">📱 Tablet</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={localComponent?.componentData?.responsive?.tablet?.columns || 'repeat(2, 1fr)'}
                onChange={(e) => updateProperty('componentData.responsive.tablet.columns', e.target.value)}
                placeholder="Colonnes"
                className="text-xs"
              />
              <Input
                value={localComponent?.componentData?.responsive?.tablet?.gap || '14px'}
                onChange={(e) => updateProperty('componentData.responsive.tablet.gap', e.target.value)}
                placeholder="Gap"
                className="text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">🖥️ Desktop</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={localComponent?.componentData?.responsive?.desktop?.columns || 'repeat(3, 1fr)'}
                onChange={(e) => updateProperty('componentData.responsive.desktop.columns', e.target.value)}
                placeholder="Colonnes"
                className="text-xs"
              />
              <Input
                value={localComponent?.componentData?.responsive?.desktop?.gap || '16px'}
                onChange={(e) => updateProperty('componentData.responsive.desktop.gap', e.target.value)}
                placeholder="Gap"
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Options avancées */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Options avancées</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Colonnes implicites</Label>
            <Input
              value={localComponent?.componentData?.advanced?.implicit?.columns || 'auto'}
              onChange={(e) => updateProperty('componentData.advanced.implicit.columns', e.target.value)}
              placeholder="auto, 200px"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Lignes implicites</Label>
            <Input
              value={localComponent?.componentData?.advanced?.implicit?.rows || 'auto'}
              onChange={(e) => updateProperty('componentData.advanced.implicit.rows', e.target.value)}
              placeholder="auto, 100px"
              className="text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="subgrid"
              checked={localComponent?.componentData?.advanced?.subgrid ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.advanced.subgrid', checked)}
            />
            <Label htmlFor="subgrid" className="text-xs">Subgrid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-grid-lines"
              checked={localComponent?.componentData?.templates?.showGridLines ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.templates.showGridLines', checked)}
            />
            <Label htmlFor="show-grid-lines" className="text-xs">Grille visible</Label>
          </div>
        </div>
      </div>

      {/* Outils visuels */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Outils visuels</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-area-labels"
              checked={localComponent?.componentData?.templates?.showAreaLabels ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.templates.showAreaLabels', checked)}
            />
            <Label htmlFor="show-area-labels" className="text-xs">Labels zones</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="snap-to-grid-grid"
              checked={localComponent?.componentData?.templates?.snapToGrid ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.templates.snapToGrid', checked)}
            />
            <Label htmlFor="snap-to-grid-grid" className="text-xs">Snap to grid</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="visual-builder"
              checked={localComponent?.componentData?.templates?.visualBuilder ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.templates.visualBuilder', checked)}
            />
            <Label htmlFor="visual-builder" className="text-xs">Builder visuel</Label>
          </div>
        </div>
      </div>

      {/* Accessibilité */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-600">Accessibilité</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Role</Label>
            <Select
              value={localComponent?.componentData?.accessibility?.role || 'grid'}
              onValueChange={(value) => updateProperty('componentData.accessibility.role', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grid-role"
              checked={localComponent?.componentData?.accessibility?.gridRole ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.accessibility.gridRole', checked)}
            />
            <Label htmlFor="grid-role" className="text-xs">Grid ARIA</Label>
          </div>
        </div>
        <Input
          value={localComponent?.componentData?.accessibility?.ariaLabel || ''}
          onChange={(e) => updateProperty('componentData.accessibility.ariaLabel', e.target.value)}
          placeholder="Aria-label pour lecteurs d'écran"
          className="text-xs"
        />
      </div>

      {/* Preview en temps réel */}
      <div className="border rounded p-3 bg-gray-50">
        <Label className="text-xs text-gray-600 mb-2 block">Aperçu de la grille</Label>
        <div className="flex items-center justify-center py-2">
          <div
            className="border border-dashed border-gray-300 grid transition-all duration-200"
            style={{
              gridTemplateColumns: localComponent?.componentData?.layout?.columns || 'repeat(3, 1fr)',
              gridTemplateRows: localComponent?.componentData?.layout?.rows || 'repeat(2, 1fr)',
              gap: localComponent?.componentData?.layout?.gap || '16px',
              padding: localComponent?.componentData?.container?.padding || '16px',
              backgroundColor: localComponent?.componentData?.container?.background ? '#f8fafc' : 'transparent',
              borderRadius: localComponent?.componentData?.container?.rounded ? '8px' : '0',
              minHeight: '120px',
              minWidth: '200px',
              gridAutoFlow: localComponent?.componentData?.layout?.autoFlow || 'row'
            }}
          >
            <div className="bg-blue-200 rounded p-2 text-xs text-center">1</div>
            <div className="bg-green-200 rounded p-2 text-xs text-center">2</div>
            <div className="bg-red-200 rounded p-2 text-xs text-center">3</div>
            <div className="bg-yellow-200 rounded p-2 text-xs text-center">4</div>
            <div className="bg-purple-200 rounded p-2 text-xs text-center">5</div>
            <div className="bg-pink-200 rounded p-2 text-xs text-center">6</div>
          </div>
        </div>
        {localComponent?.componentData?.layout?.areas?.enabled && (
          <div className="mt-2 text-xs text-gray-500">
            <strong>Zones définies:</strong> {localComponent?.componentData?.layout?.areas?.template?.join(' | ') || 'Aucune'}
          </div>
        )}
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
      case 'text':
        return renderTextConfiguration();
      case 'heading':
        return renderHeadingConfiguration();
      case 'paragraph':
        return renderParagraphConfiguration();
      case 'navbar':
        return renderNavbarConfiguration();
      case 'footer':
        return renderFooterConfiguration();
      case 'hero':
        return renderHeroConfiguration();
      case 'features':
        return renderFeaturesConfiguration();
      case 'cta':
        return renderCtaConfiguration();
      case 'modal':
        return renderModalConfiguration();
      case 'tooltip':
        return renderTooltipConfiguration();
      case 'accordion':
        return renderAccordionConfiguration();
      case 'tabs':
        return renderTabsConfiguration();
      case 'timeline':
        return renderTimelineConfiguration();
      case 'card':
        return renderCardConfiguration();
      case 'badge':
        return renderBadgeConfiguration();
      case 'alert':
        return renderAlertConfiguration();
      case 'breadcrumb':
        return renderBreadcrumbConfiguration();
      case 'progress':
        return renderProgressConfiguration();
      case 'spinner':
        return renderSpinnerConfiguration();
      case 'divider':
        return renderDividerConfiguration();
      case 'spacer':
        return renderSpacerConfiguration();
      case 'container':
        return renderContainerConfiguration();
      case 'grid':
        return renderGridConfiguration();
      case 'flex':
        return renderFlexboxConfiguration();
      case 'flexbox':
        return renderFlexboxConfiguration();
      case 'sidebar':
        return renderSidebarConfiguration();
      case 'header':
        return renderHeaderConfiguration();
      case 'main':
        return renderMainConfiguration();
      case 'section':
        return renderSectionConfiguration();
      case 'article':
        return renderArticleConfiguration();
      case 'aside':
        return renderAsideConfiguration();
      case 'map':
        return renderMapConfiguration();
      case 'chart':
        return renderChartConfiguration();
      case 'calendar':
        return renderCalendarConfiguration();
      case 'input':
        return renderInputConfiguration();
      case 'textarea':
        return renderTextareaConfiguration();
      case 'select':
        return renderSelectConfiguration();
      case 'checkbox':
        return renderCheckboxConfiguration();
      case 'radio':
        return renderRadioConfiguration();
      case 'slider':
        return renderSliderConfiguration();
      case 'toggle':
        return renderToggleConfiguration();
      case 'search':
        return renderSearchConfiguration();
      case 'pagination':
        return renderPaginationConfiguration();
      case 'rating':
        return renderRatingConfiguration();
      case 'upload':
        return renderUploadConfiguration();
      case 'icon':
        return renderIconConfiguration();
      case 'gallery':
        return renderGalleryConfiguration();
      default:
        return renderGenericConfiguration();
    }
  };

  // Configuration du carrousel
  const renderCarouselConfiguration = () => {
    // Ne pas initialiser automatiquement - laisser vide selon l'architecture unifiée

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-purple-900">Configuration du Carrousel Unifié</h4>
        
        {/* Configuration des slides avec gestion unifiée */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="slides-management">
            <AccordionTrigger className="text-sm py-2">
              <div className="flex items-center justify-between w-full pr-4">
                <span>Gestion des slides (sous-éléments)</span>
                <Badge variant="outline" className="text-xs">
                  {(localComponent?.componentData?.slides || []).length} slides
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {(localComponent?.componentData?.slides || []).map((slide: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs font-medium text-blue-600">
                        carousel-slide-{index} (sous-élément)
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const slides = [...(localComponent?.componentData?.slides || [])];
                          slides.splice(index, 1);
                          updateProperty('componentData.slides', slides);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Image (backgroundImage)</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-2"
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
                                    const slides = [...(localComponent?.componentData?.slides || [])];
                                    slides[index] = { ...slide, image: imageUrl };
                                    console.log('🎠 CAROUSEL SLIDE IMAGE UNIFIED:', { slideIndex: index, imageUrl: imageUrl.substring(0, 50) + '...' });
                                    updateProperty('componentData.slides', slides);
                                    
                                    // Forcer la mise à jour de l'interface
                                    setTimeout(() => {
                                      const event = new CustomEvent('carousel-update', { 
                                        detail: { slides, componentId: localComponent?.id } 
                                      });
                                      window.dispatchEvent(event);
                                    }, 100);
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
                          <Input
                            value={slide.image || ''}
                            onChange={(e) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, image: e.target.value };
                              console.log('🎠 CAROUSEL IMAGE UPDATE UNIFIED:', { 
                                slideIndex: index, 
                                imageUrl: e.target.value,
                                allSlides: slides 
                              });
                              updateProperty('componentData.slides', slides);
                              
                              // Forcer la mise à jour de l'interface
                              setTimeout(() => {
                                const event = new CustomEvent('carousel-update', { 
                                  detail: { slides, componentId: localComponent?.id } 
                                });
                                window.dispatchEvent(event);
                              }, 100);
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="text-xs h-7"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Titre du slide</Label>
                        <Input
                          value={slide.title || ''}
                          onChange={(e) => {
                            const slides = [...(localComponent?.componentData?.slides || [])];
                            slides[index] = { ...slide, title: e.target.value };
                            updateProperty('componentData.slides', slides);
                          }}
                          placeholder="Titre du slide"
                          className="text-xs h-7"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          value={slide.description || ''}
                          onChange={(e) => {
                            const slides = [...(localComponent?.componentData?.slides || [])];
                            slides[index] = { ...slide, description: e.target.value };
                            updateProperty('componentData.slides', slides);
                          }}
                          placeholder="Description du slide"
                          className="text-xs resize-none"
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Couleur de fond</Label>
                          <Input
                            type="color"
                            value={slide.backgroundColor || '#3b82f6'}
                            onChange={(e) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, backgroundColor: e.target.value };
                              updateProperty('componentData.slides', slides);
                            }}
                            className="h-7 w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Couleur du texte</Label>
                          <Input
                            type="color"
                            value={slide.textColor || '#ffffff'}
                            onChange={(e) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, textColor: e.target.value };
                              updateProperty('componentData.slides', slides);
                            }}
                            className="h-7 w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Taille titre</Label>
                          <Select
                            value={slide.titleSize || '24px'}
                            onValueChange={(value) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, titleSize: value };
                              updateProperty('componentData.slides', slides);
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16px">16px</SelectItem>
                              <SelectItem value="20px">20px</SelectItem>
                              <SelectItem value="24px">24px</SelectItem>
                              <SelectItem value="32px">32px</SelectItem>
                              <SelectItem value="40px">40px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Position texte</Label>
                          <Select
                            value={slide.textPosition || 'center'}
                            onValueChange={(value) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, textPosition: value };
                              updateProperty('componentData.slides', slides);
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="center">Centre</SelectItem>
                              <SelectItem value="top">Haut</SelectItem>
                              <SelectItem value="bottom">Bas</SelectItem>
                              <SelectItem value="left">Gauche</SelectItem>
                              <SelectItem value="right">Droite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Bouton/Lien (optionnel)</Label>
                        <div className="space-y-2">
                          <Input
                            value={slide.buttonText || ''}
                            onChange={(e) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, buttonText: e.target.value };
                              updateProperty('componentData.slides', slides);
                            }}
                            placeholder="Texte du bouton"
                            className="text-xs h-7"
                          />
                          <Input
                            value={slide.buttonLink || ''}
                            onChange={(e) => {
                              const slides = [...(localComponent?.componentData?.slides || [])];
                              slides[index] = { ...slide, buttonLink: e.target.value };
                              updateProperty('componentData.slides', slides);
                            }}
                            placeholder="https://example.com"
                            className="text-xs h-7"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Bouton toujours visible pour ajouter des slides */}
                <div className="pt-2 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentSlides = localComponent?.componentData?.slides || [];
                      const newIndex = currentSlides.length;
                      const newSlide = { 
                        image: '', 
                        title: `Slide ${newIndex + 1}`,
                        description: `Description du slide ${newIndex + 1}`,
                        buttonText: '',
                        buttonLink: '#',
                        backgroundColor: '#3b82f6',
                        textColor: '#ffffff',
                        titleSize: '24px',
                        textPosition: 'center'
                      };
                      const updatedSlides = [...currentSlides, newSlide];
                      updateProperty('componentData.slides', updatedSlides);
                      
                      // Forcer la mise à jour de l'interface
                      setTimeout(() => {
                        const event = new CustomEvent('carousel-slides-updated', { 
                          detail: { slides: updatedSlides, componentId: localComponent?.id } 
                        });
                        window.dispatchEvent(event);
                      }, 100);
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un slide ({(localComponent?.componentData?.slides || []).length})
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {/* Configuration du comportement */}
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
            checked={localComponent?.componentData?.showDots ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showDots', checked)}
          />
          <Label htmlFor="showDots" className="text-xs">Afficher les points</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showArrows"
            checked={localComponent?.componentData?.showArrows ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showArrows', checked)}
          />
          <Label htmlFor="showArrows" className="text-xs">Afficher les flèches</Label>
        </div>
      </div>

      {/* Outils WYSIWYG pour le carrousel unifié */}
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle du carrousel</h5>
        
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan du carrousel', '#ffffff')}
        {renderAdvancedColorPicker('styles.--carousel-dot-color', 'Couleur des indicateurs', '#cbd5e0')}
        {renderAdvancedColorPicker('styles.--carousel-arrow-color', 'Couleur des flèches', '#4a5568')}
        
        <div>
          <Label className="text-xs">Transition</Label>
          <Select 
            value={localComponent?.styles?.transition || 'all 0.3s ease'} 
            onValueChange={(value) => updateProperty('styles.transition', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all 0.3s ease">Fluide (0.3s)</SelectItem>
              <SelectItem value="all 0.5s ease">Normal (0.5s)</SelectItem>
              <SelectItem value="all 0.8s ease">Lente (0.8s)</SelectItem>
              <SelectItem value="all 0.2s ease-in-out">Rapide</SelectItem>
              <SelectItem value="all 1s cubic-bezier(0.4, 0, 0.2, 1)">Personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs">Ombre du carrousel</Label>
          <Select 
            value={localComponent?.styles?.boxShadow || 'none'} 
            onValueChange={(value) => updateProperty('styles.boxShadow', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              <SelectItem value="0 2px 8px rgba(0, 0, 0, 0.1)">Légère</SelectItem>
              <SelectItem value="0 4px 12px rgba(0, 0, 0, 0.15)">Normale</SelectItem>
              <SelectItem value="0 8px 25px rgba(0, 0, 0, 0.15)">Forte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
  };

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
      
      {/* Outils WYSIWYG pour le bouton */}
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        
        {renderAdvancedColorPicker('styles.backgroundColor', 'Couleur du bouton', '#3b82f6')}
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#ffffff')}
        
        <div>
          <Label className="text-xs">Ombre du bouton</Label>
          <Select 
            value={localComponent?.styles?.boxShadow || 'none'} 
            onValueChange={(value) => updateProperty('styles.boxShadow', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              <SelectItem value="0 1px 3px rgba(0, 0, 0, 0.1)">Légère</SelectItem>
              <SelectItem value="0 4px 12px rgba(0, 0, 0, 0.15)">Normale</SelectItem>
              <SelectItem value="0 8px 25px rgba(0, 0, 0, 0.15)">Forte</SelectItem>
              <SelectItem value="0 0 0 3px rgba(59, 130, 246, 0.5)">Focus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Configuration de l'image
  const renderImageConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de l'Image</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Source de l'image</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
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
                      console.log('🖼️ IMAGE FILE UPLOAD for SRC:', { imageUrl: imageUrl.substring(0, 50) + '...' });
                      updateProperty('attributes.src', imageUrl);
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
            <span className="text-xs text-gray-500">ou saisir une URL :</span>
          </div>
          <Input
            value={localComponent?.attributes?.src || ''}
            onChange={(e) => {
              console.log('🖼️ IMAGE SRC INPUT CHANGE:', { value: e.target.value, currentSrc: localComponent?.attributes?.src });
              updateProperty('attributes.src', e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
            className="text-sm"
          />
        </div>
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
          checked={localComponent?.componentData?.responsive ?? false}
          onCheckedChange={(checked) => updateProperty('componentData.responsive', checked)}
        />
        <Label htmlFor="responsive" className="text-xs">Image responsive</Label>
      </div>
      
      {/* Outils WYSIWYG pour l'image */}
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        
        {renderAdvancedColorPicker('styles.borderColor', 'Couleur de bordure', '#cccccc')}
        
        <div>
          <Label className="text-xs">Style de bordure</Label>
          <Input
            value={localComponent?.styles?.border || ''}
            onChange={(e) => updateProperty('styles.border', e.target.value)}
            className="h-8 text-xs"
            placeholder="1px solid #ccc"
          />
        </div>
        
        <div>
          <Label className="text-xs">Rayon de bordure</Label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={parseInt(localComponent?.styles?.borderRadius?.replace('px', '') || '0')}
              onChange={(e) => updateProperty('styles.borderRadius', `${e.target.value}px`)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-12">{localComponent?.styles?.borderRadius || '0px'}</span>
          </div>
        </div>
        
        <div>
          <Label className="text-xs">Filtre d'image</Label>
          <Select 
            value={localComponent?.styles?.filter || 'none'} 
            onValueChange={(value) => updateProperty('styles.filter', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              <SelectItem value="blur(2px)">Flou</SelectItem>
              <SelectItem value="brightness(1.2)">Plus lumineux</SelectItem>
              <SelectItem value="brightness(0.8)">Plus sombre</SelectItem>
              <SelectItem value="contrast(1.5)">Plus de contraste</SelectItem>
              <SelectItem value="grayscale(100%)">Noir et blanc</SelectItem>
              <SelectItem value="sepia(100%)">Sépia</SelectItem>
              <SelectItem value="saturate(1.5)">Plus saturé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan de l\'image', 'transparent', false)}
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
            checked={localComponent?.componentData?.striped ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.striped', checked)}
          />
          <Label htmlFor="striped" className="text-xs">Lignes alternées</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bordered"
            checked={localComponent?.componentData?.bordered ?? false}
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
            checked={localComponent?.attributes?.controls ?? false}
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
          checked={localComponent?.attributes?.controls ?? false}
          onCheckedChange={(checked) => updateProperty('attributes.controls', checked)}
        />
        <Label htmlFor="controls-audio" className="text-xs">Contrôles</Label>
      </div>
    </div>
  );

  // Configuration lien
  const renderLinkConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Link Avancée</h4>
      
      {/* Presets rapides */}
      <div>
        <Label className="text-xs text-gray-600">Types de liens prédéfinis</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'external');
              updateProperty('componentData.linkType', 'url');
              updateProperty('componentData.target', '_blank');
              updateProperty('componentData.rel', 'noopener noreferrer');
              updateProperty('componentData.icon.show', true);
              updateProperty('componentData.icon.type', 'external');
            }}
            className="text-xs"
          >
            🌐 Externe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'internal');
              updateProperty('componentData.linkType', 'internal');
              updateProperty('componentData.target', '_self');
              updateProperty('componentData.rel', '');
              updateProperty('componentData.icon.show', false);
            }}
            className="text-xs"
          >
            🏠 Interne
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'email');
              updateProperty('componentData.linkType', 'email');
              updateProperty('componentData.href', 'mailto:');
              updateProperty('componentData.icon.show', true);
              updateProperty('componentData.icon.type', 'mail');
            }}
            className="text-xs"
          >
            📧 Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'phone');
              updateProperty('componentData.linkType', 'phone');
              updateProperty('componentData.href', 'tel:');
              updateProperty('componentData.icon.show', true);
              updateProperty('componentData.icon.type', 'phone');
            }}
            className="text-xs"
          >
            📞 Téléphone
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'download');
              updateProperty('componentData.linkType', 'download');
              updateProperty('componentData.attributes.download', true);
              updateProperty('componentData.icon.show', true);
              updateProperty('componentData.icon.type', 'download');
            }}
            className="text-xs"
          >
            📥 Téléchargement
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'social');
              updateProperty('componentData.linkType', 'social');
              updateProperty('componentData.styling.variant', 'button');
              updateProperty('componentData.icon.show', true);
            }}
            className="text-xs"
          >
            📱 Social
          </Button>
        </div>
      </div>

      {/* Configuration de base */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-600">Texte du lien</Label>
          <Input
            value={localComponent?.componentData?.text || ''}
            onChange={(e) => updateProperty('componentData.text', e.target.value)}
            placeholder="Texte affiché..."
            className="mt-1 text-sm"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600">URL ou lien</Label>
          <Input
            value={localComponent?.componentData?.href || ''}
            onChange={(e) => {
              updateProperty('componentData.href', e.target.value);
              updateProperty('attributes.href', e.target.value);
            }}
            placeholder={
              localComponent?.componentData?.linkType === 'email' ? 'mailto:contact@example.com' :
              localComponent?.componentData?.linkType === 'phone' ? 'tel:+33123456789' :
              'https://example.com'
            }
            className="mt-1 text-sm"
          />
          {localComponent?.componentData?.validation?.autoValidate && (
            <div className="mt-1 text-xs text-gray-500">
              {localComponent?.componentData?.href ? (
                localComponent?.componentData?.href.startsWith('http') || 
                localComponent?.componentData?.href.startsWith('mailto:') || 
                localComponent?.componentData?.href.startsWith('tel:') ? 
                  <span className="text-green-600">✓ URL valide</span> : 
                  <span className="text-orange-600">⚠ Format d'URL à vérifier</span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Style de lien */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Style de lien</Label>
          <Select
            value={localComponent?.componentData?.styling?.variant || 'link'}
            onValueChange={(value) => updateProperty('componentData.styling.variant', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="link">Lien classique</SelectItem>
              <SelectItem value="button">Bouton</SelectItem>
              <SelectItem value="badge">Badge</SelectItem>
              <SelectItem value="card">Carte cliquable</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={localComponent?.componentData?.styling?.size || 'medium'}
            onValueChange={(value) => updateProperty('componentData.styling.size', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petit</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="large">Grand</SelectItem>
              <SelectItem value="xl">Extra grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Couleurs personnalisées */}
      <div>
        <Label className="text-xs text-gray-600">Couleurs</Label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <Label className="text-xs">Normal</Label>
            <Input
              type="color"
              value={localComponent?.componentData?.styling?.color || '#3b82f6'}
              onChange={(e) => updateProperty('componentData.styling.color', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Hover</Label>
            <Input
              type="color"
              value={localComponent?.componentData?.styling?.hoverColor || '#2563eb'}
              onChange={(e) => updateProperty('componentData.styling.hoverColor', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Visité</Label>
            <Input
              type="color"
              value={localComponent?.componentData?.styling?.visitedColor || '#7c3aed'}
              onChange={(e) => updateProperty('componentData.styling.visitedColor', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Actif</Label>
            <Input
              type="color"
              value={localComponent?.componentData?.styling?.activeColor || '#1d4ed8'}
              onChange={(e) => updateProperty('componentData.styling.activeColor', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
        </div>
      </div>

      {/* Décoration et poids */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Décoration</Label>
          <Select
            value={localComponent?.componentData?.styling?.decoration || 'underline'}
            onValueChange={(value) => updateProperty('componentData.styling.decoration', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              <SelectItem value="underline">Souligné</SelectItem>
              <SelectItem value="overline">Ligne au-dessus</SelectItem>
              <SelectItem value="line-through">Barré</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Épaisseur</Label>
          <Select
            value={localComponent?.componentData?.styling?.weight || 'normal'}
            onValueChange={(value) => updateProperty('componentData.styling.weight', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Léger</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="semibold">Semi-gras</SelectItem>
              <SelectItem value="bold">Gras</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Configuration des icônes */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-icon"
            checked={localComponent?.componentData?.icon?.show ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.icon.show', checked)}
          />
          <Label htmlFor="show-icon" className="text-xs">Afficher une icône</Label>
        </div>
        
        {localComponent?.componentData?.icon?.show && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Position</Label>
                <Select
                  value={localComponent?.componentData?.icon?.position || 'left'}
                  onValueChange={(value) => updateProperty('componentData.icon.position', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Gauche</SelectItem>
                    <SelectItem value="right">Droite</SelectItem>
                    <SelectItem value="top">Haut</SelectItem>
                    <SelectItem value="bottom">Bas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={localComponent?.componentData?.icon?.type || 'external'}
                  onValueChange={(value) => updateProperty('componentData.icon.type', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">🌐 Externe</SelectItem>
                    <SelectItem value="mail">📧 Email</SelectItem>
                    <SelectItem value="phone">📞 Téléphone</SelectItem>
                    <SelectItem value="download">📥 Téléchargement</SelectItem>
                    <SelectItem value="arrow">➡️ Flèche</SelectItem>
                    <SelectItem value="share">🔗 Partage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Taille</Label>
                <Select
                  value={localComponent?.componentData?.icon?.size || '16px'}
                  onValueChange={(value) => updateProperty('componentData.icon.size', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="14px">14px</SelectItem>
                    <SelectItem value="16px">16px</SelectItem>
                    <SelectItem value="20px">20px</SelectItem>
                    <SelectItem value="24px">24px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comportement du lien */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Cible</Label>
          <Select
            value={localComponent?.componentData?.target || '_blank'}
            onValueChange={(value) => {
              updateProperty('componentData.target', value);
              updateProperty('attributes.target', value);
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_self">Même onglet</SelectItem>
              <SelectItem value="_blank">Nouvel onglet</SelectItem>
              <SelectItem value="_parent">Fenêtre parent</SelectItem>
              <SelectItem value="_top">Fenêtre principale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Attribut Rel</Label>
          <Select
            value={localComponent?.componentData?.rel || 'noopener noreferrer'}
            onValueChange={(value) => {
              updateProperty('componentData.rel', value);
              updateProperty('attributes.rel', value);
            }}
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
              <SelectItem value="sponsored">Sponsored</SelectItem>
              <SelectItem value="ugc">UGC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Validation automatique */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Validation et sécurité</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-validate"
              checked={localComponent?.componentData?.validation?.autoValidate ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.validation.autoValidate', checked)}
            />
            <Label htmlFor="auto-validate" className="text-xs">Validation auto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-status"
              checked={localComponent?.componentData?.validation?.showStatus ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.validation.showStatus', checked)}
            />
            <Label htmlFor="show-status" className="text-xs">Afficher statut</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="require-https"
              checked={localComponent?.componentData?.validation?.requireHttps ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.validation.requireHttps', checked)}
            />
            <Label htmlFor="require-https" className="text-xs">Exiger HTTPS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="track-clicks"
              checked={localComponent?.componentData?.analytics?.trackClicks ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.analytics.trackClicks', checked)}
            />
            <Label htmlFor="track-clicks" className="text-xs">Suivi des clics</Label>
          </div>
        </div>
      </div>

      {/* Paramètres UTM (Analytics) */}
      {localComponent?.componentData?.analytics?.trackClicks && (
        <div className="space-y-3">
          <Label className="text-xs text-gray-600">Paramètres de suivi UTM</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={localComponent?.componentData?.analytics?.utmSource || ''}
              onChange={(e) => updateProperty('componentData.analytics.utmSource', e.target.value)}
              placeholder="utm_source"
              className="text-xs"
            />
            <Input
              value={localComponent?.componentData?.analytics?.utmMedium || ''}
              onChange={(e) => updateProperty('componentData.analytics.utmMedium', e.target.value)}
              placeholder="utm_medium"
              className="text-xs"
            />
            <Input
              value={localComponent?.componentData?.analytics?.utmCampaign || ''}
              onChange={(e) => updateProperty('componentData.analytics.utmCampaign', e.target.value)}
              placeholder="utm_campaign"
              className="text-xs"
            />
            <Input
              value={localComponent?.componentData?.analytics?.utmContent || ''}
              onChange={(e) => updateProperty('componentData.analytics.utmContent', e.target.value)}
              placeholder="utm_content"
              className="text-xs"
            />
          </div>
        </div>
      )}

      {/* Accessibilité */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Accessibilité</Label>
        <div className="space-y-2">
          <Input
            value={localComponent?.componentData?.accessibility?.ariaLabel || ''}
            onChange={(e) => updateProperty('componentData.accessibility.ariaLabel', e.target.value)}
            placeholder="Aria-label pour lecteurs d'écran"
            className="text-xs"
          />
          <Input
            value={localComponent?.componentData?.accessibility?.title || ''}
            onChange={(e) => updateProperty('componentData.accessibility.title', e.target.value)}
            placeholder="Titre (tooltip au survol)"
            className="text-xs"
          />
          {localComponent?.componentData?.linkType === 'download' && (
            <Input
              value={localComponent?.componentData?.accessibility?.downloadFileName || ''}
              onChange={(e) => updateProperty('componentData.accessibility.downloadFileName', e.target.value)}
              placeholder="Nom de fichier suggéré"
              className="text-xs"
            />
          )}
        </div>
      </div>

      {/* Configuration responsive */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Configuration responsive</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">📱 Mobile</Label>
            <Input
              value={localComponent?.componentData?.responsive?.mobile?.fontSize || '14px'}
              onChange={(e) => updateProperty('componentData.responsive.mobile.fontSize', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">📱 Tablet</Label>
            <Input
              value={localComponent?.componentData?.responsive?.tablet?.fontSize || '16px'}
              onChange={(e) => updateProperty('componentData.responsive.tablet.fontSize', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">🖥️ Desktop</Label>
            <Input
              value={localComponent?.componentData?.responsive?.desktop?.fontSize || '16px'}
              onChange={(e) => updateProperty('componentData.responsive.desktop.fontSize', e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Preview en temps réel */}
      <div className="border rounded p-3 bg-gray-50">
        <Label className="text-xs text-gray-600 mb-2 block">Aperçu temps réel</Label>
        <div className="flex items-center justify-center py-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1 transition-colors duration-200"
            style={{
              color: localComponent?.componentData?.styling?.color || '#3b82f6',
              textDecoration: localComponent?.componentData?.styling?.decoration || 'underline',
              fontWeight: localComponent?.componentData?.styling?.weight || 'normal',
              fontSize: localComponent?.componentData?.styling?.size === 'small' ? '14px' :
                       localComponent?.componentData?.styling?.size === 'large' ? '18px' :
                       localComponent?.componentData?.styling?.size === 'xl' ? '20px' : '16px'
            }}
          >
            {localComponent?.componentData?.icon?.show && localComponent?.componentData?.icon?.position === 'left' && (
              <span style={{ fontSize: localComponent?.componentData?.icon?.size || '16px' }}>
                {localComponent?.componentData?.icon?.type === 'external' ? '🌐' :
                 localComponent?.componentData?.icon?.type === 'mail' ? '📧' :
                 localComponent?.componentData?.icon?.type === 'phone' ? '📞' :
                 localComponent?.componentData?.icon?.type === 'download' ? '📥' :
                 localComponent?.componentData?.icon?.type === 'arrow' ? '➡️' :
                 localComponent?.componentData?.icon?.type === 'share' ? '🔗' : '🌐'}
              </span>
            )}
            {localComponent?.componentData?.text || 'Lien d\'exemple'}
            {localComponent?.componentData?.icon?.show && localComponent?.componentData?.icon?.position === 'right' && (
              <span style={{ fontSize: localComponent?.componentData?.icon?.size || '16px' }}>
                {localComponent?.componentData?.icon?.type === 'external' ? '🌐' :
                 localComponent?.componentData?.icon?.type === 'mail' ? '📧' :
                 localComponent?.componentData?.icon?.type === 'phone' ? '📞' :
                 localComponent?.componentData?.icon?.type === 'download' ? '📥' :
                 localComponent?.componentData?.icon?.type === 'arrow' ? '➡️' :
                 localComponent?.componentData?.icon?.type === 'share' ? '🔗' : '🌐'}
              </span>
            )}
          </a>
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
      
      {/* Outils WYSIWYG complets */}
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan', 'transparent')}
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#000000')}
        {renderAdvancedColorPicker('styles.borderColor', 'Couleur de bordure', '#cccccc', false)}
        
        <div>
          <Label className="text-xs">Ombre</Label>
          <Select 
            value={localComponent?.styles?.boxShadow || 'none'} 
            onValueChange={(value) => updateProperty('styles.boxShadow', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              <SelectItem value="0 1px 3px rgba(0, 0, 0, 0.1)">Légère</SelectItem>
              <SelectItem value="0 4px 12px rgba(0, 0, 0, 0.15)">Normale</SelectItem>
              <SelectItem value="0 8px 25px rgba(0, 0, 0, 0.15)">Forte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Configuration pour tous les autres composants avec outils WYSIWYG complets
  const renderNavbarConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de la Navbar</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Logo/Titre</Label>
        <Input
          value={localComponent?.componentData?.brand || 'Mon Site'}
          onChange={(e) => updateProperty('componentData.brand', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Nom de votre site"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Items de menu (séparés par des virgules)</Label>
        <Input
          value={localComponent?.componentData?.menuItems?.join(', ') || 'Accueil, À propos, Services, Contact'}
          onChange={(e) => updateProperty('componentData.menuItems', e.target.value.split(',').map(item => item.trim()))}
          className="mt-1 text-sm"
          placeholder="Accueil, À propos, Services, Contact"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="sticky"
          checked={localComponent?.componentData?.sticky ?? false}
          onCheckedChange={(checked) => updateProperty('componentData.sticky', checked)}
        />
        <Label htmlFor="sticky" className="text-xs">Navigation collante</Label>
      </div>
      
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan navbar', '#ffffff')}
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#000000')}
        {renderAdvancedColorPicker('styles.borderColor', 'Couleur de bordure', '#e5e5e5', false)}
      </div>
    </div>
  );



  const renderHeroConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Hero</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre principal</Label>
        <Input
          value={localComponent?.componentData?.title || 'Bienvenue sur notre site'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Votre titre accrocheur"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Sous-titre</Label>
        <Textarea
          value={localComponent?.componentData?.subtitle || 'Description captivante de votre produit ou service'}
          onChange={(e) => updateProperty('componentData.subtitle', e.target.value)}
          className="mt-1 text-sm resize-none"
          rows={2}
          placeholder="Description de votre offre"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Texte du bouton</Label>
          <Input
            value={localComponent?.componentData?.buttonText || 'Commencer'}
            onChange={(e) => updateProperty('componentData.buttonText', e.target.value)}
            className="text-sm"
            placeholder="Call to action"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lien du bouton</Label>
          <Input
            value={localComponent?.componentData?.buttonLink || '#'}
            onChange={(e) => updateProperty('componentData.buttonLink', e.target.value)}
            className="text-sm"
            placeholder="https://..."
          />
        </div>
      </div>
      
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan hero', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')}
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#ffffff')}
      </div>
    </div>
  );

  const renderCardConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de la Carte</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de la carte</Label>
        <Input
          value={localComponent?.componentData?.title || 'Titre de la carte'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Titre..."
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Contenu</Label>
        <Textarea
          value={localComponent?.componentData?.content || 'Contenu de la carte'}
          onChange={(e) => updateProperty('componentData.content', e.target.value)}
          className="mt-1 text-sm resize-none"
          rows={3}
          placeholder="Description de la carte..."
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Image de la carte</Label>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
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
                    updateProperty('componentData.image', imageUrl);
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
          <span className="text-xs text-gray-500">ou URL :</span>
        </div>
        <Input
          value={localComponent?.componentData?.image || ''}
          onChange={(e) => updateProperty('componentData.image', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1 text-xs"
        />
      </div>
      
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan carte', '#ffffff')}
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#333333')}
        {renderAdvancedColorPicker('styles.borderColor', 'Couleur de bordure', '#e5e5e5', false)}
        
        <div>
          <Label className="text-xs">Ombre de la carte</Label>
          <Select 
            value={localComponent?.styles?.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)'} 
            onValueChange={(value) => updateProperty('styles.boxShadow', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune</SelectItem>
              <SelectItem value="0 2px 8px rgba(0, 0, 0, 0.1)">Légère</SelectItem>
              <SelectItem value="0 4px 12px rgba(0, 0, 0, 0.15)">Normale</SelectItem>
              <SelectItem value="0 8px 25px rgba(0, 0, 0, 0.15)">Forte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderTextConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Texte</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Contenu du texte</Label>
        <Textarea
          value={localComponent?.content || 'Votre texte ici...'}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm resize-none"
          rows={4}
          placeholder="Saisissez votre texte..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Taille de police</Label>
          <Select value={localComponent?.styles?.fontSize || '16px'} onValueChange={(value) => updateProperty('styles.fontSize', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select value={localComponent?.styles?.textAlign || 'left'} onValueChange={(value) => updateProperty('styles.textAlign', value)}>
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
      </div>
      
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#000000')}
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan', 'transparent')}
        
        <div>
          <Label className="text-xs">Style de police</Label>
          <Select 
            value={localComponent?.styles?.fontWeight || 'normal'} 
            onValueChange={(value) => updateProperty('styles.fontWeight', value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Gras</SelectItem>
              <SelectItem value="lighter">Léger</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderHeadingConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Titre</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Texte du titre</Label>
        <Input
          value={localComponent?.content || 'Votre titre'}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Titre principal..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Niveau de titre</Label>
          <Select value={localComponent?.attributes?.tag || 'h2'} onValueChange={(value) => updateProperty('attributes.tag', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1 - Principal</SelectItem>
              <SelectItem value="h2">H2 - Section</SelectItem>
              <SelectItem value="h3">H3 - Sous-section</SelectItem>
              <SelectItem value="h4">H4 - Détail</SelectItem>
              <SelectItem value="h5">H5 - Mineur</SelectItem>
              <SelectItem value="h6">H6 - Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select value={localComponent?.styles?.textAlign || 'left'} onValueChange={(value) => updateProperty('styles.textAlign', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Gauche</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="right">Droite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        {renderAdvancedColorPicker('styles.color', 'Couleur du titre', '#1a1a1a')}
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan', 'transparent')}
      </div>
    </div>
  );

  const renderParagraphConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Paragraphe</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Contenu du paragraphe</Label>
        <Textarea
          value={localComponent?.content || 'Votre paragraphe...'}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm resize-none"
          rows={5}
          placeholder="Rédigez votre paragraphe ici..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Interligne</Label>
          <Select value={localComponent?.styles?.lineHeight || '1.6'} onValueChange={(value) => updateProperty('styles.lineHeight', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Serré</SelectItem>
              <SelectItem value="1.2">Compact</SelectItem>
              <SelectItem value="1.4">Normal</SelectItem>
              <SelectItem value="1.6">Aéré</SelectItem>
              <SelectItem value="2">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Justification</Label>
          <Select value={localComponent?.styles?.textAlign || 'left'} onValueChange={(value) => updateProperty('styles.textAlign', value)}>
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
      </div>
      
      <div className="space-y-3 pt-3 border-t">
        <h5 className="text-sm font-semibold text-gray-700">Personnalisation visuelle</h5>
        {renderAdvancedColorPicker('styles.color', 'Couleur du texte', '#333333')}
        {renderAdvancedColorPicker('styles.backgroundColor', 'Arrière-plan', 'transparent')}
      </div>
    </div>
  );

  // Configurations spécialisées pour chaque type de composant
  const renderGridConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de la Grille</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Colonnes</Label>
          <Select
            value={String(localComponent?.componentData?.columns || 2)}
            onValueChange={(value) => updateProperty('componentData.columns', parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 colonne</SelectItem>
              <SelectItem value="2">2 colonnes</SelectItem>
              <SelectItem value="3">3 colonnes</SelectItem>
              <SelectItem value="4">4 colonnes</SelectItem>
              <SelectItem value="6">6 colonnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Espacement</Label>
          <Select
            value={localComponent?.componentData?.gap || '16px'}
            onValueChange={(value) => updateProperty('componentData.gap', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8px">Petit</SelectItem>
              <SelectItem value="16px">Moyen</SelectItem>
              <SelectItem value="24px">Grand</SelectItem>
              <SelectItem value="32px">Très grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select
            value={localComponent?.componentData?.alignment || 'center'}
            onValueChange={(value) => updateProperty('componentData.alignment', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Haut</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="bottom">Bas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Couleur fond éléments</Label>
          <Input
            type="color"
            value={localComponent?.componentData?.itemBackground || '#f3f4f6'}
            onChange={(e) => updateProperty('componentData.itemBackground', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Éléments de la grille</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.gridItems || []).map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg space-y-2 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Élément {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const items = [...(localComponent?.componentData?.gridItems || [])];
                    items.splice(index, 1);
                    updateProperty('componentData.gridItems', items);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Titre de l'élément"
                value={item.title || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.gridItems || [])];
                  items[index] = { ...item, title: e.target.value };
                  updateProperty('componentData.gridItems', items);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Contenu de l'élément"
                value={item.content || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.gridItems || [])];
                  items[index] = { ...item, content: e.target.value };
                  updateProperty('componentData.gridItems', items);
                }}
                className="text-sm min-h-[60px]"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const items = [...(localComponent?.componentData?.gridItems || [])];
              const newItem = { 
                title: `Élément ${items.length + 1}`, 
                content: 'Contenu de l\'élément' 
              };
              items.push(newItem);
              updateProperty('componentData.gridItems', items);
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

  const renderContainerConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Container Avancée</h4>
      
      {/* Presets rapides */}
      <div>
        <Label className="text-xs text-gray-600">Presets rapides</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'hero');
              updateProperty('componentData.maxWidth', '100%');
              updateProperty('componentData.columns', 1);
              updateProperty('componentData.padding', '60px 20px');
              updateProperty('componentData.distribution', 'center');
            }}
            className="text-xs"
          >
            📄 Hero
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'content');
              updateProperty('componentData.maxWidth', '1200px');
              updateProperty('componentData.columns', 1);
              updateProperty('componentData.padding', '20px');
              updateProperty('componentData.distribution', 'flex-start');
            }}
            className="text-xs"
          >
            📝 Content
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'sidebar');
              updateProperty('componentData.maxWidth', '100%');
              updateProperty('componentData.columns', 2);
              updateProperty('componentData.gap', '30px');
              updateProperty('componentData.gridTemplate', '300px 1fr');
            }}
            className="text-xs"
          >
            📊 Sidebar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'grid3');
              updateProperty('componentData.maxWidth', '1200px');
              updateProperty('componentData.columns', 3);
              updateProperty('componentData.gap', '20px');
              updateProperty('componentData.distribution', 'space-between');
            }}
            className="text-xs"
          >
            🔲 Grid 3
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Largeur maximale</Label>
          <Select
            value={localComponent?.componentData?.maxWidth || '1200px'}
            onValueChange={(value) => updateProperty('componentData.maxWidth', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">Pleine largeur</SelectItem>
              <SelectItem value="1400px">Très large (1400px)</SelectItem>
              <SelectItem value="1200px">Standard (1200px)</SelectItem>
              <SelectItem value="1000px">Compact (1000px)</SelectItem>
              <SelectItem value="800px">Étroit (800px)</SelectItem>
              <SelectItem value="600px">Mobile (600px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Centrage automatique</Label>
          <Switch
            checked={localComponent?.componentData?.centered ?? true}
            onCheckedChange={(checked) => updateProperty('componentData.centered', checked)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Grille intégrée */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Colonnes</Label>
          <Select
            value={String(localComponent?.componentData?.columns || 1)}
            onValueChange={(value) => updateProperty('componentData.columns', parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 colonne</SelectItem>
              <SelectItem value="2">2 colonnes</SelectItem>
              <SelectItem value="3">3 colonnes</SelectItem>
              <SelectItem value="4">4 colonnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Écart</Label>
          <Select
            value={localComponent?.componentData?.gap || '20px'}
            onValueChange={(value) => updateProperty('componentData.gap', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10px">Petit (10px)</SelectItem>
              <SelectItem value="20px">Moyen (20px)</SelectItem>
              <SelectItem value="30px">Grand (30px)</SelectItem>
              <SelectItem value="40px">Très grand (40px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Distribution</Label>
          <Select
            value={localComponent?.componentData?.distribution || 'flex-start'}
            onValueChange={(value) => updateProperty('componentData.distribution', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flex-start">Début</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="space-between">Espacement</SelectItem>
              <SelectItem value="space-around">Autour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template de grille personnalisé */}
      <div>
        <Label className="text-xs text-gray-600">Template grille (CSS Grid)</Label>
        <Input
          value={localComponent?.componentData?.gridTemplate || 'none'}
          onChange={(e) => updateProperty('componentData.gridTemplate', e.target.value)}
          placeholder="300px 1fr 200px"
          className="mt-1 text-xs"
        />
      </div>

      {/* Contraintes enfants */}
      <div>
        <Label className="text-xs text-gray-600">Types acceptés (contraintes)</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {['text', 'heading', 'button', 'image', 'card'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`constraint-${type}`}
                checked={(localComponent?.componentData?.constraints || []).includes(type)}
                onCheckedChange={(checked) => {
                  const constraints = localComponent?.componentData?.constraints || [];
                  const newConstraints = checked 
                    ? [...constraints, type]
                    : constraints.filter((c: string) => c !== type);
                  updateProperty('componentData.constraints', newConstraints);
                }}
              />
              <Label htmlFor={`constraint-${type}`} className="text-xs">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Overflow intelligent */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Gestion overflow</Label>
          <Select
            value={localComponent?.componentData?.overflow || 'visible'}
            onValueChange={(value) => updateProperty('componentData.overflow', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Masqué</SelectItem>
              <SelectItem value="scroll">Défilement</SelectItem>
              <SelectItem value="auto">Automatique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Padding uniforme</Label>
          <Input
            value={localComponent?.componentData?.padding || '20px'}
            onChange={(e) => updateProperty('componentData.padding', e.target.value)}
            placeholder="20px ou 20px 40px"
            className="mt-1 text-xs"
          />
        </div>
      </div>

      {/* Guides visuels */}
      <div>
        <Label className="text-xs text-gray-600">Guides visuels (éditeur)</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-limits"
              checked={localComponent?.componentData?.guides?.showLimits ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.guides', {
                ...localComponent?.componentData?.guides,
                showLimits: checked
              })}
            />
            <Label htmlFor="show-limits" className="text-xs">Limites</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-grid"
              checked={localComponent?.componentData?.guides?.showGrid ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.guides', {
                ...localComponent?.componentData?.guides,
                showGrid: checked
              })}
            />
            <Label htmlFor="show-grid" className="text-xs">Grille</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="snap-to-grid"
              checked={localComponent?.componentData?.guides?.snapToGrid ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.guides', {
                ...localComponent?.componentData?.guides,
                snapToGrid: checked
              })}
            />
            <Label htmlFor="snap-to-grid" className="text-xs">Magnétisme</Label>
          </div>
        </div>
      </div>

      {/* Configuration responsive */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="responsive">
          <AccordionTrigger className="text-xs">Configuration responsive</AccordionTrigger>
          <AccordionContent className="space-y-3">
            {['mobile', 'tablet', 'desktop'].map(breakpoint => (
              <div key={breakpoint} className="border rounded p-3 space-y-2">
                <Label className="text-xs font-medium capitalize">{breakpoint}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      placeholder="Padding"
                      value={localComponent?.componentData?.responsive?.[breakpoint]?.padding || ''}
                      onChange={(e) => updateProperty(`componentData.responsive.${breakpoint}.padding`, e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Colonnes"
                      type="number"
                      min="1"
                      max="4"
                      value={localComponent?.componentData?.responsive?.[breakpoint]?.columns || ''}
                      onChange={(e) => updateProperty(`componentData.responsive.${breakpoint}.columns`, parseInt(e.target.value))}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Max Width"
                      value={localComponent?.componentData?.responsive?.[breakpoint]?.maxWidth || ''}
                      onChange={(e) => updateProperty(`componentData.responsive.${breakpoint}.maxWidth`, e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const renderFlexboxConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Flexbox</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Direction</Label>
          <Select
            value={localComponent?.componentData?.flexDirection || 'row'}
            onValueChange={(value) => updateProperty('componentData.flexDirection', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Horizontal</SelectItem>
              <SelectItem value="column">Vertical</SelectItem>
              <SelectItem value="row-reverse">Horizontal inversé</SelectItem>
              <SelectItem value="column-reverse">Vertical inversé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Justification</Label>
          <Select
            value={localComponent?.componentData?.justifyContent || 'flex-start'}
            onValueChange={(value) => updateProperty('componentData.justifyContent', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flex-start">Début</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="flex-end">Fin</SelectItem>
              <SelectItem value="space-between">Espacement entre</SelectItem>
              <SelectItem value="space-around">Espacement autour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select
            value={localComponent?.componentData?.alignItems || 'stretch'}
            onValueChange={(value) => updateProperty('componentData.alignItems', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stretch">Étirer</SelectItem>
              <SelectItem value="flex-start">Début</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="flex-end">Fin</SelectItem>
              <SelectItem value="baseline">Ligne de base</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Retour à la ligne</Label>
          <Select
            value={localComponent?.componentData?.flexWrap || 'nowrap'}
            onValueChange={(value) => updateProperty('componentData.flexWrap', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nowrap">Pas de retour</SelectItem>
              <SelectItem value="wrap">Retour à la ligne</SelectItem>
              <SelectItem value="wrap-reverse">Retour inversé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Espacement entre éléments</Label>
        <Select
          value={localComponent?.componentData?.gap || '16px'}
          onValueChange={(value) => updateProperty('componentData.gap', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Aucun</SelectItem>
            <SelectItem value="8px">Petit (8px)</SelectItem>
            <SelectItem value="16px">Moyen (16px)</SelectItem>
            <SelectItem value="24px">Grand (24px)</SelectItem>
            <SelectItem value="32px">Très grand (32px)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderHeaderConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de l'En-tête</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Logo/Marque</Label>
        <Input
          value={localComponent?.componentData?.logo || ''}
          onChange={(e) => updateProperty('componentData.logo', e.target.value)}
          placeholder="Nom de votre marque"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Menu de navigation</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.navigation || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Texte du menu"
                value={item.text || ''}
                onChange={(e) => {
                  const navigation = [...(localComponent?.componentData?.navigation || [])];
                  navigation[index] = { ...item, text: e.target.value };
                  updateProperty('componentData.navigation', navigation);
                }}
                className="flex-1 text-sm"
              />
              <Input
                placeholder="Lien"
                value={item.link || ''}
                onChange={(e) => {
                  const navigation = [...(localComponent?.componentData?.navigation || [])];
                  navigation[index] = { ...item, link: e.target.value };
                  updateProperty('componentData.navigation', navigation);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const navigation = [...(localComponent?.componentData?.navigation || [])];
                  navigation.splice(index, 1);
                  updateProperty('componentData.navigation', navigation);
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
              const navigation = [...(localComponent?.componentData?.navigation || [])];
              navigation.push({ text: `Menu ${navigation.length + 1}`, link: '#', id: Date.now().toString() });
              updateProperty('componentData.navigation', navigation);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un menu
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFooterConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Pied de page</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Nom de l'entreprise</Label>
        <Input
          value={localComponent?.componentData?.companyName || ''}
          onChange={(e) => updateProperty('componentData.companyName', e.target.value)}
          placeholder="Nom de votre entreprise"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Description</Label>
        <Textarea
          value={localComponent?.componentData?.description || ''}
          onChange={(e) => updateProperty('componentData.description', e.target.value)}
          placeholder="Description de votre entreprise"
          className="mt-1 text-sm resize-none"
          rows={3}
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Liens du footer</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.links || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Texte du lien"
                value={item.text || ''}
                onChange={(e) => {
                  const links = [...(localComponent?.componentData?.links || [])];
                  links[index] = { ...item, text: e.target.value };
                  updateProperty('componentData.links', links);
                }}
                className="flex-1 text-sm"
              />
              <Input
                placeholder="URL"
                value={item.link || ''}
                onChange={(e) => {
                  const links = [...(localComponent?.componentData?.links || [])];
                  links[index] = { ...item, link: e.target.value };
                  updateProperty('componentData.links', links);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const links = [...(localComponent?.componentData?.links || [])];
                  links.splice(index, 1);
                  updateProperty('componentData.links', links);
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
              const links = [...(localComponent?.componentData?.links || [])];
              links.push({ text: `Lien ${links.length + 1}`, link: '#', id: Date.now().toString() });
              updateProperty('componentData.links', links);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un lien
          </Button>
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Copyright</Label>
        <Input
          value={localComponent?.componentData?.copyright || ''}
          onChange={(e) => updateProperty('componentData.copyright', e.target.value)}
          placeholder="© 2025 Tous droits réservés"
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  const renderSidebarConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de la Barre latérale</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de la sidebar</Label>
        <Input
          value={localComponent?.componentData?.title || ''}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          placeholder="Navigation"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Éléments du menu</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.menuItems || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Texte du menu"
                value={item.text || ''}
                onChange={(e) => {
                  const menuItems = [...(localComponent?.componentData?.menuItems || [])];
                  menuItems[index] = { ...item, text: e.target.value };
                  updateProperty('componentData.menuItems', menuItems);
                }}
                className="flex-1 text-sm"
              />
              <Input
                placeholder="Lien"
                value={item.link || ''}
                onChange={(e) => {
                  const menuItems = [...(localComponent?.componentData?.menuItems || [])];
                  menuItems[index] = { ...item, link: e.target.value };
                  updateProperty('componentData.menuItems', menuItems);
                }}
                className="flex-1 text-sm"
              />
              <Checkbox
                checked={item.active || false}
                onCheckedChange={(checked) => {
                  const menuItems = [...(localComponent?.componentData?.menuItems || [])];
                  menuItems[index] = { ...item, active: checked };
                  updateProperty('componentData.menuItems', menuItems);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const menuItems = [...(localComponent?.componentData?.menuItems || [])];
                  menuItems.splice(index, 1);
                  updateProperty('componentData.menuItems', menuItems);
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
              const menuItems = [...(localComponent?.componentData?.menuItems || [])];
              menuItems.push({ text: `Menu ${menuItems.length + 1}`, link: '#', active: false, id: Date.now().toString() });
              updateProperty('componentData.menuItems', menuItems);
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





  const renderAccordionConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de l'Accordéon</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Éléments de l'accordéon</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Question {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const items = [...(localComponent?.componentData?.items || [])];
                    items.splice(index, 1);
                    updateProperty('componentData.items', items);
                  }}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Question"
                value={item.question || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, question: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Réponse"
                value={item.answer || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, answer: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm resize-none"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.isOpen || false}
                  onCheckedChange={(checked) => {
                    const items = [...(localComponent?.componentData?.items || [])];
                    items[index] = { ...item, isOpen: checked };
                    updateProperty('componentData.items', items);
                  }}
                />
                <Label className="text-xs">Ouvert par défaut</Label>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const items = [...(localComponent?.componentData?.items || [])];
              items.push({ 
                question: `Question ${items.length + 1}`, 
                answer: 'Réponse...', 
                isOpen: false, 
                id: Date.now().toString() 
              });
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une question
          </Button>
        </div>
      </div>
    </div>
  );

  // Configurations simplifiées pour les autres composants
  const renderFeaturesConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Section Fonctionnalités</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre principal</Label>
        <Input
          value={localComponent?.componentData?.featuresTitle || 'Nos Fonctionnalités'}
          onChange={(e) => updateProperty('componentData.featuresTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Fonctionnalités</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.featureItems || []).map((feature: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Fonctionnalité {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const featureItems = [...(localComponent?.componentData?.featureItems || [])];
                    featureItems.splice(index, 1);
                    updateProperty('componentData.featureItems', featureItems);
                  }}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Titre de la fonctionnalité"
                value={feature.title || ''}
                onChange={(e) => {
                  const featureItems = [...(localComponent?.componentData?.featureItems || [])];
                  featureItems[index] = { ...feature, title: e.target.value };
                  updateProperty('componentData.featureItems', featureItems);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Description"
                value={feature.description || ''}
                onChange={(e) => {
                  const featureItems = [...(localComponent?.componentData?.featureItems || [])];
                  featureItems[index] = { ...feature, description: e.target.value };
                  updateProperty('componentData.featureItems', featureItems);
                }}
                className="text-sm min-h-[40px]"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const featureItems = [...(localComponent?.componentData?.featureItems || [])];
              featureItems.push({ title: 'Nouvelle fonctionnalité', description: 'Description...' });
              updateProperty('componentData.featureItems', featureItems);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une fonctionnalité
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCtaConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Call-to-Action</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre principal</Label>
        <Input
          value={localComponent?.componentData?.ctaTitle || 'Prêt à commencer ?'}
          onChange={(e) => updateProperty('componentData.ctaTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Sous-titre</Label>
        <Textarea
          value={localComponent?.componentData?.ctaSubtitle || 'Rejoignez-nous dès aujourd\'hui !'}
          onChange={(e) => updateProperty('componentData.ctaSubtitle', e.target.value)}
          className="mt-1 text-sm min-h-[50px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Texte du bouton</Label>
          <Input
            value={localComponent?.componentData?.ctaButtonText || 'Commencer'}
            onChange={(e) => updateProperty('componentData.ctaButtonText', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lien du bouton</Label>
          <Input
            value={localComponent?.componentData?.ctaButtonLink || '#'}
            onChange={(e) => updateProperty('componentData.ctaButtonLink', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
  const renderModalConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Modale</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={localComponent?.componentData?.modalSize || 'medium'}
            onValueChange={(value) => updateProperty('componentData.modalSize', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="fullscreen">Plein écran</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Fermeture automatique</Label>
          <Switch
            checked={localComponent?.componentData?.autoClose ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.autoClose', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de la modale</Label>
        <Input
          value={localComponent?.componentData?.modalTitle || 'Titre de la modale'}
          onChange={(e) => updateProperty('componentData.modalTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Contenu</Label>
        <Textarea
          value={localComponent?.componentData?.modalContent || 'Contenu de la modale...'}
          onChange={(e) => updateProperty('componentData.modalContent', e.target.value)}
          className="mt-1 text-sm min-h-[60px]"
        />
      </div>
    </div>
  );

  const renderTooltipConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Infobulle</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Position</Label>
          <Select
            value={localComponent?.componentData?.tooltipPosition || 'top'}
            onValueChange={(value) => updateProperty('componentData.tooltipPosition', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Haut</SelectItem>
              <SelectItem value="bottom">Bas</SelectItem>
              <SelectItem value="left">Gauche</SelectItem>
              <SelectItem value="right">Droite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Délai (ms)</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.tooltipDelay || 500}
            onChange={(e) => updateProperty('componentData.tooltipDelay', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Texte de l'infobulle</Label>
        <Input
          value={localComponent?.componentData?.tooltipText || 'Texte d\'aide'}
          onChange={(e) => updateProperty('componentData.tooltipText', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  const renderTabsConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Onglets</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Onglets</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.tabItems || []).map((tab: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Onglet {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const tabItems = [...(localComponent?.componentData?.tabItems || [])];
                    tabItems.splice(index, 1);
                    updateProperty('componentData.tabItems', tabItems);
                  }}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Titre de l'onglet"
                value={tab.title || ''}
                onChange={(e) => {
                  const tabItems = [...(localComponent?.componentData?.tabItems || [])];
                  tabItems[index] = { ...tab, title: e.target.value };
                  updateProperty('componentData.tabItems', tabItems);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Contenu de l'onglet"
                value={tab.content || ''}
                onChange={(e) => {
                  const tabItems = [...(localComponent?.componentData?.tabItems || [])];
                  tabItems[index] = { ...tab, content: e.target.value };
                  updateProperty('componentData.tabItems', tabItems);
                }}
                className="text-sm min-h-[50px]"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const tabItems = [...(localComponent?.componentData?.tabItems || [])];
              tabItems.push({ title: `Onglet ${tabItems.length + 1}`, content: 'Contenu...' });
              updateProperty('componentData.tabItems', tabItems);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un onglet
          </Button>
        </div>
      </div>
    </div>
  );
  const renderTimelineConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Timeline</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Événements de la timeline</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.timelineItems || []).map((event: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Événement {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const timelineItems = [...(localComponent?.componentData?.timelineItems || [])];
                    timelineItems.splice(index, 1);
                    updateProperty('componentData.timelineItems', timelineItems);
                  }}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Date"
                value={event.date || ''}
                onChange={(e) => {
                  const timelineItems = [...(localComponent?.componentData?.timelineItems || [])];
                  timelineItems[index] = { ...event, date: e.target.value };
                  updateProperty('componentData.timelineItems', timelineItems);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Titre de l'événement"
                value={event.title || ''}
                onChange={(e) => {
                  const timelineItems = [...(localComponent?.componentData?.timelineItems || [])];
                  timelineItems[index] = { ...event, title: e.target.value };
                  updateProperty('componentData.timelineItems', timelineItems);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Description"
                value={event.description || ''}
                onChange={(e) => {
                  const timelineItems = [...(localComponent?.componentData?.timelineItems || [])];
                  timelineItems[index] = { ...event, description: e.target.value };
                  updateProperty('componentData.timelineItems', timelineItems);
                }}
                className="text-sm min-h-[40px]"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const timelineItems = [...(localComponent?.componentData?.timelineItems || [])];
              timelineItems.push({ date: '2024', title: 'Nouvel événement', description: 'Description...' });
              updateProperty('componentData.timelineItems', timelineItems);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un événement
          </Button>
        </div>
      </div>
    </div>
  );
  const renderBadgeConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Badge</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Variante</Label>
          <Select
            value={localComponent?.componentData?.badgeVariant || 'default'}
            onValueChange={(value) => updateProperty('componentData.badgeVariant', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Standard</SelectItem>
              <SelectItem value="secondary">Secondaire</SelectItem>
              <SelectItem value="success">Succès</SelectItem>
              <SelectItem value="warning">Attention</SelectItem>
              <SelectItem value="destructive">Danger</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={localComponent?.componentData?.badgeSize || 'medium'}
            onValueChange={(value) => updateProperty('componentData.badgeSize', value)}
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
        <Label className="text-xs text-gray-600">Texte du badge</Label>
        <Input
          value={localComponent?.componentData?.badgeText || 'Badge'}
          onChange={(e) => updateProperty('componentData.badgeText', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  const renderAlertConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Alerte</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type d'alerte</Label>
          <Select
            value={localComponent?.componentData?.alertType || 'info'}
            onValueChange={(value) => updateProperty('componentData.alertType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Information</SelectItem>
              <SelectItem value="success">Succès</SelectItem>
              <SelectItem value="warning">Attention</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Fermable</Label>
          <Switch
            checked={localComponent?.componentData?.dismissible ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.dismissible', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de l'alerte</Label>
        <Input
          value={localComponent?.componentData?.alertTitle || 'Titre'}
          onChange={(e) => updateProperty('componentData.alertTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Message</Label>
        <Textarea
          value={localComponent?.componentData?.alertMessage || 'Message d\'alerte...'}
          onChange={(e) => updateProperty('componentData.alertMessage', e.target.value)}
          className="mt-1 text-sm min-h-[50px]"
        />
      </div>
    </div>
  );
  const renderBreadcrumbConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Fil d'Ariane</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Éléments du fil d'Ariane</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.breadcrumbItems || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Texte"
                value={item.text || ''}
                onChange={(e) => {
                  const breadcrumbItems = [...(localComponent?.componentData?.breadcrumbItems || [])];
                  breadcrumbItems[index] = { ...item, text: e.target.value };
                  updateProperty('componentData.breadcrumbItems', breadcrumbItems);
                }}
                className="flex-1 text-sm"
              />
              <Input
                placeholder="Lien"
                value={item.link || ''}
                onChange={(e) => {
                  const breadcrumbItems = [...(localComponent?.componentData?.breadcrumbItems || [])];
                  breadcrumbItems[index] = { ...item, link: e.target.value };
                  updateProperty('componentData.breadcrumbItems', breadcrumbItems);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const breadcrumbItems = [...(localComponent?.componentData?.breadcrumbItems || [])];
                  breadcrumbItems.splice(index, 1);
                  updateProperty('componentData.breadcrumbItems', breadcrumbItems);
                }}
                className="h-8 w-8 p-0 text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const breadcrumbItems = [...(localComponent?.componentData?.breadcrumbItems || [])];
              breadcrumbItems.push({ text: `Page ${breadcrumbItems.length + 1}`, link: '#' });
              updateProperty('componentData.breadcrumbItems', breadcrumbItems);
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

  const renderProgressConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Barre de Progression</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Valeur (%)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={localComponent?.componentData?.progressValue || 50}
            onChange={(e) => updateProperty('componentData.progressValue', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Afficher le texte</Label>
          <Switch
            checked={localComponent?.componentData?.showText ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showText', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Couleur</Label>
        <Input
          type="color"
          value={localComponent?.componentData?.progressColor || '#3b82f6'}
          onChange={(e) => updateProperty('componentData.progressColor', e.target.value)}
          className="mt-1 h-8"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Taille</Label>
        <Select
          value={localComponent?.componentData?.progressSize || 'medium'}
          onValueChange={(value) => updateProperty('componentData.progressSize', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Petite</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSpinnerConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Spinner</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={localComponent?.componentData?.spinnerSize || 'medium'}
            onValueChange={(value) => updateProperty('componentData.spinnerSize', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petit (16px)</SelectItem>
              <SelectItem value="medium">Moyen (24px)</SelectItem>
              <SelectItem value="large">Grand (32px)</SelectItem>
              <SelectItem value="xl">Très grand (48px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Vitesse</Label>
          <Select
            value={localComponent?.componentData?.spinnerSpeed || 'normal'}
            onValueChange={(value) => updateProperty('componentData.spinnerSpeed', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Lent</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="fast">Rapide</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Couleur</Label>
        <Input
          type="color"
          value={localComponent?.componentData?.spinnerColor || '#3b82f6'}
          onChange={(e) => updateProperty('componentData.spinnerColor', e.target.value)}
          className="mt-1 h-8"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Texte de chargement</Label>
        <Input
          value={localComponent?.componentData?.loadingText || 'Chargement...'}
          onChange={(e) => updateProperty('componentData.loadingText', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );
  const renderDividerConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Divider Avancée</h4>
      
      {/* Presets rapides */}
      <div>
        <Label className="text-xs text-gray-600">Styles prédéfinis</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'minimal');
              updateProperty('componentData.style', 'solid');
              updateProperty('componentData.thickness', '1px');
              updateProperty('componentData.color', '#e5e7eb');
              updateProperty('componentData.withText', false);
            }}
            className="text-xs"
          >
            📏 Minimal
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'bold');
              updateProperty('componentData.style', 'solid');
              updateProperty('componentData.thickness', '4px');
              updateProperty('componentData.color', '#374151');
              updateProperty('componentData.effects.shadow', true);
            }}
            className="text-xs"
          >
            🔸 Bold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'decorative');
              updateProperty('componentData.decorative.pattern', 'dots');
              updateProperty('componentData.color', '#8b5cf6');
              updateProperty('componentData.decorative.dotCount', 5);
            }}
            className="text-xs"
          >
            ✨ Décoratif
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'branded');
              updateProperty('componentData.withText', true);
              updateProperty('componentData.text', 'SECTION');
              updateProperty('componentData.effects.gradient', 'linear-gradient(90deg, #3b82f6, #8b5cf6)');
            }}
            className="text-xs"
          >
            🏷️ Branded
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Style de ligne</Label>
          <Select
            value={localComponent?.componentData?.style || 'solid'}
            onValueChange={(value) => updateProperty('componentData.style', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solide</SelectItem>
              <SelectItem value="dashed">Tirets</SelectItem>
              <SelectItem value="dotted">Points</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="groove">Rainuré</SelectItem>
              <SelectItem value="ridge">Relief</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Épaisseur</Label>
          <Select
            value={localComponent?.componentData?.thickness || '2px'}
            onValueChange={(value) => updateProperty('componentData.thickness', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1px">Très fin (1px)</SelectItem>
              <SelectItem value="2px">Fin (2px)</SelectItem>
              <SelectItem value="3px">Moyen (3px)</SelectItem>
              <SelectItem value="4px">Épais (4px)</SelectItem>
              <SelectItem value="6px">Très épais (6px)</SelectItem>
              <SelectItem value="8px">Ultra épais (8px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Largeur</Label>
          <Select
            value={localComponent?.componentData?.width || '100%'}
            onValueChange={(value) => updateProperty('componentData.width', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100%">Pleine (100%)</SelectItem>
              <SelectItem value="80%">Large (80%)</SelectItem>
              <SelectItem value="60%">Moyenne (60%)</SelectItem>
              <SelectItem value="40%">Petite (40%)</SelectItem>
              <SelectItem value="20%">Minimale (20%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select
            value={localComponent?.componentData?.alignment || 'center'}
            onValueChange={(value) => updateProperty('componentData.alignment', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Gauche</SelectItem>
              <SelectItem value="center">Centre</SelectItem>
              <SelectItem value="right">Droite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Orientation</Label>
          <Select
            value={localComponent?.componentData?.orientation || 'horizontal'}
            onValueChange={(value) => updateProperty('componentData.orientation', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Couleur</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="color"
            value={localComponent?.componentData?.color || '#e5e7eb'}
            onChange={(e) => updateProperty('componentData.color', e.target.value)}
            className="w-16 h-8"
          />
          <div className="flex gap-1 flex-1">
            {['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#1f2937'].map(color => (
              <button
                key={color}
                className="w-6 h-6 rounded border-2 border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => updateProperty('componentData.color', color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider avec texte */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="with-text"
            checked={localComponent?.componentData?.withText ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.withText', checked)}
          />
          <Label htmlFor="with-text" className="text-xs">Divider avec texte</Label>
        </div>
        {localComponent?.componentData?.withText && (
          <div className="space-y-2">
            <Input
              value={localComponent?.componentData?.text || ''}
              onChange={(e) => updateProperty('componentData.text', e.target.value)}
              placeholder="OU, ET, SECTION..."
              className="text-xs"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={localComponent?.componentData?.textStyle?.fontSize || '14px'}
                onChange={(e) => updateProperty('componentData.textStyle.fontSize', e.target.value)}
                placeholder="Taille"
                className="text-xs"
              />
              <Input
                type="color"
                value={localComponent?.componentData?.textStyle?.color || '#6b7280'}
                onChange={(e) => updateProperty('componentData.textStyle.color', e.target.value)}
                className="h-8"
              />
              <Input
                value={localComponent?.componentData?.textStyle?.padding || '0 12px'}
                onChange={(e) => updateProperty('componentData.textStyle.padding', e.target.value)}
                placeholder="Padding"
                className="text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Motifs décoratifs */}
      <div>
        <Label className="text-xs text-gray-600">Motif décoratif</Label>
        <Select
          value={localComponent?.componentData?.decorative?.pattern || 'none'}
          onValueChange={(value) => updateProperty('componentData.decorative.pattern', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            <SelectItem value="dots">Points</SelectItem>
            <SelectItem value="waves">Vagues</SelectItem>
            <SelectItem value="zigzag">Zigzag</SelectItem>
            <SelectItem value="ornament">Ornement</SelectItem>
          </SelectContent>
        </Select>
        
        {localComponent?.componentData?.decorative?.pattern === 'dots' && (
          <div className="mt-2">
            <Label className="text-xs">Nombre de points</Label>
            <Input
              type="number"
              min="3"
              max="10"
              value={localComponent?.componentData?.decorative?.dotCount || 3}
              onChange={(e) => updateProperty('componentData.decorative.dotCount', parseInt(e.target.value))}
              className="mt-1 text-xs"
            />
          </div>
        )}
        
        {localComponent?.componentData?.decorative?.pattern === 'waves' && (
          <div className="mt-2">
            <Label className="text-xs">Amplitude</Label>
            <Select
              value={localComponent?.componentData?.decorative?.waveAmplitude || '5px'}
              onValueChange={(value) => updateProperty('componentData.decorative.waveAmplitude', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3px">Subtile (3px)</SelectItem>
                <SelectItem value="5px">Normale (5px)</SelectItem>
                <SelectItem value="8px">Prononcée (8px)</SelectItem>
                <SelectItem value="12px">Forte (12px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Espacement */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Espacement haut</Label>
          <Select
            value={localComponent?.componentData?.spacing?.top || '20px'}
            onValueChange={(value) => updateProperty('componentData.spacing.top', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Aucun</SelectItem>
              <SelectItem value="10px">Petit (10px)</SelectItem>
              <SelectItem value="20px">Moyen (20px)</SelectItem>
              <SelectItem value="30px">Grand (30px)</SelectItem>
              <SelectItem value="40px">Très grand (40px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Espacement bas</Label>
          <Select
            value={localComponent?.componentData?.spacing?.bottom || '20px'}
            onValueChange={(value) => updateProperty('componentData.spacing.bottom', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Aucun</SelectItem>
              <SelectItem value="10px">Petit (10px)</SelectItem>
              <SelectItem value="20px">Moyen (20px)</SelectItem>
              <SelectItem value="30px">Grand (30px)</SelectItem>
              <SelectItem value="40px">Très grand (40px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Effets */}
      <div>
        <Label className="text-xs text-gray-600">Effets visuels</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="shadow"
              checked={localComponent?.componentData?.effects?.shadow ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.effects.shadow', checked)}
            />
            <Label htmlFor="shadow" className="text-xs">Ombre</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="glow"
              checked={localComponent?.componentData?.effects?.glow ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.effects.glow', checked)}
            />
            <Label htmlFor="glow" className="text-xs">Lueur</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gradient"
              checked={!!localComponent?.componentData?.effects?.gradient}
              onCheckedChange={(checked) => updateProperty('componentData.effects.gradient', 
                checked ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : null)}
            />
            <Label htmlFor="gradient" className="text-xs">Gradient</Label>
          </div>
        </div>
      </div>

      {/* Animation */}
      <div>
        <Label className="text-xs text-gray-600">Animation</Label>
        <Select
          value={localComponent?.componentData?.effects?.animation || 'none'}
          onValueChange={(value) => updateProperty('componentData.effects.animation', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            <SelectItem value="fadeIn">Apparition</SelectItem>
            <SelectItem value="slideIn">Glissement</SelectItem>
            <SelectItem value="pulse">Pulsation</SelectItem>
            <SelectItem value="draw">Tracé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview en temps réel */}
      <div className="border rounded p-3 bg-gray-50">
        <Label className="text-xs text-gray-600 mb-2 block">Aperçu temps réel</Label>
        <div className="flex items-center justify-center py-4">
          <div
            className="transition-all duration-200"
            style={{
              width: localComponent?.componentData?.width || '100%',
              height: localComponent?.componentData?.thickness || '2px',
              backgroundColor: localComponent?.componentData?.color || '#e5e7eb',
              borderStyle: localComponent?.componentData?.style || 'solid',
              borderColor: localComponent?.componentData?.color || '#e5e7eb',
              borderWidth: localComponent?.componentData?.style !== 'solid' ? localComponent?.componentData?.thickness || '2px' : '0',
              maxWidth: '200px'
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderSpacerConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Spacer Avancée</h4>
      
      {/* Presets rapides */}
      <div>
        <Label className="text-xs text-gray-600">Espacements prédéfinis</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'small');
              updateProperty('componentData.size.height', '10px');
              updateProperty('componentData.type', 'vertical');
            }}
            className="text-xs"
          >
            📏 Petit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'medium');
              updateProperty('componentData.size.height', '30px');
              updateProperty('componentData.type', 'vertical');
            }}
            className="text-xs"
          >
            📐 Moyen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'large');
              updateProperty('componentData.size.height', '60px');
              updateProperty('componentData.type', 'vertical');
            }}
            className="text-xs"
          >
            📏 Grand
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'section');
              updateProperty('componentData.size.height', '80px');
              updateProperty('componentData.type', 'section');
            }}
            className="text-xs"
          >
            🔲 Section
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'flexible');
              updateProperty('componentData.advanced.flexGrow', true);
              updateProperty('componentData.size.height', '20px');
            }}
            className="text-xs"
          >
            🔄 Flexible
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'horizontal');
              updateProperty('componentData.type', 'horizontal');
              updateProperty('componentData.size.width', '30px');
              updateProperty('componentData.size.height', '100%');
            }}
            className="text-xs"
          >
            ↔️ Horizontal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type d'espacement</Label>
          <Select
            value={localComponent?.componentData?.type || 'vertical'}
            onValueChange={(value) => updateProperty('componentData.type', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="section">Section</SelectItem>
              <SelectItem value="page">Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Preset actuel</Label>
          <div className="mt-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
            {localComponent?.componentData?.preset || 'custom'}
          </div>
        </div>
      </div>

      {/* Dimensions personnalisées */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Dimensions personnalisées</Label>
        
        {localComponent?.componentData?.type === 'horizontal' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Largeur</Label>
              <Select
                value={localComponent?.componentData?.size?.width || '30px'}
                onValueChange={(value) => updateProperty('componentData.size.width', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10px">10px</SelectItem>
                  <SelectItem value="20px">20px</SelectItem>
                  <SelectItem value="30px">30px</SelectItem>
                  <SelectItem value="50px">50px</SelectItem>
                  <SelectItem value="80px">80px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Hauteur</Label>
              <Input
                value={localComponent?.componentData?.size?.height || '100%'}
                onChange={(e) => updateProperty('componentData.size.height', e.target.value)}
                placeholder="100%"
                className="mt-1 text-xs"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Hauteur</Label>
              <Select
                value={localComponent?.componentData?.size?.height || '20px'}
                onValueChange={(value) => updateProperty('componentData.size.height', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5px">Micro (5px)</SelectItem>
                  <SelectItem value="10px">Petit (10px)</SelectItem>
                  <SelectItem value="15px">Fin (15px)</SelectItem>
                  <SelectItem value="20px">Normal (20px)</SelectItem>
                  <SelectItem value="30px">Moyen (30px)</SelectItem>
                  <SelectItem value="40px">Large (40px)</SelectItem>
                  <SelectItem value="60px">Grand (60px)</SelectItem>
                  <SelectItem value="80px">Très grand (80px)</SelectItem>
                  <SelectItem value="120px">Énorme (120px)</SelectItem>
                  <SelectItem value="200px">Géant (200px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Largeur</Label>
              <Select
                value={localComponent?.componentData?.size?.width || '100%'}
                onValueChange={(value) => updateProperty('componentData.size.width', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100%">Pleine largeur</SelectItem>
                  <SelectItem value="80%">80%</SelectItem>
                  <SelectItem value="60%">60%</SelectItem>
                  <SelectItem value="40%">40%</SelectItem>
                  <SelectItem value="300px">Fixe (300px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div>
          <Input
            value={localComponent?.componentData?.size?.height || '20px'}
            onChange={(e) => updateProperty('componentData.size.height', e.target.value)}
            placeholder="Valeur personnalisée (ex: 45px, 3rem, 5vh)"
            className="text-xs"
          />
        </div>
      </div>

      {/* Visibilité et affichage */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Visibilité et affichage</Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-editor"
              checked={localComponent?.componentData?.visibility?.showInEditor ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.visibility.showInEditor', checked)}
            />
            <Label htmlFor="show-editor" className="text-xs">Visible en édition</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-export"
              checked={localComponent?.componentData?.visibility?.showInExport ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.visibility.showInExport', checked)}
            />
            <Label htmlFor="show-export" className="text-xs">Visible à l'export</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-guides"
              checked={localComponent?.componentData?.visibility?.showGuides ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.visibility.showGuides', checked)}
            />
            <Label htmlFor="show-guides" className="text-xs">Afficher guides</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flex-grow"
              checked={localComponent?.componentData?.advanced?.flexGrow ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.advanced.flexGrow', checked)}
            />
            <Label htmlFor="flex-grow" className="text-xs">Espacement flexible</Label>
          </div>
        </div>
      </div>

      {/* Configuration responsive */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Configuration responsive</Label>
        
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">📱 Mobile</Label>
              <Input
                value={localComponent?.componentData?.responsive?.mobile?.height || '15px'}
                onChange={(e) => updateProperty('componentData.responsive.mobile.height', e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">📱 Tablet</Label>
              <Input
                value={localComponent?.componentData?.responsive?.tablet?.height || '20px'}
                onChange={(e) => updateProperty('componentData.responsive.tablet.height', e.target.value)}
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">🖥️ Desktop</Label>
              <Input
                value={localComponent?.componentData?.responsive?.desktop?.height || '20px'}
                onChange={(e) => updateProperty('componentData.responsive.desktop.height', e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contraintes avancées */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Contraintes avancées</Label>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Hauteur min</Label>
            <Input
              value={localComponent?.componentData?.advanced?.minHeight || '5px'}
              onChange={(e) => updateProperty('componentData.advanced.minHeight', e.target.value)}
              className="mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Hauteur max</Label>
            <Input
              value={localComponent?.componentData?.advanced?.maxHeight || '500px'}
              onChange={(e) => updateProperty('componentData.advanced.maxHeight', e.target.value)}
              className="mt-1 text-xs"
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flex-shrink"
              checked={localComponent?.componentData?.advanced?.flexShrink ?? true}
              onCheckedChange={(checked) => updateProperty('componentData.advanced.flexShrink', checked)}
            />
            <Label htmlFor="flex-shrink" className="text-xs">Permettre la réduction automatique</Label>
          </div>
        </div>
      </div>

      {/* Cas d'usage courants */}
      <div className="border rounded p-3 bg-blue-50">
        <Label className="text-xs text-blue-800 mb-2 block">💡 Cas d'usage suggérés</Label>
        <div className="text-xs text-blue-700 space-y-1">
          <div><strong>Vertical (5-20px):</strong> Espacement entre éléments</div>
          <div><strong>Section (40-80px):</strong> Séparation de sections</div>
          <div><strong>Horizontal (20-50px):</strong> Colonnes et sidebars</div>
          <div><strong>Flexible:</strong> S'adapte à l'espace disponible</div>
          <div><strong>Page (100-200px):</strong> Espacement entre pages</div>
        </div>
      </div>

      {/* Preview en temps réel */}
      <div className="border rounded p-3 bg-gray-50">
        <Label className="text-xs text-gray-600 mb-2 block">Aperçu temps réel</Label>
        <div className="flex items-center justify-center py-2">
          <div
            className="bg-blue-200 border-2 border-dashed border-blue-400 flex items-center justify-center"
            style={{
              width: localComponent?.componentData?.type === 'horizontal' ? 
                localComponent?.componentData?.size?.width || '30px' : '100px',
              height: localComponent?.componentData?.type === 'horizontal' ? 
                '30px' : localComponent?.componentData?.size?.height || '20px',
              maxWidth: '200px',
              maxHeight: '60px'
            }}
          >
            <span className="text-xs text-blue-600 font-mono">
              {localComponent?.componentData?.size?.height || '20px'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );


  const renderMainConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Contenu Principal</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Rôle sémantique</Label>
        <Select
          value={localComponent?.componentData?.mainRole || 'main'}
          onValueChange={(value) => updateProperty('componentData.mainRole', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Contenu principal</SelectItem>
            <SelectItem value="banner">Bannière</SelectItem>
            <SelectItem value="complementary">Complémentaire</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de la section</Label>
        <Input
          value={localComponent?.componentData?.mainTitle || ''}
          onChange={(e) => updateProperty('componentData.mainTitle', e.target.value)}
          placeholder="Titre optionnel"
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  const renderSectionConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Section</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de la section</Label>
        <Input
          value={localComponent?.componentData?.sectionTitle || 'Ma Section'}
          onChange={(e) => updateProperty('componentData.sectionTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">ID de la section</Label>
        <Input
          value={localComponent?.componentData?.sectionId || ''}
          onChange={(e) => updateProperty('componentData.sectionId', e.target.value)}
          placeholder="section-1"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Arrière-plan</Label>
        <Select
          value={localComponent?.componentData?.sectionBackground || 'default'}
          onValueChange={(value) => updateProperty('componentData.sectionBackground', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Standard</SelectItem>
            <SelectItem value="gray">Gris clair</SelectItem>
            <SelectItem value="primary">Couleur primaire</SelectItem>
            <SelectItem value="gradient">Dégradé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderArticleConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Article</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de l'article</Label>
        <Input
          value={localComponent?.componentData?.articleTitle || 'Mon Article'}
          onChange={(e) => updateProperty('componentData.articleTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Auteur</Label>
          <Input
            value={localComponent?.componentData?.articleAuthor || ''}
            onChange={(e) => updateProperty('componentData.articleAuthor', e.target.value)}
            placeholder="Nom de l'auteur"
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Date de publication</Label>
          <Input
            type="date"
            value={localComponent?.componentData?.publishDate || ''}
            onChange={(e) => updateProperty('componentData.publishDate', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Résumé</Label>
        <Textarea
          value={localComponent?.componentData?.articleSummary || ''}
          onChange={(e) => updateProperty('componentData.articleSummary', e.target.value)}
          placeholder="Résumé de l'article"
          className="mt-1 text-sm min-h-[60px]"
        />
      </div>
    </div>
  );

  const renderAsideConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Contenu Latéral</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre du contenu latéral</Label>
        <Input
          value={localComponent?.componentData?.asideTitle || 'Information'}
          onChange={(e) => updateProperty('componentData.asideTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Position</Label>
        <Select
          value={localComponent?.componentData?.asidePosition || 'right'}
          onValueChange={(value) => updateProperty('componentData.asidePosition', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Gauche</SelectItem>
            <SelectItem value="right">Droite</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Contenu</Label>
        <Textarea
          value={localComponent?.componentData?.asideContent || 'Contenu latéral...'}
          onChange={(e) => updateProperty('componentData.asideContent', e.target.value)}
          className="mt-1 text-sm min-h-[80px]"
        />
      </div>
    </div>
  );

  const renderMapConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Carte</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Latitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={localComponent?.componentData?.mapLat || 48.8566}
            onChange={(e) => updateProperty('componentData.mapLat', parseFloat(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Longitude</Label>
          <Input
            type="number"
            step="0.000001"
            value={localComponent?.componentData?.mapLng || 2.3522}
            onChange={(e) => updateProperty('componentData.mapLng', parseFloat(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Zoom</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={localComponent?.componentData?.mapZoom || 13}
            onChange={(e) => updateProperty('componentData.mapZoom', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Marqueur</Label>
          <Switch
            checked={localComponent?.componentData?.showMarker ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showMarker', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Titre du marqueur</Label>
        <Input
          value={localComponent?.componentData?.markerTitle || 'Notre adresse'}
          onChange={(e) => updateProperty('componentData.markerTitle', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );
  const renderChartConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Graphique</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type de graphique</Label>
          <Select
            value={localComponent?.componentData?.chartType || 'bar'}
            onValueChange={(value) => updateProperty('componentData.chartType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Barres</SelectItem>
              <SelectItem value="line">Ligne</SelectItem>
              <SelectItem value="pie">Camembert</SelectItem>
              <SelectItem value="doughnut">Anneau</SelectItem>
              <SelectItem value="area">Aires</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Largeur</Label>
          <Select
            value={localComponent?.componentData?.chartWidth || '400px'}
            onValueChange={(value) => updateProperty('componentData.chartWidth', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300px">Petit (300px)</SelectItem>
              <SelectItem value="400px">Moyen (400px)</SelectItem>
              <SelectItem value="500px">Grand (500px)</SelectItem>
              <SelectItem value="100%">Pleine largeur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Titre du graphique</Label>
        <Input
          value={localComponent?.componentData?.chartTitle || 'Mon Graphique'}
          onChange={(e) => updateProperty('componentData.chartTitle', e.target.value)}
          placeholder="Titre du graphique"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Données (JSON)</Label>
        <Textarea
          value={localComponent?.componentData?.chartData || '{"labels":["Jan","Fév","Mar"],"values":[10,20,15]}'}
          onChange={(e) => updateProperty('componentData.chartData', e.target.value)}
          placeholder="Données au format JSON"
          className="mt-1 text-sm min-h-[60px]"
        />
      </div>
    </div>
  );
  const renderCalendarConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Calendrier</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Vue par défaut</Label>
          <Select
            value={localComponent?.componentData?.calendarView || 'month'}
            onValueChange={(value) => updateProperty('componentData.calendarView', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="day">Jour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Première jour de la semaine</Label>
          <Select
            value={localComponent?.componentData?.firstDayOfWeek || 'monday'}
            onValueChange={(value) => updateProperty('componentData.firstDayOfWeek', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sunday">Dimanche</SelectItem>
              <SelectItem value="monday">Lundi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Événements cliquables</Label>
          <Switch
            checked={localComponent?.componentData?.eventsClickable ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.eventsClickable', checked)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Navigation</Label>
          <Switch
            checked={localComponent?.componentData?.showNavigation ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showNavigation', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Événements du calendrier</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.calendarEvents || []).map((event: any, index: number) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Événement {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const calendarEvents = [...(localComponent?.componentData?.calendarEvents || [])];
                    calendarEvents.splice(index, 1);
                    updateProperty('componentData.calendarEvents', calendarEvents);
                  }}
                  className="h-6 w-6 p-0 text-red-600"
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              <Input
                placeholder="Titre de l'événement"
                value={event.title || ''}
                onChange={(e) => {
                  const calendarEvents = [...(localComponent?.componentData?.calendarEvents || [])];
                  calendarEvents[index] = { ...event, title: e.target.value };
                  updateProperty('componentData.calendarEvents', calendarEvents);
                }}
                className="text-sm"
              />
              <Input
                type="date"
                value={event.date || ''}
                onChange={(e) => {
                  const calendarEvents = [...(localComponent?.componentData?.calendarEvents || [])];
                  calendarEvents[index] = { ...event, date: e.target.value };
                  updateProperty('componentData.calendarEvents', calendarEvents);
                }}
                className="text-sm"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const calendarEvents = [...(localComponent?.componentData?.calendarEvents || [])];
              calendarEvents.push({ title: 'Nouvel événement', date: new Date().toISOString().split('T')[0] });
              updateProperty('componentData.calendarEvents', calendarEvents);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un événement
          </Button>
        </div>
      </div>
    </div>
  );
  const renderInputConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Champ de Saisie</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type de champ</Label>
          <Select
            value={localComponent?.componentData?.inputType || 'text'}
            onValueChange={(value) => updateProperty('componentData.inputType', value)}
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
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Requis</Label>
          <Switch
            checked={localComponent?.componentData?.required || false}
            onCheckedChange={(checked) => updateProperty('componentData.required', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Placeholder</Label>
        <Input
          value={localComponent?.componentData?.placeholder || 'Tapez ici...'}
          onChange={(e) => updateProperty('componentData.placeholder', e.target.value)}
          placeholder="Texte d'aide"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Label du champ</Label>
        <Input
          value={localComponent?.componentData?.label || ''}
          onChange={(e) => updateProperty('componentData.label', e.target.value)}
          placeholder="Nom du champ"
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );

  const renderTextareaConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Zone de Texte</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Lignes</Label>
          <Select
            value={String(localComponent?.componentData?.rows || 4)}
            onValueChange={(value) => updateProperty('componentData.rows', parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 lignes</SelectItem>
              <SelectItem value="4">4 lignes</SelectItem>
              <SelectItem value="6">6 lignes</SelectItem>
              <SelectItem value="8">8 lignes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Redimensionnable</Label>
          <Switch
            checked={localComponent?.componentData?.resizable ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.resizable', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Placeholder</Label>
        <Input
          value={localComponent?.componentData?.placeholder || 'Votre message...'}
          onChange={(e) => updateProperty('componentData.placeholder', e.target.value)}
          placeholder="Texte d'aide"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Limite de caractères</Label>
        <Input
          type="number"
          value={localComponent?.componentData?.maxLength || ''}
          onChange={(e) => updateProperty('componentData.maxLength', e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Limite (ex: 500)"
          className="mt-1 text-sm"
        />
      </div>
    </div>
  );
  const renderSelectConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Liste Déroulante</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Placeholder</Label>
          <Input
            value={localComponent?.componentData?.selectPlaceholder || 'Sélectionnez...'}
            onChange={(e) => updateProperty('componentData.selectPlaceholder', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Requis</Label>
          <Switch
            checked={localComponent?.componentData?.required || false}
            onCheckedChange={(checked) => updateProperty('componentData.required', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Options</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.selectOptions || []).map((option: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Texte"
                value={option.label || ''}
                onChange={(e) => {
                  const selectOptions = [...(localComponent?.componentData?.selectOptions || [])];
                  selectOptions[index] = { ...option, label: e.target.value };
                  updateProperty('componentData.selectOptions', selectOptions);
                }}
                className="flex-1 text-sm"
              />
              <Input
                placeholder="Valeur"
                value={option.value || ''}
                onChange={(e) => {
                  const selectOptions = [...(localComponent?.componentData?.selectOptions || [])];
                  selectOptions[index] = { ...option, value: e.target.value };
                  updateProperty('componentData.selectOptions', selectOptions);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const selectOptions = [...(localComponent?.componentData?.selectOptions || [])];
                  selectOptions.splice(index, 1);
                  updateProperty('componentData.selectOptions', selectOptions);
                }}
                className="h-8 w-8 p-0 text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const selectOptions = [...(localComponent?.componentData?.selectOptions || [])];
              selectOptions.push({ label: `Option ${selectOptions.length + 1}`, value: `option${selectOptions.length + 1}` });
              updateProperty('componentData.selectOptions', selectOptions);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une option
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCheckboxConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Case à Cocher</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Label</Label>
          <Input
            value={localComponent?.componentData?.checkboxLabel || 'Case à cocher'}
            onChange={(e) => updateProperty('componentData.checkboxLabel', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Cochée par défaut</Label>
          <Switch
            checked={localComponent?.componentData?.defaultChecked || false}
            onCheckedChange={(checked) => updateProperty('componentData.defaultChecked', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Description</Label>
        <Textarea
          value={localComponent?.componentData?.checkboxDescription || ''}
          onChange={(e) => updateProperty('componentData.checkboxDescription', e.target.value)}
          placeholder="Description optionnelle"
          className="mt-1 text-sm min-h-[50px]"
        />
      </div>
    </div>
  );

  const renderRadioConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Boutons Radio</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Nom du groupe</Label>
        <Input
          value={localComponent?.componentData?.radioGroupName || 'radioGroup'}
          onChange={(e) => updateProperty('componentData.radioGroupName', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Options radio</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.radioOptions || []).map((option: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Texte"
                value={option.label || ''}
                onChange={(e) => {
                  const radioOptions = [...(localComponent?.componentData?.radioOptions || [])];
                  radioOptions[index] = { ...option, label: e.target.value };
                  updateProperty('componentData.radioOptions', radioOptions);
                }}
                className="flex-1 text-sm"
              />
              <Input
                placeholder="Valeur"
                value={option.value || ''}
                onChange={(e) => {
                  const radioOptions = [...(localComponent?.componentData?.radioOptions || [])];
                  radioOptions[index] = { ...option, value: e.target.value };
                  updateProperty('componentData.radioOptions', radioOptions);
                }}
                className="flex-1 text-sm"
              />
              <Checkbox
                checked={option.defaultSelected || false}
                onCheckedChange={(checked) => {
                  const radioOptions = [...(localComponent?.componentData?.radioOptions || [])];
                  radioOptions[index] = { ...option, defaultSelected: checked };
                  updateProperty('componentData.radioOptions', radioOptions);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const radioOptions = [...(localComponent?.componentData?.radioOptions || [])];
                  radioOptions.splice(index, 1);
                  updateProperty('componentData.radioOptions', radioOptions);
                }}
                className="h-8 w-8 p-0 text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const radioOptions = [...(localComponent?.componentData?.radioOptions || [])];
              radioOptions.push({ label: `Option ${radioOptions.length + 1}`, value: `option${radioOptions.length + 1}` });
              updateProperty('componentData.radioOptions', radioOptions);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une option
          </Button>
        </div>
      </div>
    </div>
  );
  const renderSliderConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Curseur</h4>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Valeur min</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.sliderMin || 0}
            onChange={(e) => updateProperty('componentData.sliderMin', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Valeur max</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.sliderMax || 100}
            onChange={(e) => updateProperty('componentData.sliderMax', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Pas</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.sliderStep || 1}
            onChange={(e) => updateProperty('componentData.sliderStep', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Valeur par défaut</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.sliderDefault || 50}
            onChange={(e) => updateProperty('componentData.sliderDefault', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Afficher la valeur</Label>
          <Switch
            checked={localComponent?.componentData?.showValue ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showValue', checked)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderToggleConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Interrupteur</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Label</Label>
          <Input
            value={localComponent?.componentData?.toggleLabel || 'Activer'}
            onChange={(e) => updateProperty('componentData.toggleLabel', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Activé par défaut</Label>
          <Switch
            checked={localComponent?.componentData?.defaultToggled || false}
            onCheckedChange={(checked) => updateProperty('componentData.defaultToggled', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Description</Label>
        <Textarea
          value={localComponent?.componentData?.toggleDescription || ''}
          onChange={(e) => updateProperty('componentData.toggleDescription', e.target.value)}
          placeholder="Description optionnelle"
          className="mt-1 text-sm min-h-[50px]"
        />
      </div>
    </div>
  );

  const renderSearchConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Recherche</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Placeholder</Label>
          <Input
            value={localComponent?.componentData?.searchPlaceholder || 'Rechercher...'}
            onChange={(e) => updateProperty('componentData.searchPlaceholder', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Bouton de recherche</Label>
          <Switch
            checked={localComponent?.componentData?.showSearchButton ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showSearchButton', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Résultats suggérés</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.searchSuggestions || []).map((suggestion: string, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Suggestion"
                value={suggestion || ''}
                onChange={(e) => {
                  const searchSuggestions = [...(localComponent?.componentData?.searchSuggestions || [])];
                  searchSuggestions[index] = e.target.value;
                  updateProperty('componentData.searchSuggestions', searchSuggestions);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const searchSuggestions = [...(localComponent?.componentData?.searchSuggestions || [])];
                  searchSuggestions.splice(index, 1);
                  updateProperty('componentData.searchSuggestions', searchSuggestions);
                }}
                className="h-8 w-8 p-0 text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const searchSuggestions = [...(localComponent?.componentData?.searchSuggestions || [])];
              searchSuggestions.push(`Suggestion ${searchSuggestions.length + 1}`);
              updateProperty('componentData.searchSuggestions', searchSuggestions);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une suggestion
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPaginationConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Pagination</h4>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Pages totales</Label>
          <Input
            type="number"
            min="1"
            value={localComponent?.componentData?.totalPages || 10}
            onChange={(e) => updateProperty('componentData.totalPages', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Page actuelle</Label>
          <Input
            type="number"
            min="1"
            value={localComponent?.componentData?.currentPage || 1}
            onChange={(e) => updateProperty('componentData.currentPage', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Pages visibles</Label>
          <Input
            type="number"
            min="3"
            max="10"
            value={localComponent?.componentData?.visiblePages || 5}
            onChange={(e) => updateProperty('componentData.visiblePages', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Boutons Précédent/Suivant</Label>
          <Switch
            checked={localComponent?.componentData?.showPrevNext ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showPrevNext', checked)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Aller à la page</Label>
          <Switch
            checked={localComponent?.componentData?.showGoToPage || false}
            onCheckedChange={(checked) => updateProperty('componentData.showGoToPage', checked)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderRatingConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Notation</h4>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Nombre d'étoiles</Label>
          <Select
            value={String(localComponent?.componentData?.maxRating || 5)}
            onValueChange={(value) => updateProperty('componentData.maxRating', parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 étoiles</SelectItem>
              <SelectItem value="5">5 étoiles</SelectItem>
              <SelectItem value="10">10 étoiles</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Note actuelle</Label>
          <Input
            type="number"
            min="0"
            max={localComponent?.componentData?.maxRating || 5}
            step="0.1"
            value={localComponent?.componentData?.currentRating || 0}
            onChange={(e) => updateProperty('componentData.currentRating', parseFloat(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lecture seule</Label>
          <Switch
            checked={localComponent?.componentData?.readOnly || false}
            onCheckedChange={(checked) => updateProperty('componentData.readOnly', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Couleur active</Label>
          <Input
            type="color"
            value={localComponent?.componentData?.activeColor || '#fbbf24'}
            onChange={(e) => updateProperty('componentData.activeColor', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Afficher le texte</Label>
          <Switch
            checked={localComponent?.componentData?.showRatingText ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showRatingText', checked)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderUploadConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Upload de Fichier</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Types de fichier acceptés</Label>
          <Input
            value={localComponent?.componentData?.acceptedTypes || 'image/*'}
            onChange={(e) => updateProperty('componentData.acceptedTypes', e.target.value)}
            placeholder="ex: image/*, .pdf, .doc"
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Fichiers multiples</Label>
          <Switch
            checked={localComponent?.componentData?.multiple || false}
            onCheckedChange={(checked) => updateProperty('componentData.multiple', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Taille max (MB)</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.maxSize || 10}
            onChange={(e) => updateProperty('componentData.maxSize', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Glisser-déposer</Label>
          <Switch
            checked={localComponent?.componentData?.dragDrop ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.dragDrop', checked)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Texte d'aide</Label>
        <Textarea
          value={localComponent?.componentData?.uploadText || 'Cliquez ou glissez vos fichiers ici'}
          onChange={(e) => updateProperty('componentData.uploadText', e.target.value)}
          className="mt-1 text-sm min-h-[50px]"
        />
      </div>
    </div>
  );
  
  // Configuration de Gallery
  const renderGalleryConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration de Galerie</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre de la galerie</Label>
        <Input
          value={localComponent?.componentData?.title || 'Galerie Photos'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Galerie Photos"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Images de la galerie</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.images || []).map((image: any, index: number) => (
            <div key={index} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-xs font-medium text-blue-600">
                  Image {index + 1}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const images = [...(localComponent?.componentData?.images || [])];
                    images.splice(index, 1);
                    updateProperty('componentData.images', images);
                  }}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">URL de l'image</Label>
                  <div className="flex gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const base64Url = event.target?.result as string;
                            const images = [...(localComponent?.componentData?.images || [])];
                            images[index] = { ...image, src: base64Url };
                            updateProperty('componentData.images', images);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: 'none' }}
                      id={`file-input-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-input-${index}`)?.click()}
                      className="h-7 px-2 text-xs"
                      title="Parcourir les fichiers"
                    >
                      📁
                    </Button>
                    <Input
                      value={image.src || ''}
                      onChange={(e) => {
                        const images = [...(localComponent?.componentData?.images || [])];
                        images[index] = { ...image, src: e.target.value };
                        updateProperty('componentData.images', images);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="text-xs h-7 flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Texte alternatif</Label>
                  <Input
                    value={image.alt || ''}
                    onChange={(e) => {
                      const images = [...(localComponent?.componentData?.images || [])];
                      images[index] = { ...image, alt: e.target.value };
                      updateProperty('componentData.images', images);
                    }}
                    placeholder="Description de l'image"
                    className="text-xs h-7"
                  />
                </div>
                <div>
                  <Label className="text-xs">Légende (optionnelle)</Label>
                  <Input
                    value={image.caption || ''}
                    onChange={(e) => {
                      const images = [...(localComponent?.componentData?.images || [])];
                      images[index] = { ...image, caption: e.target.value };
                      updateProperty('componentData.images', images);
                    }}
                    placeholder="Légende de l'image"
                    className="text-xs h-7"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const currentImages = localComponent?.componentData?.images || [];
              const newImage = { 
                src: '',
                alt: `Image ${currentImages.length + 1}`,
                caption: ''
              };
              const updatedImages = [...currentImages, newImage];
              updateProperty('componentData.images', updatedImages);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une image ({(localComponent?.componentData?.images || []).length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Colonnes</Label>
          <Select
            value={localComponent?.componentData?.columns || '3'}
            onValueChange={(value) => updateProperty('componentData.columns', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 colonnes</SelectItem>
              <SelectItem value="3">3 colonnes</SelectItem>
              <SelectItem value="4">4 colonnes</SelectItem>
              <SelectItem value="6">6 colonnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Espacement</Label>
          <Select
            value={localComponent?.componentData?.gap || '6'}
            onValueChange={(value) => updateProperty('componentData.gap', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Petit</SelectItem>
              <SelectItem value="4">Moyen</SelectItem>
              <SelectItem value="6">Normal</SelectItem>
              <SelectItem value="8">Grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={localComponent?.componentData?.showCaptions ?? false}
          onCheckedChange={(checked) => updateProperty('componentData.showCaptions', checked)}
        />
        <Label className="text-xs">Afficher les légendes</Label>
      </div>
    </div>
  );

  const renderIconConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Icon Avancée</h4>
      
      {/* Presets thématiques */}
      <div>
        <Label className="text-xs text-gray-600">Presets thématiques</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'social');
              updateProperty('componentData.library', 'lucide');
              updateProperty('componentData.iconName', 'share-2');
              updateProperty('componentData.styling.variant', 'circle');
              updateProperty('componentData.colors.icon', '#1da1f2');
            }}
            className="text-xs"
          >
            📱 Social
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'navigation');
              updateProperty('componentData.library', 'lucide');
              updateProperty('componentData.iconName', 'menu');
              updateProperty('componentData.styling.variant', 'square');
              updateProperty('componentData.colors.icon', '#374151');
            }}
            className="text-xs"
          >
            🧭 Navigation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'action');
              updateProperty('componentData.library', 'lucide');
              updateProperty('componentData.iconName', 'play');
              updateProperty('componentData.styling.variant', 'circle');
              updateProperty('componentData.animation.type', 'pulse');
            }}
            className="text-xs"
          >
            ⚡ Action
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'status');
              updateProperty('componentData.library', 'lucide');
              updateProperty('componentData.iconName', 'check-circle');
              updateProperty('componentData.colors.icon', '#10b981');
              updateProperty('componentData.styling.background', false);
            }}
            className="text-xs"
          >
            ✅ Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'ecommerce');
              updateProperty('componentData.library', 'lucide');
              updateProperty('componentData.iconName', 'shopping-cart');
              updateProperty('componentData.interaction.badge.show', true);
              updateProperty('componentData.interaction.badge.text', '3');
            }}
            className="text-xs"
          >
            🛒 E-commerce
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateProperty('componentData.preset', 'minimal');
              updateProperty('componentData.library', 'lucide');
              updateProperty('componentData.iconName', 'heart');
              updateProperty('componentData.styling.background', false);
              updateProperty('componentData.styling.border', false);
            }}
            className="text-xs"
          >
            ⭕ Minimal
          </Button>
        </div>
      </div>

      {/* Bibliothèque et icône */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Bibliothèque</Label>
          <Select
            value={localComponent?.componentData?.library || 'lucide'}
            onValueChange={(value) => updateProperty('componentData.library', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lucide">Lucide Icons</SelectItem>
              <SelectItem value="heroicons">Heroicons</SelectItem>
              <SelectItem value="fontawesome">Font Awesome</SelectItem>
              <SelectItem value="emoji">Emoji</SelectItem>
              <SelectItem value="custom">SVG personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={localComponent?.componentData?.size || 'medium'}
            onValueChange={(value) => updateProperty('componentData.size', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="micro">Micro (16px)</SelectItem>
              <SelectItem value="small">Petit (20px)</SelectItem>
              <SelectItem value="medium">Moyen (24px)</SelectItem>
              <SelectItem value="large">Grand (32px)</SelectItem>
              <SelectItem value="xl">XL (40px)</SelectItem>
              <SelectItem value="xxl">XXL (48px)</SelectItem>
              <SelectItem value="giant">Géant (64px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sélection d'icône */}
      <div>
        <Label className="text-xs text-gray-600">
          {localComponent?.componentData?.library === 'emoji' ? 'Emoji' : 'Nom de l\'icône'}
        </Label>
        <Input
          value={localComponent?.componentData?.iconName || 'star'}
          onChange={(e) => updateProperty('componentData.iconName', e.target.value)}
          placeholder={
            localComponent?.componentData?.library === 'emoji' ? '⭐ 🚀 💡 ❤️' :
            localComponent?.componentData?.library === 'lucide' ? 'heart, star, home, user' :
            'search, bell, menu, settings'
          }
          className="mt-1 text-sm"
        />
        
        {/* Suggestions rapides d'icônes */}
        <div className="mt-2">
          <Label className="text-xs text-gray-500">Suggestions populaires :</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {localComponent?.componentData?.library === 'emoji' ? 
              ['⭐', '🚀', '💡', '❤️', '🎯', '🔥', '⚡', '🎨'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => updateProperty('componentData.iconName', emoji)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {emoji}
                </button>
              )) :
              ['heart', 'star', 'home', 'user', 'settings', 'search', 'bell', 'menu'].map(icon => (
                <button
                  key={icon}
                  onClick={() => updateProperty('componentData.iconName', icon)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {icon}
                </button>
              ))
            }
          </div>
        </div>
      </div>

      {/* SVG personnalisé */}
      {localComponent?.componentData?.library === 'custom' && (
        <div>
          <Label className="text-xs text-gray-600">Code SVG personnalisé</Label>
          <textarea
            value={localComponent?.componentData?.customSvg || ''}
            onChange={(e) => updateProperty('componentData.customSvg', e.target.value)}
            placeholder="<svg>...</svg>"
            className="mt-1 w-full h-20 text-xs border rounded p-2"
          />
        </div>
      )}

      {/* Style d'affichage */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Variant</Label>
          <Select
            value={localComponent?.componentData?.styling?.variant || 'circle'}
            onValueChange={(value) => updateProperty('componentData.styling.variant', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="circle">Cercle</SelectItem>
              <SelectItem value="square">Carré</SelectItem>
              <SelectItem value="rounded">Arrondi</SelectItem>
              <SelectItem value="none">Sans fond</SelectItem>
              <SelectItem value="badge">Badge</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Options d'affichage</Label>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="flex items-center space-x-1">
              <Checkbox
                id="background"
                checked={localComponent?.componentData?.styling?.background ?? true}
                onCheckedChange={(checked) => updateProperty('componentData.styling.background', checked)}
              />
              <Label htmlFor="background" className="text-xs">Fond</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id="border"
                checked={localComponent?.componentData?.styling?.border ?? true}
                onCheckedChange={(checked) => updateProperty('componentData.styling.border', checked)}
              />
              <Label htmlFor="border" className="text-xs">Bordure</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id="shadow"
                checked={localComponent?.componentData?.styling?.shadow ?? true}
                onCheckedChange={(checked) => updateProperty('componentData.styling.shadow', checked)}
              />
              <Label htmlFor="shadow" className="text-xs">Ombre</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id="rounded"
                checked={localComponent?.componentData?.styling?.rounded ?? true}
                onCheckedChange={(checked) => updateProperty('componentData.styling.rounded', checked)}
              />
              <Label htmlFor="rounded" className="text-xs">Arrondi</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Couleurs */}
      <div>
        <Label className="text-xs text-gray-600">Couleurs</Label>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div>
            <Label className="text-xs">Icône</Label>
            <Input
              type="color"
              value={localComponent?.componentData?.colors?.icon || '#3b82f6'}
              onChange={(e) => updateProperty('componentData.colors.icon', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Icône (hover)</Label>
            <Input
              type="color"
              value={localComponent?.componentData?.colors?.hoverIcon || '#2563eb'}
              onChange={(e) => updateProperty('componentData.colors.hoverIcon', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
          {localComponent?.componentData?.styling?.background && (
            <>
              <div>
                <Label className="text-xs">Fond</Label>
                <Input
                  type="color"
                  value={localComponent?.componentData?.colors?.background || '#f3f4f6'}
                  onChange={(e) => updateProperty('componentData.colors.background', e.target.value)}
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Fond (hover)</Label>
                <Input
                  type="color"
                  value={localComponent?.componentData?.colors?.hoverBackground || '#e5e7eb'}
                  onChange={(e) => updateProperty('componentData.colors.hoverBackground', e.target.value)}
                  className="mt-1 h-8"
                />
              </div>
            </>
          )}
          {localComponent?.componentData?.styling?.border && (
            <div className="col-span-2">
              <Label className="text-xs">Bordure</Label>
              <Input
                type="color"
                value={localComponent?.componentData?.colors?.border || '#d1d5db'}
                onChange={(e) => updateProperty('componentData.colors.border', e.target.value)}
                className="mt-1 h-8"
              />
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Animation</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={localComponent?.componentData?.animation?.type || 'none'}
              onValueChange={(value) => updateProperty('componentData.animation.type', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                <SelectItem value="pulse">Pulsation</SelectItem>
                <SelectItem value="bounce">Rebond</SelectItem>
                <SelectItem value="rotate">Rotation</SelectItem>
                <SelectItem value="shake">Secousse</SelectItem>
                <SelectItem value="glow">Lueur</SelectItem>
                <SelectItem value="scale">Agrandissement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Déclencheur</Label>
            <Select
              value={localComponent?.componentData?.animation?.trigger || 'hover'}
              onValueChange={(value) => updateProperty('componentData.animation.trigger', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Toujours</SelectItem>
                <SelectItem value="hover">Au survol</SelectItem>
                <SelectItem value="click">Au clic</SelectItem>
                <SelectItem value="focus">Au focus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Vitesse</Label>
            <Select
              value={localComponent?.componentData?.animation?.speed || 'normal'}
              onValueChange={(value) => updateProperty('componentData.animation.speed', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Lente</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="fast">Rapide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Durée</Label>
            <Input
              value={localComponent?.componentData?.animation?.duration || '0.2s'}
              onChange={(e) => updateProperty('componentData.animation.duration', e.target.value)}
              placeholder="0.2s"
              className="mt-1 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Interactivité */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Interactivité</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clickable"
              checked={localComponent?.componentData?.interaction?.clickable ?? false}
              onCheckedChange={(checked) => updateProperty('componentData.interaction.clickable', checked)}
            />
            <Label htmlFor="clickable" className="text-xs">Cliquable</Label>
          </div>
          {localComponent?.componentData?.interaction?.clickable && (
            <div>
              <Input
                value={localComponent?.componentData?.interaction?.link || ''}
                onChange={(e) => updateProperty('componentData.interaction.link', e.target.value)}
                placeholder="URL de destination"
                className="text-xs"
              />
            </div>
          )}
        </div>
        
        <div>
          <Input
            value={localComponent?.componentData?.interaction?.tooltip || ''}
            onChange={(e) => updateProperty('componentData.interaction.tooltip', e.target.value)}
            placeholder="Texte d'info-bulle (optionnel)"
            className="text-xs"
          />
        </div>
      </div>

      {/* Badge */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-badge"
            checked={localComponent?.componentData?.interaction?.badge?.show ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.interaction.badge.show', checked)}
          />
          <Label htmlFor="show-badge" className="text-xs">Afficher un badge</Label>
        </div>
        
        {localComponent?.componentData?.interaction?.badge?.show && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={localComponent?.componentData?.interaction?.badge?.text || ''}
                onChange={(e) => updateProperty('componentData.interaction.badge.text', e.target.value)}
                placeholder="1, !, NEW"
                className="text-xs"
              />
              <Select
                value={localComponent?.componentData?.interaction?.badge?.position || 'top-right'}
                onValueChange={(value) => updateProperty('componentData.interaction.badge.position', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-right">Haut-droite</SelectItem>
                  <SelectItem value="top-left">Haut-gauche</SelectItem>
                  <SelectItem value="bottom-right">Bas-droite</SelectItem>
                  <SelectItem value="bottom-left">Bas-gauche</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="color"
              value={localComponent?.componentData?.interaction?.badge?.color || '#ef4444'}
              onChange={(e) => updateProperty('componentData.interaction.badge.color', e.target.value)}
              className="h-8"
            />
          </div>
        )}
      </div>

      {/* Accessibilité */}
      <div className="space-y-2">
        <Label className="text-xs text-gray-600">Accessibilité</Label>
        <Input
          value={localComponent?.componentData?.accessibility?.ariaLabel || ''}
          onChange={(e) => updateProperty('componentData.accessibility.ariaLabel', e.target.value)}
          placeholder="Description pour lecteurs d'écran"
          className="text-xs"
        />
        <Input
          value={localComponent?.componentData?.accessibility?.title || ''}
          onChange={(e) => updateProperty('componentData.accessibility.title', e.target.value)}
          placeholder="Titre (tooltip natif)"
          className="text-xs"
        />
      </div>

      {/* Configuration responsive */}
      <div className="space-y-3">
        <Label className="text-xs text-gray-600">Configuration responsive</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">📱 Mobile</Label>
            <Input
              value={localComponent?.componentData?.responsive?.mobile?.size || '24px'}
              onChange={(e) => updateProperty('componentData.responsive.mobile.size', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">📱 Tablet</Label>
            <Input
              value={localComponent?.componentData?.responsive?.tablet?.size || '32px'}
              onChange={(e) => updateProperty('componentData.responsive.tablet.size', e.target.value)}
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">🖥️ Desktop</Label>
            <Input
              value={localComponent?.componentData?.responsive?.desktop?.size || '32px'}
              onChange={(e) => updateProperty('componentData.responsive.desktop.size', e.target.value)}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Preview en temps réel */}
      <div className="border rounded p-3 bg-gray-50">
        <Label className="text-xs text-gray-600 mb-2 block">Aperçu temps réel</Label>
        <div className="flex items-center justify-center py-4">
          <div
            className="relative inline-flex items-center justify-center transition-all duration-200"
            style={{
              width: localComponent?.componentData?.size === 'micro' ? '40px' :
                     localComponent?.componentData?.size === 'small' ? '50px' :
                     localComponent?.componentData?.size === 'medium' ? '60px' :
                     localComponent?.componentData?.size === 'large' ? '70px' :
                     localComponent?.componentData?.size === 'xl' ? '80px' :
                     localComponent?.componentData?.size === 'xxl' ? '90px' :
                     localComponent?.componentData?.size === 'giant' ? '100px' : '60px',
              height: localComponent?.componentData?.size === 'micro' ? '40px' :
                      localComponent?.componentData?.size === 'small' ? '50px' :
                      localComponent?.componentData?.size === 'medium' ? '60px' :
                      localComponent?.componentData?.size === 'large' ? '70px' :
                      localComponent?.componentData?.size === 'xl' ? '80px' :
                      localComponent?.componentData?.size === 'xxl' ? '90px' :
                      localComponent?.componentData?.size === 'giant' ? '100px' : '60px',
              backgroundColor: localComponent?.componentData?.styling?.background ? 
                localComponent?.componentData?.colors?.background || '#f3f4f6' : 'transparent',
              borderWidth: localComponent?.componentData?.styling?.border ? '2px' : '0',
              borderColor: localComponent?.componentData?.colors?.border || '#d1d5db',
              borderStyle: 'solid',
              borderRadius: localComponent?.componentData?.styling?.variant === 'circle' ? '50%' :
                           localComponent?.componentData?.styling?.variant === 'rounded' ? '12px' :
                           localComponent?.componentData?.styling?.variant === 'square' ? '8px' : '0',
              boxShadow: localComponent?.componentData?.styling?.shadow ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
              color: localComponent?.componentData?.colors?.icon || '#3b82f6',
              fontSize: localComponent?.componentData?.size === 'micro' ? '14px' :
                       localComponent?.componentData?.size === 'small' ? '18px' :
                       localComponent?.componentData?.size === 'medium' ? '22px' :
                       localComponent?.componentData?.size === 'large' ? '28px' :
                       localComponent?.componentData?.size === 'xl' ? '34px' :
                       localComponent?.componentData?.size === 'xxl' ? '40px' :
                       localComponent?.componentData?.size === 'giant' ? '48px' : '22px'
            }}
          >
            {/* Icône */}
            <span>
              {localComponent?.componentData?.library === 'emoji' ? 
                localComponent?.componentData?.iconName || '⭐' :
                localComponent?.componentData?.iconName === 'heart' ? '♥' :
                localComponent?.componentData?.iconName === 'star' ? '★' :
                localComponent?.componentData?.iconName === 'home' ? '🏠' :
                localComponent?.componentData?.iconName === 'user' ? '👤' :
                localComponent?.componentData?.iconName === 'settings' ? '⚙️' :
                localComponent?.componentData?.iconName === 'search' ? '🔍' :
                localComponent?.componentData?.iconName === 'bell' ? '🔔' :
                localComponent?.componentData?.iconName === 'menu' ? '☰' :
                localComponent?.componentData?.iconName || '★'
              }
            </span>
            
            {/* Badge */}
            {localComponent?.componentData?.interaction?.badge?.show && (
              <span
                className="absolute text-xs font-bold text-white rounded-full min-w-[16px] h-4 flex items-center justify-center px-1"
                style={{
                  backgroundColor: localComponent?.componentData?.interaction?.badge?.color || '#ef4444',
                  fontSize: '10px',
                  top: localComponent?.componentData?.interaction?.badge?.position?.includes('top') ? '-2px' : 'auto',
                  bottom: localComponent?.componentData?.interaction?.badge?.position?.includes('bottom') ? '-2px' : 'auto',
                  right: localComponent?.componentData?.interaction?.badge?.position?.includes('right') ? '-2px' : 'auto',
                  left: localComponent?.componentData?.interaction?.badge?.position?.includes('left') ? '-2px' : 'auto'
                }}
              >
                {localComponent?.componentData?.interaction?.badge?.text || '1'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderListConfiguration = () => {
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-purple-900">Configuration de Liste</h4>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="list-items">
            <AccordionTrigger className="text-sm py-2">
              <div className="flex items-center justify-between w-full pr-4">
                <span>Éléments de liste</span>
                <Badge variant="outline" className="text-xs">
                  {(localComponent?.componentData?.listItems || []).length} éléments
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {(localComponent?.componentData?.listItems || []).map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-xs font-medium text-blue-600">
                        Élément {index + 1}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const items = [...(localComponent?.componentData?.listItems || [])];
                          items.splice(index, 1);
                          updateProperty('componentData.listItems', items);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Texte</Label>
                        <Input
                          value={item.text || ''}
                          onChange={(e) => {
                            const items = [...(localComponent?.componentData?.listItems || [])];
                            items[index] = { ...item, text: e.target.value };
                            updateProperty('componentData.listItems', items);
                          }}
                          placeholder="Texte de l'élément"
                          className="text-xs h-7"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentItems = localComponent?.componentData?.listItems || [];
                      const newItem = { 
                        text: `Élément ${currentItems.length + 1}`,
                        link: ''
                      };
                      const updatedItems = [...currentItems, newItem];
                      updateProperty('componentData.listItems', updatedItems);
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un élément
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

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