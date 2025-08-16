
import React from 'react';
import { AppView, Team } from '../types';
import { AtlassianIcon, DashboardIcon, UsersIcon, CubeIcon, SearchIcon, ChatBubbleIcon } from './icons';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  teams: Team[];
  onFeedbackClick: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, teams, onFeedbackClick }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-slate-100 border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center mb-6 px-2">
        <AtlassianIcon className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-lg font-bold text-slate-800">Smart Navigator</span>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem
          icon={<DashboardIcon className="h-5 w-5" />}
          label="Dashboard"
          isActive={activeView === AppView.Dashboard}
          onClick={() => onViewChange(AppView.Dashboard)}
        />
        <NavItem
          icon={<SearchIcon className="h-5 w-5" />}
          label="Search Results"
          isActive={activeView === AppView.Search}
          onClick={() => onViewChange(AppView.Search)}
        />
        <NavItem
          icon={<CubeIcon className="h-5 w-5" />}
          label="Spaces"
          isActive={activeView === AppView.Spaces}
          onClick={() => onViewChange(AppView.Spaces)}
        />
        <NavItem
          icon={<UsersIcon className="h-5 w-5" />}
          label="Teams"
          isActive={activeView === AppView.Teams}
          onClick={() => onViewChange(AppView.Teams)}
        />
      </nav>
      
      <div className="mt-6">
        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Teams</h3>
        <div className="space-y-1">
          {teams.map(team => (
            <button key={team.id} className="flex items-center w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-md">
              <span className="h-2 w-2 mr-3 bg-green-400 rounded-full"></span>
              {team.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button 
          onClick={onFeedbackClick}
          className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 bg-slate-200 text-slate-700 hover:bg-slate-300"
        >
          <ChatBubbleIcon className="h-5 w-5 mr-2"/>
          Give Feedback
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
