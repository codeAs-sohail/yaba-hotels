import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetBranchesQuery, useCreateFeedbackMutation } from '../features/dashboard/dashboardApi';

const RATING_OPTIONS = [
  { value: 1, label: 'Bad' },
  { value: 2, label: 'Meh' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Awesome' },
  { value: 5, label: 'Loved it' },
];

const QUALITY_TAGS = [
  'Food Quality',
  'Service',
  'Ambience',
  'Timeliness',
  'Value for Money',
  'Customer Satisfaction',
];

export default function Feedback() {
  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();
  const [createFeedback, { isLoading: isSubmitting }] = useCreateFeedbackMutation();

  const [stars, setStars] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState('');
  const [selectedQualities, setSelectedQualities] = useState(['Food Quality', 'Customer Satisfaction']);
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!branchId) {
      setErrorMessage('Please select a branch.');
      return;
    }

    try {
      await createFeedback({
        branch: Number(branchId),
        stars: Number(stars) || 5,
        name: fullName.trim(),
        phone_number: mobileNumber.trim(),
        email: email.trim(),
        qualities: selectedQualities,
        message: message.trim(),
      }).unwrap();

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleReset = () => {
    setSubmitted(false);
    setStars(5);
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setBranchId('');
    setSelectedQualities(['Food Quality', 'Customer Satisfaction']);
    setMessage('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-white text-[#29211C] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="pb-3 text-xs sm:text-sm text-[#766D65]">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/home" className="hover:text-[#29211C] transition-colors font-medium">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#29211C]/30 select-none">
              /
            </li>
            <li aria-current="page" className="font-semibold text-[#29211C]">
              Feedback
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29211C] tracking-tight mb-8">
          Feedback
        </h1>

        {submitted ? (
          <div className="max-w-2xl mx-auto bg-[#FFFDF5] border border-amber-200/80 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#29211C] mb-2">
              Thank You for Your Feedback!
            </h2>
            <p className="text-[#766D65] text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
              Your feedback is greatly valued and helps us continuously enhance our dishes, service, and hospitality.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#29211C] text-white hover:bg-black transition-colors"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Side: Value Input Note Banner (Pista House style) */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFFDF5] border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                <p className="text-sm sm:text-[15px] text-[#4A4036] leading-relaxed">
                  We value your input! Please take a moment to share your feedback so we can continue to improve and serve you better. Your thoughts make a difference.
                </p>
              </div>
            </div>

            {/* Right Side: Feedback Form */}
            <div className="lg:col-span-7">
              <div className="space-y-6">
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#29211C]">
                  Share your feedback with us
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Rate our service: 5 Stars with Text Labels */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-2">
                      Rate our service
                    </label>
                    <div className="bg-[#FAFAFA] border border-[#EAE6E1] rounded-2xl p-4 sm:p-5">
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
                              className="group flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all hover:bg-white hover:shadow-xs cursor-pointer focus:outline-none"
                            >
                              <span
                                className={`text-2xl sm:text-3xl transition-colors duration-150 ${
                                  isSelected ? 'text-amber-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                              <span
                                className={`mt-1.5 text-[11px] sm:text-xs font-medium transition-colors ${
                                  isSelected ? 'text-[#29211C] font-semibold' : 'text-[#8E867E]'
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
                    <label htmlFor="feedback-fullname" className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="feedback-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter Full Name"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#EAE6E1] text-sm text-[#29211C] placeholder-[#A0988E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29211C]/20 transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="feedback-mobile" className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      id="feedback-mobile"
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter Mobile Number"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#EAE6E1] text-sm text-[#29211C] placeholder-[#A0988E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29211C]/20 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="feedback-email" className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#EAE6E1] text-sm text-[#29211C] placeholder-[#A0988E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29211C]/20 transition-all"
                    />
                  </div>

                  {/* Select Branch */}
                  <div>
                    <label htmlFor="feedback-branch" className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-1.5">
                      Select Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="feedback-branch"
                      required
                      value={branchId}
                      onChange={(e) => setBranchId(e.target.value)}
                      disabled={loadingBranches}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#EAE6E1] text-sm text-[#29211C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29211C]/20 transition-all cursor-pointer"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* What stood out to you? (Pill tags) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-2">
                      What stood out to you?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUALITY_TAGS.map((tag) => {
                        const isSelected = selectedQualities.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleQuality(tag)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#29211C] text-white border-[#29211C] shadow-xs'
                                : 'bg-[#FAFAFA] text-[#4A4036] border-[#EAE6E1] hover:bg-gray-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Your Message */}
                  <div>
                    <label htmlFor="feedback-message" className="block text-xs font-semibold uppercase tracking-wider text-[#766D65] mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      id="feedback-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message here"
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#EAE6E1] text-sm text-[#29211C] placeholder-[#A0988E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#29211C]/20 transition-all resize-y"
                    />
                  </div>

                  {/* Error display */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#29211C] hover:bg-black text-white font-medium text-sm transition-all shadow-sm hover:shadow-md active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting Feedback...' : 'Share Feedback'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
