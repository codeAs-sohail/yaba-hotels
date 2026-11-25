import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetBranchesQuery,
  useCreateFeedbackMutation,
  useGetFeedbacksQuery,
} from '../features/dashboard/dashboardApi';

const RATING_OPTIONS = [
  { value: 1, label: 'Bad' },
  { value: 2, label: 'Meh' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Awesome' },
  { value: 5, label: 'Loved it' },
];

const TAG_ROWS = [
  ['Food Quality', 'Service', 'Ambience', 'Timeliness'],
  ['Value for Money', 'Customer Satisfaction'],
];

export default function Feedback() {
  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();
  const [createFeedback, { isLoading: isSubmitting }] = useCreateFeedbackMutation();

  const [stars, setStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState('');
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [message, setMessage] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem('yaba_submitted_feedbacks');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const { data: featuredFeedbacks = [] } = useGetFeedbacksQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Approved by owner (is_featured: true) + local submission preview
  const visibleFeedbacks = [
    ...submittedFeedbacks.filter((s) => !featuredFeedbacks.some((f) => f.id === s.id)),
    ...featuredFeedbacks,
  ];

  useEffect(() => {
    document.title = 'Feedback | Yaba Fast Food';
    window.scrollTo(0, 0);
  }, []);

  const toggleQuality = (tag) => {
    if (selectedQualities.includes(tag)) {
      setSelectedQualities(selectedQualities.filter((t) => t !== tag));
    } else {
      setSelectedQualities([...selectedQualities, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!branchId) {
      setErrorMessage('Please select a branch.');
      return;
    }

    const ratingValue = Number(stars) > 0 ? Number(stars) : 5;

    try {
      const res = await createFeedback({
        branch: Number(branchId),
        stars: ratingValue,
        name: fullName.trim(),
        phone_number: mobileNumber.trim(),
        email: email.trim(),
        qualities: selectedQualities,
        message: message.trim(),
      }).unwrap();

      const matchedBranch = branches.find((b) => b.id === Number(branchId));

      const newFeedback = {
        id: res?.id || Date.now(),
        branch_address: matchedBranch?.address || res?.branch_address || 'Yaba Fast Food',
        stars: ratingValue,
        name: fullName.trim() || 'Guest Diner',
        phone_number: mobileNumber.trim(),
        email: email.trim(),
        qualities: [...selectedQualities],
        message: message.trim(),
        created_at: new Date().toISOString(),
      };

      setSubmittedFeedbacks((prev) => {
        const updated = [newFeedback, ...prev];
        try {
          localStorage.setItem('yaba_submitted_feedbacks', JSON.stringify(updated.slice(0, 10)));
        } catch (_) {}
        return updated;
      });

      setSuccessMessage('Thank you! Your feedback has been recorded and is displayed below.');
      setMessage('');

      // Smooth scroll to the submitted feedback below
      setTimeout(() => {
        const section = document.getElementById('user-submitted-feedback-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      console.error('Feedback submit failed:', err);
      const detail =
        err?.data?.email?.[0] ||
        err?.data?.branch?.[0] ||
        err?.data?.error ||
        err?.data?.detail ||
        'Failed to submit feedback. Please check your inputs and try again.';
      setErrorMessage(detail);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#29211C] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 text-xs sm:text-sm text-gray-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/home" className="hover:text-gray-800 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400 select-none">
              /
            </li>
            <li aria-current="page" className="text-gray-800 font-medium">
              Feedback
            </li>
          </ol>
        </nav>

        {/* 2-Column Desktop Grid matching Pista House Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Heading + Value Input Note Card */}
          <div className="lg:col-span-5">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1E1D] tracking-tight mb-8">
              Feedback
            </h1>

            <div className="bg-[#FFFDF3] border border-[#F3E8B5] rounded-xl p-6 sm:p-7 shadow-2xs">
              <p className="text-sm sm:text-[15px] text-[#4A4036] leading-relaxed">
                We value your input! Please take a moment to share your feedback so we can continue to improve and serve you better. Your thoughts make a difference.
              </p>
            </div>
          </div>

          {/* Right Column: Share your feedback with us Form */}
          <div className="lg:col-span-7">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1D] mb-6">
                Share your feedback with us
              </h2>

              {successMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-800 flex items-center gap-3 shadow-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold leading-tight">{successMessage}</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your submitted response is displayed below.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rate our service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate our service
                  </label>
                  <div className="bg-[#F5F5F5] rounded-xl p-5 sm:p-6">
                    <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                      {RATING_OPTIONS.map((item) => {
                        const isHovered = hoveredStar >= item.value;
                        const isSelected = (!hoveredStar && stars >= item.value) || isHovered;

                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => setStars(item.value)}
                            onMouseEnter={() => setHoveredStar(item.value)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="group flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all hover:bg-white hover:shadow-2xs cursor-pointer focus:outline-none"
                          >
                            <svg
                              className="w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-150"
                              viewBox="0 0 24 24"
                              fill={isSelected ? '#F59E0B' : '#D1D5DB'}
                              stroke={isSelected ? '#D97706' : 'none'}
                              strokeWidth="0.5"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span
                              className={`mt-2 text-xs font-medium transition-colors ${
                                isSelected ? 'text-[#1F1E1D] font-semibold' : 'text-[#6B7280]'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="feedback-fullname" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="feedback-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Full Name"
                    className="w-full px-4 py-3.5 rounded-lg bg-[#F5F5F5] border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none transition-colors text-sm text-[#1F2937] placeholder-gray-400"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="feedback-mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="feedback-mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="w-full px-4 py-3.5 rounded-lg bg-[#F5F5F5] border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none transition-colors text-sm text-[#1F2937] placeholder-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    className="w-full px-4 py-3.5 rounded-lg bg-[#F5F5F5] border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none transition-colors text-sm text-[#1F2937] placeholder-gray-400"
                  />
                </div>

                {/* Select Branch */}
                <div>
                  <label htmlFor="feedback-branch" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Select Branch
                  </label>
                  <div className="relative">
                    <select
                      id="feedback-branch"
                      required
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      disabled={loadingBranches}
                      className="w-full appearance-none px-4 py-3.5 pr-10 rounded-lg bg-[#F5F5F5] border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none transition-colors text-sm text-[#1F2937] cursor-pointer disabled:opacity-60"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.address}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* What stood out to you? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2.5">
                    What stood out to you?
                  </label>
                  <div className="space-y-2">
                    {TAG_ROWS.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex flex-wrap gap-2">
                        {row.map((tag) => {
                          const isSelected = selectedQualities.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleQuality(tag)}
                              className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#29211C] text-white border border-[#29211C] shadow-xs'
                                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-2xs'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Your Message */}
                <div>
                  <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message here"
                    className="w-full px-4 py-3.5 rounded-lg bg-[#F5F5F5] border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none transition-colors text-sm text-[#1F2937] placeholder-gray-400 resize-y"
                  />
                </div>

                {/* Error display */}
                {errorMessage && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#29211C] hover:bg-black text-white font-medium text-sm transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting Feedback...' : 'Share Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Submitted Feedback Section - Displayed Below the Form */}
        {visibleFeedbacks.length > 0 && (
          <section
            id="user-submitted-feedback-section"
            className="mt-16 pt-10 border-t border-[#EAE6E1]"
            aria-labelledby="submitted-feedback-heading"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                  <span>✓ Customer Reviews</span>
                </div>
                <h2 id="submitted-feedback-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#29211C]">
                  Customer Feedback & Experiences
                </h2>
                <p className="text-xs sm:text-sm text-[#766D65] mt-1">
                  Thank you for helping us improve our dining experience! Here are genuine reviews from our guests.
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs text-[#766D65] bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                {visibleFeedbacks.length} {visibleFeedbacks.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {visibleFeedbacks.map((fb, idx) => (
                <div
                  key={fb.id || idx}
                  className="bg-[#FFFDF3] border border-[#F3E8B5] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div>
                    {/* Header: User initials, name, branch and star rating */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#29211C] text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs">
                          {fb.name ? fb.name.charAt(0) : 'U'}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#29211C] leading-tight">
                            {fb.name || 'Valued Guest'}
                          </h3>
                          <p className="text-xs text-[#766D65] mt-0.5">
                            📍 {fb.branch_address}
                          </p>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-amber-400 text-lg leading-none">
                          {'★'.repeat(fb.stars)}{'☆'.repeat(5 - fb.stars)}
                        </div>
                        <span className="text-[10px] font-bold text-[#766D65] uppercase tracking-wider mt-1">
                          {RATING_OPTIONS.find((r) => r.value === fb.stars)?.label || `${fb.stars} Stars`}
                        </span>
                      </div>
                    </div>

                    {/* Qualities Tags */}
                    {fb.qualities && fb.qualities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {fb.qualities.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-[11px] font-semibold text-[#4A4036] shadow-2xs"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Message Box */}
                    {fb.message ? (
                      <div className="p-3.5 rounded-lg bg-white/90 border border-gray-200 text-sm text-[#29211C] leading-relaxed italic">
                        "{fb.message}"
                      </div>
                    ) : (
                      <p className="text-xs text-[#766D65] italic py-1">No written message provided.</p>
                    )}
                  </div>

                  {/* Card Footer: Timestamp & Verified status */}
                  <div className="mt-5 pt-3.5 border-t border-gray-200/70 flex items-center justify-between text-[11px] text-[#766D65]">
                    <span>
                      {new Date(fb.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Received by Management
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
