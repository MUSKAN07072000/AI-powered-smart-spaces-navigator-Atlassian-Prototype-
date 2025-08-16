
export interface Space {
  id: string;
  name: string;
  description: string;
  key: string;
  teamIds: string[];
  lastActivity: string;
  governanceScore: number;
}

export interface Team {
  id: string;
  name:string;
  members: string[];
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
  assignee: string;
  spaceId: string;
  created: string;
}

export interface Document {
  id: string;
  title: string;
  spaceId: string;
  content: string;
  lastUpdated: string;
  author: string;
}

export interface SearchResult {
  id: string;
  type: 'space' | 'team' | 'issue' | 'document';
  title: string;
  summary: string;
  relevance: number;
}

export enum AppView {
  Dashboard = 'dashboard',
  Search = 'search',
  Teams = 'teams',
  Spaces = 'spaces',
}

export type SelectedItemData = Space | Team | Issue | Document;
export type SelectedItem = {
    type: 'space' | 'team' | 'issue' | 'document';
    data?: SelectedItemData;
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GovernanceAlert {
  id: string;
  spaceId: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
}
