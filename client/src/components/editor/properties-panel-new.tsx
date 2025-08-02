import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
        return renderFlexConfiguration();
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const slides = [...(localComponent?.componentData?.slides || [])];
                    const newIndex = slides.length;
                    slides.push({ 
                      image: '', 
                      title: `Slide ${newIndex + 1}`,
                      description: '',
                      buttonText: '',
                      buttonLink: '#',
                      backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
                    });
                    updateProperty('componentData.slides', slides);
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un slide
                </Button>
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
          checked={localComponent?.componentData?.responsive !== false}
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
          checked={localComponent?.componentData?.sticky !== false}
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
      
      <div>
        <Label className="text-xs text-gray-600">Éléments de la grille</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                placeholder="Contenu de l'élément"
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
              items.push({ text: `Élément ${items.length + 1}`, id: Date.now().toString() });
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
  const renderFeaturesConfiguration = () => renderGenericConfiguration();
  const renderCtaConfiguration = () => renderGenericConfiguration();
  const renderModalConfiguration = () => renderGenericConfiguration();
  const renderTooltipConfiguration = () => renderGenericConfiguration();
  const renderTabsConfiguration = () => renderGenericConfiguration();
  const renderTimelineConfiguration = () => renderGenericConfiguration();
  const renderBadgeConfiguration = () => renderGenericConfiguration();
  const renderAlertConfiguration = () => renderGenericConfiguration();
  const renderBreadcrumbConfiguration = () => renderGenericConfiguration();
  const renderProgressConfiguration = () => renderGenericConfiguration();
  const renderSpinnerConfiguration = () => renderGenericConfiguration();
  const renderDividerConfiguration = () => renderGenericConfiguration();
  const renderSpacerConfiguration = () => renderGenericConfiguration();
  const renderContainerConfiguration = () => renderGenericConfiguration();
  const renderFlexConfiguration = () => renderGenericConfiguration();
  const renderMainConfiguration = () => renderGenericConfiguration();
  const renderSectionConfiguration = () => renderGenericConfiguration();
  const renderArticleConfiguration = () => renderGenericConfiguration();
  const renderAsideConfiguration = () => renderGenericConfiguration();
  const renderMapConfiguration = () => renderGenericConfiguration();
  const renderChartConfiguration = () => renderGenericConfiguration();
  const renderCalendarConfiguration = () => renderGenericConfiguration();
  const renderInputConfiguration = () => renderGenericConfiguration();
  const renderTextareaConfiguration = () => renderGenericConfiguration();
  const renderSelectConfiguration = () => renderGenericConfiguration();
  const renderCheckboxConfiguration = () => renderGenericConfiguration();
  const renderRadioConfiguration = () => renderGenericConfiguration();
  const renderSliderConfiguration = () => renderGenericConfiguration();
  const renderToggleConfiguration = () => renderGenericConfiguration();
  const renderSearchConfiguration = () => renderGenericConfiguration();
  const renderPaginationConfiguration = () => renderGenericConfiguration();
  const renderRatingConfiguration = () => renderGenericConfiguration();
  const renderUploadConfiguration = () => renderGenericConfiguration();

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