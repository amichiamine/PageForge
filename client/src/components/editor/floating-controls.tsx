import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PanelLeft, 
  PanelRight, 
  Menu,
  Eye,
  Code,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Upload,
  Download
} from 'lucide-react';

interface FloatingControlsProps {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  showMainNav: boolean;
  showPreview: boolean;
  showCode: boolean;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onToggleMainNav: () => void;
  onTogglePreview: () => void;
  onToggleCode: () => void;
  onViewportChange: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  onSave?: () => void;
  onExport?: () => void;
  onUpload?: () => void;
}

export default function FloatingControls({
  showLeftPanel,
  showRightPanel,
  showMainNav,
  showPreview,
  showCode,
  viewport,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleMainNav,
  onTogglePreview,
  onToggleCode,
  onViewportChange,
  onSave,
  onExport,
  onUpload
}: FloatingControlsProps) {
  return (
    <>
      {/* Bouton navigation principale - En haut à gauche */}
      <button
        onClick={onToggleMainNav}
        className="floating-button nav-toggle-floating"
        title={showMainNav ? "Masquer la navigation" : "Afficher la navigation"}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Bouton panneau gauche (Composants) */}
      <button
        onClick={onToggleLeftPanel}
        className="floating-button panel-toggle-left"
        title={showLeftPanel ? "Masquer les composants" : "Afficher les composants"}
        style={{ left: showLeftPanel ? '230px' : '10px' }}
      >
        <PanelLeft className="w-5 h-5" />
      </button>

      {/* Bouton panneau droit (Propriétés) */}
      <button
        onClick={onToggleRightPanel}
        className="floating-button panel-toggle-right"
        title={showRightPanel ? "Masquer les propriétés" : "Afficher les propriétés"}
        style={{ right: showRightPanel ? '230px' : '10px' }}
      >
        <PanelRight className="w-5 h-5" />
      </button>

      {/* Contrôles de l'éditeur - Centre droit */}
      <div className="fixed top-20 right-4 z-1000 flex flex-col gap-2">
        {/* Mode Preview */}
        <button
          onClick={onTogglePreview}
          className={`floating-button ${showPreview ? 'bg-gradient-green' : ''}`}
          title="Mode aperçu"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Mode Code */}
        <button
          onClick={onToggleCode}
          className={`floating-button ${showCode ? 'bg-gradient-purple' : ''}`}
          title="Voir le code"
        >
          <Code className="w-5 h-5" />
        </button>

        {/* Sélecteur de viewport */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onViewportChange('desktop')}
            className={`floating-button ${viewport === 'desktop' ? 'bg-gradient-blue' : ''}`}
            title="Vue ordinateur"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewportChange('tablet')}
            className={`floating-button ${viewport === 'tablet' ? 'bg-gradient-blue' : ''}`}
            title="Vue tablette"
          >
            <Tablet className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewportChange('mobile')}
            className={`floating-button ${viewport === 'mobile' ? 'bg-gradient-blue' : ''}`}
            title="Vue mobile"
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Actions de projet - En bas à droite */}
      <div className="fixed bottom-20 right-4 z-1000 flex flex-col gap-2">
        {onSave && (
          <button
            onClick={onSave}
            className="floating-button bg-gradient-green"
            title="Sauvegarder"
          >
            <Save className="w-5 h-5" />
          </button>
        )}
        
        {onExport && (
          <button
            onClick={onExport}
            className="floating-button bg-gradient-orange"
            title="Exporter"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
        
        {onUpload && (
          <button
            onClick={onUpload}
            className="floating-button bg-gradient-pink"
            title="Upload FTP"
          >
            <Upload className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bouton paramètres - En bas à gauche */}
      <button
        className="floating-button fixed bottom-20 left-20 z-1000 bg-gradient-purple"
        title="Paramètres de l'éditeur"
        onClick={() => {
          // Ouvrir un modal de paramètres ou rediriger vers la page settings
          window.location.href = '/settings';
        }}
      >
        <Settings className="w-5 h-5" />
      </button>
    </>
  );
}