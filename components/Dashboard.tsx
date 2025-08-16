
import React from 'react';
import type { GovernanceAlert } from '../types';
import { LightBulbIcon, ExclamationIcon, ChevronRightIcon } from './icons';

interface DashboardProps {
  aiSuggestions: string[];
  isLoadingSuggestions: boolean;
  governanceAlerts: GovernanceAlert[];
}

const AISuggestionsWidget: React.FC<{ suggestions: string[]; isLoading: boolean }> = ({ suggestions, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <LightBulbIcon className="h-6 w-6 text-yellow-500" />
        <h3 className="ml-3 text-lg font-semibold text-slate-800">AI-Powered Suggestions</h3>
      </div>
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <ChevronRightIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span className="ml-2 text-sm text-slate-600">{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const GovernanceAlertsWidget: React.FC<{ alerts: GovernanceAlert[] }> = ({ alerts }) => {
  const getSeverityClasses = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-500 text-red-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <ExclamationIcon className="h-6 w-6 text-red-500" />
        <h3 className="ml-3 text-lg font-semibold text-slate-800">Governance Alerts</h3>
      </div>
      <div className="space-y-4">
        {alerts.length > 0 ? alerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-md border-l-4 ${getSeverityClasses(alert.severity)}`}>
            <h4 className="font-bold">{alert.title}</h4>
            <p className="text-sm mt-1">{alert.description}</p>
            <button className="text-sm font-semibold mt-2 hover:underline">Take Action</button>
          </div>
        )) : <p className="text-sm text-slate-500">No outstanding governance alerts. Great job!</p>}
      </div>
    </div>
  );
};


const PlaceholderWidget: React.FC<{title: string}> = ({title}) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center">
        <div className="text-center">
            <p className="font-semibold text-slate-700">{title}</p>
            <p className="text-sm text-slate-500">Data coming soon</p>
        </div>
    </div>
)

const Dashboard: React.FC<DashboardProps> = ({ aiSuggestions, isLoadingSuggestions, governanceAlerts }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">
        <GovernanceAlertsWidget alerts={governanceAlerts} />
      </div>
      <div className="lg:col-span-2">
        <AISuggestionsWidget suggestions={aiSuggestions} isLoading={isLoadingSuggestions} />
      </div>
       <PlaceholderWidget title="My Open Issues"/>
       <PlaceholderWidget title="Recent Documents"/>
       <PlaceholderWidget title="Team Activity Stream"/>
       <PlaceholderWidget title="Space Health"/>
    </div>
  );
};

export default Dashboard;
