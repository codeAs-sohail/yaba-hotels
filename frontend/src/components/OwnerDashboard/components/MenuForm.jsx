import React, { useState, useEffect } from 'react';
import {
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useGetCategoriesQuery,
  useGetBranchesQuery,
} from '../../../features/dashboard/dashboardApi';
import { useUpload } from '../../../context/UploadContext';
import { resolveImageUrl } from '../../../api/config';

/**
 * Reusable Mobile-first Menu Item Form (Add / Edit).
 * Supports camera/gallery upload with live preview, portion selection (Full/Single),
 * dynamic Category and Branch dropdowns, and delivery platform link toggles.
 */
export default function MenuForm({ initialData = null, onClose, onSuccess }) {
  const isEditing = Boolean(initialData);

  // Form states
  const [item, setItem] = useState(initialData?.item || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [itemType, setItemType] = useState(initialData?.item_type || 'full');
  const [branch, setBranch] = useState(initialData?.branch || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.image ? resolveImageUrl(initialData.image) : ''
  );

  // Platform toggles & URLs
  const platforms = initialData?.online_platforms || {};
  const [zomatoActive, setZomatoActive] = useState(Boolean(platforms.zomato));
  const [zomatoUrl, setZomatoUrl] = useState(platforms.zomato || '');

  const [swiggyActive, setSwiggyActive] = useState(Boolean(platforms.swiggy));
  const [swiggyUrl, setSwiggyUrl] = useState(platforms.swiggy || '');

  const [ownlyActive, setOwnlyActive] = useState(Boolean(platforms.ownly));
  const [ownlyUrl, setOwnlyUrl] = useState(platforms.ownly || '');

  const [errorMessage, setErrorMessage] = useState('');

  // API hooks
  const { data: categories = [], isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();
  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();
  const { startUpload } = useUpload();

  const isSubmitting = isCreating || isUpdating;

  // Set default branch and category on first load if not editing
  useEffect(() => {
    if (!isEditing) {
      if (branches.length > 0 && !branch) {
        setBranch(branches[0].id);
      }
      if (categories.length > 0 && !category) {
        setCategory(categories[0].id);
      }
    }
  }, [branches, categories, isEditing, branch, category]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file.');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // URL validator helper
  const isValidUrl = (string) => {
    if (!string) return true;
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!item.trim()) {
      setErrorMessage('Please enter an item name.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMessage('Please enter a valid price greater than 0.');
      return;
    }
    if (!branch) {
      setErrorMessage('Please select a branch.');
      return;
    }
    if (!category) {
      setErrorMessage('Please select a category.');
      return;
    }

    // Validate platform URLs
    if (zomatoActive && zomatoUrl.trim() && !isValidUrl(zomatoUrl.trim())) {
      setErrorMessage('Please enter a valid URL for Zomato.');
      return;
    }
    if (swiggyActive && swiggyUrl.trim() && !isValidUrl(swiggyUrl.trim())) {
      setErrorMessage('Please enter a valid URL for Swiggy.');
      return;
    }
    if (ownlyActive && ownlyUrl.trim() && !isValidUrl(ownlyUrl.trim())) {
      setErrorMessage('Please enter a valid URL for Ownly.');
      return;
    }

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('item', item.trim());
    formData.append('price', price);
    formData.append('item_type', itemType);
    formData.append('branch', branch);
    formData.append('category', category);
    formData.append('description', description.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Platform delivery links
    formData.append('zomato', zomatoActive ? zomatoUrl.trim() : '');
    formData.append('swiggy', swiggyActive ? swiggyUrl.trim() : '');
    formData.append('ownly', ownlyActive ? ownlyUrl.trim() : '');

    const itemName = item.trim();
    const isEditMode = isEditing;
    const itemId = initialData?.id;

    // Close the modal immediately so the user can continue performing other operations!
    onClose();

    // Trigger asynchronous background save with loading circle and progress line
    startUpload({
      title: isEditMode ? `Update: ${itemName}` : `Menu Item: ${itemName}`,
      type: 'menu',
      file: imageFile,
      task: async () => {
        let res;
        if (isEditMode) {
          res = await updateMenu({ id: itemId, formData }).unwrap();
        } else {
          res = await createMenu(formData).unwrap();
        }
        if (onSuccess) onSuccess();
        return res;
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl border border-[#141414]/10 flex flex-col overflow-hidden max-h-[100vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-[#141414]/10 bg-[#FFFBEA]/80">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
              {isEditing ? 'Update Menu Item' : 'Add New Menu Item'}
            </h2>
            <p className="text-xs text-[#555555]">
              {isEditing ? 'Edit pricing, portion, or links' : 'Upload photo and fill in item specifications'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#141414]/10 text-[#141414] transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-5 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Image Upload with Live Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-2">
              Item Photo (Supabase Storage)
            </label>
            <div className="relative border-2 border-dashed border-[#141414]/20 hover:border-[#F2E205] rounded-2xl p-4 bg-[#FFFBEA]/40 text-center transition-colors">
              {imagePreview ? (
                <div className="relative aspect-[16/9] max-h-48 mx-auto rounded-xl overflow-hidden bg-black/5">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-bold gap-2">
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#F2E205]/30 flex items-center justify-center text-2xl mb-2">
                    📸
                  </div>
                  <span className="text-sm font-bold text-[#141414]">Click to choose photo</span>
                  <span className="text-xs text-[#555555] mt-1">Camera or Gallery (JPEG, PNG, WebP up to 10MB)</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* 2 & 3. Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. Chicken 65"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#141414]/20 focus:outline-none focus:ring-2 focus:ring-[#F2E205] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 250"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#141414]/20 focus:outline-none focus:ring-2 focus:ring-[#F2E205] text-sm font-medium"
              />
            </div>
          </div>

          {/* 4. Portion Selection (Dropdown with Full and Single) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Portion Size *
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#141414]/20 focus:outline-none focus:ring-2 focus:ring-[#F2E205] text-sm font-semibold bg-white"
              >
                <option value="full">Full</option>
                <option value="single">Single</option>
              </select>
            </div>

            {/* 6. Dynamic Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loadingCategories}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#141414]/20 focus:outline-none focus:ring-2 focus:ring-[#F2E205] text-sm font-medium bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Dynamic Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Branch *
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={loadingBranches}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#141414]/20 focus:outline-none focus:ring-2 focus:ring-[#F2E205] text-sm font-medium bg-white"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.address}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Crisp wok-tossed chicken with spicy green chillies and curry leaves."
              className="w-full px-4 py-2.5 rounded-xl border border-[#141414]/20 focus:outline-none focus:ring-2 focus:ring-[#F2E205] text-sm font-medium"
            />
          </div>

          {/* 5. Delivery Platform Toggles & URL Inputs */}
          <div className="pt-2 border-t border-[#141414]/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#141414]">
              Online Delivery Platforms
            </h3>

            {/* Zomato Toggle */}
            <div className="p-3.5 rounded-xl border border-[#141414]/10 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span className="text-sm font-bold text-[#141414]">Zomato</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={zomatoActive}
                    onChange={(e) => setZomatoActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
                </label>
              </div>
              {zomatoActive && (
                <div className="mt-3">
                  <input
                    type="url"
                    value={zomatoUrl}
                    onChange={(e) => setZomatoUrl(e.target.value)}
                    placeholder="https://www.zomato.com/hyderabad/yaba-fast-food..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#141414]/20 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            {/* Swiggy Toggle */}
            <div className="p-3.5 rounded-xl border border-[#141414]/10 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                  <span className="text-sm font-bold text-[#141414]">Swiggy</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={swiggyActive}
                    onChange={(e) => setSwiggyActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600" />
                </label>
              </div>
              {swiggyActive && (
                <div className="mt-3">
                  <input
                    type="url"
                    value={swiggyUrl}
                    onChange={(e) => setSwiggyUrl(e.target.value)}
                    placeholder="https://www.swiggy.com/restaurants/yaba-fast-food..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#141414]/20 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Ownly Toggle */}
            <div className="p-3.5 rounded-xl border border-[#141414]/10 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-sm font-bold text-[#141414]">Ownly Delivery</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ownlyActive}
                    onChange={(e) => setOwnlyActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
              {ownlyActive && (
                <div className="mt-3">
                  <input
                    type="url"
                    value={ownlyUrl}
                    onChange={(e) => setOwnlyUrl(e.target.value)}
                    placeholder="https://yabafastfood.com/order/..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#141414]/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-[#141414]/10 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#141414]/20 text-sm font-bold text-[#141414] hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#F2E205] hover:bg-[#E5D500] text-[#141414] text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#141414]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Menu Item'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
