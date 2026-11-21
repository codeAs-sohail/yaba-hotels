import React, { useState } from 'react';
import {
  useGetBranchesQuery,
  useDeleteBranchMutation,
} from '../../../features/dashboard/dashboardApi';
import BranchForm from './BranchForm';

/**
 * Branch Management Tab View.
 * Displays branch cards, Add/Update branch modals, and safe branch deletion.
 */
export default function BranchManagement() {
  const { data: branches = [], isLoading, isFetching } = useGetBranchesQuery();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deletingBranch, setDeletingBranch] = useState(null);
  const [forceDeleteConfirm, setForceDeleteConfirm] = useState(false);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handlePromptDelete = (branch) => {
    setDeletingBranch(branch);
    setForceDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBranch) return;

    const hasAssociatedData = (deletingBranch.menu_count || 0) > 0 || (deletingBranch.feedback_count || 0) > 0;

    if (hasAssociatedData && !forceDeleteConfirm) {
      setForceDeleteConfirm(true);
      return;
    }

    try {
      await deleteBranch({ id: deletingBranch.id, force: forceDeleteConfirm }).unwrap();
      setDeletingBranch(null);
      setForceDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete branch:', err);
      if (err?.status === 404) {
        setDeletingBranch(null);
        setForceDeleteConfirm(false);
        return;
      }
      const msg = err?.data?.error || 'Failed to delete branch.';
      alert(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#141414]/10 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#141414]">
            Hyderabad Outlets ({branches.length})
          </h3>
          <p className="text-xs text-[#555555]">
            Manage physical restaurant branches and contact info
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#F2E205] hover:bg-[#E5D500] text-[#141414] text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 active:scale-95"
        >
          <span>+ Add Branch</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {(isLoading || isFetching) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-[#141414]/10 animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isFetching && branches.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#141414]/10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
            📍
          </div>
          <h3 className="font-serif text-xl font-bold text-[#141414]">No Branches Listed</h3>
          <p className="text-sm text-[#555555] mt-1 mb-6">
            Register your first Hyderabad store location.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F2E205] text-[#141414] font-bold text-sm shadow-md hover:bg-[#E5D500]"
          >
            <span>+ Add Branch Now</span>
          </button>
        </div>
      )}

      {/* Branches Grid */}
      {!isLoading && !isFetching && branches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#141414]/10 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Branch Address */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#FFFBEA] text-[#141414] border border-[#F2E205] flex items-center justify-center text-sm font-serif font-bold">
                      #{b.id}
                    </span>
                    <h4 className="font-sans font-bold text-base sm:text-lg text-[#141414] leading-snug">
                      {b.address}
                    </h4>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mt-4 text-xs sm:text-sm text-[#555555]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📞</span>
                    <a href={`tel:${b.phone_number}`} className="hover:text-[#141414] font-medium">
                      {b.phone_number}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base">✉️</span>
                    <a href={`mailto:${b.email}`} className="hover:text-[#141414] font-medium truncate">
                      {b.email}
                    </a>
                  </div>

                  {b.location && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-base">🗺️</span>
                      <a
                        href={b.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B94720] hover:underline font-semibold text-xs flex items-center gap-1"
                      >
                        <span>Open Google Maps</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>

                {/* Associated Counts */}
                <div className="mt-4 pt-3 border-t border-[#141414]/8 flex items-center gap-2 text-[11px] font-semibold text-[#766D65]">
                  <span className="bg-[#FFFBEA] px-2 py-0.5 rounded border border-[#141414]/8">
                    {b.menu_count || 0} Menu Items
                  </span>
                  <span className="bg-[#FFFBEA] px-2 py-0.5 rounded border border-[#141414]/8">
                    {b.feedback_count || 0} Reviews
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#141414]/8 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-3 py-2 rounded-xl bg-[#FFFBEA] hover:bg-[#F2E205] text-[#141414] text-xs font-bold border border-[#141414]/10 transition-colors"
                >
                  Edit Branch
                </button>
                <button
                  onClick={() => handlePromptDelete(b)}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Branch Form Modal */}
      {isFormOpen && (
        <BranchForm
          initialData={editingBranch}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Branch Delete Safety Confirmation Modal */}
      {deletingBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#141414]/10 text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${forceDeleteConfirm ? 'bg-red-100 text-red-600 animate-bounce' : 'bg-amber-100 text-amber-600'}`}>
              ⚠️
            </div>

            <h3 className="font-serif text-xl font-bold text-[#141414]">
              {forceDeleteConfirm ? 'Force Delete Branch?' : `Delete "${deletingBranch.address}"?`}
            </h3>

            {forceDeleteConfirm ? (
              <p className="text-xs sm:text-sm text-red-600 font-medium mt-2 mb-6">
                Caution: This branch has {deletingBranch.menu_count || 0} menu items and {deletingBranch.feedback_count || 0} reviews. Force deleting will permanently remove all associated menu items and feedback.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#555555] mt-2 mb-6">
                Are you sure you want to remove this branch location from Yaba Fast Food?
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeletingBranch(null);
                  setForceDeleteConfirm(false);
                }}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-[#141414]/20 text-xs sm:text-sm font-bold text-[#141414]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-sm transition-colors ${forceDeleteConfirm ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isDeleting ? 'Deleting...' : (forceDeleteConfirm ? 'Confirm Force Delete' : 'Delete Branch')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
