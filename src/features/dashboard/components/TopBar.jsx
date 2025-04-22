import { useState } from 'react';
import { RiSearchLine, RiNotification3Line, RiUserLine, RiRefreshLine } from '@remixicon/react';
import { useDashboard } from '../context/DashboardContext';

const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { refreshData, loading, timeUntilRefresh } = useDashboard();

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex items-center justify-between h-16">
          {/* Search Bar */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiSearchLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative group"
            >
              <span className="sr-only">Refresh data</span>
              <RiRefreshLine className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {loading ? 'Refreshing...' : `Next refresh in ${formatTime(timeUntilRefresh)}`}
              </div>
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              <span className="sr-only">View notifications</span>
              <RiNotification3Line className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Profile */}
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">View profile</span>
              <RiUserLine className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 