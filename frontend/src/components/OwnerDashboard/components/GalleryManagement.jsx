import React, { useState } from 'react';
import {
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
} from '../../../features/dashboard/dashboardApi';
import { useUpload } from '../../../context/UploadContext';
import { resolveImageUrl } from '../../../api/config';

/**
 * Gallery Management Tab View.
 * Displays responsive photo grid, upload with live preview, update/replace, and delete.
 */
export default function GalleryManagement() {
  const { data: gallery = [], isLoading, isFetching } = useGetGalleryQuery();
  const [createGallery, { isLoading: isCreating }] = useCreateGalleryMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation();
  const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation();
  const { startUpload } = useUpload();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenUpload = (target = null) => {
    setReplaceTarget(target);
    setSelectedFile(null);
    setPreviewUrl('');
    setErrorMessage('');
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please choose an image to upload.');
      return;
    }

    const fileToUpload = selectedFile;
    const targetToReplace = replaceTarget;
    const formData = new FormData();
    formData.append('image', fileToUpload);

    // Close modal immediately so the user can continue navigating freely,
    // while the async upload runs with the animated circle and progress line.
    setIsUploadModalOpen(false);

    try {
      await startUpload({
        title: targetToReplace ? `Replace Photo #${targetToReplace.id}` : fileToUpload.name,
        type: 'gallery',
        file: fileToUpload,
        task: async () => {
          if (targetToReplace) {
            return await updateGallery({ id: targetToReplace.id, formData }).unwrap();
          } else {
            return await createGallery(formData).unwrap();
          }
        },
      });
    } catch (err) {
      console.error('Gallery upload error:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingImage) return;
    try {
      await deleteGallery(deletingImage.id).unwrap();
      setDeletingImage(null);
    } catch (err) {
      console.error('Failed to delete image:', err);
      if (err?.status === 404) {
        setDeletingImage(null);
        return;
      }
      alert(err?.data?.error || 'Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#141414]/10 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#141414]">
            Restaurant Showcase Gallery
          </h3>
          <p className="text-xs text-[#555555]">
            Photos stored securely on Supabase Storage
          </p>
        </div>
        <button
          onClick={() => handleOpenUpload(null)}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#F2E205] hover:bg-[#E5D500] text-[#141414] text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 active:scale-95"
        >
          <span>+ Add Photo</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {(isLoading || isFetching) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && gallery.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#141414]/10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
            🖼️
          </div>
          <h3 className="font-serif text-xl font-bold text-[#141414]">No Photos in Gallery</h3>
          <p className="text-sm text-[#555555] mt-1 mb-6">
            Upload images of your store, dining tables, and sizzler kitchens.
          </p>
          <button
            onClick={() => handleOpenUpload(null)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F2E205] text-[#141414] font-bold text-sm shadow-md hover:bg-[#E5D500] transition-colors"
          >
            <span>+ Upload Photo Now</span>
          </button>
        </div>
      )}

      {/* Image Grid */}
      {!isLoading && !isFetching && gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-2xl overflow-hidden bg-[#141414]/5 border border-[#141414]/10 shadow-xs group"
            >
              <img
                src={resolveImageUrl(img.image_link)}
                alt={`Gallery #${img.id}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect fill="%23FFFBEA" width="300" height="300"/><text fill="%23766D65" font-family="sans-serif" font-size="14" font-weight="bold" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle">Yaba Showcase</text></svg>';
                }}
              />

              {/* Action Overlays */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => handleOpenUpload(img)}
                  className="w-full max-w-[130px] px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#141414] text-xs font-bold shadow-xs transition-colors"
                >
                  Replace Photo
                </button>
                <button
                  onClick={() => setDeletingImage(img)}
                  className="w-full max-w-[130px] px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Delete Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Replace Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#141414]/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#141414]/10">
              <h3 className="font-serif text-xl font-bold text-[#141414]">
                {replaceTarget ? 'Replace Gallery Photo' : 'Upload Gallery Photo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#141414]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="border-2 border-dashed border-[#141414]/20 rounded-2xl p-4 bg-[#FFFBEA]/40 text-center">
                {previewUrl ? (
                  <div className="relative aspect-square max-h-56 mx-auto rounded-xl overflow-hidden bg-black/5">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-bold">
                      <span>Change Image</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                    <div className="text-3xl mb-2">📸</div>
                    <span className="text-sm font-bold text-[#141414]">Select Image</span>
                    <span className="text-xs text-[#555555] mt-1">From camera or device files</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#141414]/20 text-xs font-bold text-[#141414]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#F2E205] text-[#141414] text-xs font-bold hover:bg-[#E5D500] shadow-sm flex items-center gap-2"
                >
                  {(isCreating || isUpdating) ? 'Uploading to Supabase...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#141414]/10 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="font-serif text-lg font-bold text-[#141414]">Delete this photo?</h3>
            <p className="text-xs text-[#555555] mt-1 mb-5">
              This photo will be removed from your gallery and deleted from Supabase Storage.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeletingImage(null)}
                className="px-4 py-2 rounded-xl border border-[#141414]/20 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
