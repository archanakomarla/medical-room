
import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
}

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
        <circle cx="12" cy="13" r="3"></circle>
    </svg>
);


export default function CameraView({ onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions and try again.");
      }
    };
    startCamera();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="absolute top-8 text-2xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg">Capture Medical Room Background</h1>
        {error ? (
            <div className="text-red-400 p-4 bg-red-900/50 rounded-lg">
                <p>{error}</p>
            </div>
        ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        )}
        <canvas ref={canvasRef} className="hidden"></canvas>
        <button
            onClick={handleCaptureClick}
            disabled={!!error}
            className="absolute bottom-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-4 px-6 rounded-full transition-transform transform hover:scale-105 shadow-lg"
        >
            <CameraIcon />
            Capture Room
        </button>
    </div>
  );
}
