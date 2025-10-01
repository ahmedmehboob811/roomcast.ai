
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './Icons';
import Spinner from './Spinner';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${dragActive ? 'border-brand-accent bg-brand-secondary' : 'border-brand-secondary hover:border-brand-accent'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={isLoading}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadIcon className="w-12 h-12 text-gray-400" />
        <p className="text-gray-300">
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="font-semibold text-brand-accent hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent focus:ring-offset-brand-primary rounded"
          >
            Click to upload
          </button>
          {' '} or drag and drop a room image.
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
        {isLoading && (
          <div className="absolute inset-0 bg-brand-primary/80 flex flex-col items-center justify-center rounded-xl">
            <Spinner />
            <p className="mt-4 text-brand-light animate-pulse">Analyzing room...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
