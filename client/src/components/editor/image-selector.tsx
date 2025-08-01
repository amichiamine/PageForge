import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Link, Image as ImageIcon, X } from "lucide-react";

interface ImageSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ImageSelector({ value = '', onChange, className = '' }: ImageSelectorProps) {
  const [imageUrl, setImageUrl] = useState(value);
  const [previewImage, setPreviewImage] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        setPreviewImage(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewImage(url);
    onChange(url);
  };

  const handleClearImage = () => {
    setImageUrl('');
    setPreviewImage('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlInputChange = (url: string) => {
    setImageUrl(url);
    // Attendre un peu avant de charger l'aperçu pour éviter trop de requêtes
    const timeoutId = setTimeout(() => {
      if (url && (url.startsWith('http') || url.startsWith('data:'))) {
        setPreviewImage(url);
        onChange(url);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Aperçu de l'image */}
      {previewImage && (
        <Card className="relative">
          <div className="relative">
            <img
              src={previewImage}
              alt="Aperçu"
              className="w-full h-32 object-cover rounded-lg"
              onError={() => {
                setPreviewImage('');
                alert('Impossible de charger l\'image. Vérifiez l\'URL.');
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={handleClearImage}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* Options de sélection */}
      <div className="grid grid-cols-1 gap-4">
        {/* Upload de fichier */}
        <div>
          <Label className="text-sm font-medium">Télécharger une image</Label>
          <div className="mt-1">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-20 border-dashed border-2 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Cliquez pour télécharger
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, GIF (max 5MB)
                </span>
              </div>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* URL d'image */}
        <div>
          <Label className="text-sm font-medium">Ou coller une URL d'image</Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlInputChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Images prédéfinies (optionnel) */}
      <div>
        <Label className="text-sm font-medium">Images d'exemple</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop'
          ].map((sampleUrl, index) => (
            <button
              key={index}
              onClick={() => handleUrlChange(sampleUrl)}
              className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
            >
              <img
                src={sampleUrl}
                alt={`Exemple ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Informations sur le fichier sélectionné */}
      {imageUrl && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            <span>Image sélectionnée:</span>
          </div>
          <div className="break-all bg-muted/50 p-2 rounded text-xs">
            {imageUrl.startsWith('data:') ? 
              'Fichier téléchargé (base64)' : 
              imageUrl}
          </div>
        </div>
      )}
    </div>
  );
}