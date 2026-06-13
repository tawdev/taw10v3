'use client';

import { ChangeEvent, useState } from 'react';
import { Link2, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/form';
import { uploadService } from '@/services/upload.service';

type ImageMode = 'upload' | 'url';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function ImageUploadField({ value, onChange, label = 'Image URL', required = false }: ImageUploadFieldProps) {
  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Max size is 5MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploaded = await uploadService.uploadImage(file);
      onChange(uploaded.imageUrl);
      setImageMode('url'); // Switch back to URL view to show the result
    } catch {
      setError('Unable to upload image.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#6b6255]">{label}</label>
        <div className="flex rounded-md bg-[#efe7d7] p-0.5">
          <button
            type="button"
            onClick={() => setImageMode('upload')}
            className={`flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
              imageMode === 'upload' ? 'bg-white text-[#1f2a24] shadow-sm' : 'text-[#8a8172] hover:text-[#1f2a24]'
            }`}
          >
            <UploadCloud className="h-3 w-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setImageMode('url')}
            className={`flex items-center gap-1.5 rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
              imageMode === 'url' ? 'bg-white text-[#1f2a24] shadow-sm' : 'text-[#8a8172] hover:text-[#1f2a24]'
            }`}
          >
            <Link2 className="h-3 w-3" /> URL
          </button>
        </div>
      </div>

      {error && <div className="text-xs font-semibold text-red-600">{error}</div>}

      {imageMode === 'upload' ? (
        <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d9caa9] bg-[#fffdf8] px-6 py-4 text-center transition-colors hover:bg-[#faf9f6] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <UploadCloud className="mb-2 h-6 w-6 text-[#a68942]" />
          <span className="text-xs font-bold text-[#1f2a24]">
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </span>
          <span className="mt-0.5 text-[10px] font-medium text-[#8a8172]">
            PNG, JPG, WEBP up to 5MB
          </span>
          <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} disabled={isUploading} />
        </label>
      ) : (
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          required={required} 
          placeholder="https://example.com/image.jpg"
          className="h-12 rounded-xl border-[#d9caa9] bg-[#fffdf8] px-4 font-semibold" 
        />
      )}
    </div>
  );
}
