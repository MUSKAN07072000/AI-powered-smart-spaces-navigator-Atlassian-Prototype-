
import React from 'react';
import { AppView, SearchResult, GovernanceAlert, SelectedItem } from '../types';
import Dashboard from './Dashboard';
import { SearchIcon, LightBulbIcon, CubeIcon, DocumentIcon, CheckCircleIcon, UsersIcon } from './icons';

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
    onSelectItem: (item: SearchResult) => void;
    selectedItem: SelectedItem | null;
}

const getIconForType = (type: SearchResult['type']) => {
    switch(type) {
        case 'space': return <CubeIcon className="h-5 w-5 text-blue-500" />;
        case 'document': return <DocumentIcon className="h-5 w-5 text-green-500" />;
        case 'issue': return <CheckCircleIcon className="h-5 w-5 text-yellow-500" />;
        case 'team': return <UsersIcon className="h-5 w-5 text-purple-500" />;
        default: return <CubeIcon className="h-5 w-5 text-slate-400" />;
    }
};

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, onSelectItem, selectedItem }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-16">
                <SearchIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-medium text-slate-900">No Search Results</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Use the smart search bar above to find what you're looking for.
                </p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.sort((a,b) => b.relevance - a.relevance).map((item) => (
                <button
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`text-left p-4 rounded-lg shadow-sm transition-all duration-200 border ${
                      selectedItem?.data?.id === item.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'bg-white hover:shadow-md hover:border-blue-300'
                    }`}
                >
                    <div className="flex items-center mb-1">
                        {getIconForType(item.type)}
                        <span className="ml-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">{item.type}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg truncate">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.summary}</p>
                    <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full">
                        <div className="h-1.5 bg-blue-500 rounded-full" style={{width: `${item.relevance}%`}}></div>
                    </div>
                </button>
            ))}
        </div>
    );
};

interface MainContentProps {
  activeView: AppView;
  searchResults: SearchResult[];
  isLoadingSearch: boolean;
  aiSuggestions: string[];
  isLoadingSuggestions: boolean;
  governanceAlerts: GovernanceAlert[];
  onSelectItem: (item: SearchResult) => void;
  selectedItem: SelectedItem | null;
}

const MainContent: React.FC<MainContentProps> = ({
  activeView,
  searchResults,
  isLoadingSearch,
  aiSuggestions,
  isLoadingSuggestions,
  governanceAlerts,
  onSelectItem,
  selectedItem
}) => {
  const renderContent = () => {
    switch (activeView) {
      case AppView.Dashboard:
        return <Dashboard 
                  aiSuggestions={aiSuggestions} 
                  isLoadingSuggestions={isLoadingSuggestions} 
                  governanceAlerts={governanceAlerts} 
                />;
      case AppView.Search:
        return <SearchResults 
                    results={searchResults} 
                    isLoading={isLoadingSearch} 
                    onSelectItem={onSelectItem} 
                    selectedItem={selectedItem}
                />;
      default:
        return <div className="text-center py-20">
                    <h2 className="text-xl font-bold">Coming Soon</h2>
                    <p className="text-slate-500">This view is under construction.</p>
                </div>;
    }
  };

  const viewTitles: Record<AppView, string> = {
    [AppView.Dashboard]: "My Dashboard",
    [AppView.Search]: "Smart Search Results",
    [AppView.Spaces]: "All Spaces",
    [AppView.Teams]: "All Teams",
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">{viewTitles[activeView]}</h1>
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;
