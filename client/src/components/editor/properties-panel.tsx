import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Eye, EyeOff, Lock, Unlock, PanelLeftOpen, PanelLeftClose, Plus, Minus } from 'lucide-react';
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

    console.log('🔧 GRID UPDATE:', { path, value, componentType: localComponent.type });

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

    // Préserver la position lors des mises à jour de componentData
    if (path.startsWith('componentData.') && localComponent.styles) {
      updatedComponent.styles = {
        ...updatedComponent.styles,
        left: localComponent.styles.left,
        top: localComponent.styles.top,
        width: localComponent.styles.width,
        height: localComponent.styles.height
      };
    }

    setLocalComponent(updatedComponent);
    onComponentUpdate(updatedComponent);
    
    console.log('🔧 GRID UPDATED:', { updatedComponent: updatedComponent.componentData });
  };

  // Fonction pour rendre les propriétés spécifiques au type de composant
  const renderComponentSpecificProperties = () => {
    if (!localComponent) return null;

    const componentType = localComponent.type;

    switch (componentType) {
      case 'carousel':
        return renderCarouselProperties();
      case 'pricing':
        return renderPricingProperties();
      case 'testimonial':
        return renderTestimonialProperties();
      case 'team':
        return renderTeamProperties();
      case 'stats':
        return renderStatsProperties();
      case 'features':
        return renderFeaturesProperties();
      case 'cta':
        return renderCtaProperties();
      case 'menu':
        return renderMenuProperties();
      case 'breadcrumb':
        return renderBreadcrumbProperties();
      case 'pagination':
        return renderPaginationProperties();
      case 'tabs':
        return renderTabsProperties();
      case 'search':
        return renderSearchProperties();
      case 'faq':
        return renderFaqProperties();
      case 'timeline':
        return renderTimelineProperties();
      case 'blog-post':
        return renderBlogPostProperties();
      case 'countdown':
        return renderCountdownProperties();
      case 'map':
        return renderMapProperties();
      case 'weather':
        return renderWeatherProperties();
      case 'product-card':
        return renderProductCardProperties();
      case 'form':
        return renderFormProperties();
      case 'input':
        return renderInputProperties();
      case 'textarea':
        return renderTextareaProperties();
      case 'checkbox':
        return renderCheckboxProperties();
      case 'radio':
        return renderRadioProperties();
      case 'select':
        return renderSelectProperties();
      case 'button':
        return renderButtonProperties();
      case 'image':
        return renderImageProperties();
      case 'video':
        return renderVideoProperties();
      case 'audio':
        return renderAudioProperties();
      case 'gallery':
        return renderGalleryProperties();
      case 'icon':
        return renderIconProperties();
      case 'link':
        return renderLinkProperties();
      case 'modal':
        return renderModalProperties();
      case 'dropdown':
        return renderDropdownProperties();
      case 'accordion':
        return renderAccordionProperties();
      case 'chart':
        return renderChartProperties();
      case 'table':
        return renderTableProperties();
      case 'list':
        return renderListProperties();
      case 'card':
        return renderCardProperties();
      case 'badge':
        return renderBadgeProperties();
      case 'alert':
        return renderAlertProperties();
      case 'progress':
        return renderProgressProperties();
      case 'slider':
        return renderSliderProperties();
      case 'toggle':
        return renderToggleProperties();
      case 'tooltip':
        return renderTooltipProperties();
      case 'popover':
        return renderPopoverProperties();
      case 'calendar':
        return renderCalendarProperties();
      case 'rating':
        return renderRatingProperties();
      case 'stepper':
        return renderStepperProperties();
      case 'footer':
        return renderFooterProperties();
      case 'header':
        return renderHeaderProperties();
      case 'hero':
        return renderHeroProperties();
      case 'banner':
        return renderBannerProperties();
      case 'sidebar':
        return renderSidebarProperties();
      case 'navbar':
        return renderNavbarProperties();
      case 'container':
        return renderContainerProperties();
      case 'grid':
        return renderGridProperties();
      case 'flexbox':
        return renderFlexboxProperties();
      case 'code':
        return renderCodeProperties();
      default:
        return renderGenericProperties();
    }
  };

  // Fonction pour les propriétés du carrousel
  const renderCarouselProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration du Carrousel</h4>
      
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

      <div>
        <Label className="text-xs text-gray-600">Images du carrousel</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.slides || []).map((slide: any, index: number) => (
            <div key={index} className="flex gap-2 items-center p-2 border rounded">
              <Input
                type="url"
                placeholder="URL de l'image"
                value={slide.image || ''}
                onChange={(e) => {
                  const slides = [...(localComponent?.componentData?.slides || [])];
                  slides[index] = { ...slide, image: e.target.value };
                  updateProperty('componentData.slides', slides);
                }}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const slides = [...(localComponent?.componentData?.slides || [])];
                  slides.splice(index, 1);
                  updateProperty('componentData.slides', slides);
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
              const slides = [...(localComponent?.componentData?.slides || [])];
              slides.push({ image: '', caption: `Slide ${slides.length + 1}` });
              updateProperty('componentData.slides', slides);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une image
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du composant pricing
  const renderPricingProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration des Prix</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Nom du plan</Label>
        <Input
          value={localComponent?.componentData?.planName || 'Plan Professionnel'}
          onChange={(e) => updateProperty('componentData.planName', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Prix</Label>
          <Input
            value={localComponent?.componentData?.price || '29€'}
            onChange={(e) => updateProperty('componentData.price', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Période</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.period, '/mois')}
            onValueChange={(value) => updateProperty('componentData.period', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="/mois">Par mois</SelectItem>
              <SelectItem value="/an">Par an</SelectItem>
              <SelectItem value="/semaine">Par semaine</SelectItem>
              <SelectItem value="une-fois">Une fois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Description</Label>
        <Input
          value={localComponent?.componentData?.description || 'Idéal pour les équipes qui grandissent'}
          onChange={(e) => updateProperty('componentData.description', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Fonctionnalités (une par ligne)</Label>
        <Textarea
          value={(localComponent?.componentData?.features || ['10 utilisateurs inclus', 'Support prioritaire', 'Intégrations avancées']).join('\n')}
          onChange={(e) => updateProperty('componentData.features', e.target.value.split('\n').filter(f => f.trim()))}
          className="mt-1 text-sm"
          rows={4}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Texte du bouton</Label>
        <Input
          value={localComponent?.componentData?.buttonText || 'Commencer maintenant'}
          onChange={(e) => updateProperty('componentData.buttonText', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du testimonial
  const renderTestimonialProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Témoignage</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Citation</Label>
        <Textarea
          value={localComponent?.componentData?.quote || 'Cette solution a transformé notre façon de travailler. Les résultats sont impressionnants et l\'équipe est très satisfaite.'}
          onChange={(e) => updateProperty('componentData.quote', e.target.value)}
          className="mt-1 text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Nom de l'auteur</Label>
          <Input
            value={localComponent?.componentData?.authorName || 'Marie Dubois'}
            onChange={(e) => updateProperty('componentData.authorName', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Titre/Fonction</Label>
          <Input
            value={localComponent?.componentData?.authorTitle || 'Directrice Marketing, TechCorp'}
            onChange={(e) => updateProperty('componentData.authorTitle', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Photo de l'auteur (URL)</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.authorImage || ''}
          onChange={(e) => updateProperty('componentData.authorImage', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du team
  const renderTeamProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Équipe</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Nom</Label>
          <Input
            value={localComponent?.componentData?.name || 'Sarah Martin'}
            onChange={(e) => updateProperty('componentData.name', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Poste</Label>
          <Input
            value={localComponent?.componentData?.role || 'Développeuse Senior'}
            onChange={(e) => updateProperty('componentData.role', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Photo (URL)</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.image || ''}
          onChange={(e) => updateProperty('componentData.image', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Bio</Label>
        <Textarea
          value={localComponent?.componentData?.bio || 'Passionnée par le développement web moderne, Sarah apporte son expertise technique à notre équipe depuis plus de 5 ans.'}
          onChange={(e) => updateProperty('componentData.bio', e.target.value)}
          className="mt-1 text-sm"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Email</Label>
        <Input
          type="email"
          value={localComponent?.componentData?.email || 'sarah@example.com'}
          onChange={(e) => updateProperty('componentData.email', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du stats
  const renderStatsProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Statistiques</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Nombre</Label>
          <Input
            value={localComponent?.componentData?.number || '1000+'}
            onChange={(e) => updateProperty('componentData.number', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Label</Label>
          <Input
            value={localComponent?.componentData?.label || 'Clients satisfaits'}
            onChange={(e) => updateProperty('componentData.label', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Icône</Label>
        <Select
          value={ensureSelectValue(localComponent?.componentData?.icon, '👥')}
          onValueChange={(value) => updateProperty('componentData.icon', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="👥">👥 Utilisateurs</SelectItem>
            <SelectItem value="💼">💼 Projets</SelectItem>
            <SelectItem value="⭐">⭐ Étoiles</SelectItem>
            <SelectItem value="🏆">🏆 Prix</SelectItem>
            <SelectItem value="📈">📈 Croissance</SelectItem>
            <SelectItem value="💯">💯 Pourcentage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du FAQ
  const renderFaqProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration FAQ</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Questions & Réponses</Label>
        <div className="space-y-3 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded space-y-2">
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
                className="text-sm"
                rows={2}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items.splice(index, 1);
                  updateProperty('componentData.items', items);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Minus className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const items = [...(localComponent?.componentData?.items || [])];
              items.push({ question: '', answer: '' });
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une question
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du countdown
  const renderCountdownProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Compte à rebours</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Date cible</Label>
        <Input
          type="datetime-local"
          value={localComponent?.componentData?.targetDate || '2025-12-31T23:59'}
          onChange={(e) => updateProperty('componentData.targetDate', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Titre</Label>
        <Input
          value={localComponent?.componentData?.title || 'Lancement dans'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Message de fin</Label>
        <Input
          value={localComponent?.componentData?.endMessage || 'L\'événement a commencé !'}
          onChange={(e) => updateProperty('componentData.endMessage', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés du weather
  const renderWeatherProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Météo</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Ville</Label>
          <Input
            value={localComponent?.componentData?.city || 'Paris'}
            onChange={(e) => updateProperty('componentData.city', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Température</Label>
          <Input
            value={localComponent?.componentData?.temperature || '22°C'}
            onChange={(e) => updateProperty('componentData.temperature', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Condition</Label>
        <Select
          value={ensureSelectValue(localComponent?.componentData?.condition, 'sunny')}
          onValueChange={(value) => updateProperty('componentData.condition', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sunny">☀️ Ensoleillé</SelectItem>
            <SelectItem value="cloudy">☁️ Nuageux</SelectItem>
            <SelectItem value="rainy">🌧️ Pluvieux</SelectItem>
            <SelectItem value="snowy">❄️ Neigeux</SelectItem>
            <SelectItem value="stormy">⛈️ Orageux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés d'image
  const renderImageProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Image</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL de l'image</Label>
        <Input
          type="url"
          value={localComponent?.attributes?.src || ''}
          onChange={(e) => updateProperty('attributes.src', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Texte alternatif</Label>
        <Input
          value={localComponent?.attributes?.alt || ''}
          onChange={(e) => updateProperty('attributes.alt', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Description de l'image"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Mode d'ajustement</Label>
        <Select
          value={ensureSelectValue(localComponent?.styles?.objectFit, 'cover')}
          onValueChange={(value) => updateProperty('styles.objectFit', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Couvrir</SelectItem>
            <SelectItem value="contain">Contenir</SelectItem>
            <SelectItem value="fill">Remplir</SelectItem>
            <SelectItem value="scale-down">Réduire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés de bouton
  const renderButtonProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Bouton</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Texte du bouton</Label>
        <Input
          value={localComponent?.content || 'Cliquez ici'}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type</Label>
          <Select
            value={ensureSelectValue(localComponent?.attributes?.type, 'button')}
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
        <div>
          <Label className="text-xs text-gray-600">Variante</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.variant, 'primary')}
            onValueChange={(value) => updateProperty('componentData.variant', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Principal</SelectItem>
              <SelectItem value="secondary">Secondaire</SelectItem>
              <SelectItem value="outline">Contour</SelectItem>
              <SelectItem value="ghost">Fantôme</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Action (URL ou JavaScript)</Label>
        <Input
          value={localComponent?.componentData?.action || ''}
          onChange={(e) => updateProperty('componentData.action', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com ou onclick='alert(Hello)'"
        />
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés de formulaire
  const renderFormProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Formulaire</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Méthode</Label>
          <Select
            value={ensureSelectValue(localComponent?.attributes?.method, 'POST')}
            onValueChange={(value) => updateProperty('attributes.method', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Action</Label>
          <Input
            value={localComponent?.attributes?.action || '/submit'}
            onChange={(e) => updateProperty('attributes.action', e.target.value)}
            className="mt-1 text-sm"
            placeholder="/submit"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="autocomplete"
          checked={localComponent?.attributes?.autocomplete === 'on'}
          onCheckedChange={(checked) => updateProperty('attributes.autocomplete', checked ? 'on' : 'off')}
        />
        <Label htmlFor="autocomplete" className="text-xs text-gray-600">Autocomplétion</Label>
      </div>

      <Separator />
    </div>
  );

  // Fonction pour les propriétés génériques
  const renderGenericProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Propriétés génériques</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Contenu</Label>
        <Textarea
          value={localComponent?.content || ''}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
          rows={3}
        />
      </div>

      <Separator />
    </div>
  );

  // Ajouter les autres fonctions de propriétés vides pour éviter les erreurs
  const renderFeaturesProperties = () => renderGenericProperties();
  const renderCtaProperties = () => renderGenericProperties();
  const renderMenuProperties = () => renderGenericProperties();
  const renderBreadcrumbProperties = () => renderGenericProperties();
  const renderPaginationProperties = () => renderGenericProperties();
  const renderTabsProperties = () => renderGenericProperties();
  const renderSearchProperties = () => renderGenericProperties();
  const renderTimelineProperties = () => renderGenericProperties();
  const renderBlogPostProperties = () => renderGenericProperties();
  const renderMapProperties = () => renderGenericProperties();
  const renderProductCardProperties = () => renderGenericProperties();
  const renderInputProperties = () => renderGenericProperties();
  const renderTextareaProperties = () => renderGenericProperties();
  const renderCheckboxProperties = () => renderGenericProperties();
  const renderVideoProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Vidéo</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL de la vidéo</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.src || ''}
          onChange={(e) => updateProperty('componentData.src', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/video.mp4"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Image de couverture</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.poster || ''}
          onChange={(e) => updateProperty('componentData.poster', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/poster.jpg"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.autoplay || false}
            onCheckedChange={(checked) => updateProperty('componentData.autoplay', checked)}
          />
          <Label className="text-xs">Lecture automatique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.loop || false}
            onCheckedChange={(checked) => updateProperty('componentData.loop', checked)}
          />
          <Label className="text-xs">Boucle</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.muted || false}
            onCheckedChange={(checked) => updateProperty('componentData.muted', checked)}
          />
          <Label className="text-xs">Muet</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderAudioProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Audio</h4>
      
      <div>
        <Label className="text-xs text-gray-600">URL du fichier audio</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.src || ''}
          onChange={(e) => updateProperty('componentData.src', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/audio.mp3"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Titre</Label>
        <Input
          value={localComponent?.componentData?.title || 'Fichier audio'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Volume</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={localComponent?.componentData?.volume || 0.5}
            onChange={(e) => updateProperty('componentData.volume', parseFloat(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={localComponent?.componentData?.autoplay || false}
              onCheckedChange={(checked) => updateProperty('componentData.autoplay', checked)}
            />
            <Label className="text-xs">Auto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={localComponent?.componentData?.loop || false}
              onCheckedChange={(checked) => updateProperty('componentData.loop', checked)}
            />
            <Label className="text-xs">Boucle</Label>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderProgressProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Progress</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Valeur</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.value || 65}
            onChange={(e) => updateProperty('componentData.value', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Maximum</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.max || 100}
            onChange={(e) => updateProperty('componentData.max', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Couleur</Label>
        <Input
          type="color"
          value={localComponent?.componentData?.color || '#3b82f6'}
          onChange={(e) => updateProperty('componentData.color', e.target.value)}
          className="mt-1 h-8"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.showLabel ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showLabel', checked)}
          />
          <Label className="text-xs">Afficher le pourcentage</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.animated || false}
            onCheckedChange={(checked) => updateProperty('componentData.animated', checked)}
          />
          <Label className="text-xs">Animation</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderSliderProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Slider</h4>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Minimum</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.min || 0}
            onChange={(e) => updateProperty('componentData.min', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Maximum</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.max || 100}
            onChange={(e) => updateProperty('componentData.max', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Valeur</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.value || 50}
            onChange={(e) => updateProperty('componentData.value', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Pas</Label>
          <Input
            type="number"
            value={localComponent?.componentData?.step || 1}
            onChange={(e) => updateProperty('componentData.step', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Couleur</Label>
          <Input
            type="color"
            value={localComponent?.componentData?.color || '#3b82f6'}
            onChange={(e) => updateProperty('componentData.color', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderToggleProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Toggle</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Libellé</Label>
        <Input
          value={localComponent?.componentData?.label || 'Activer'}
          onChange={(e) => updateProperty('componentData.label', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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
        <div>
          <Label className="text-xs text-gray-600">Couleur</Label>
          <Input
            type="color"
            value={localComponent?.componentData?.color || '#3b82f6'}
            onChange={(e) => updateProperty('componentData.color', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={localComponent?.componentData?.checked || false}
          onCheckedChange={(checked) => updateProperty('componentData.checked', checked)}
        />
        <Label className="text-xs">État initial activé</Label>
      </div>
      <Separator />
    </div>
  );

  const renderTooltipProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Tooltip</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Texte déclencheur</Label>
        <Input
          value={localComponent?.componentData?.text || 'Survolez-moi'}
          onChange={(e) => updateProperty('componentData.text', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Contenu de l'infobulle</Label>
        <Textarea
          value={localComponent?.componentData?.tooltip || 'Ceci est une infobulle'}
          onChange={(e) => updateProperty('componentData.tooltip', e.target.value)}
          className="mt-1 text-sm"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Position</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.position, 'top')}
            onValueChange={(value) => updateProperty('componentData.position', value)}
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
            value={localComponent?.componentData?.delay || 0}
            onChange={(e) => updateProperty('componentData.delay', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderRatingProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Rating</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Note actuelle</Label>
          <Input
            type="number"
            min="0"
            value={localComponent?.componentData?.rating || 4}
            onChange={(e) => updateProperty('componentData.rating', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Note maximum</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={localComponent?.componentData?.maxRating || 5}
            onChange={(e) => updateProperty('componentData.maxRating', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Icône</Label>
        <Input
          value={localComponent?.componentData?.icon || '★'}
          onChange={(e) => updateProperty('componentData.icon', e.target.value)}
          className="mt-1 text-sm"
          placeholder="★ ❤️ 👍"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.allowHalfRating ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.allowHalfRating', checked)}
          />
          <Label className="text-xs">Demi-notes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.readonly || false}
            onCheckedChange={(checked) => updateProperty('componentData.readonly', checked)}
          />
          <Label className="text-xs">Lecture seule</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderCalendarProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Calendrier</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Date sélectionnée</Label>
        <Input
          type="date"
          value={localComponent?.componentData?.selectedDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => updateProperty('componentData.selectedDate', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Date minimum</Label>
          <Input
            type="date"
            value={localComponent?.componentData?.minDate || ''}
            onChange={(e) => updateProperty('componentData.minDate', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Date maximum</Label>
          <Input
            type="date"
            value={localComponent?.componentData?.maxDate || ''}
            onChange={(e) => updateProperty('componentData.maxDate', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Langue</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.locale, 'fr')}
            onValueChange={(value) => updateProperty('componentData.locale', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
              <SelectItem value="de">Allemand</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            checked={localComponent?.componentData?.showWeekNumbers || false}
            onCheckedChange={(checked) => updateProperty('componentData.showWeekNumbers', checked)}
          />
          <Label className="text-xs">Numéros de semaine</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderStepperProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Stepper</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Étapes</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.steps || []).map((step: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nom de l'étape"
                value={step}
                onChange={(e) => {
                  const steps = [...(localComponent?.componentData?.steps || [])];
                  steps[index] = e.target.value;
                  updateProperty('componentData.steps', steps);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const steps = [...(localComponent?.componentData?.steps || [])];
                  steps.splice(index, 1);
                  updateProperty('componentData.steps', steps);
                }}
                className="text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const steps = [...(localComponent?.componentData?.steps || [])];
              steps.push(`Étape ${steps.length + 1}`);
              updateProperty('componentData.steps', steps);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une étape
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Étape actuelle</Label>
          <Input
            type="number"
            min="0"
            value={localComponent?.componentData?.currentStep || 0}
            onChange={(e) => updateProperty('componentData.currentStep', parseInt(e.target.value))}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Orientation</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.orientation, 'horizontal')}
            onValueChange={(value) => updateProperty('componentData.orientation', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontale</SelectItem>
              <SelectItem value="vertical">Verticale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={localComponent?.componentData?.showNumbers ?? false}
          onCheckedChange={(checked) => updateProperty('componentData.showNumbers', checked)}
        />
        <Label className="text-xs">Afficher les numéros</Label>
      </div>
      <Separator />
    </div>
  );

  const renderHeroProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Héro</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre principal</Label>
        <Input
          value={localComponent?.componentData?.title || 'Titre Héro'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Sous-titre</Label>
        <Textarea
          value={localComponent?.componentData?.subtitle || 'Sous-titre descriptif'}
          onChange={(e) => updateProperty('componentData.subtitle', e.target.value)}
          className="mt-1 text-sm"
          rows={2}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Image de fond</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.backgroundImage || ''}
          onChange={(e) => updateProperty('componentData.backgroundImage', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com/background.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Texte du bouton</Label>
          <Input
            value={localComponent?.componentData?.ctaText || 'Action principale'}
            onChange={(e) => updateProperty('componentData.ctaText', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lien du bouton</Label>
          <Input
            value={localComponent?.componentData?.ctaLink || '#'}
            onChange={(e) => updateProperty('componentData.ctaLink', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          checked={localComponent?.componentData?.overlay ?? false}
          onCheckedChange={(checked) => updateProperty('componentData.overlay', checked)}
        />
        <Label className="text-xs">Overlay sombre</Label>
      </div>
      <Separator />
    </div>
  );

  const renderBannerProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Bannière</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Message</Label>
        <Textarea
          value={localComponent?.componentData?.message || 'Message important'}
          onChange={(e) => updateProperty('componentData.message', e.target.value)}
          className="mt-1 text-sm"
          rows={2}
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Type</Label>
        <Select
          value={ensureSelectValue(localComponent?.componentData?.type, 'warning')}
          onValueChange={(value) => updateProperty('componentData.type', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Information</SelectItem>
            <SelectItem value="success">Succès</SelectItem>
            <SelectItem value="warning">Avertissement</SelectItem>
            <SelectItem value="error">Erreur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Texte d'action</Label>
          <Input
            value={localComponent?.componentData?.actionText || ''}
            onChange={(e) => updateProperty('componentData.actionText', e.target.value)}
            className="mt-1 text-sm"
            placeholder="En savoir plus"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lien d'action</Label>
          <Input
            value={localComponent?.componentData?.actionLink || ''}
            onChange={(e) => updateProperty('componentData.actionLink', e.target.value)}
            className="mt-1 text-sm"
            placeholder="#"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.dismissible ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.dismissible', checked)}
          />
          <Label className="text-xs">Peut être fermée</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.icon ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.icon', checked)}
          />
          <Label className="text-xs">Afficher l'icône</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderHeaderProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration En-tête</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Logo/Marque</Label>
        <Input
          value={localComponent?.componentData?.logo || 'Mon Site'}
          onChange={(e) => updateProperty('componentData.logo', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Navigation</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.navigation || []).map((nav: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Libellé"
                value={nav.label || ''}
                onChange={(e) => {
                  const navigation = [...(localComponent?.componentData?.navigation || [])];
                  navigation[index] = { ...nav, label: e.target.value };
                  updateProperty('componentData.navigation', navigation);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Lien"
                value={nav.href || ''}
                onChange={(e) => {
                  const navigation = [...(localComponent?.componentData?.navigation || [])];
                  navigation[index] = { ...nav, href: e.target.value };
                  updateProperty('componentData.navigation', navigation);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const navigation = [...(localComponent?.componentData?.navigation || [])];
                  navigation.splice(index, 1);
                  updateProperty('componentData.navigation', navigation);
                }}
                className="text-red-600"
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
              navigation.push({ label: 'Accueil', href: '#' });
              updateProperty('componentData.navigation', navigation);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un lien
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.showSearch || false}
            onCheckedChange={(checked) => updateProperty('componentData.showSearch', checked)}
          />
          <Label className="text-xs">Barre de recherche</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.sticky || false}
            onCheckedChange={(checked) => updateProperty('componentData.sticky', checked)}
          />
          <Label className="text-xs">Sticky</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderFooterProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Pied de page</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Nom de l'entreprise</Label>
        <Input
          value={localComponent?.componentData?.companyName || 'Mon Entreprise'}
          onChange={(e) => updateProperty('componentData.companyName', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Description</Label>
        <Textarea
          value={localComponent?.componentData?.description || ''}
          onChange={(e) => updateProperty('componentData.description', e.target.value)}
          className="mt-1 text-sm"
          rows={2}
          placeholder="Description de votre entreprise"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Copyright</Label>
        <Input
          value={localComponent?.componentData?.copyright || '© 2025 Tous droits réservés'}
          onChange={(e) => updateProperty('componentData.copyright', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Liens</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.links || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Libellé"
                value={link.label || ''}
                onChange={(e) => {
                  const links = [...(localComponent?.componentData?.links || [])];
                  links[index] = { ...link, label: e.target.value };
                  updateProperty('componentData.links', links);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Lien"
                value={link.href || ''}
                onChange={(e) => {
                  const links = [...(localComponent?.componentData?.links || [])];
                  links[index] = { ...link, href: e.target.value };
                  updateProperty('componentData.links', links);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const links = [...(localComponent?.componentData?.links || [])];
                  links.splice(index, 1);
                  updateProperty('componentData.links', links);
                }}
                className="text-red-600"
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
              links.push({ label: 'Accueil', href: '#' });
              updateProperty('componentData.links', links);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un lien
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderSidebarProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Sidebar</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre</Label>
        <Input
          value={localComponent?.componentData?.title || 'Menu latéral'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Éléments du menu</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Libellé"
                value={item.label || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, label: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Lien"
                value={item.href || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, href: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items.splice(index, 1);
                  updateProperty('componentData.items', items);
                }}
                className="text-red-600"
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
              items.push({ label: 'Menu', href: '#' });
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un élément
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Position</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.position, 'left')}
            onValueChange={(value) => updateProperty('componentData.position', value)}
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
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            checked={localComponent?.componentData?.collapsible ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.collapsible', checked)}
          />
          <Label className="text-xs">Repliable</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderNavbarProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Navbar</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Marque</Label>
        <Input
          value={localComponent?.componentData?.brand || 'Marque'}
          onChange={(e) => updateProperty('componentData.brand', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Éléments de navigation</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Libellé"
                value={item.label || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, label: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Lien"
                value={item.href || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, href: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items.splice(index, 1);
                  updateProperty('componentData.items', items);
                }}
                className="text-red-600"
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
              items.push({ label: 'Accueil', href: '#' });
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un élément
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.alignment, 'left')}
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
          <Label className="text-xs text-gray-600">Style</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.style, 'horizontal')}
            onValueChange={(value) => updateProperty('componentData.style', value)}
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
      <Separator />
    </div>
  );

  const renderChartProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Graphique</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Titre</Label>
        <Input
          value={localComponent?.componentData?.title || 'Statistiques'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Type de graphique</Label>
        <Select
          value={ensureSelectValue(localComponent?.componentData?.type, 'bar')}
          onValueChange={(value) => updateProperty('componentData.type', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Barres</SelectItem>
            <SelectItem value="line">Ligne</SelectItem>
            <SelectItem value="pie">Secteurs</SelectItem>
            <SelectItem value="area">Aires</SelectItem>
            <SelectItem value="doughnut">Anneau</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Données</Label>
        <Textarea
          value={localComponent?.componentData?.data || '10,20,30,40,50'}
          onChange={(e) => updateProperty('componentData.data', e.target.value)}
          className="mt-1 text-sm"
          rows={3}
          placeholder="Entrez les valeurs séparées par des virgules"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Libellés</Label>
        <Textarea
          value={localComponent?.componentData?.labels || 'Jan,Fév,Mar,Avr,Mai'}
          onChange={(e) => updateProperty('componentData.labels', e.target.value)}
          className="mt-1 text-sm"
          rows={2}
          placeholder="Entrez les libellés séparés par des virgules"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Couleur primaire</Label>
          <Input
            type="color"
            value={localComponent?.componentData?.primaryColor || '#3b82f6'}
            onChange={(e) => updateProperty('componentData.primaryColor', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            checked={localComponent?.componentData?.showLegend ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showLegend', checked)}
          />
          <Label className="text-xs">Afficher la légende</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderTableProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Tableau</h4>
      
      <div>
        <Label className="text-xs text-gray-600">En-têtes</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.headers || []).map((header: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="En-tête"
                value={header}
                onChange={(e) => {
                  const headers = [...(localComponent?.componentData?.headers || [])];
                  headers[index] = e.target.value;
                  updateProperty('componentData.headers', headers);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const headers = [...(localComponent?.componentData?.headers || [])];
                  headers.splice(index, 1);
                  updateProperty('componentData.headers', headers);
                }}
                className="text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const headers = [...(localComponent?.componentData?.headers || [])];
              headers.push(`Colonne ${headers.length + 1}`);
              updateProperty('componentData.headers', headers);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une colonne
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Lignes de données</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.rows || []).map((row: string[], rowIndex: number) => (
            <div key={rowIndex} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Ligne {rowIndex + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const rows = [...(localComponent?.componentData?.rows || [])];
                    rows.splice(rowIndex, 1);
                    updateProperty('componentData.rows', rows);
                  }}
                  className="text-red-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {row.map((cell: string, cellIndex: number) => (
                  <Input
                    key={cellIndex}
                    placeholder={`Cellule ${cellIndex + 1}`}
                    value={cell}
                    onChange={(e) => {
                      const rows = [...(localComponent?.componentData?.rows || [])];
                      rows[rowIndex][cellIndex] = e.target.value;
                      updateProperty('componentData.rows', rows);
                    }}
                    className="text-sm"
                  />
                ))}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const rows = [...(localComponent?.componentData?.rows || [])];
              const headerCount = (localComponent?.componentData?.headers || []).length || 2;
              rows.push(Array(headerCount).fill(''));
              updateProperty('componentData.rows', rows);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une ligne
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.striped ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.striped', checked)}
          />
          <Label className="text-xs">Lignes alternées</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.sortable || false}
            onCheckedChange={(checked) => updateProperty('componentData.sortable', checked)}
          />
          <Label className="text-xs">Tri activé</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderRadioProperties = () => renderGenericProperties();
  const renderSelectProperties = () => renderGenericProperties();
  const renderGalleryProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Galerie</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Images</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.images || []).map((image: any, index: number) => (
            <div key={index} className="p-3 border rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Image {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const images = [...(localComponent?.componentData?.images || [])];
                    images.splice(index, 1);
                    updateProperty('componentData.images', images);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="URL de l'image"
                value={image.src || ''}
                onChange={(e) => {
                  const images = [...(localComponent?.componentData?.images || [])];
                  images[index] = { ...image, src: e.target.value };
                  updateProperty('componentData.images', images);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Texte alternatif"
                value={image.alt || ''}
                onChange={(e) => {
                  const images = [...(localComponent?.componentData?.images || [])];
                  images[index] = { ...image, alt: e.target.value };
                  updateProperty('componentData.images', images);
                }}
                className="text-sm"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const images = [...(localComponent?.componentData?.images || [])];
              images.push({ src: '', alt: '' });
              updateProperty('componentData.images', images);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une image
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderIconProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Icône</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Icône</Label>
        <Input
          value={localComponent?.content || '⭐'}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
          placeholder="Emoji ou caractère"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Taille</Label>
          <Input
            value={localComponent?.styles?.fontSize || '32px'}
            onChange={(e) => updateProperty('styles.fontSize', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Couleur</Label>
          <Input
            type="color"
            value={localComponent?.styles?.color || '#3b82f6'}
            onChange={(e) => updateProperty('styles.color', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderLinkProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Lien</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Texte du lien</Label>
        <Input
          value={localComponent?.content || 'Lien vers une page'}
          onChange={(e) => updateProperty('content', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">URL</Label>
        <Input
          type="url"
          value={localComponent?.attributes?.href || '#'}
          onChange={(e) => updateProperty('attributes.href', e.target.value)}
          className="mt-1 text-sm"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Cible</Label>
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
          </SelectContent>
        </Select>
      </div>
      <Separator />
    </div>
  );

  const renderModalProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Modal</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Texte du bouton</Label>
        <Input
          value={localComponent?.componentData?.triggerText || 'Ouvrir Modal'}
          onChange={(e) => updateProperty('componentData.triggerText', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Titre du modal</Label>
        <Input
          value={localComponent?.componentData?.title || 'Titre du Modal'}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Contenu</Label>
        <Textarea
          value={localComponent?.componentData?.content || 'Contenu du modal...'}
          onChange={(e) => updateProperty('componentData.content', e.target.value)}
          className="mt-1 text-sm"
          rows={3}
        />
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
            <SelectItem value="fullscreen">Plein écran</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
    </div>
  );

  const renderDropdownProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Dropdown</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Label</Label>
        <Input
          value={localComponent?.componentData?.label || 'Sélectionner...'}
          onChange={(e) => updateProperty('componentData.label', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Options</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.options || []).map((option: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Valeur"
                value={option.value || ''}
                onChange={(e) => {
                  const options = [...(localComponent?.componentData?.options || [])];
                  options[index] = { ...option, value: e.target.value };
                  updateProperty('componentData.options', options);
                }}
                className="text-sm"
              />
              <Input
                placeholder="Libellé"
                value={option.label || ''}
                onChange={(e) => {
                  const options = [...(localComponent?.componentData?.options || [])];
                  options[index] = { ...option, label: e.target.value };
                  updateProperty('componentData.options', options);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const options = [...(localComponent?.componentData?.options || [])];
                  options.splice(index, 1);
                  updateProperty('componentData.options', options);
                }}
                className="text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const options = [...(localComponent?.componentData?.options || [])];
              options.push({ value: '', label: '' });
              updateProperty('componentData.options', options);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une option
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderAccordionProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Accordéon</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Éléments</Label>
        <div className="space-y-3 mt-1">
          {(localComponent?.componentData?.items || []).map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Élément {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const items = [...(localComponent?.componentData?.items || [])];
                    items.splice(index, 1);
                    updateProperty('componentData.items', items);
                  }}
                  className="text-red-600"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Titre"
                value={item.title || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, title: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Textarea
                placeholder="Contenu"
                value={item.content || ''}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = { ...item, content: e.target.value };
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
                rows={2}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const items = [...(localComponent?.componentData?.items || [])];
              items.push({ title: '', content: '' });
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un élément
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderChartProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Graphique</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Type</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.type, 'bar')}
            onValueChange={(value) => updateProperty('componentData.type', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Barres</SelectItem>
              <SelectItem value="line">Ligne</SelectItem>
              <SelectItem value="pie">Camembert</SelectItem>
              <SelectItem value="doughnut">Anneau</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Titre</Label>
          <Input
            value={localComponent?.componentData?.title || 'Statistiques'}
            onChange={(e) => updateProperty('componentData.title', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.showLegend ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showLegend', checked)}
          />
          <Label className="text-xs">Afficher la légende</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.showGrid ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.showGrid', checked)}
          />
          <Label className="text-xs">Afficher la grille</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderTableProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Tableau</h4>
      
      <div>
        <Label className="text-xs text-gray-600">En-têtes</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.headers || []).map((header: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="En-tête"
                value={header}
                onChange={(e) => {
                  const headers = [...(localComponent?.componentData?.headers || [])];
                  headers[index] = e.target.value;
                  updateProperty('componentData.headers', headers);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const headers = [...(localComponent?.componentData?.headers || [])];
                  headers.splice(index, 1);
                  updateProperty('componentData.headers', headers);
                }}
                className="text-red-600"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const headers = [...(localComponent?.componentData?.headers || [])];
              headers.push('Nouvelle colonne');
              updateProperty('componentData.headers', headers);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une colonne
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.striped ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.striped', checked)}
          />
          <Label className="text-xs">Lignes alternées</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localComponent?.componentData?.bordered ?? false}
            onCheckedChange={(checked) => updateProperty('componentData.bordered', checked)}
          />
          <Label className="text-xs">Bordures</Label>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderListProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Liste</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Type de liste</Label>
        <Select
          value={ensureSelectValue(localComponent?.componentData?.listType, 'unordered')}
          onValueChange={(value) => updateProperty('componentData.listType', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unordered">Non ordonnée</SelectItem>
            <SelectItem value="ordered">Ordonnée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Éléments</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.items || []).map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Élément de liste"
                value={item}
                onChange={(e) => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items[index] = e.target.value;
                  updateProperty('componentData.items', items);
                }}
                className="text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const items = [...(localComponent?.componentData?.items || [])];
                  items.splice(index, 1);
                  updateProperty('componentData.items', items);
                }}
                className="text-red-600"
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
              items.push('Nouvel élément');
              updateProperty('componentData.items', items);
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un élément
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  );

  const renderCardProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Carte</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Image</Label>
        <Input
          type="url"
          value={localComponent?.componentData?.image || ''}
          onChange={(e) => updateProperty('componentData.image', e.target.value)}
          className="mt-1 text-sm"
          placeholder="URL de l'image"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Titre</Label>
        <Input
          value={localComponent?.componentData?.title || ''}
          onChange={(e) => updateProperty('componentData.title', e.target.value)}
          className="mt-1 text-sm"
        />
      </div>

      <div>
        <Label className="text-xs text-gray-600">Description</Label>
        <Textarea
          value={localComponent?.componentData?.description || ''}
          onChange={(e) => updateProperty('componentData.description', e.target.value)}
          className="mt-1 text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Texte bouton</Label>
          <Input
            value={localComponent?.componentData?.buttonText || ''}
            onChange={(e) => updateProperty('componentData.buttonText', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600">Lien bouton</Label>
          <Input
            value={localComponent?.componentData?.buttonLink || ''}
            onChange={(e) => updateProperty('componentData.buttonLink', e.target.value)}
            className="mt-1 text-sm"
          />
        </div>
      </div>
      <Separator />
    </div>
  );
  const renderBadgeProperties = () => renderGenericProperties();
  const renderAlertProperties = () => renderGenericProperties();
  const renderProgressProperties = () => renderGenericProperties();
  const renderSliderProperties = () => renderGenericProperties();
  const renderToggleProperties = () => renderGenericProperties();
  const renderTooltipProperties = () => renderGenericProperties();
  const renderPopoverProperties = () => renderGenericProperties();
  const renderCalendarProperties = () => renderGenericProperties();
  const renderRatingProperties = () => renderGenericProperties();
  const renderStepperProperties = () => renderGenericProperties();
  const renderFooterProperties = () => renderGenericProperties();
  const renderHeaderProperties = () => renderGenericProperties();
  const renderHeroProperties = () => renderGenericProperties();
  const renderBannerProperties = () => renderGenericProperties();
  const renderContainerProperties = () => renderGenericProperties();
  const renderGridProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration de la Grille</h4>
      
      {/* PARAMÈTRES GLOBAUX */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Colonnes</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.columns?.toString(), '2')}
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
              <SelectItem value="5">5 colonnes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Espacement</Label>
          <Input
            value={localComponent?.componentData?.gap || '16px'}
            onChange={(e) => updateProperty('componentData.gap', e.target.value)}
            className="mt-1 text-sm"
            placeholder="16px"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Alignement</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.alignment, 'center')}
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

      {/* GESTION DES COLLECTIONS */}
      <div>
        <Label className="text-xs text-gray-600">Éléments de la grille</Label>
        <div className="space-y-2 mt-1">
          {(localComponent?.componentData?.gridItems || []).map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg space-y-2 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Élément {index + 1}</span>
                {/* SUPPRESSION D'ÉLÉMENT */}
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
              {/* ÉDITION D'ÉLÉMENT INDIVIDUEL */}
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
          
          {/* AJOUT D'ÉLÉMENT */}
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
            className="w-full text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter un élément
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );
  const renderFlexboxProperties = () => renderGenericProperties();

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
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {comp.type}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {comp.content || comp.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          #{comp.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onComponentSelect(comp);
                        }}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                        title="Sélectionner"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
        {/* Liste des composants */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Composants sur la page</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {project?.content?.pages?.[0]?.content?.structure?.map((comp) => (
              <div
                key={comp.id}
                className={`p-2 rounded text-xs cursor-pointer border transition-colors group ${
                  component?.id === comp.id 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => onComponentSelect(comp)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{comp.type}</div>
                    <div className="text-gray-500 truncate">{comp.content || comp.id.slice(-8)}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComponentDelete(comp.id);
                    }}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )) || []}
          </div>
        </div>

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
              {setHideMainSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHideMainSidebar(!hideMainSidebar)}
                  className="h-8 w-8 p-0"
                  title={hideMainSidebar ? "Afficher la navigation" : "Masquer la navigation"}
                >
                  {hideMainSidebar ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
              )}
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

        {/* Propriétés spécifiques au composant */}
        {renderComponentSpecificProperties()}

        {/* Tag HTML */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Configuration HTML</h4>
          <div>
            <Label htmlFor="tag" className="text-xs text-gray-600">Balise HTML</Label>
            <Select
              value={ensureSelectValue(localComponent.tag, 'div')}
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
                value={localComponent.styles?.width || '200px'}
                onChange={(e) => {
                  let value = e.target.value.trim();
                  // Valider et nettoyer la valeur
                  if (!value || value === 'auto' || value === '' || value === 'undefined' || value === 'NaN') {
                    value = '200px';
                  }
                  // Ajouter px si seulement un nombre est entré
                  if (/^\d+\.?\d*$/.test(value)) {
                    value = value + 'px';
                  }
                  // Vérifier que la valeur est valide
                  if (!/^\d+\.?\d*(px|%|em|rem|vh|vw)$/.test(value)) {
                    value = '200px';
                  }
                  updateProperty('styles.width', value);
                }}
                placeholder="ex: 200px"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs text-gray-600">Hauteur</Label>
              <Input
                id="height"
                type="text"
                value={localComponent.styles?.height || '100px'}
                onChange={(e) => {
                  let value = e.target.value.trim();
                  // Valider et nettoyer la valeur
                  if (!value || value === 'auto' || value === '' || value === 'undefined' || value === 'NaN') {
                    value = '100px';
                  }
                  // Ajouter px si seulement un nombre est entré
                  if (/^\d+\.?\d*$/.test(value)) {
                    value = value + 'px';
                  }
                  // Vérifier que la valeur est valide
                  if (!/^\d+\.?\d*(px|%|em|rem|vh|vw)$/.test(value)) {
                    value = '100px';
                  }
                  updateProperty('styles.height', value);
                }}
                placeholder="ex: 100px"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          {/* Z-Index */}
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
        </div>

        <Separator />

        {/* Styles CSS simplifiés */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Styles CSS</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Couleur de fond</Label>
              <div className="flex mt-1">
                <Input
                  type="color"
                  value={localComponent.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateProperty('styles.backgroundColor', e.target.value)}
                  className="w-12 h-9 p-1 rounded-l border-r-0"
                />
                <Input
                  type="text"
                  value={localComponent.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateProperty('styles.backgroundColor', e.target.value)}
                  className="flex-1 text-sm rounded-l-none"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-gray-600">Couleur du texte</Label>
              <div className="flex mt-1">
                <Input
                  type="color"
                  value={localComponent.styles?.color || '#000000'}
                  onChange={(e) => updateProperty('styles.color', e.target.value)}
                  className="w-12 h-9 p-1 rounded-l border-r-0"
                />
                <Input
                  type="text"
                  value={localComponent.styles?.color || '#000000'}
                  onChange={(e) => updateProperty('styles.color', e.target.value)}
                  className="flex-1 text-sm rounded-l-none"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Padding</Label>
              <Input
                type="text"
                value={localComponent.styles?.padding || '0'}
                onChange={(e) => updateProperty('styles.padding', e.target.value)}
                placeholder="ex: 10px 20px"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Margin</Label>
              <Input
                type="text"
                value={localComponent.styles?.margin || '0'}
                onChange={(e) => updateProperty('styles.margin', e.target.value)}
                placeholder="ex: 10px 20px"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Bordure</Label>
              <Input
                type="text"
                value={localComponent.styles?.border || 'none'}
                onChange={(e) => updateProperty('styles.border', e.target.value)}
                placeholder="ex: 1px solid #000"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Bordure arrondie</Label>
              <Input
                type="text"
                value={localComponent.styles?.borderRadius || '0'}
                onChange={(e) => updateProperty('styles.borderRadius', e.target.value)}
                placeholder="ex: 8px"
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <Separator />
        </div>
      </div>
    </div>
  );

  // Fonction pour les propriétés du composant code
  const renderCodeProperties = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-900">Configuration Code</h4>
      
      <div>
        <Label className="text-xs text-gray-600">Langage de programmation</Label>
        <Select
          value={ensureSelectValue(localComponent?.componentData?.language, 'javascript')}
          onValueChange={(value) => updateProperty('componentData.language', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="php">PHP</SelectItem>
            <SelectItem value="ruby">Ruby</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs text-gray-600">Code source</Label>
        <Textarea
          value={localComponent?.componentData?.content || 'console.log("Hello World!");'}
          onChange={(e) => updateProperty('componentData.content', e.target.value)}
          className="mt-1 text-sm font-mono"
          rows={8}
          placeholder="Saisissez votre code ici..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-gray-600">Afficher les numéros de ligne</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.showLineNumbers, 'true')}
            onValueChange={(value) => updateProperty('componentData.showLineNumbers', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Oui</SelectItem>
              <SelectItem value="false">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-gray-600">Thème</Label>
          <Select
            value={ensureSelectValue(localComponent?.componentData?.theme, 'dark')}
            onValueChange={(value) => updateProperty('componentData.theme', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="light">Clair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />
    </div>
  );
}