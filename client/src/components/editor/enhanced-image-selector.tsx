import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Upload,
  Link,
  Image as ImageIcon,
  Search,
  X,
  Download,
  Eye,
  Settings,
  Grid3X3,
  Square,
  Maximize2,
  RotateCw,
  Crop,
  Filter,
  Palette
} from 'lucide-react';

interface EnhancedImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageData: {
    src: string;
    type: 'file' | 'url' | 'gallery';
    alt?: string;
    title?: string;
    size?: { width?: number; height?: number };
    filter?: string;
  }) => void;
  currentImage?: string;
}

const stockImages = [
  { id: 1, src: '/api/placeholder/400/300', title: 'Paysage montagneux', category: 'nature' },
  { id: 2, src: '/api/placeholder/400/300', title: 'Bureau moderne', category: 'business' },
  { id: 3, src: '/api/placeholder/400/300', title: 'Équipe collaborative', category: 'business' },
  { id: 4, src: '/api/placeholder/400/300', title: 'Code source', category: 'tech' },
  { id: 5, src: '/api/placeholder/400/300', title: 'Interface mobile', category: 'tech' },
  { id: 6, src: '/api/placeholder/400/300', title: 'Coucher de soleil', category: 'nature' },
  { id: 7, src: '/api/placeholder/400/300', title: 'Réunion d\'équipe', category: 'business' },
  { id: 8, src: '/api/placeholder/400/300', title: 'Développeur au travail', category: 'tech' },
];

const categories = [
  { id: 'all', name: 'Tout', count: stockImages.length },
  { id: 'business', name: 'Business', count: stockImages.filter(img => img.category === 'business').length },
  { id: 'tech', name: 'Technologie', count: stockImages.filter(img => img.category === 'tech').length },
  { id: 'nature', name: 'Nature', count: stockImages.filter(img => img.category === 'nature').length },
];

const imageFilters = [
  { id: 'none', name: 'Aucun', filter: 'none' },
  { id: 'grayscale', name: 'Noir & Blanc', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sépia', filter: 'sepia(100%)' },
  { id: 'blur', name: 'Flou', filter: 'blur(2px)' },
  { id: 'brightness', name: 'Lumineux', filter: 'brightness(1.2)' },
  { id: 'contrast', name: 'Contraste', filter: 'contrast(1.2)' },
  { id: 'saturate', name: 'Saturé', filter: 'saturate(1.5)' },
];

export function EnhancedImageSelector({ isOpen, onClose, onImageSelect, currentImage }: EnhancedImageSelectorProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'gallery'>('upload');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageSettings, setImageSettings] = useState({
    width: 400,
    height: 300,
    filter: 'none',
    alt: '',
    title: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredImages = stockImages.filter(img => {
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedImages(prev => [...prev, result]);
          setPreviewImage(result);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreviewImage(urlInput.trim());
    }
  };

  const handleImageSelect = (src: string, type: 'file' | 'url' | 'gallery') => {
    const selectedFilter = imageFilters.find(f => f.id === imageSettings.filter);
    
    onImageSelect({
      src,
      type,
      alt: imageSettings.alt || 'Image sélectionnée',
      title: imageSettings.title,
      size: {
        width: imageSettings.width,
        height: imageSettings.height
      },
      filter: selectedFilter?.filter !== 'none' ? selectedFilter?.filter : undefined
    });
    onClose();
  };

  const resetImageSettings = () => {
    setImageSettings({
      width: 400,
      height: 300,
      filter: 'none',
      alt: '',
      title: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Sélectionner une image
            {previewImage && (
              <Badge variant="secondary" className="ml-2">
                Image prévisualisée
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Left panel - Image sources */}
          <div className="lg:col-span-2 flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Télécharger
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Galerie
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="flex-1 mt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium">Télécharger des images</h3>
                        <p className="text-sm text-gray-500">
                          Glissez-déposez vos images ou cliquez pour les sélectionner
                        </p>
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="mt-4"
                      >
                        Choisir des fichiers
                      </Button>
                    </div>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Images téléchargées ({uploadedImages.length})</h4>
                      <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                        {uploadedImages.map((src, index) => (
                          <Card
                            key={index}
                            className="p-2 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            onClick={() => setPreviewImage(src)}
                          >
                            <img
                              src={src}
                              alt={`Téléchargé ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="flex-1 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label>URL de l'image</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="url"
                        placeholder="https://exemple.com/image.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      />
                      <Button onClick={handleUrlSubmit} variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Aperçu
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Entrez l'URL complète d'une image accessible publiquement
                    </p>
                  </div>

                  {urlInput && (
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Aperçu de l'URL</h4>
                      <img
                        src={urlInput}
                        alt="Aperçu URL"
                        className="max-w-full h-32 object-contain rounded border"
                        onLoad={() => setPreviewImage(urlInput)}
                        onError={() => alert('Impossible de charger l\'image depuis cette URL')}
                      />
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="flex-1 mt-4">
                <div className="space-y-4">
                  {/* Search and filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Rechercher des images..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="text-xs"
                        >
                          {category.name} ({category.count})
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Stock images grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {filteredImages.map(image => (
                      <Card
                        key={image.id}
                        className="p-2 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                        onClick={() => setPreviewImage(image.src)}
                      >
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-24 object-cover rounded"
                        />
                        <p className="text-xs text-center mt-1 truncate">{image.title}</p>
                      </Card>
                    ))}
                  </div>

                  {filteredImages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune image trouvée</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right panel - Preview and settings */}
          <div className="space-y-4">
            {/* Image preview */}
            <Card className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Aperçu
                </h4>
                {previewImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewImage(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {previewImage ? (
                <div className="space-y-3">
                  <div 
                    className="relative border rounded overflow-hidden bg-gray-50"
                    style={{ height: '200px' }}
                  >
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      className="w-full h-full object-contain"
                      style={{
                        filter: imageFilters.find(f => f.id === imageSettings.filter)?.filter
                      }}
                    />
                  </div>
                  
                  <Button
                    onClick={() => handleImageSelect(previewImage, activeTab === 'upload' ? 'file' : activeTab)}
                    className="w-full"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Utiliser cette image
                  </Button>
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Aucune image sélectionnée</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Image settings */}
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4" />
                <h4 className="font-medium">Paramètres</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetImageSettings}
                  className="ml-auto h-6 text-xs"
                >
                  Réinitialiser
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Largeur (px)</Label>
                    <Input
                      type="number"
                      value={imageSettings.width}
                      onChange={(e) => setImageSettings(s => ({ ...s, width: parseInt(e.target.value) || 400 }))}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Hauteur (px)</Label>
                    <Input
                      type="number"
                      value={imageSettings.height}
                      onChange={(e) => setImageSettings(s => ({ ...s, height: parseInt(e.target.value) || 300 }))}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>

                {/* Filter */}
                <div>
                  <Label className="text-xs">Filtre</Label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {imageFilters.map(filter => (
                      <Button
                        key={filter.id}
                        variant={imageSettings.filter === filter.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setImageSettings(s => ({ ...s, filter: filter.id }))}
                        className="h-6 text-xs"
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Alt text */}
                <div>
                  <Label className="text-xs">Texte alternatif</Label>
                  <Input
                    placeholder="Description de l'image"
                    value={imageSettings.alt}
                    onChange={(e) => setImageSettings(s => ({ ...s, alt: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </div>

                {/* Title */}
                <div>
                  <Label className="text-xs">Titre (optionnel)</Label>
                  <Input
                    placeholder="Titre de l'image"
                    value={imageSettings.title}
                    onChange={(e) => setImageSettings(s => ({ ...s, title: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}