import React, { useState } from 'react';
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from '../../../features/dashboard/dashboardApi';

/**
 * Reusable Mobile-first Branch Form Modal (Add / Edit).
 */
export default function BranchForm({ initialData = null, onClose, onSuccess }) {
  const isEditing = Boolean(initialData);

  const [address, setAddress] = useState(initialData?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phone_number || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [errorMessage, setErrorMessage] = useState('');

  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();

  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!address.trim()) {
      setErrorMessage('Please enter a branch address.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter a phone number.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a branch email address.');
      return;
    }

    const payload = {
      address: address.trim(),
      phone_number: phoneNumber.trim(),
      email: email.trim(),
      location: location.trim(),
    };

    try {
      if (isEditing) {
        await updateBranch({ id: initialData.id, body: payload }).unwrap();
      } else {
        await createBranch(payload).unwrap();
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Branch save error:', err);
      setErrorMessage(
        err?.data?.error ||
        err?.data?.detail ||
        'Failed to save branch. Please verify input fields.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#141414]/10">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#141414]/10">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
              {isEditing ? 'Update Branch' : 'Add New Branch'}
            </h3>
            <p className="text-xs text-[#555555]">
              {isEditing ? 'Modify address, phone, or Google Maps URL' : 'Register a new Hyderabad location'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-[#141414]"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
              Branch Address / Area *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Tegal Kunta, Hyderabad"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#141414]/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2E205]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98490 12345"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#141414]/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2E205]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="branch@yabafastfood.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#141414]/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2E205]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5">
              Google Maps Location URL (Optional)
            </label>
            <input
              type="url"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#141414]/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F2E205]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#141414]/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#141414]/20 text-xs font-bold text-[#141414]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#F2E205] text-[#141414] text-xs font-bold hover:bg-[#E5D500] shadow-sm flex items-center gap-2"
            >
              {isSubmitting ? 'Saving Branch...' : (isEditing ? 'Save Changes' : 'Create Branch')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
