
import React, { useRef } from 'react';
import type { PredefinedObject } from '../types';

interface ObjectPaletteProps {
  predefinedObjects: PredefinedObject[];
  customObjects: PredefinedObject[];
  onAddCustomObject: (file: File) => void;
}

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;

const ObjectItem: React.FC<{ obj: PredefinedObject }> = ({ obj }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('application/json', JSON.stringify(obj));
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="p-2 border border-gray-600 rounded-md bg-gray-700 cursor-grab active:cursor-grabbing hover:bg-gray-600 transition-colors flex flex-col items-center gap-2"
        >
            <img src={obj.src} alt={obj.name} className="max-w-full h-auto max-h-24 object-contain pointer-events-none" />
            <span className="text-xs text-center text-gray-300">{obj.name}</span>
        </div>
    );
};

export default function ObjectPalette({ predefinedObjects, customObjects, onAddCustomObject }: ObjectPaletteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddCustomObject(e.target.files[0]);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 p-4 overflow-y-auto flex flex-col gap-6 shadow-lg z-10">
      <div>
        <h2 className="text-lg font-semibold mb-3 text-blue-300">Objects</h2>
        <div className="grid grid-cols-2 gap-3">
          {predefinedObjects.map((obj) => (
            <ObjectItem key={obj.id} obj={obj} />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h2 className="text-lg font-semibold mb-3 text-blue-300">Custom Objects</h2>
         <div className="grid grid-cols-2 gap-3 mb-4">
          {customObjects.map((obj) => (
            <ObjectItem key={obj.id} obj={obj} />
          ))}
        </div>
        <input
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          <UploadIcon/>
          Upload PNG
        </button>
      </div>
    </aside>
  );
}
