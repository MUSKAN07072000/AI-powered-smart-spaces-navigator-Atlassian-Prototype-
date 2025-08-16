
import React, { useState } from 'react';
import type { SelectedItem, ChatMessage } from '../types';
import DocumentationPanel from './DocumentationPanel';
import NavigationAssistant from './NavigationAssistant';

interface RightPanelProps {
  selectedItem: SelectedItem | null;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isStreamingResponse: boolean;
}

type ActiveTab = 'docs' | 'assistant';

const RightPanel: React.FC<RightPanelProps> = ({ selectedItem, chatHistory, onSendMessage, isStreamingResponse }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');

  React.useEffect(() => {
    if (selectedItem) {
      setActiveTab('docs');
    }
  }, [selectedItem]);

  return (
    <aside className="w-96 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col">
      <div className="border-b border-slate-200">
        <div className="flex -mb-px">
          <TabButton
            label="Documentation"
            isActive={activeTab === 'docs'}
            onClick={() => setActiveTab('docs')}
          />
          <TabButton
            label="Assistant"
            isActive={activeTab === 'assistant'}
            onClick={() => setActiveTab('assistant')}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'docs' && <DocumentationPanel selectedItem={selectedItem} />}
        {activeTab === 'assistant' && (
          <NavigationAssistant
            chatHistory={chatHistory}
            onSendMessage={onSendMessage}
            isStreamingResponse={isStreamingResponse}
          />
        )}
      </div>
    </aside>
  );
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 text-sm font-medium transition-colors duration-150 border-b-2 ${
      isActive
        ? 'text-blue-600 border-blue-600'
        : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300'
    }`}
  >
    {label}
  </button>
);

export default RightPanel;
