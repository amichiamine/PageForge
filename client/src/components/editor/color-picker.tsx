import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Zap, Image } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  type?: 'solid' | 'gradient' | 'image';
  showBackgroundTypes?: boolean;
}

export default function ColorPicker({ 
  value = "#000000", 
  onChange, 
  type = 'solid',
  showBackgroundTypes = false 
}: ColorPickerProps) {
  const [currentType, setCurrentType] = useState(type);
  const [solidColor, setSolidColor] = useState(value.startsWith('#') ? value : '#000000');
  const [gradientStart, setGradientStart] = useState('#3B82F6');
  const [gradientEnd, setGradientEnd] = useState('#8B5CF6');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [imageUrl, setImageUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonColors = [
    '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E',
    '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
    '#6366F1', '#F43F5E', '#84CC16', '#06B6D4', '#8B5CF6', '#F59E0B'
  ];

  const gradientDirections = [
    { value: 'to right', label: 'Horizontal →' },
    { value: 'to left', label: '← Horizontal' },
    { value: 'to bottom', label: 'Vertical ↓' },
    { value: 'to top', label: '↑ Vertical' },
    { value: 'to bottom right', label: 'Diagonal ↘' },
    { value: 'to bottom left', label: '↙ Diagonal' },
    { value: 'to top right', label: 'Diagonal ↗' },
    { value: 'to top left', label: '↖ Diagonal' }
  ];

  useEffect(() => {
    if (value && value.includes('gradient')) {
      setCurrentType('gradient');
    } else if (value && value.includes('url(')) {
      setCurrentType('image');
      const urlMatch = value.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch) setImageUrl(urlMatch[1]);
    } else {
      setCurrentType('solid');
      if (value.startsWith('#')) setSolidColor(value);
    }
  }, [value]);

  const handleSolidColorChange = (color: string) => {
    setSolidColor(color);
    onChange(color);
  };

  const handleGradientChange = () => {
    const gradientValue = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
    onChange(gradientValue);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        onChange(`url(${result})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    onChange(`url(${url})`);
  };

  const renderColorPreview = () => {
    let previewStyle: React.CSSProperties = {};
    
    if (currentType === 'solid') {
      previewStyle.backgroundColor = solidColor;
    } else if (currentType === 'gradient') {
      previewStyle.background = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
    } else if (currentType === 'image' && imageUrl) {
      previewStyle.backgroundImage = `url(${imageUrl})`;
      previewStyle.backgroundSize = 'cover';
      previewStyle.backgroundPosition = 'center';
    }

    return (
      <div 
        className="w-8 h-8 rounded border-2 border-gray-200 flex-shrink-0"
        style={previewStyle}
      />
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="p-1 h-auto">
            {renderColorPreview()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          {showBackgroundTypes ? (
            <Tabs value={currentType} onValueChange={(value) => setCurrentType(value as 'solid' | 'gradient' | 'image')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="solid" className="flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  <span className="hidden sm:inline">Couleur</span>
                </TabsTrigger>
                <TabsTrigger value="gradient" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span className="hidden sm:inline">Dégradé</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <Image className="w-3 h-3" />
                  <span className="hidden sm:inline">Image</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <TabsContent value="solid" className="space-y-4 mt-0">
                  <div>
                    <Label>Couleur personnalisée</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={solidColor}
                        onChange={(e) => handleSolidColorChange(e.target.value)}
                        className="w-16 h-8 p-1 border rounded"
                      />
                      <Input
                        type="text"
                        value={solidColor}
                        onChange={(e) => handleSolidColorChange(e.target.value)}
                        className="flex-1 text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Couleurs courantes</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {commonColors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={() => handleSolidColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gradient" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Couleur de début</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={gradientStart}
                          onChange={(e) => {
                            setGradientStart(e.target.value);
                            handleGradientChange();
                          }}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={gradientStart}
                          onChange={(e) => {
                            setGradientStart(e.target.value);
                            handleGradientChange();
                          }}
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Couleur de fin</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={gradientEnd}
                          onChange={(e) => {
                            setGradientEnd(e.target.value);
                            handleGradientChange();
                          }}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={gradientEnd}
                          onChange={(e) => {
                            setGradientEnd(e.target.value);
                            handleGradientChange();
                          }}
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Direction</Label>
                    <select
                      value={gradientDirection}
                      onChange={(e) => {
                        setGradientDirection(e.target.value);
                        handleGradientChange();
                      }}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                    >
                      {gradientDirections.map((dir) => (
                        <option key={dir.value} value={dir.value}>
                          {dir.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Aperçu</Label>
                    <div 
                      className="w-full h-16 rounded border mt-1"
                      style={{ background: `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})` }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4 mt-0">
                  <div>
                    <Label>Télécharger une image</Label>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full mt-1"
                    >
                      Choisir un fichier
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div>
                    <Label>Ou URL d'image</Label>
                    <Input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                  
                  {imageUrl && (
                    <div>
                      <Label>Aperçu</Label>
                      <div 
                        className="w-full h-16 rounded border mt-1 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <Label>Couleur personnalisée</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    value={solidColor}
                    onChange={(e) => handleSolidColorChange(e.target.value)}
                    className="w-16 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={solidColor}
                    onChange={(e) => handleSolidColorChange(e.target.value)}
                    className="flex-1 text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              
              <div>
                <Label>Couleurs courantes</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {commonColors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => handleSolidColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      <Input
        type="text"
        value={currentType === 'solid' ? solidColor : 
               currentType === 'gradient' ? `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})` :
               imageUrl ? `url(${imageUrl})` : ''}
        onChange={(e) => {
          if (currentType === 'solid') {
            handleSolidColorChange(e.target.value);
          }
        }}
        className="flex-1 text-sm"
        placeholder={currentType === 'solid' ? '#000000' : 
                    currentType === 'gradient' ? 'Dégradé' : 
                    'URL de l\'image'}
        readOnly={currentType !== 'solid'}
      />
    </div>
  );
}