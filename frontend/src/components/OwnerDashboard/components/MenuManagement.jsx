import React, { useState } from 'react';
import {
  useGetMenusQuery,
  useGetBranchesQuery,
  useDeleteMenuMutation,
} from '../../../features/dashboard/dashboardApi';
import MenuCard from './MenuCard';
import MenuForm from './MenuForm';

/**
 * Menu Management Tab View.
 * Filter by branch, list responsive cards, Add/Edit form, and Delete confirmation.
 */
export default function MenuManagement() {
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Queries
  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();
  const { data: menus = [], isLoading: loadingMenus, isFetching } = useGetMenusQuery(selectedBranchId);
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteMenu(deletingItem.id).unwrap();
      setDeletingItem(null);
    } catch (err) {
      console.error('Failed to delete menu item:', err);
      // If 404, it was already removed from the database
      if (err?.status === 404) {
        setDeletingItem(null);
        return;
      }
      alert(err?.data?.error || 'Failed to delete menu item. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#141414]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Branch Filter Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 flex-grow max-w-md">
          <label htmlFor="branch-filter" className="text-xs font-bold uppercase tracking-wider text-[#141414] whitespace-nowrap">
            Branch:
          </label>
          <div className="relative w-full">
            <select
              id="branch-filter"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              disabled={loadingBranches}
              className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-[#141414]/15 text-sm font-semibold text-[#141414] bg-[#FFFBEA]/60 focus:outline-none focus:ring-2 focus:ring-[#F2E205] transition-all cursor-pointer"
            >
              <option value="all">All Branches ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.address}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Menu Button & Stats */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-bold text-[#555555] bg-gray-100 px-3 py-1.5 rounded-lg">
            {menus.length} {menus.length === 1 ? 'item' : 'items'}
          </span>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2E205] hover:bg-[#E5D500] text-[#141414] text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {(loadingMenus || isFetching) && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-[#141414]/10 animate-pulse space-y-3">
              <div className="aspect-[16/10] bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingMenus && !isFetching && menus.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#141414]/10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
            🍽️
          </div>
          <h3 className="font-serif text-xl font-bold text-[#141414]">No Menu Items Found</h3>
          <p className="text-sm text-[#555555] mt-1 mb-6">
            {selectedBranchId === 'all'
              ? 'Get started by adding your first delicious dish to the menu.'
              : 'There are no items currently listed for this branch.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F2E205] text-[#141414] font-bold text-sm shadow-md hover:bg-[#E5D500] transition-colors"
          >
            <span>+ Add Menu Item Now</span>
          </button>
        </div>
      )}

      {/* Menu Cards Grid */}
      {!loadingMenus && !isFetching && menus.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {menus.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={handleOpenEdit}
              onDelete={setDeletingItem}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <MenuForm
          initialData={editingItem}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#141414]/10 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="font-serif text-xl font-bold text-[#141414]">
              Delete "{deletingItem.item}"?
            </h3>
            <p className="text-sm text-[#555555] mt-2 mb-6">
              This action will remove the item from the menu and permanently delete its linked delivery platform records.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-[#141414]/20 text-sm font-bold text-[#141414] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
