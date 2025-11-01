'use client';

import { useState, useRef } from 'react';
import { uploadFile, deleteFile, getFilePreview, BUCKETS } from '@/lib/appwrite';
import { Button } from '@/components/ui';

export default function ImageUpload({ images = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      await handleFiles(imageFiles);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressKey = `${file.name}-${Date.now()}`;
      
      try {
        setUploadProgress((prev) => ({ ...prev, [progressKey]: 0 }));

        // Upload to Appwrite storage
        const response = await uploadFile(BUCKETS.PRODUCT_IMAGES, file);
        
        // Get preview URL
        const previewUrl = getFilePreview(BUCKETS.PRODUCT_IMAGES, response.$id, 400, 400);

        newImages.push({
          fileId: response.$id,
          url: previewUrl,
          name: file.name,
        });

        setUploadProgress((prev) => ({ ...prev, [progressKey]: 100 }));
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Failed to upload ${file.name}`);
      } finally {
        // Remove progress indicator after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const updated = { ...prev };
            delete updated[progressKey];
            return updated;
          });
        }, 1000);
      }
    }

    onChange(newImages);
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (index) => {
    const imageToDelete = images[index];
    
    try {
      // Delete from Appwrite storage
      await deleteFile(BUCKETS.PRODUCT_IMAGES, imageToDelete.fileId);
      
      // Remove from state
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete image');
    }
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-slate-600 hover:border-slate-500'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-slate-400">
            cloud_upload
          </span>
          <div>
            <p className="text-white text-sm mb-1">
              Drag and drop images here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:text-primary/80 font-medium"
                disabled={uploading}
              >
                browse
              </button>
            </p>
            <p className="text-slate-400 text-xs">
              Supports: JPG, PNG, GIF (max 10MB per file)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([key, progress]) => (
            <div key={key} className="flex items-center gap-3">
              <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.fileId}
              className="relative group aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700"
            >
              <img
                src={image.url}
                alt={image.name || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Move left"
                  >
                    <span className="material-symbols-outlined text-white text-base">
                      chevron_left
                    </span>
                  </button>
                )}
                
                {/* Move right */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    title="Move right"
                  >
                    <span className="material-symbols-outlined text-white text-base">
                      chevron_right
                    </span>
                  </button>
                )}
                
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="p-2 bg-negative hover:bg-negative/80 rounded-lg transition-colors"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-white text-base">
                    delete
                  </span>
                </button>
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded text-white text-xs font-medium">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <p className="text-slate-400 text-sm text-center py-4">
          No images uploaded yet
        </p>
      )}
    </div>
  );
}
