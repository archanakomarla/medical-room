
import React from 'react';

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const RefreshCwIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;


interface ToolbarProps {
  onRetake: () => void;
  onReset: () => void;
  onSave: () => void;
}

export default function Toolbar({ onRetake, onReset, onSave }: ToolbarProps) {
  return (
    <header className="bg-gray-900 text-white p-2 flex items-center justify-between shadow-md z-20">
      <h1 className="text-xl font-bold text-blue-400">Medical Room Designer</h1>
      <div className="flex items-center gap-2">
        <button onClick={onRetake} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          <CameraIcon />
          Retake Photo
        </button>
         <button onClick={onReset} className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          <RefreshCwIcon />
          Reset Objects
        </button>
        <button onClick={onSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
          <DownloadIcon />
          Save Design
        </button>
      </div>
    </header>
  );
}
