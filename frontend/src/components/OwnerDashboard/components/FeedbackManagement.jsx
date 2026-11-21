import React, { useState } from 'react';
import {
  useGetFeedbacksQuery,
  useGetBranchesQuery,
  useToggleFeedbackVisibilityMutation,
} from '../../../features/dashboard/dashboardApi';

/**
 * Feedback Management Tab View.
 * Displays customer reviews, star ratings, qualities, branch filtering,
 * average rating metrics, and a checkbox to choose which feedbacks to show to customers.
 */
export default function FeedbackManagement() {
  const [selectedBranchId, setSelectedBranchId] = useState('all');
  const [togglingId, setTogglingId] = useState(null);

  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();
  const { data: feedbacks = [], isLoading: loadingFeedbacks, isFetching } = useGetFeedbacksQuery(selectedBranchId);
  const [toggleVisibility] = useToggleFeedbackVisibilityMutation();

  // Compute metrics
  const totalCount = feedbacks.length;
  const shownCount = feedbacks.filter((f) => f.is_featured).length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((acc, f) => acc + (f.stars || 0), 0) / totalCount).toFixed(1)
      : '0.0';

  const handleToggle = async (feedback) => {
    try {
      setTogglingId(feedback.id);
      await toggleVisibility({
        id: feedback.id,
        is_featured: !feedback.is_featured,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update visibility:', err);
      alert('Failed to update feedback visibility. Please try again.');
    } finally {
      setTogglingId(null);
    }
  };

  const renderStars = (stars) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`text-base ${i <= stars ? 'opacity-100' : 'text-gray-200'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (_) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Analytics Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#141414]/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Branch Filter */}
        <div className="flex items-center gap-2 sm:gap-3 flex-grow max-w-md">
          <label htmlFor="feedback-branch-filter" className="text-xs font-bold uppercase tracking-wider text-[#141414] whitespace-nowrap">
            Filter Branch:
          </label>
          <div className="relative w-full">
            <select
              id="feedback-branch-filter"
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

        {/* Metrics Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FFFBEA] border border-[#F2E205] px-3.5 py-2 rounded-xl shadow-xs">
            <span className="text-amber-500 text-lg">★</span>
            <div>
              <div className="font-serif font-bold text-base text-[#141414] leading-none">
                {avgRating} <span className="text-xs text-[#555555] font-sans">/ 5.0</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-[#766D65] tracking-wider">
                Average Rating
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl">
            <div className="font-serif font-bold text-base text-[#141414] leading-none">
              {totalCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#766D65] tracking-wider">
              Total Reviews
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
            <div className="font-serif font-bold text-base text-emerald-800 leading-none">
              {shownCount} <span className="text-xs text-emerald-600 font-sans">/ {totalCount}</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Shown to Customers
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {(loadingFeedbacks || isFetching) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-[#141414]/10 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingFeedbacks && !isFetching && feedbacks.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#141414]/10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
            💬
          </div>
          <h3 className="font-serif text-xl font-bold text-[#141414]">No Customer Feedback Yet</h3>
          <p className="text-sm text-[#555555] mt-1">
            Customer reviews submitted on your branches will appear here automatically.
          </p>
        </div>
      )}

      {/* Feedbacks Grid */}
      {!loadingFeedbacks && !isFetching && feedbacks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {feedbacks.map((f) => {
            const isShown = Boolean(f.is_featured);
            const isUpdating = togglingId === f.id;

            return (
              <div
                key={f.id}
                className={`rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isShown
                    ? 'bg-white border-emerald-400 shadow-sm ring-1 ring-emerald-400/30'
                    : 'bg-white border-[#141414]/10 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Header: Stars, Date, and Visibility Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {renderStars(f.stars)}
                    <span className="text-[11px] font-semibold text-[#766D65]">
                      {formatDate(f.created_at)}
                    </span>
                  </div>

                  {/* Customer Email */}
                  <div className="font-bold text-sm text-[#141414] truncate mb-2">
                    {f.email}
                  </div>

                  {/* Qualities / Tags */}
                  {Array.isArray(f.qualities) && f.qualities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {f.qualities.map((q, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#FFFBEA] border border-[#F2E205]/40 text-[#141414]"
                        >
                          ✓ {q}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message */}
                  {f.message ? (
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed italic bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                      "{f.message}"
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No written message left.</p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-[#141414]/10 space-y-2.5">
                  {/* Interactive Checkbox */}
                  <label
                    htmlFor={`feedback-show-${f.id}`}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer select-none transition-all ${
                      isShown
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100/80'
                    } ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        id={`feedback-show-${f.id}`}
                        type="checkbox"
                        checked={isShown}
                        disabled={isUpdating}
                        onChange={() => handleToggle(f)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold">
                        {isShown ? 'Shown to customers' : 'Show to customers'}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isShown
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isUpdating ? 'Saving...' : isShown ? 'Visible' : 'Hidden'}
                    </span>
                  </label>

                  {/* Branch Address */}
                  <div className="flex items-center gap-1.5 text-xs text-[#766D65] pt-0.5">
                    <svg className="w-3.5 h-3.5 text-[#E85D16] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate font-medium">{f.branch_address}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
