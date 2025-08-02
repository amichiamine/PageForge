import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { nanoid } from 'nanoid';
import ResizableComponent from './resizable-component';
import AlignmentGuides from './alignment-guides';
import ComponentDebugger from './component-debugger';
import type { Project, ComponentDefinition } from '@shared/schema';
import { 
  createComponent, 
  findComponentById, 
  updateComponentInTree, 
  removeComponentFromTree
} from '@/lib/editor-utils';

interface VisualEditorProps {
  project: Project | null;
  selectedComponent: ComponentDefinition | null;
  onComponentSelect: (component: ComponentDefinition | null) => void;
  onComponentUpdate: (project: Project) => void;
  showAlignmentGuides?: boolean;
}

interface DragItem {
  type: string;
  id?: string;
  componentType?: string;
  isExisting?: boolean;
}

const VisualEditor: React.FC<VisualEditorProps> = ({
  project,
  selectedComponent,
  onComponentSelect,
  onComponentUpdate,
  showAlignmentGuides = true
}) => {
  const [draggedComponent, setDraggedComponent] = useState<ComponentDefinition | null>(null);
  const [guides, setGuides] = useState<{ x: number[], y: number[] }>({ x: [], y: [] });
  const [debuggerVisible, setDebuggerVisible] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['component', 'COMPONENT', 'EXISTING_COMPONENT'],
    drop: (item: DragItem, monitor) => {
      if (!project) return;

      const offset = monitor.getClientOffset();
      const editorRect = editorRef.current?.getBoundingClientRect();

      if (!offset || !editorRect) return;

      // Ajuster les coordonnées pour tenir compte du scroll et des marges
      const x = Math.max(10, offset.x - editorRect.left - 10);
      const y = Math.max(10, offset.y - editorRect.top - 10);

      if (item.isExisting && item.id) {
        // Moving existing component
        handleComponentMove(item.id, x, y);
      } else if (item.componentType || item.type) {
        // Adding new component
        handleComponentAdd(item.componentType || item.type, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleComponentAdd = useCallback((componentType: string, x: number, y: number) => {
    if (!project || !project.content?.pages?.[0]) return;

    console.log('Adding component of type:', componentType);
    const newComponent = createComponent(componentType);
    console.log('Created component:', newComponent);
    
    // Tailles réduites pour tous les composants
    const baseWidths: Record<string, string> = {
      'container': '250px',
      'section': '280px', 
      'header': '300px',
      'footer': '300px',
      'heading': '200px',
      'paragraph': '220px',
      'image': '180px',
      'button': '120px',
      'link': '100px',
      'form': '240px',
      'list': '180px',
      'video': '200px',
      'audio': '200px',
      'calendar': '200px',
      'contact': '200px',
      'testimonial': '220px',
      'pricing': '200px'
    };

    const baseHeights: Record<string, string> = {
      'container': '120px',
      'section': '150px',
      'header': '80px', 
      'footer': '80px',
      'heading': '40px',
      'paragraph': '60px',
      'image': '120px',
      'button': '36px',
      'link': '24px',
      'form': '200px',
      'list': '100px',
      'video': '120px',
      'audio': '50px',
      'calendar': '200px',
      'contact': '150px',
      'testimonial': '120px',
      'pricing': '200px'
    };
    
    newComponent.styles = {
      ...newComponent.styles,
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: baseWidths[componentType] || newComponent.styles?.width || '180px',
      height: baseHeights[componentType] || newComponent.styles?.height || '80px',
      backgroundColor: newComponent.styles?.backgroundColor || 'transparent',
      color: newComponent.styles?.color || '#000000',
      fontSize: newComponent.styles?.fontSize || '14px',
      fontFamily: newComponent.styles?.fontFamily || 'Inter, sans-serif',
      padding: newComponent.styles?.padding || '8px',
      margin: newComponent.styles?.margin || '0px',
      border: newComponent.styles?.border || '1px solid #e5e7eb',
      borderRadius: newComponent.styles?.borderRadius || '6px',
      zIndex: '1000'
    };

    const updatedStructure = [...(project.content.pages[0].content.structure || []), newComponent];

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);
    onComponentSelect(newComponent);
  }, [project, onComponentUpdate, onComponentSelect]);

  const handleComponentMove = useCallback((componentId: string, x: number, y: number) => {
    if (!project || !project.content?.pages?.[0]) return;

    const currentStructure = project.content.pages[0].content.structure || [];
    const componentToMove = findComponentById(currentStructure, componentId);

    if (!componentToMove) return;

    const updatedComponent = {
      ...componentToMove,
      styles: {
        ...componentToMove.styles,
        left: `${x}px`,
        top: `${y}px`
      }
    };

    console.log('Updating component:', updatedComponent);

    const updatedStructure = updateComponentInTree(currentStructure, componentId, updatedComponent);

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);
  }, [project, onComponentUpdate]);

  const handleComponentUpdate = useCallback((updatedComponent: ComponentDefinition) => {
    if (!project || !project.content?.pages?.[0]) return;

    const currentStructure = project.content.pages[0].content.structure || [];
    const updatedStructure = updateComponentInTree(currentStructure, updatedComponent.id, updatedComponent);

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);
  }, [project, onComponentUpdate]);

  const handleComponentDelete = useCallback((componentId: string) => {
    if (!project || !project.content?.pages?.[0]) return;

    const currentStructure = project.content.pages[0].content.structure || [];
    const updatedStructure = removeComponentFromTree(currentStructure, componentId);

    const updatedProject = {
      ...project,
      content: {
        ...project.content,
        pages: [{
          ...project.content.pages[0],
          content: {
            ...project.content.pages[0].content,
            structure: updatedStructure
          }
        }]
      }
    };

    onComponentUpdate(updatedProject);

    if (selectedComponent?.id === componentId) {
      onComponentSelect(null);
    }
  }, [project, selectedComponent, onComponentUpdate, onComponentSelect]);

  const structure = project?.content?.pages?.[0]?.content?.structure || [];

  const renderComponent = useCallback((component: ComponentDefinition): React.ReactNode => {
    return (
      <ResizableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onUpdate={(updatedComponent) => {
                if (!project || !project.content?.pages?.[0]) return;
                
                const currentStructure = project.content.pages[0].content?.structure || [];
                const updatedStructure = currentStructure.map(c => 
                  c.id === updatedComponent.id ? updatedComponent : c
                );
                const updatedProject = {
                  ...project,
                  content: {
                    ...project.content,
                    pages: [{
                      ...project.content.pages[0],
                      content: {
                        ...project.content.pages[0].content,
                        structure: updatedStructure
                      }
                    }]
                  }
                };
                onComponentUpdate(updatedProject);
              }}
              onSelect={() => onComponentSelect(component)}
              showGuides={true}
            >
              <ComponentRenderer component={component} />
            </ResizableComponent>
    );
  }, [selectedComponent, onComponentSelect, handleComponentUpdate, handleComponentDelete, showAlignmentGuides, project, onComponentUpdate]);

  // Component renderer for different component types
  const ComponentRenderer = ({ component }: { component: ComponentDefinition }) => {
    // Extraire les styles de positionnement qui sont gérés par ResizableComponent
    const { position, left, top, zIndex, ...componentStyles } = component.styles || {};
    
    const style = {
      ...componentStyles,
      width: '100%',
      height: '100%',
      position: 'relative' as const,
    };

    switch (component.type) {
      case 'text':
      case 'paragraph':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.content || 'Texte'}
          </div>
        );
        
      case 'heading':
        const HeadingTag = (component.attributes?.level ? `h${component.attributes.level}` : 'h1') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={style} className={component.attributes?.className}>
            {component.content || 'Titre'}
          </HeadingTag>
        );
        
      case 'button':
        return (
          <button style={style} className={component.attributes?.className}>
            {component.content || 'Bouton'}
          </button>
        );
        
      case 'image':
        const imageSrc = component.attributes?.src || component.componentData?.src;
        return (
          <div style={style} className={`responsive-image ${component.attributes?.className || ''}`}>
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt={component.attributes?.alt || component.componentData?.alt || 'Image'} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  maxWidth: '100%'
                }}
                loading={component.attributes?.loading || 'lazy'}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                width: '100%',
                height: '100%',
                border: '2px dashed #d1d5db'
              }}>
                📷 Image
              </div>
            )}
          </div>
        );
        
      case 'container':
      case 'section':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || component.content || 'Container'}
          </div>
        );
        
      case 'header':
        return (
          <header style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || 'Header'}
          </header>
        );
        
      case 'footer':
        return (
          <footer style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || 'Footer'}
          </footer>
        );
        
      case 'list':
        return (
          <ul style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || <li>Élément de liste</li>}
          </ul>
        );
        
      case 'form':
        return (
          <form style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || 'Formulaire'}
          </form>
        );
        
      case 'input':
        return (
          <input 
            style={style} 
            className={component.attributes?.className}
            type={component.attributes?.type || 'text'}
            placeholder={component.attributes?.placeholder || ''}
          />
        );
        
      case 'textarea':
        return (
          <textarea 
            style={style} 
            className={component.attributes?.className}
            placeholder={component.attributes?.placeholder || ''}
            rows={component.attributes?.rows || 3}
            defaultValue={component.content || ''}
          />
        );
        
      case 'card':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <>
                <div style={{ height: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🖼️
                </div>
                <div style={{ height: '50%', padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Titre de la carte</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Description...</div>
                </div>
              </>
            )}
          </div>
        );
        
      case 'carousel':
        const slides = component.componentData?.slides || [];
        const currentSlideIndex = component.componentData?.currentSlide || 0;
        
        // Si pas de slides définis, on crée des slides par défaut
        if (slides.length === 0) {
          slides.push(
            { image: '', title: 'Slide 1', backgroundColor: '#3b82f6' },
            { image: '', title: 'Slide 2', backgroundColor: '#8b5cf6' },
            { image: '', title: 'Slide 3', backgroundColor: '#ef4444' }
          );
        }
        
        // Effet pour forcer la responsivité après changement de structure
        useEffect(() => {
          const container = document.querySelector(`[data-component-id="${component.id}"]`);
          if (container) {
            const images = container.querySelectorAll('img');
            images.forEach((img: HTMLImageElement) => {
              img.style.cssText = `
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                object-position: center !important;
                display: block !important;
              `;
            });
          }
        }, [slides.length, component.id]);
        
        return (
          <div 
            style={{
              ...style,
              overflow: 'hidden',
              position: 'relative',
              boxSizing: 'border-box'
            }} 
            className={`carousel-container ${component.attributes?.className || ''}`}
            data-component-id={component.id}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              {/* Container des slides */}
              <div style={{
                display: 'flex',
                width: `${slides.length * 100}%`,
                height: '100%',
                transform: `translateX(-${(currentSlideIndex % slides.length) * (100 / slides.length)}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}>
                {slides.map((slide: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      width: `${100 / slides.length}%`,
                      height: '100%',
                      position: 'relative',
                      backgroundColor: slide.backgroundColor || '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Image responsive avec contraintes strictes */}
                    {slide.image && (
                      <div 
                        className="carousel-image-container"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                          zIndex: 1
                        }}>
                        <img
                          className="carousel-responsive-image"
                          src={slide.image}
                          alt={slide.title || `Slide ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block',
                            border: 'none',
                            outline: 'none'
                          }}
                          onLoad={(e) => {
                            // Forcer la responsivité immédiatement et après délai
                            const img = e.target as HTMLImageElement;
                            const applyResponsiveStyles = () => {
                              img.style.cssText = `
                                width: 100% !important;
                                height: 100% !important;
                                object-fit: cover !important;
                                object-position: center !important;
                                display: block !important;
                                max-width: none !important;
                                max-height: none !important;
                                min-width: 100% !important;
                                min-height: 100% !important;
                                border: none !important;
                                outline: none !important;
                              `;
                            };
                            applyResponsiveStyles();
                            setTimeout(applyResponsiveStyles, 50);
                            setTimeout(applyResponsiveStyles, 200);
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Contenu texte */}
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      background: slide.image ? 'rgba(0,0,0,0.4)' : 'transparent',
                      padding: slide.image ? '12px 20px' : '8px 16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      maxWidth: '90%',
                      color: slide.image ? 'rgba(255,255,255,0.95)' : '#ffffff',
                      fontSize: `${Math.max(12, Math.min(18, (parseInt(style.width as string) || 200) * 0.08))}px`,
                      fontWeight: 'bold',
                      textShadow: slide.image ? '1px 1px 3px rgba(0,0,0,0.8)' : 'none',
                      wordBreak: 'break-word' as const
                    }}>
                      {slide.title || `Slide ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Indicateurs de slides */}
              {slides.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '6px',
                  zIndex: 10
                }}>
                  {slides.map((_: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: index === (currentSlideIndex % slides.length) 
                          ? '#ffffff' 
                          : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* Flèches de navigation */}
              {slides.length > 1 && (
                <>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    ‹
                  </div>
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    ›
                  </div>
                </>
              )}
            </div>
          </div>
        );
        
      case 'accordion':
        const accordionItems = component.componentData?.items || [
          { question: 'Question 1', answer: 'Réponse à la première question...', isOpen: false },
          { question: 'Question 2', answer: 'Réponse à la deuxième question...', isOpen: false }
        ];
        
        return (
          <div style={style} className={`accordion-container ${component.attributes?.className || ''}`}>
            {accordionItems.map((item: any, index: number) => (
              <div key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ 
                  padding: '16px', 
                  fontWeight: '500', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  {item.question}
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {item.isOpen ? '▲' : '▼'}
                  </span>
                </div>
                {item.isOpen && (
                  <div style={{ 
                    padding: '12px 16px', 
                    fontSize: '14px', 
                    color: '#666',
                    backgroundColor: '#f9fafb'
                  }}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'chart':
        return (
          <div style={style} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <div style={{ padding: '20px' }}>
                <div style={{ fontWeight: '600', marginBottom: '16px' }}>📊 Statistiques</div>
                <div style={{ display: 'flex', alignItems: 'end', height: '120px', gap: '8px' }}>
                  <div style={{ width: '40px', height: '75%', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '40px', height: '60%', backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '40px', height: '90%', backgroundColor: '#f59e0b', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '40px', height: '45%', backgroundColor: '#ef4444', borderRadius: '4px 4px 0 0' }}></div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div style={{...style, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={component.attributes?.className}>
            {component.children?.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            )) || (
              <div style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>▶️</div>
                <div>Lecteur Vidéo</div>
              </div>
            )}
          </div>
        );

      case 'map':
        return (
          <div style={{...style, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={component.attributes?.className}>
            <div style={{ textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
              <div style={{ fontSize: '14px' }}>Carte Interactive</div>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div style={{...style, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px'}} className={component.attributes?.className}>
            <div style={{ fontWeight: '600', marginBottom: '12px', fontSize: '16px' }}>📅 Calendrier</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '12px' }}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} style={{ textAlign: 'center', fontWeight: '500', padding: '4px' }}>{day}</div>
              ))}
              {Array.from({length: 30}, (_, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '4px', backgroundColor: i === 14 ? '#3b82f6' : 'transparent', color: i === 14 ? 'white' : '#374151', borderRadius: '4px' }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={{...style, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px'}} className={component.attributes?.className}>
            <div style={{ fontWeight: '600', marginBottom: '16px', fontSize: '18px' }}>📞 Contact</div>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>📧 contact@exemple.com</div>
              <div style={{ marginBottom: '8px' }}>📱 +33 1 23 45 67 89</div>
              <div>📍 123 Rue Exemple, Paris</div>
            </div>
          </div>
        );

      case 'gallery':
        const galleryImages = component.componentData?.images || [];
        return (
          <div style={{
            ...style,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '8px',
            padding: '12px'
          }} className={`gallery-container ${component.attributes?.className || ''}`}>
            {galleryImages.length > 0 ? (
              galleryImages.map((image: any, index: number) => (
                <div 
                  key={index}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <img 
                    src={image.src || image} 
                    alt={image.alt || `Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))
            ) : (
              // Galerie par défaut avec des placeholders
              Array.from({ length: 4 }, (_, index) => (
                <div 
                  key={index}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #d1d5db',
                    color: '#6b7280',
                    fontSize: '24px'
                  }}
                >
                  🖼️
                </div>
              ))
            )}
          </div>
        );

      case 'testimonial':
        return (
          <div style={{...style, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px'}} className={component.attributes?.className}>
            <div style={{ fontSize: '14px', fontStyle: 'italic', marginBottom: '12px', color: '#374151' }}>
              "Un service exceptionnel qui a dépassé toutes nos attentes..."
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '50%', marginRight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                👤
              </div>
              <div>
                <div style={{ fontWeight: '500', fontSize: '14px' }}>Jean Dupont</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Client satisfait</div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div style={{...style, backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', textAlign: 'center'}} className={component.attributes?.className}>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Plan Standard</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px' }}>29€<span style={{ fontSize: '14px', fontWeight: 'normal' }}>/mois</span></div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              ✓ Fonctionnalités essentielles<br/>
              ✓ Support par email<br/>
              ✓ Mises à jour incluses
            </div>
            <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', fontSize: '14px' }}>
              Choisir ce plan
            </button>
          </div>
        );
        
      default:
        return (
          <div style={style} className={component.attributes?.className}>
            {component.content || component.type}
          </div>
        );
    }
  };

  // Gérer le clic sur le fond pour désélectionner
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onComponentSelect(null);
    }
  };

  return (
    <div
      ref={(node) => {
        if (editorRef.current !== node) {
          (editorRef as any).current = node;
        }
        drop(node);
      }}
      className={`
        visual-editor-container relative w-full h-full min-h-[600px] bg-white overflow-hidden
        ${isOver && canDrop ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''}
        ${!structure.length ? 'editor-drop-zone' : ''}
      `}
      style={{ 
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        zIndex: 1
      }}
      onClick={handleBackgroundClick}
      onTouchStart={(e) => {
        // Gérer le clic tactile pour désélectionner aussi
        if (e.target === e.currentTarget) {
          onComponentSelect(null);
        }
        
        // Gérer différemment selon la zone touchée
        const touch = e.touches[0];
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();

        // Gérer différemment selon la zone touchée
        const edgeThreshold = 40;
        const isNearEdge = touch.clientY < rect.top + edgeThreshold || 
                          touch.clientY > rect.bottom - edgeThreshold;

        if (isNearEdge && structure.length > 0) {
          // Permettre le scroll près des bords s'il y a du contenu
          element.style.touchAction = 'pan-y';
        } else {
          // Bloquer le scroll pour permettre le drop
          element.style.touchAction = 'none';
          e.preventDefault();
        }
      }}
      onTouchEnd={() => {
        // Restaurer le comportement par défaut
        if (editorRef.current) {
          editorRef.current.style.touchAction = 'manipulation';
        }
      }}
    >
      {/* Alignment Guides will be implemented as an overlay in the parent component */}

      {/* Components */}
      {structure.map(renderComponent)}

      {/* Empty State */}
      {!structure.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium mb-2">Commencez à créer</h3>
            <p className="text-gray-400">
              Glissez et déposez des composants depuis la palette pour commencer
            </p>
          </div>
        </div>
      )}

      {/* Component Debugger */}
      <ComponentDebugger
        components={structure}
        selectedComponent={selectedComponent}
        onToggle={() => setDebuggerVisible(!debuggerVisible)}
        isVisible={debuggerVisible}
      />
    </div>
  );
};

export default VisualEditor;