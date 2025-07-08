'use client';

import { useState } from 'react';
import UserSearch from './UserSearch';
import UserTable from './UserTable';

export default function DashboardContainer() {
  const [searchText, setSearchText] = useState('');
  const [userType, setUserType] = useState<'all' | 'client' | 'partner'>('all');

  // Handler functions to pass down to children
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleUserTypeChange = (type: 'all' | 'client' | 'partner') => {
    setUserType(type);
  };

  return (
    <>
      <div className="mb-8">
        <UserSearch
          searchText={searchText}
          userType={userType}
          onSearchChange={handleSearchChange}
          onUserTypeChange={handleUserTypeChange}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">User Progress Tracking</h2>
      </div>

      <div className="mb-8">
        <UserTable searchText={searchText} userType={userType} />
      </div>
    </>
  );
}
