import React from "react";

interface AlignmentGuidesProps {
  showGuides: boolean;
  selectedComponent?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  containerBounds?: {
    width: number;
    height: number;
  };
}

export default function AlignmentGuides({ 
  showGuides, 
  selectedComponent, 
  containerBounds 
}: AlignmentGuidesProps) {
  if (!showGuides || !selectedComponent || !containerBounds) {
    return null;
  }

  const centerX = containerBounds.width / 2;
  const centerY = containerBounds.height / 2;
  const componentCenterX = selectedComponent.x + selectedComponent.width / 2;
  const componentCenterY = selectedComponent.y + selectedComponent.height / 2;

  const showVerticalGuide = Math.abs(componentCenterX - centerX) < 10;
  const showHorizontalGuide = Math.abs(componentCenterY - centerY) < 10;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Vertical center guide */}
      {showVerticalGuide && (
        <div
          className="absolute bg-blue-500 opacity-60"
          style={{
            left: centerX - 0.5,
            top: 0,
            width: 1,
            height: containerBounds.height,
          }}
        />
      )}

      {/* Horizontal center guide */}
      {showHorizontalGuide && (
        <div
          className="absolute bg-blue-500 opacity-60"
          style={{
            left: 0,
            top: centerY - 0.5,
            width: containerBounds.width,
            height: 1,
          }}
        />
      )}

      {/* Component bounds indicator */}
      <div
        className="absolute border border-blue-400 bg-blue-100 bg-opacity-20"
        style={{
          left: selectedComponent.x,
          top: selectedComponent.y,
          width: selectedComponent.width,
          height: selectedComponent.height,
        }}
      />

      {/* Position tooltip */}
      <div
        className="absolute bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-30"
        style={{
          left: selectedComponent.x + selectedComponent.width + 10,
          top: selectedComponent.y,
        }}
      >
        <div>X: {Math.round(selectedComponent.x)}px</div>
        <div>Y: {Math.round(selectedComponent.y)}px</div>
        <div>W: {Math.round(selectedComponent.width)}px</div>
        <div>H: {Math.round(selectedComponent.height)}px</div>
      </div>
    </div>
  );
}