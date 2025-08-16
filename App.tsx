
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import RightPanel from './components/RightPanel';
import FeedbackModal from './components/FeedbackModal';
import { Space, Team, Issue, Document, SearchResult, AppView, SelectedItem, ChatMessage, GovernanceAlert } from './types';
import { MOCK_SPACES, MOCK_TEAMS, MOCK_DOCUMENTS, MOCK_ISSUES, MOCK_GOVERNANCE_ALERTS } from './services/mockData';
import { performSmartSearch, getAiSuggestions, initChat, streamChatResponse } from './services/geminiService';
import type { Chat } from '@google/genai';


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.Dashboard);
  const [spaces] = useState<Space[]>(MOCK_SPACES);
  const [teams] = useState<Team[]>(MOCK_TEAMS);
  const [issues] = useState<Issue[]>(MOCK_ISSUES);
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS);
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [governanceAlerts] = useState<GovernanceAlert[]>(MOCK_GOVERNANCE_ALERTS);

  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    setChat(initChat());
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSuggestions = useCallback(async () => {
    setIsLoadingSuggestions(true);
    try {
      const context = {
        role: 'Admin',
        recentActivity: "viewed the main dashboard and has 2 outstanding governance alerts.",
      };
      const suggestions = await getAiSuggestions(context);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setAiSuggestions(["Could not load suggestions. Please check your API key."]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoadingSearch(true);
    setActiveView(AppView.Search);
    setSearchResults([]);
    setSelectedItem(null);

    try {
      const contextData = { spaces, teams, issues, documents };
      const results = await performSmartSearch(query, contextData);
      setSearchResults(results);
    } catch (error) {
      console.error("Error performing smart search:", error);
      // You could set an error state here to show in the UI
    } finally {
      setIsLoadingSearch(false);
    }
  };
  
  const handleSendMessage = async (message: string) => {
    if (!chat || !message.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsStreamingResponse(true);
    
    const aiMessage: ChatMessage = { role: 'assistant', content: '' };
    setChatHistory(prev => [...prev, aiMessage]);

    try {
      const contextData = { spaces, teams, issues, documents };
      const stream = await streamChatResponse(chat, message, contextData);
      
      let currentContent = "";
      for await (const chunk of stream) {
        currentContent += chunk;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = currentContent;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Error streaming chat response:", error);
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].content = "Sorry, I encountered an error. Please try again.";
        return newHistory;
      });
    } finally {
      setIsStreamingResponse(false);
    }
  };


  const handleSelectItem = useCallback((item: SearchResult) => {
    let fullItem: SelectedItem | null = null;
    switch (item.type) {
      case 'space':
        fullItem = { type: 'space', data: spaces.find(s => s.id === item.id) };
        break;
      case 'team':
        fullItem = { type: 'team', data: teams.find(t => t.id === item.id) };
        break;
      case 'issue':
        fullItem = { type: 'issue', data: issues.find(i => i.id === item.id) };
        break;
      case 'document':
        fullItem = { type: 'document', data: documents.find(d => d.id === item.id) };
        break;
    }
    setSelectedItem(fullItem as SelectedItem);
  }, [spaces, teams, issues, documents]);
  
  const handleViewChange = (view: AppView) => {
    setActiveView(view);
    setSelectedItem(null);
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100 text-slate-800">
      <Sidebar 
        activeView={activeView} 
        onViewChange={handleViewChange} 
        teams={teams}
        onFeedbackClick={() => setIsFeedbackModalOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSearch={handleSearch} />
        <MainContent
          activeView={activeView}
          searchResults={searchResults}
          isLoadingSearch={isLoadingSearch}
          aiSuggestions={aiSuggestions}
          isLoadingSuggestions={isLoadingSuggestions}
          governanceAlerts={governanceAlerts}
          onSelectItem={handleSelectItem}
          selectedItem={selectedItem}
        />
      </div>
      <RightPanel 
        selectedItem={selectedItem}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        isStreamingResponse={isStreamingResponse}
      />
      {isFeedbackModalOpen && (
        <FeedbackModal onClose={() => setIsFeedbackModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
