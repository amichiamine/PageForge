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
              <SelectItem value="none">Aucun</SelectItem>
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
      <h4 className="text-sm font-semibold text-purple-900">Configuration du Container</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type de container</Label>
          <Select
            value={localComponent?.componentData?.containerType || 'content'}
            onValueChange={(value) => updateProperty('componentData.containerType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">Contenu</SelectItem>
              <SelectItem value="hero">Section héro</SelectItem>
              <SelectItem value="feature">Zone features</SelectItem>
              <SelectItem value="wrapper">Wrapper</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <SelectItem value="1200px">Standard (1200px)</SelectItem>
              <SelectItem value="1000px">Compact (1000px)</SelectItem>
              <SelectItem value="800px">Étroit (800px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Padding vertical</Label>
          <Select
            value={localComponent?.componentData?.paddingY || '20px'}
            onValueChange={(value) => updateProperty('componentData.paddingY', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Aucun</SelectItem>
              <SelectItem value="10px">Petit</SelectItem>
              <SelectItem value="20px">Moyen</SelectItem>
              <SelectItem value="40px">Grand</SelectItem>
              <SelectItem value="60px">Très grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Padding horizontal</Label>
          <Select
            value={localComponent?.componentData?.paddingX || '20px'}
            onValueChange={(value) => updateProperty('componentData.paddingX', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Aucun</SelectItem>
              <SelectItem value="15px">Petit</SelectItem>
              <SelectItem value="20px">Moyen</SelectItem>
              <SelectItem value="30px">Grand</SelectItem>
              <SelectItem value="40px">Très grand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Contenu du container</Label>
        <Textarea
          value={localComponent?.content || 'Zone de contenu'}
          onChange={(e) => updateProperty('content', e.target.value)}
          placeholder="Contenu affiché dans le container"
          className="mt-1 text-sm min-h-[60px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Bordure visible</Label>
          <Switch
            checked={localComponent?.componentData?.showBorder ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showBorder', checked)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Centré</Label>
          <Switch
            checked={localComponent?.componentData?.centered ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.centered', checked)}
            className="mt-1"
          />
        </div>
      </div>
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
      <h4 className="text-sm font-semibold text-purple-900">Configuration Séparateur</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type de séparateur</Label>
          <Select
            value={localComponent?.componentData?.dividerType || 'line'}
            onValueChange={(value) => updateProperty('componentData.dividerType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Ligne</SelectItem>
              <SelectItem value="dashed">Pointillés</SelectItem>
              <SelectItem value="dotted">Points</SelectItem>
              <SelectItem value="double">Double ligne</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Épaisseur</Label>
          <Select
            value={localComponent?.componentData?.thickness || '1px'}
            onValueChange={(value) => updateProperty('componentData.thickness', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1px">Fin (1px)</SelectItem>
              <SelectItem value="2px">Moyen (2px)</SelectItem>
              <SelectItem value="3px">Épais (3px)</SelectItem>
              <SelectItem value="4px">Très épais (4px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Couleur</Label>
        <Input
          type="color"
          value={localComponent?.componentData?.dividerColor || '#e5e7eb'}
          onChange={(e) => updateProperty('componentData.dividerColor', e.target.value)}
          className="mt-1 h-8"
        />
      </div>
    </div>
  );

  const renderSpacerConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-purple-900">Configuration Espacement</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Hauteur d'espacement</Label>
        <Select
          value={localComponent?.componentData?.spacerHeight || '20px'}
          onValueChange={(value) => updateProperty('componentData.spacerHeight', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10px">Petit (10px)</SelectItem>
            <SelectItem value="20px">Moyen (20px)</SelectItem>
            <SelectItem value="30px">Grand (30px)</SelectItem>
            <SelectItem value="50px">Très grand (50px)</SelectItem>
            <SelectItem value="80px">Extra grand (80px)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Visible en édition</Label>
        <Switch
          checked={localComponent?.componentData?.showInEditor ?? false}
          onCheckedChange={(checked) => updateProperty('componentData.showInEditor', checked)}
          className="mt-1"
        />
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
      <h4 className="text-sm font-semibold text-purple-900">Configuration Icône</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type d'icône</Label>
          <Select
            value={localComponent?.componentData?.iconType || 'lucide'}
            onValueChange={(value) => updateProperty('componentData.iconType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lucide">Lucide Icons</SelectItem>
              <SelectItem value="fontawesome">Font Awesome</SelectItem>
              <SelectItem value="feather">Feather Icons</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Select
            value={localComponent?.componentData?.iconSize || '24'}
            onValueChange={(value) => updateProperty('componentData.iconSize', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16">Petit (16px)</SelectItem>
              <SelectItem value="24">Moyen (24px)</SelectItem>
              <SelectItem value="32">Grand (32px)</SelectItem>
              <SelectItem value="48">Très grand (48px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Nom de l'icône</Label>
        <Input
          value={localComponent?.componentData?.iconName || 'heart'}
          onChange={(e) => updateProperty('componentData.iconName', e.target.value)}
          placeholder="Ex: heart, star, home"
          className="mt-1 text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs text-gray-600">Couleur</Label>
        <Input
          type="color"
          value={localComponent?.componentData?.iconColor || '#374151'}
          onChange={(e) => updateProperty('componentData.iconColor', e.target.value)}
          className="mt-1 h-8"
        />
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