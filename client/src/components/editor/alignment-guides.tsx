
import React from "react";

interface AlignmentGuidesProps {
  showGuides: boolean;
  selectedComponent?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  containerBounds?: {
    width: number;
    height: number;
  } | null;
  allComponents?: Array<{
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
  allComponents = []
}: AlignmentGuidesProps) {
  if (!showGuides || !selectedComponent || !containerBounds) {
    return null;
  }

  const centerX = containerBounds.width / 2;
  const centerY = containerBounds.height / 2;
  const componentCenterX = selectedComponent.x + selectedComponent.width / 2;
  const componentCenterY = selectedComponent.y + selectedComponent.height / 2;

  const snapDistance = 10;
  const showVerticalGuide = Math.abs(componentCenterX - centerX) < snapDistance;
  const showHorizontalGuide = Math.abs(componentCenterY - centerY) < snapDistance;

  // Guides d'alignement avec d'autres composants
  const otherComponents = allComponents.filter(comp => 
    comp.id !== selectedComponent && selectedComponent
  );

  const alignmentLines: Array<{
    type: 'vertical' | 'horizontal';
    position: number;
    color: string;
  }> = [];

  // Guide vertical du centre du conteneur
  if (showVerticalGuide) {
    alignmentLines.push({
      type: 'vertical',
      position: centerX,
      color: '#3b82f6'
    });
  }

  // Guide horizontal du centre du conteneur
  if (showHorizontalGuide) {
    alignmentLines.push({
      type: 'horizontal',
      position: centerY,
      color: '#3b82f6'
    });
  }

  // Guides d'alignement avec d'autres composants
  otherComponents.forEach(comp => {
    const compCenterX = comp.x + comp.width / 2;
    const compCenterY = comp.y + comp.height / 2;

    // Alignement vertical
    if (Math.abs(componentCenterX - compCenterX) < snapDistance) {
      alignmentLines.push({
        type: 'vertical',
        position: compCenterX,
        color: '#ef4444'
      });
    }

    // Alignement horizontal
    if (Math.abs(componentCenterY - compCenterY) < snapDistance) {
      alignmentLines.push({
        type: 'horizontal',
        position: compCenterY,
        color: '#ef4444'
      });
    }

    // Alignement des bords
    if (Math.abs(selectedComponent.x - comp.x) < snapDistance) {
      alignmentLines.push({
        type: 'vertical',
        position: comp.x,
        color: '#10b981'
      });
    }

    if (Math.abs(selectedComponent.y - comp.y) < snapDistance) {
      alignmentLines.push({
        type: 'horizontal',
        position: comp.y,
        color: '#10b981'
      });
    }
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {alignmentLines.map((line, index) => (
        <div
          key={index}
          className="absolute transition-opacity duration-200"
          style={{
            backgroundColor: line.color,
            opacity: 0.7,
            ...(line.type === 'vertical' ? {
              left: line.position - 0.5,
              top: 0,
              width: 1,
              height: containerBounds.height,
            } : {
              left: 0,
              top: line.position - 0.5,
              width: containerBounds.width,
              height: 1,
            })
          }}
        />
      ))}
      
      {/* Indicateurs aux intersections */}
      {alignmentLines.filter(l => l.type === 'vertical').map(vLine => 
        alignmentLines.filter(l => l.type === 'horizontal').map(hLine => (
          <div
            key={`${vLine.position}-${hLine.position}`}
            className="absolute w-2 h-2 border-2 border-white rounded-full"
            style={{
              left: vLine.position - 4,
              top: hLine.position - 4,
              backgroundColor: vLine.color,
              boxShadow: '0 0 4px rgba(0,0,0,0.3)'
            }}
          />
        ))
      )}
    </div>
  );
}
