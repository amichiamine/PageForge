
import React from 'react';

interface AlignmentGuidesProps {
  showGuides: boolean;
  selectedComponent: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  containerBounds: {
    width: number;
    height: number;
  };
  allComponents: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export default function AlignmentGuides({
  showGuides,
  selectedComponent,
  containerBounds,
  allComponents
}: AlignmentGuidesProps) {
  if (!showGuides || !selectedComponent) {
    return null;
  }

  const guides: React.ReactElement[] = [];
  const threshold = 5; // Seuil de proximité pour afficher les guides

  // Guides de grille de base
  if (showGuides) {
    // Grille verticale tous les 20px
    for (let x = 0; x <= containerBounds.width; x += 20) {
      guides.push(
        <div
          key={`grid-v-${x}`}
          className="absolute border-l border-gray-200 opacity-30 pointer-events-none"
          style={{
            left: `${x}px`,
            top: 0,
            height: `${containerBounds.height}px`,
          }}
        />
      );
    }

    // Grille horizontale tous les 20px
    for (let y = 0; y <= containerBounds.height; y += 20) {
      guides.push(
        <div
          key={`grid-h-${y}`}
          className="absolute border-t border-gray-200 opacity-30 pointer-events-none"
          style={{
            top: `${y}px`,
            left: 0,
            width: `${containerBounds.width}px`,
          }}
        />
      );
    }
  }

  // Guides d'alignement avec d'autres composants
  allComponents.forEach((comp, index) => {
    if (!selectedComponent) return;

    // Guide d'alignement vertical (centres alignés)
    const centerXDiff = Math.abs((selectedComponent.x + selectedComponent.width / 2) - (comp.x + comp.width / 2));
    if (centerXDiff <= threshold) {
      const centerX = comp.x + comp.width / 2;
      guides.push(
        <div
          key={`align-v-center-${index}`}
          className="absolute border-l-2 border-blue-400 opacity-70 pointer-events-none"
          style={{
            left: `${centerX}px`,
            top: 0,
            height: `${containerBounds.height}px`,
          }}
        />
      );
    }

    // Guide d'alignement horizontal (centres alignés)
    const centerYDiff = Math.abs((selectedComponent.y + selectedComponent.height / 2) - (comp.y + comp.height / 2));
    if (centerYDiff <= threshold) {
      const centerY = comp.y + comp.height / 2;
      guides.push(
        <div
          key={`align-h-center-${index}`}
          className="absolute border-t-2 border-blue-400 opacity-70 pointer-events-none"
          style={{
            top: `${centerY}px`,
            left: 0,
            width: `${containerBounds.width}px`,
          }}
        />
      );
    }

    // Guides d'alignement des bords
    // Bord gauche
    if (Math.abs(selectedComponent.x - comp.x) <= threshold) {
      guides.push(
        <div
          key={`align-left-${index}`}
          className="absolute border-l-2 border-green-400 opacity-70 pointer-events-none"
          style={{
            left: `${comp.x}px`,
            top: 0,
            height: `${containerBounds.height}px`,
          }}
        />
      );
    }

    // Bord droit
    if (Math.abs((selectedComponent.x + selectedComponent.width) - (comp.x + comp.width)) <= threshold) {
      guides.push(
        <div
          key={`align-right-${index}`}
          className="absolute border-l-2 border-green-400 opacity-70 pointer-events-none"
          style={{
            left: `${comp.x + comp.width}px`,
            top: 0,
            height: `${containerBounds.height}px`,
          }}
        />
      );
    }

    // Bord haut
    if (Math.abs(selectedComponent.y - comp.y) <= threshold) {
      guides.push(
        <div
          key={`align-top-${index}`}
          className="absolute border-t-2 border-green-400 opacity-70 pointer-events-none"
          style={{
            top: `${comp.y}px`,
            left: 0,
            width: `${containerBounds.width}px`,
          }}
        />
      );
    }

    // Bord bas
    if (Math.abs((selectedComponent.y + selectedComponent.height) - (comp.y + comp.height)) <= threshold) {
      guides.push(
        <div
          key={`align-bottom-${index}`}
          className="absolute border-t-2 border-green-400 opacity-70 pointer-events-none"
          style={{
            top: `${comp.y + comp.height}px`,
            left: 0,
            width: `${containerBounds.width}px`,
          }}
        />
      );
    }
  });

  // Guides de bordure du conteneur
  if (selectedComponent.x <= threshold) {
    guides.push(
      <div
        key="container-left"
        className="absolute border-l-2 border-red-400 opacity-70 pointer-events-none"
        style={{
          left: 0,
          top: 0,
          height: `${containerBounds.height}px`,
        }}
      />
    );
  }

  if (selectedComponent.y <= threshold) {
    guides.push(
      <div
        key="container-top"
        className="absolute border-t-2 border-red-400 opacity-70 pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: `${containerBounds.width}px`,
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {guides}
      
      {/* Informations de position */}
      {selectedComponent && (
        <div 
          className="absolute bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none"
          style={{
            left: `${selectedComponent.x + selectedComponent.width + 10}px`,
            top: `${selectedComponent.y}px`,
          }}
        >
          x: {selectedComponent.x}, y: {selectedComponent.y}
          <br />
          w: {selectedComponent.width}, h: {selectedComponent.height}
        </div>
      )}
    </div>
  );
}
