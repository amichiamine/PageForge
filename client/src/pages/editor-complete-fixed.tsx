import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'wouter';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ColorPicker from '@/components/editor/color-picker';
import Header from '@/components/layout/header';
import { 
  Menu, Settings, Plus, Save, Code, Users, Download, 
  Eye, Upload, Trash2, X, Zap 
} from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollaboration } from '@/hooks/useCollaboration';
import type { ComponentDefinition } from '@shared/schema';
import { nanoid } from 'nanoid';

// Composants disponibles - MINIMAL POUR TEST
const componentTypes = [
  { type: 'heading', name: 'Titre', category: 'Text', icon: '📝' },
  { type: 'paragraph', name: 'Paragraphe', category: 'Text', icon: '📄' },
  { type: 'button', name: 'Bouton', category: 'Interactive', icon: '🔘' },
  { type: 'image', name: 'Image', category: 'Media', icon: '🖼️' },
  { type: 'container', name: 'Container', category: 'Layout', icon: '📦' },
  { type: 'card', name: 'Card', category: 'Layout', icon: '🗃️' }
];

export default function EditorComplete() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const collaboration = useCollaboration({ projectId: id || '' });
  
  // Project data
  const { 
    data: projects, 
    isLoading, 
    error, 
    refetch
  } = useProjects();
  const project = projects?.find(p => p.id === id);
  
  // Si pas d'ID spécifié, utiliser le premier projet ou créer un projet temporaire
  const activeProject = project || (projects?.[0]) || {
    id: 'temp',
    name: 'Nouveau projet',
    type: 'single-page',
    content: { pages: [{ id: 'main', name: 'Accueil', path: '/', content: { structure: [] } }] }
  };
  
  // Debugging pour voir le problème
  console.log('ID recherché:', id);
  console.log('Projets disponibles:', projects);
  console.log('Projet trouvé:', project);
  console.log('Projet actif:', activeProject);
  
  // Editor state
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDefinition | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  
  // UI state
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showTouchPalette, setShowTouchPalette] = useState(false);
  
  // Page settings
  const [pageBackground, setPageBackground] = useState('#ffffff');
  const [pageBackgroundType, setPageBackgroundType] = useState<'solid' | 'gradient' | 'image'>('solid');

  // Initialize components from project
  useEffect(() => {
    const structure = activeProject?.content?.pages?.[0]?.content?.structure;
    if (structure && Array.isArray(structure)) {
      setComponents(structure);
    }
  }, [activeProject]);

  // Draggable component for palette
  function DraggableComponent({ component }: { component: typeof componentTypes[0] }) {
    const [{ isDragging }, drag] = useDrag({
      type: 'new-component',
      item: { componentType: component.type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`p-2 border rounded cursor-move text-center hover:bg-gray-50 ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="text-lg mb-1">{component.icon}</div>
        <div className="text-xs">{component.name}</div>
      </div>
    );
  }

  // Drop zone
  function DropZone({
    components,
    selectedComponent,
    onComponentSelect,
    onComponentAdd,
    onComponentMove,
    onComponentUpdate,
    onComponentDelete,
  }: {
    components: ComponentDefinition[];
    selectedComponent: ComponentDefinition | null;
    onComponentSelect: (component: ComponentDefinition | null) => void;
    onComponentAdd: (type: string, position: { x: number; y: number }) => void;
    onComponentMove: (id: string, position: { x: number; y: number }) => void;
    onComponentUpdate: (component: ComponentDefinition) => void;
    onComponentDelete: (id: string) => void;
  }) {
    const [{ isOver }, drop] = useDrop({
      accept: ['new-component', 'existing-component'],
      drop: (item: any, monitor) => {
        const offset = monitor.getDropResult();
        const clientOffset = monitor.getClientOffset();

        if (clientOffset && item.componentType) {
          onComponentAdd(item.componentType, {
            x: clientOffset.x - 250,
            y: clientOffset.y - 150,
          });
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`relative w-full h-full min-h-[600px] bg-white ${
          isOver ? 'bg-blue-50' : ''
        }`}
        style={{ 
          background: pageBackground,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={() => onComponentSelect(null)}
      >
        {components.map((component) => (
          <DraggableRenderedComponent
            key={component.id}
            component={component}
            isSelected={selectedComponent?.id === component.id}
            onSelect={onComponentSelect}
            onMove={onComponentMove}
          />
        ))}
        
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">🎨</div>
              <p>Glissez des composants ici pour commencer</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Rendered component with drag capability
  function DraggableRenderedComponent({ 
    component, 
    isSelected, 
    onSelect,
    onMove 
  }: {
    component: ComponentDefinition;
    isSelected: boolean;
    onSelect: (component: ComponentDefinition | null) => void;
    onMove: (id: string, position: { x: number; y: number }) => void;
  }) {
    const [{ isDragging }, drag] = useDrag({
      type: 'existing-component',
      item: { id: component.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`absolute cursor-move ${
          isDragging ? 'opacity-50' : ''
        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: component.position?.x || 0,
          top: component.position?.y || 0,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(component);
        }}
      >
        {renderComponent(component)}
      </div>
    );
  }

  // Component renderer
  function renderComponent(component: ComponentDefinition) {
    const content = component.content || 'Nouveau composant';
    const styles = component.styles || {};

    switch (component.type) {
      case 'heading':
        return <h2 className="text-xl font-bold" style={styles}>{content}</h2>;
      case 'paragraph':
        return <p style={styles}>{content}</p>;
      case 'button':
        return <button className="px-4 py-2 bg-blue-500 text-white rounded" style={styles}>{content}</button>;
      case 'image':
        const imageSrc = component.attributes?.src;
        return imageSrc ? (
          <img src={imageSrc} alt="Component" className="max-w-32 max-h-20 object-cover rounded" style={styles} />
        ) : (
          <div className="w-32 h-20 bg-gray-200 flex items-center justify-center rounded" style={styles}>
            📷 Image
          </div>
        );
      case 'container':
        return <div className="p-4 border border-dashed border-gray-300 min-h-20" style={styles}>Container</div>;
      case 'card':
        return <div className="p-4 border rounded-lg shadow-sm bg-white" style={styles}>{content}</div>;
      default:
        return <div style={styles}>{content}</div>;
    }
  }

  // Event handlers
  const handleComponentAdd = useCallback((type: string, position: { x: number; y: number }) => {
    const newComponent: ComponentDefinition = {
      id: nanoid(),
      type,
      content: `Nouveau ${type}`,
      attributes: {},
      styles: {},
      position: { ...position, width: 200, height: 100 }
    };
    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent);
    setIsDirty(true);
  }, []);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    setComponents(prev => prev.map(comp =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    ));
    setSelectedComponent(updatedComponent);
    setIsDirty(true);
  }, []);

  const handleComponentMove = useCallback((componentId: string, position: { x: number; y: number }) => {
    setComponents(prev => prev.map(comp =>
      comp.id === componentId ? { 
        ...comp, 
        position: { x: position.x, y: position.y, width: comp.position?.width || 200, height: comp.position?.height || 100 }
      } : comp
    ));
    setIsDirty(true);
  }, []);

  const handleComponentDelete = useCallback((componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
    setIsDirty(true);
  }, [selectedComponent]);

  const handleSave = useCallback(() => {
    if (!activeProject) return;
    console.log('Sauvegarde des composants:', components);
    setIsDirty(false);
  }, [activeProject, components]);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">Erreur lors du chargement des projets</p>
          <Button onClick={() => refetch()} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && !project && id) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-orange-500 mb-4">Projet non trouvé (ID: {id})</p>
          <p className="text-sm text-gray-500 mb-4">
            Projets disponibles: {projects?.map(p => p.id).join(', ') || 'aucun'}
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <Header 
          title={activeProject.name}
          subtitle={`${activeProject.type} • ${components.length} composant(s)`}
          actions={
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {activeProject.type === 'single-page' && 'Page unique'}
                {activeProject.type === 'multi-page' && 'Multi-pages'}
                {activeProject.type === 'ftp-sync' && 'Sync FTP'}
                {activeProject.type === 'ftp-upload' && 'Upload FTP'}
              </Badge>

              <Separator orientation="vertical" className="h-6" />

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                title="Basculer palette composants"
              >
                <Menu className="w-4 h-4 mr-2" />
                Palette
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setRightPanelVisible(!rightPanelVisible)}
                title="Basculer propriétés"
              >
                <Settings className="w-4 h-4 mr-2" />
                Props
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={!isDirty}
                title="Sauvegarder"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauver
              </Button>
            </div>
          }
        />

        {/* Main editor content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Component palette */}
          <div className={`${isMobile && !leftPanelVisible ? 'hidden' : 'w-64'} border-r bg-white flex-shrink-0 overflow-y-auto`}>
            <div className="p-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Composants</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTouchPalette(true)}
                  className="h-6 w-6 p-0"
                  title="Ouvrir palette complète"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {componentTypes.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    component={component}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center - Visual editor */}
          <div className="flex-1 flex flex-col relative">
            <div className={`flex-1 overflow-auto ${isMobile ? 'p-1' : 'p-4'}`}>
              <Card className="h-full min-h-[600px]">
                <DropZone
                  components={components}
                  selectedComponent={selectedComponent}
                  onComponentSelect={setSelectedComponent}
                  onComponentAdd={handleComponentAdd}
                  onComponentMove={handleComponentMove}
                  onComponentUpdate={handleComponentUpdate}
                  onComponentDelete={handleComponentDelete}
                />
              </Card>
            </div>
          </div>

          {/* Right sidebar - Properties panel */}
          <div className={`${isMobile && !rightPanelVisible ? 'hidden' : 'w-80'} border-l bg-white flex-shrink-0 overflow-y-auto`}>
            <div className="p-2">
              <Tabs defaultValue="component" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="component" className="text-sm">Composant</TabsTrigger>
                  <TabsTrigger value="page" className="text-sm">Page</TabsTrigger>
                </TabsList>
                
                <TabsContent value="component" className="mt-2 space-y-2">
                  <h2 className="text-sm font-semibold">Propriétés</h2>
                  {selectedComponent ? (
                    <div className="space-y-4">
                      <Card className="p-3">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <span className="text-lg">{componentTypes.find(c => c.type === selectedComponent.type)?.icon}</span>
                          {componentTypes.find(c => c.type === selectedComponent.type)?.name || selectedComponent.type}
                        </h3>
                        <Badge variant="outline" className="mb-3">{selectedComponent.type}</Badge>
                        
                        {/* Content editor */}
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="content">Contenu</Label>
                            <Textarea
                              id="content"
                              value={selectedComponent.content || ''}
                              onChange={(e) => handleComponentUpdate({
                                ...selectedComponent,
                                content: e.target.value
                              })}
                              placeholder="Contenu du composant..."
                              className="mt-1"
                              rows={2}
                            />
                          </div>

                          {/* Position controls */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="x" className="text-xs">Position X</Label>
                              <Input
                                id="x"
                                type="number"
                                value={selectedComponent.position?.x || 0}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  position: {
                                    ...selectedComponent.position,
                                    x: parseInt(e.target.value) || 0,
                                    y: selectedComponent.position?.y || 0,
                                    width: selectedComponent.position?.width || 200,
                                    height: selectedComponent.position?.height || 100
                                  }
                                })}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="y" className="text-xs">Position Y</Label>
                              <Input
                                id="y"
                                type="number"
                                value={selectedComponent.position?.y || 0}
                                onChange={(e) => handleComponentUpdate({
                                  ...selectedComponent,
                                  position: {
                                    ...selectedComponent.position,
                                    x: selectedComponent.position?.x || 0,
                                    y: parseInt(e.target.value) || 0,
                                    width: selectedComponent.position?.width || 200,
                                    height: selectedComponent.position?.height || 100
                                  }
                                })}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          {/* Basic CSS */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Style CSS</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="color" className="text-xs">Couleur</Label>
                                <Input
                                  id="color"
                                  type="color"
                                  value={selectedComponent.styles?.color || '#000000'}
                                  onChange={(e) => handleComponentUpdate({
                                    ...selectedComponent,
                                    styles: { ...selectedComponent.styles, color: e.target.value }
                                  })}
                                  className="mt-1 h-8"
                                />
                              </div>
                              <div>
                                <Label htmlFor="backgroundColor" className="text-xs">Arrière-plan</Label>
                                <Input
                                  id="backgroundColor"
                                  type="color"
                                  value={selectedComponent.styles?.backgroundColor || '#ffffff'}
                                  onChange={(e) => handleComponentUpdate({
                                    ...selectedComponent,
                                    styles: { ...selectedComponent.styles, backgroundColor: e.target.value }
                                  })}
                                  className="mt-1 h-8"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Delete button */}
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="mt-4 w-full"
                            onClick={() => handleComponentDelete(selectedComponent.id)}
                          >
                            Supprimer le composant
                          </Button>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <Card className="p-3">
                      <p className="text-xs text-gray-500">Aucun composant sélectionné</p>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="page" className="mt-2 space-y-3">
                  <h2 className="text-xs font-semibold">Propriétés de la page</h2>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Arrière-plan de la page</Label>
                    <ColorPicker
                      value={pageBackground}
                      onChange={(color: string) => {
                        setPageBackground(color);
                        document.body.style.background = color;
                      }}
                      type={pageBackgroundType}
                      showBackgroundTypes={true}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}