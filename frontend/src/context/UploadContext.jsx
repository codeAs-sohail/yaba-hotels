import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const UploadContext = createContext(null);

/**
 * Global Upload Provider that manages asynchronous image uploads across all pages.
 * Ensures that if the owner uploads an image and switches tabs or navigates away,
 * the upload Promise continues uninterrupted, and a floating indicator (with circle & progress line)
 * tracks the progress until completion.
 */
export function UploadProvider({ children }) {
  const [uploads, setUploads] = useState([]);
  const progressTimers = useRef({});

  const dismissUpload = useCallback((id) => {
    if (progressTimers.current[id]) {
      clearInterval(progressTimers.current[id]);
      delete progressTimers.current[id];
    }
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const startUpload = useCallback(async ({ title, type = 'image', file = null, task }) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    let previewUrl = '';
    if (file && file instanceof Blob) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (e) {
        console.warn('Could not generate object URL for preview:', e);
      }
    }

    const newUpload = {
      id,
      title: title || (file ? file.name : 'Image'),
      type,
      previewUrl,
      status: 'uploading', // 'uploading' | 'completed' | 'error'
      progress: 15,
      errorMessage: '',
      startedAt: Date.now(),
    };

    setUploads((prev) => [newUpload, ...prev]);

    // Simulated smooth progress while network task is in-flight
    const timer = setInterval(() => {
      setUploads((prev) =>
        prev.map((item) => {
          if (item.id === id && item.status === 'uploading') {
            const nextProgress = Math.min(item.progress + Math.floor(Math.random() * 8 + 4), 92);
            return { ...item, progress: nextProgress };
          }
          return item;
        })
      );
    }, 400);

    progressTimers.current[id] = timer;

    try {
      const result = await task();

      // Finish progress
      clearInterval(progressTimers.current[id]);
      delete progressTimers.current[id];

      setUploads((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'completed', progress: 100 }
            : item
        )
      );

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        dismissUpload(id);
      }, 4500);

      return result;
    } catch (err) {
      clearInterval(progressTimers.current[id]);
      delete progressTimers.current[id];

      const errMsg =
        err?.data?.error ||
        err?.data?.detail ||
        err?.message ||
        'Upload failed. Please check network or file size.';

      setUploads((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'error', errorMessage: errMsg }
            : item
        )
      );

      throw err;
    }
  }, [dismissUpload]);

  const activeCount = uploads.filter((u) => u.status === 'uploading').length;

  return (
    <UploadContext.Provider value={{ uploads, startUpload, dismissUpload, activeCount }}>
      {children}
      <UploadToastContainer uploads={uploads} onDismiss={dismissUpload} />
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}

/**
 * Floating UI Widget displaying active and recent uploads with animated circle and progress line.
 * Stays visible at the bottom of the screen across all dashboard tabs & routes.
 */
function UploadToastContainer({ uploads, onDismiss }) {
  if (uploads.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-3 sm:px-0"
    >
      {uploads.map((upload) => (
        <div
          key={upload.id}
          className={`pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 border shadow-2xl transition-all duration-300 transform translate-y-0 ${
            upload.status === 'error'
              ? 'border-red-300 ring-2 ring-red-100'
              : upload.status === 'completed'
              ? 'border-emerald-300 ring-2 ring-emerald-100'
              : 'border-[#141414]/15 ring-2 ring-[#F2E205]/40'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Animated Circle / Spinner or Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {upload.status === 'uploading' && (
                <div className="relative w-8 h-8 flex items-center justify-center">
                  {/* Circular SVG Spinner */}
                  <svg
                    className="animate-spin w-8 h-8 text-[#E85D16]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-20"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-black text-[#141414]">
                    {upload.progress}%
                  </span>
                </div>
              )}

              {upload.status === 'completed' && (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shadow-xs">
                  ✓
                </div>
              )}

              {upload.status === 'error' && (
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shadow-xs">
                  ✕
                </div>
              )}
            </div>

            {/* Upload details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#141414] truncate">
                  {upload.status === 'uploading' && 'Uploading Image...'}
                  {upload.status === 'completed' && 'Upload Successful!'}
                  {upload.status === 'error' && 'Upload Failed'}
                </h4>
                <button
                  type="button"
                  onClick={() => onDismiss(upload.id)}
                  className="text-gray-400 hover:text-gray-700 p-1 -mr-1 rounded-full text-xs"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-[#555555] truncate mt-0.5">
                {upload.title}
              </p>

              {/* Status explanation */}
              {upload.status === 'uploading' && (
                <p className="text-[10px] text-amber-700 mt-1 font-medium leading-tight">
                  Uploading asynchronously to storage. You can freely switch tabs or pages!
                </p>
              )}

              {upload.status === 'completed' && (
                <p className="text-[10px] text-emerald-700 mt-1 font-medium leading-tight">
                  Saved securely and live in your restaurant showcase.
                </p>
              )}

              {upload.status === 'error' && (
                <p className="text-[10px] text-red-600 mt-1 font-medium leading-tight line-clamp-2">
                  {upload.errorMessage}
                </p>
              )}

              {/* Animated Progress Line */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-2.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    upload.status === 'error'
                      ? 'bg-red-500'
                      : upload.status === 'completed'
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-[#F2E205] to-[#E85D16] animate-pulse'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UploadContext;
