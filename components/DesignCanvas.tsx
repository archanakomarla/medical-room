
import React, { forwardRef } from 'react';
import type { PlacedObject, PredefinedObject } from '../types';
import PlacedObjectComponent from './PlacedObject';

interface DesignCanvasProps {
  backgroundImage: string | null;
  placedObjects: PlacedObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<PlacedObject>) => void;
  onAddObject: (obj: PredefinedObject, position: { x: number, y: number }) => void;
  onDeleteObject: (id: string) => void;
}

const DesignCanvas = forwardRef<HTMLDivElement, DesignCanvasProps>(({
  backgroundImage,
  placedObjects,
  selectedObjectId,
  onSelectObject,
  onUpdateObject,
  onAddObject,
  onDeleteObject,
}, ref) => {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const objData = e.dataTransfer.getData('application/json');
    if (objData) {
        const obj: PredefinedObject = JSON.parse(objData);
        const canvasRect = e.currentTarget.getBoundingClientRect();
        const position = {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        };
        onAddObject(obj, position);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  return (
    <div
      ref={ref}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative shadow-2xl overflow-hidden"
      style={{
        aspectRatio: '16 / 9',
        width: '90%',
        maxWidth: '1280px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {placedObjects.map((obj) => (
        <PlacedObjectComponent
          key={obj.id}
          object={obj}
          isSelected={obj.id === selectedObjectId}
          onSelect={onSelectObject}
          onUpdate={onUpdateObject}
          onDelete={onDeleteObject}
          bounds={ref && typeof ref !== 'function' ? ref.current?.getBoundingClientRect() : null}
        />
      ))}
    </div>
  );
});

export default DesignCanvas;
