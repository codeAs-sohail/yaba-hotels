import React from 'react';

const TABS = [
  { id: 'menus', label: 'Menus', icon: '🍽️' },
  { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  { id: 'branches', label: 'Branches', icon: '📍' },
  { id: 'feedback', label: 'Feedback', icon: '💬' },
];

/**
 * Responsive tab bar for Owner Dashboard.
 * Horizontal scrollable on mobile; elegant tab buttons on desktop.
 */
export default function DashboardTabs({ activeTab, onSelectTab }) {
  return (
    <div className="w-full border-b border-[#141414]/10 bg-white/70 backdrop-blur-md sticky top-[68px] sm:top-[72px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none"
          aria-label="Owner Dashboard Navigation Tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] ${
                  isActive
                    ? 'bg-[#F2E205] text-[#141414] shadow-sm scale-[1.02]'
                    : 'text-[#555555] hover:text-[#141414] hover:bg-[#F2E205]/20'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
