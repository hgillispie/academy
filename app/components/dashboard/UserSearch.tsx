'use client';

interface UserSearchProps {
  searchText: string;
  userType: 'all' | 'client' | 'partner';
  onSearchChange: (text: string) => void;
  onUserTypeChange: (type: 'all' | 'client' | 'partner') => void;
}

export default function UserSearch({
  searchText,
  userType,
  onSearchChange,
  onUserTypeChange,
}: UserSearchProps) {
  // Handle immediate search on input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        {/* Search input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Search by space, name, or email"
              value={searchText}
              onChange={handleSearchInput}
            />
          </div>
        </div>

        {/* User type toggle */}
        <div className="flex-shrink-0">
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
            User Type
          </label>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                userType === 'all'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onUserTypeChange('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                userType === 'client'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onUserTypeChange('client')}
            >
              Clients
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                userType === 'partner'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onUserTypeChange('partner')}
            >
              Partners
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
