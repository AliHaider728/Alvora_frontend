import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface VariationImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (image: { url: string; publicId?: string; alt?: string } | undefined) => void;
  currentImage?: { url: string; publicId?: string; alt?: string };
  productImages: { id: string; url: string; publicId?: string }[];
}

export const VariationImageModal: React.FC<VariationImageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentImage,
  productImages
}) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; publicId?: string; alt?: string } | undefined>(currentImage);
  const [altText, setAltText] = useState(currentImage?.alt || '');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('images', file); // using 'images' to match the backend multer config

    try {
      const res = await api.uploadProductImage(formData);
      setSelectedImage({
        url: res.secureUrl,
        publicId: res.secureUrl.split('/').pop()?.split('.')[0] || '', // Fallback extraction
        alt: altText
      });
    } catch (err) {
      console.error('Failed to upload variation image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      onSave({ ...selectedImage, alt: altText });
    } else {
      onSave(undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-heading font-black text-lg text-slate-800">Variation Image</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Current Selection</h3>
            {selectedImage ? (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 aspect-video flex items-center justify-center max-w-sm">
                <img src={selectedImage.url} alt="Variation Preview" className="max-w-full max-h-full object-contain" />
                <button
                  onClick={() => setSelectedImage(undefined)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-md text-rose-500 shadow hover:bg-rose-50"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No image selected</p>
                <p className="text-xs">Select from gallery or upload a new one</p>
              </div>
            )}
          </div>

          {selectedImage && (
            <div className="mb-6">
              <label className="block">
                <span className="block text-xs font-bold text-slate-700 mb-1.5">Alt Text</span>
                <input
                  type="text"
                  value={altText}
                  onChange={e => setAltText(e.target.value)}
                  placeholder="Describe the image for screen readers and SEO"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Upload New</h3>
              <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 cursor-pointer transition-colors font-medium text-sm">
                {isUploading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-5 h-5" /> Select File</>
                )}
                <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleUpload} />
              </label>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-3">Select from Gallery</h3>
              {productImages.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  No existing product images available.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {productImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => {
                        setSelectedImage({ url: img.url, publicId: img.publicId, alt: altText });
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage?.url === img.url ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img src={img.url} className="w-full h-full object-cover" alt="Gallery option" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/60 text-[9px] text-white font-bold text-center py-0.5">Main</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-colors">
            Confirm Image
          </button>
        </div>
      </div>
    </div>
  );
};
