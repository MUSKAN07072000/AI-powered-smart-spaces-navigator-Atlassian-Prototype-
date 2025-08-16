
import React, { useState } from 'react';
import { SearchIcon, SparklesIcon } from './icons';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="flex-shrink-0 bg-white/70 backdrop-blur-lg border-b border-slate-200 z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SparklesIcon className="h-5 w-5 text-blue-500" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full bg-slate-100 border-transparent rounded-md pl-10 pr-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Smart search for spaces, documents, issues..."
            />
             <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </button>
          </form>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-700">Alex Winslow</span>
          <img
            className="h-9 w-9 rounded-full"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="User avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
