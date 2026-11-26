import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import {
  useGetBranchesQuery,
  useCreateFeedbackMutation,
  useGetPublicFeedbacksQuery,
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

  const { data: visibleFeedbacks = [] } = useGetPublicFeedbacksQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
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
        branch_address: matchedBranch?.address || res?.branch_address || 'Yaba Hotels',
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

      setSuccessMessage('Thank you! Your feedback has been submitted to management and will appear once reviewed.');
      setMessage('');
      setFullName('');
      setMobileNumber('');
      setEmail('');
      setBranchId('');
      setStars(0);
      setSelectedQualities([]);
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
    <div className="w-full min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pb-6 text-xs text-[#685F57]">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/home" className="hover:text-[#E85D16] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#DED4C8]">/</li>
            <li aria-current="page" className="text-[#1E1916] font-semibold">
              Feedback
            </li>
          </ol>
        </nav>

        {/* 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column */}
          <ScrollReveal className="lg:col-span-5">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
              Guest Relations
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1E1916] tracking-tight mb-6">
              Feedback
            </h1>

            <div className="bg-white border border-[#E6DDD2] rounded-xl p-6 sm:p-7">
              <p className="text-sm sm:text-base text-[#38302A] leading-relaxed">
                We value your perspective. Please take a brief moment to share your dining experience across any of our five kitchens so we can keep raising our standards.
              </p>
              <div className="mt-5 pt-4 border-t border-[#F0EAE1] text-xs text-[#685F57]">
                Every review is read directly by our outlet leadership team.
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Feedback Form */}
          <div className="lg:col-span-7 bg-white border border-[#E6DDD2] rounded-xl p-5 sm:p-8">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1916] mb-6">
              Share your experience with us
            </h2>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-[#FFF6F0] border border-[#FDD2B8] text-sm text-[#1E1916] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E85D16] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-semibold leading-snug">{successMessage}</p>
                  <p className="text-xs text-[#685F57] mt-1">
                    Thank you for dining with Yaba Hotels.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service Rating */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#685F57] mb-2">
                  Rate our service
                </label>
                <div className="bg-[#FCF9F4] border border-[#E6DDD2] rounded-xl p-4 sm:p-5">
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
                          className="group flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors hover:bg-white cursor-pointer"
                        >
                          <svg
                            className="w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-150"
                            viewBox="0 0 24 24"
                            fill={isSelected ? '#E85D16' : '#DED4C8'}
                            stroke={isSelected ? '#CC4D0D' : 'none'}
                            strokeWidth="0.5"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span
                            className={`mt-1.5 text-[11px] sm:text-xs font-medium ${
                              isSelected ? 'text-[#1E1916] font-semibold' : 'text-[#685F57]'
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

              {/* Full Name & Mobile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="feedback-fullname" className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#685F57] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="feedback-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Full Name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FCF9F4] border border-[#E2D8CE] focus:border-[#E85D16] focus:bg-white focus:outline-none transition-colors text-sm text-[#1E1916] placeholder-[#9B9087]"
                  />
                </div>

                <div>
                  <label htmlFor="feedback-mobile" className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#685F57] mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="feedback-mobile"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter Mobile Number"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FCF9F4] border border-[#E2D8CE] focus:border-[#E85D16] focus:bg-white focus:outline-none transition-colors text-sm text-[#1E1916] placeholder-[#9B9087]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="feedback-email" className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#685F57] mb-1.5">
                  Email Address *
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#FCF9F4] border border-[#E2D8CE] focus:border-[#E85D16] focus:bg-white focus:outline-none transition-colors text-sm text-[#1E1916] placeholder-[#9B9087]"
                />
              </div>

              {/* Select Branch */}
              <div>
                <label htmlFor="feedback-branch" className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#685F57] mb-1.5">
                  Select Branch *
                </label>
                <div className="relative">
                  <select
                    id="feedback-branch"
                    required
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    disabled={loadingBranches}
                    className="w-full min-h-[44px] appearance-none px-3.5 py-2.5 pr-10 rounded-lg bg-[#FCF9F4] border border-[#E2D8CE] focus:border-[#E85D16] focus:bg-white focus:outline-none transition-colors text-sm text-[#1E1916] cursor-pointer disabled:opacity-60"
                  >
                    <option value="">Choose an outlet</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.address}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#685F57]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quality Chips */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#685F57] mb-2.5">
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
                            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#E85D16] text-white border border-[#E85D16]'
                                : 'bg-[#FCF9F4] text-[#38302A] border border-[#E2D8CE] hover:border-[#E85D16]'
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

              {/* Message */}
              <div>
                <label htmlFor="feedback-message" className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#685F57] mb-1.5">
                  Your Message
                </label>
                <textarea
                  id="feedback-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share thoughts about your meal, service, or outlet..."
                  className="w-full px-3.5 py-3 rounded-lg bg-[#FCF9F4] border border-[#E2D8CE] focus:border-[#E85D16] focus:bg-white focus:outline-none transition-colors text-sm text-[#1E1916] placeholder-[#9B9087] resize-y"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Primary Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Public Customer Reviews */}
        {visibleFeedbacks.length > 0 && (
          <section
            id="user-submitted-feedback-section"
            className="mt-16 pt-12 border-t border-[#E6DDD2]"
            aria-labelledby="submitted-feedback-heading"
          >
            <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-1.5">
                  Guest Experiences
                </p>
                <h2 id="submitted-feedback-heading" className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1916]">
                  Featured Diner Reviews
                </h2>
              </div>
              <span className="self-start sm:self-auto text-xs text-[#685F57] bg-white border border-[#E6DDD2] px-3 py-1 rounded-lg font-medium">
                {visibleFeedbacks.length} {visibleFeedbacks.length === 1 ? 'review' : 'reviews'}
              </span>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {visibleFeedbacks.map((fb, idx) => (
                <ScrollReveal key={fb.id || idx} delay={(idx % 4) * 50}>
                  <div className="h-full bg-white border border-[#E6DDD2] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FFF6F0] border border-[#FDD2B8] text-[#E85D16] flex items-center justify-center font-serif font-semibold text-base uppercase">
                            {fb.name ? fb.name.charAt(0) : 'G'}
                          </div>
                          <div>
                            <h3 className="font-serif font-semibold text-base text-[#1E1916] leading-tight">
                              {fb.name || 'Guest Diner'}
                            </h3>
                            <p className="text-xs text-[#685F57] mt-0.5">
                              {fb.branch_address}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-0.5 text-[#E85D16]" aria-label={`${fb.stars} stars`}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= fb.stars ? 'fill-current' : 'fill-[#DED4C8]'}`}
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-[#685F57] uppercase tracking-wider mt-1">
                            {RATING_OPTIONS.find((r) => r.value === fb.stars)?.label || `${fb.stars} Stars`}
                          </span>
                        </div>
                      </div>

                      {fb.qualities && fb.qualities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3.5">
                          {fb.qualities.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded bg-[#FCF9F4] border border-[#E6DDD2] text-[11px] font-medium text-[#38302A]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {fb.message ? (
                        <div className="p-3.5 rounded-lg bg-[#FCF9F4] border border-[#E6DDD2] text-sm text-[#1E1916] leading-relaxed">
                          “{fb.message}”
                        </div>
                      ) : (
                        <p className="text-xs text-[#685F57] italic py-1">No written comment provided.</p>
                      )}
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-[#F0EAE1] flex items-center justify-between text-[11px] text-[#685F57]">
                      <span>
                        {new Date(fb.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="font-medium text-[#685F57]">Verified Feedback</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Local user submission preview notice */}
        {visibleFeedbacks.length === 0 && submittedFeedbacks.length > 0 && (
          <p className="mt-10 text-center text-xs text-[#685F57]">
            Your recent feedback has been received and awaits management review before public showcase.
          </p>
        )}
      </div>
    </div>
  );
}
