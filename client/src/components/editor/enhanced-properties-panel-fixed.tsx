import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, Search, ChevronRight, ChevronDown, Settings,
  Type, Layout, Box, Palette, PaintBucket, Square, Sparkles
} from 'lucide-react';
import type { ComponentDefinition, Project } from '@shared/schema';
import { 
  massiveCSSProperties,
  getAllCategories,
  getPropertiesByCategory,
  getCSSPropertyDefinition
} from '@/lib/massive-css-properties';

interface EnhancedPropertiesPanelProps {
  component: ComponentDefinition | null;
  onComponentUpdate: (component: ComponentDefinition) => void;
  project: Project;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentDelete: (componentId: string) => void;
  className?: string;
}

export default function EnhancedPropertiesPanel({
  component,
  onComponentUpdate,
  onComponentDelete,
  className = ""
}: EnhancedPropertiesPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Layout']);
  const [activeTab, setActiveTab] = useState('properties');

  const categories = getAllCategories();
  
  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true;
    const properties = getPropertiesByCategory(category);
    return properties.some(prop => 
      prop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCSSPropertyDefinition(prop)?.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const updateCSSProperty = (property: string, value: string) => {
    if (!component) return;
    
    onComponentUpdate({
      ...component,
      styles: {
        ...component.styles,
        [property]: value
      }
    });
  };

  const renderPropertyControl = (property: string) => {
    const def = getCSSPropertyDefinition(property);
    if (!def) return null;

    const currentValue = component?.styles?.[property] || def.defaultValue;

    switch (def.type) {
      case 'select':
        return (
          <div key={property} className="space-y-1">
            <Label className="text-xs">{def.label}</Label>
            <Select value={currentValue} onValueChange={(value) => updateCSSProperty(property, value)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {def.options?.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'number':
        return (
          <div key={property} className="space-y-1">
            <Label className="text-xs">{def.label}</Label>
            <Input
              type="number"
              value={currentValue}
              onChange={(e) => updateCSSProperty(property, e.target.value)}
              min={def.min}
              max={def.max}
              className="h-7 text-xs"
            />
          </div>
        );
      
      case 'color':
        return (
          <div key={property} className="space-y-1">
            <Label className="text-xs">{def.label}</Label>
            <input
              type="color"
              value={currentValue}
              onChange={(e) => updateCSSProperty(property, e.target.value)}
              className="w-full h-7 rounded border cursor-pointer"
            />
          </div>
        );
      
      default:
        return (
          <div key={property} className="space-y-1">
            <Label className="text-xs">{def.label}</Label>
            <Input
              type="text"
              value={currentValue}
              onChange={(e) => updateCSSProperty(property, e.target.value)}
              placeholder={def.defaultValue}
              className="h-7 text-xs"
            />
          </div>
        );
    }
  };

  if (!component) {
    return (
      <Card className={`p-3 ${className}`}>
        <p className="text-xs text-gray-500">Aucun composant sélectionné</p>
        <p className="text-xs text-gray-400 mt-2">
          Cliquez sur un composant dans le canvas pour voir ses propriétés.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="properties" className="text-xs">Propriétés</TabsTrigger>
          <TabsTrigger value="css" className="text-xs">CSS Massif</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="space-y-3">
          <Card className="p-3">
            <h3 className="font-medium mb-3 text-sm">Composant: {component.type}</h3>
            
            <div className="space-y-3">
              {/* Contenu */}
              <div>
                <Label className="text-xs">Contenu</Label>
                <Input
                  type="text"
                  value={component.content || ''}
                  onChange={(e) => onComponentUpdate({
                    ...component,
                    content: e.target.value
                  })}
                  placeholder="Contenu du composant..."
                  className="h-7 text-xs"
                />
              </div>

              {/* Position & Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={component.position?.x || 0}
                    onChange={(e) => onComponentUpdate({
                      ...component,
                      position: { 
                        ...component.position,
                        x: parseInt(e.target.value) || 0
                      }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={component.position?.y || 0}
                    onChange={(e) => onComponentUpdate({
                      ...component,
                      position: { 
                        ...component.position,
                        y: parseInt(e.target.value) || 0
                      }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Largeur</Label>
                  <Input
                    type="number"
                    value={component.position?.width || 200}
                    onChange={(e) => onComponentUpdate({
                      ...component,
                      position: { 
                        ...component.position,
                        width: parseInt(e.target.value) || 200
                      }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Hauteur</Label>
                  <Input
                    type="number"
                    value={component.position?.height || 100}
                    onChange={(e) => onComponentUpdate({
                      ...component,
                      position: { 
                        ...component.position,
                        height: parseInt(e.target.value) || 100
                      }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => onComponentDelete(component.id)}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Supprimer
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="css" className="space-y-3">
          <Card className="p-3">
            <CardHeader className="p-0 pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <CardTitle className="text-sm">CSS Propriétés Massives</CardTitle>
              </div>
              
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher propriété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 h-7 text-xs"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredCategories.map(category => {
                  const properties = getPropertiesByCategory(category);
                  const isExpanded = expandedCategories.includes(category);
                  
                  const filteredProperties = searchTerm 
                    ? properties.filter(prop => 
                        prop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        getCSSPropertyDefinition(prop)?.label.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    : properties;

                  if (filteredProperties.length === 0) return null;

                  return (
                    <div key={category} className="border rounded">
                      <button
                        onClick={() => toggleCategory(category)}
                        className="w-full p-2 text-left flex items-center justify-between hover:bg-gray-50 text-xs"
                      >
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center space-x-1">
                          <Badge variant="secondary" className="text-xs">
                            {filteredProperties.length}
                          </Badge>
                          {isExpanded ? 
                            <ChevronDown className="w-3 h-3" /> : 
                            <ChevronRight className="w-3 h-3" />
                          }
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="p-2 border-t bg-gray-50/50 space-y-2">
                          {filteredProperties.map(property => renderPropertyControl(property))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}