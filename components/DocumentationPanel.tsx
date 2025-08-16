
import React from 'react';
import type { SelectedItem, Space, Issue, Document, Team } from '../types';
import { CubeIcon, DocumentIcon, CheckCircleIcon, UsersIcon } from './icons';

const Detail: React.FC<{ label: string; value?: string | number | React.ReactNode; }> = ({ label, value }) => (
    <div className="py-2">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900">{value || 'N/A'}</dd>
    </div>
);

const SpaceDetails: React.FC<{ space: Space }> = ({ space }) => (
    <>
        <Detail label="Key" value={space.key} />
        <Detail label="Description" value={space.description} />
        <Detail label="Last Activity" value={space.lastActivity} />
        <Detail label="Team IDs" value={space.teamIds.join(', ')} />
        <Detail label="Governance Score" value={
            <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${space.governanceScore}%`}}></div>
                </div>
                <span className="ml-3 font-semibold">{space.governanceScore}%</span>
            </div>
        } />
    </>
);

const IssueDetails: React.FC<{ issue: Issue }> = ({ issue }) => (
    <>
        <Detail label="Key" value={issue.key} />
        <Detail label="Status" value={issue.status} />
        <Detail label="Assignee" value={issue.assignee} />
        <Detail label="Created" value={issue.created} />
        <Detail label="Space ID" value={issue.spaceId} />
    </>
);

const DocumentDetails: React.FC<{ doc: Document }> = ({ doc }) => (
    <>
        <Detail label="Author" value={doc.author} />
        <Detail label="Last Updated" value={doc.lastUpdated} />
        <Detail label="Space ID" value={doc.spaceId} />
        <Detail label="Content Preview" value={<p className="line-clamp-4">{doc.content}</p>} />
    </>
);

const TeamDetails: React.FC<{ team: Team }> = ({ team }) => (
    <>
        <Detail label="Members" value={team.members.join(', ')} />
    </>
);


const DocumentationPanel: React.FC<{ selectedItem: SelectedItem | null }> = ({ selectedItem }) => {
    if (!selectedItem || !selectedItem.data) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <DocumentIcon className="h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-800">Documentation</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Select an item from the search results to see its details here.
                </p>
            </div>
        );
    }
    
    const { type, data } = selectedItem;
    
    const iconMap = {
        space: <CubeIcon className="h-8 w-8 text-blue-600" />,
        issue: <CheckCircleIcon className="h-8 w-8 text-yellow-600" />,
        document: <DocumentIcon className="h-8 w-8 text-green-600" />,
        team: <UsersIcon className="h-8 w-8 text-purple-600" />
    };

    const renderDetails = () => {
        switch(type) {
            case 'space': return <SpaceDetails space={data as Space} />;
            case 'issue': return <IssueDetails issue={data as Issue} />;
            case 'document': return <DocumentDetails doc={data as Document} />;
            case 'team': return <TeamDetails team={data as Team} />;
            default: return null;
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-start mb-4">
                <div className="p-2 bg-slate-100 rounded-lg mr-4">
                    {iconMap[type]}
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">{type}</p>
                    <h2 className="text-xl font-bold text-slate-900">{('name' in data && data.name) || ('title' in data && data.title)}</h2>
                </div>
            </div>
            
            <dl className="divide-y divide-slate-200">
                {renderDetails()}
            </dl>
        </div>
    );
};

export default DocumentationPanel;
