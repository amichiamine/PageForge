import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Upload, Link, Search, Image as ImageIcon, Star } from 'lucide-react';

interface ImageSelectorProps {
  currentSrc?: string;
  onImageSelect: (src: string, alt?: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Collection d'images par défaut (unsplash, placeholder, etc.)
const stockImages = [
  { src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', alt: 'Bureau moderne', category: 'business' },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', alt: 'Ordinateur portable', category: 'technology' },
  { src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400', alt: 'Équipe travail', category: 'business' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', alt: 'Graphiques analytics', category: 'business' },
  { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', alt: 'Nature paysage', category: 'nature' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', alt: 'Montagnes', category: 'nature' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', alt: 'Restaurant', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', alt: 'Café', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', alt: 'Bureau design', category: 'workspace' },
  { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', alt: 'Espace travail', category: 'workspace' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', alt: 'Équipe startup', category: 'people' },
  { src: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400', alt: 'Portrait professionnel', category: 'people' }
];

const placeholderImages = [
  { src: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Image+1', alt: 'Placeholder 1', category: 'placeholder' },
  { src: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Image+2', alt: 'Placeholder 2', category: 'placeholder' },
  { src: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Image+3', alt: 'Placeholder 3', category: 'placeholder' },
  { src: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Image+4', alt: 'Placeholder 4', category: 'placeholder' },
  { src: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Image+5', alt: 'Placeholder 5', category: 'placeholder' },
  { src: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=Image+6', alt: 'Placeholder 6', category: 'placeholder' }
];

export default function EnhancedImageSelector({ 
  currentSrc, 
  onImageSelect, 
  isOpen, 
  onOpenChange 
}: ImageSelectorProps) {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload' | 'url'>('stock');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', 'business', 'technology', 'nature', 'food', 'workspace', 'people', 'placeholder'];

  const filteredImages = [...stockImages, ...placeholderImages].filter(img => {
    const matchesSearch = img.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || img.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(result, file.name);
        onOpenChange(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl.trim(), altText.trim() || 'Image');
      setImageUrl('');
      setAltText('');
      onOpenChange(false);
    }
  };

  const handleStockImageSelect = (src: string, alt: string) => {
    onImageSelect(src, alt);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Sélectionner une image
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Images stock
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="space-y-4 overflow-auto max-h-[60vh]">
            {/* Search and filters */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher des images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === 'all' ? 'Toutes' : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Image grid */}
            <div className="grid grid-cols-3 gap-3 pb-4">
              {filteredImages.map((image, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all"
                  onClick={() => handleStockImageSelect(image.src, image.alt)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Sélectionner
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{image.alt}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="text-center py-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Télécharger une image</h3>
                <p className="text-gray-600 mb-4">
                  Glissez-déposez votre image ici ou cliquez pour parcourir
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="mx-auto"
                >
                  Choisir un fichier
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Formats supportés: JPG, PNG, GIF, WEBP (max 10MB)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">URL de l'image</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="alt-text">Texte alternatif (optionnel)</Label>
                <Input
                  id="alt-text"
                  placeholder="Description de l'image"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="border rounded-lg p-4">
                  <Label className="text-sm font-medium mb-2 block">Aperçu</Label>
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={altText || 'Preview'}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
                className="w-full"
              >
                Utiliser cette image
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}