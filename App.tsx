
import React, { useState, useCallback, useRef } from 'react';
import type { PlacedObject, PredefinedObject } from './types';
import { AppState } from './types';
import CameraView from './components/CameraView';
import DesignCanvas from './components/DesignCanvas';
import ObjectPalette from './components/ObjectPalette';
import Toolbar from './components/Toolbar';
import { PREDEFINED_OBJECTS } from './constants';

declare const html2canvas: any;

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.CAMERA_VIEW);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [placedObjects, setPlacedObjects] = useState<PlacedObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [customObjects, setCustomObjects] = useState<PredefinedObject[]>([]);
  const designCanvasRef = useRef<HTMLDivElement>(null);

  const handleCapture = (imageSrc: string) => {
    setBackgroundImage(imageSrc);
    setAppState(AppState.DESIGN_VIEW);
  };

  const handleRetake = () => {
    setBackgroundImage(null);
    setPlacedObjects([]);
    setSelectedObjectId(null);
    setAppState(AppState.CAMERA_VIEW);
  };
  
  const handleReset = () => {
    setPlacedObjects([]);
    setSelectedObjectId(null);
  }

  const handleAddObject = (obj: PredefinedObject, position: { x: number; y: number }) => {
    const newObject: PlacedObject = {
      ...obj,
      id: `obj_${Date.now()}`,
      x: position.x - obj.width / 2,
      y: position.y - obj.height / 2,
      rotation: 0,
    };
    setPlacedObjects((prev) => [...prev, newObject]);
    setSelectedObjectId(newObject.id);
  };

  const handleUpdateObject = useCallback((id: string, updates: Partial<PlacedObject>) => {
    setPlacedObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  }, []);
  
  const handleDeleteObject = (id: string) => {
      setPlacedObjects(prev => prev.filter(obj => obj.id !== id));
      setSelectedObjectId(null);
  }

  const handleAddCustomObject = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
             const newCustomObject: PredefinedObject = {
                id: `custom_${Date.now()}`,
                name: file.name.split('.')[0],
                src: e.target?.result as string,
                width: img.width > 200 ? 200 : img.width,
                height: img.height > 200 ? (200 / img.width) * img.height : img.height,
            };
            setCustomObjects(prev => [...prev, newCustomObject]);
        }
        img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveImage = () => {
    if (designCanvasRef.current) {
        setSelectedObjectId(null); // Deselect object to hide controls before capture
        setTimeout(() => { // Allow UI to update
            html2canvas(designCanvasRef.current, {
                useCORS: true,
                backgroundColor: null, // Transparent background
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = 'medical-room-design.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }, 100);
    }
  };


  if (appState === AppState.CAMERA_VIEW) {
    return <CameraView onCapture={handleCapture} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Toolbar onRetake={handleRetake} onReset={handleReset} onSave={handleSaveImage} />
      <div className="flex flex-1 overflow-hidden">
        <ObjectPalette
          predefinedObjects={PREDEFINED_OBJECTS}
          customObjects={customObjects}
          onAddCustomObject={handleAddCustomObject}
        />
        <main 
            className="flex-1 flex items-center justify-center p-4 bg-gray-900/50 overflow-auto"
            onClick={(e) => {
                if((e.target as HTMLElement).tagName === 'MAIN') {
                    setSelectedObjectId(null);
                }
            }}
        >
          <DesignCanvas
            ref={designCanvasRef}
            backgroundImage={backgroundImage}
            placedObjects={placedObjects}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
            onUpdateObject={handleUpdateObject}
            onAddObject={handleAddObject}
            onDeleteObject={handleDeleteObject}
          />
        </main>
      </div>
    </div>
  );
}
