import React, { useEffect, useRef } from 'react';
import type { PlacedObject } from '../types';

interface PlacedObjectProps {
  object: PlacedObject;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<PlacedObject>) => void;
  onDelete: (id: string) => void;
  bounds: DOMRect | null;
}

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const RotateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.43-6.13"></path><path d="M21 2v4h-4"></path></svg>;

// FIX: Explicitly type PlacedObjectComponent as a React.FC to resolve a TypeScript error where the 'key' prop was not being correctly handled.
const PlacedObjectComponent: React.FC<PlacedObjectProps> = ({ object, isSelected, onSelect, onUpdate, onDelete, bounds }) => {
  const ref = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<{ type: string, startX: number, startY: number, startWidth?: number, startHeight?: number, startRot?: number, centerX?: number, centerY?: number, startAngle?: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
    e.stopPropagation();
    onSelect(object.id);
    interactionRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
    };
    
    if (type === 'resize' && ref.current) {
        interactionRef.current.startWidth = object.width;
        interactionRef.current.startHeight = object.height;
    }
     if (type === 'rotate' && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      interactionRef.current.startRot = object.rotation;
      interactionRef.current.centerX = centerX;
      interactionRef.current.centerY = centerY;
      interactionRef.current.startAngle = startAngle;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!interactionRef.current || !bounds) return;

    const dx = e.clientX - interactionRef.current.startX;
    const dy = e.clientY - interactionRef.current.startY;

    switch (interactionRef.current.type) {
      case 'move':
        onUpdate(object.id, { x: object.x + dx, y: object.y + dy });
        interactionRef.current.startX = e.clientX;
        interactionRef.current.startY = e.clientY;
        break;
      case 'resize':
        if(interactionRef.current.startWidth && interactionRef.current.startHeight) {
            const newWidth = Math.max(20, interactionRef.current.startWidth + dx);
            const newHeight = Math.max(20, interactionRef.current.startHeight + dy);
            onUpdate(object.id, { width: newWidth, height: newHeight });
        }
        break;
      case 'rotate':
        if(interactionRef.current.centerX && interactionRef.current.centerY && interactionRef.current.startAngle !== undefined && interactionRef.current.startRot !== undefined) {
             const currentAngle = Math.atan2(e.clientY - interactionRef.current.centerY, e.clientX - interactionRef.current.centerX) * (180 / Math.PI);
             const angleDiff = currentAngle - interactionRef.current.startAngle;
             onUpdate(object.id, { rotation: interactionRef.current.startRot + angleDiff });
        }
        break;
    }
  };

  const handleMouseUp = () => {
    interactionRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      style={{
        position: 'absolute',
        left: `${object.x}px`,
        top: `${object.y}px`,
        width: `${object.width}px`,
        height: `${object.height}px`,
        transform: `rotate(${object.rotation}deg)`,
        backgroundImage: `url(${object.src})`,
        backgroundSize: '100% 100%',
        cursor: 'move',
        userSelect: 'none',
      }}
      className={`transition-shadow ${isSelected ? 'shadow-2xl shadow-blue-500/50' : ''}`}
    >
      {isSelected && (
        <>
            <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-500 border-dashed pointer-events-none"></div>

            <div 
                onMouseDown={(e) => handleMouseDown(e, 'resize')}
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize"
            />
            
            <button 
                onMouseDown={(e) => { e.stopPropagation(); onDelete(object.id); }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-white hover:bg-red-700 cursor-pointer"
            >
                <TrashIcon/>
            </button>

            <div 
                onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white cursor-alias"
            >
                <RotateIcon />
            </div>
        </>
      )}
    </div>
  );
};

export default PlacedObjectComponent;
