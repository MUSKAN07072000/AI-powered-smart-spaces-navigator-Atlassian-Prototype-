
import type { Space, Team, Issue, Document, GovernanceAlert } from '../types';

export const MOCK_TEAMS: Team[] = [
  { id: 'T1', name: 'Phoenix Core', members: ['Alice', 'Bob', 'Charlie'] },
  { id: 'T2', name: 'Quantum Leap Dev', members: ['David', 'Eve', 'Frank'] },
  { id: 'T3', name: 'Nebula Design', members: ['Grace', 'Heidi', 'Ivan'] },
  { id: 'T4', name: 'Orion Platform', members: ['Judy', 'Mallory', 'Trent'] },
];

export const MOCK_SPACES: Space[] = [
  { 
    id: 'S1', 
    name: 'Project Phoenix', 
    description: 'A project to rebuild the core customer-facing application with modern technologies.', 
    key: 'PHX', 
    teamIds: ['T1', 'T3'], 
    lastActivity: '2 hours ago',
    governanceScore: 85,
  },
  { 
    id: 'S2', 
    name: 'Quantum Leap Initiative', 
    description: 'Research and development for next-generation AI-powered features.', 
    key: 'QLI', 
    teamIds: ['T2'], 
    lastActivity: '5 days ago',
    governanceScore: 45,
  },
  { 
    id: 'S3', 
    name: 'Nebula Design System', 
    description: 'Centralized design system and component library for all company products.', 
    key: 'NDS', 
    teamIds: ['T3'], 
    lastActivity: '24 minutes ago',
    governanceScore: 95,
  },
  { 
    id: 'S4', 
    name: 'Orion Platform Engineering', 
    description: 'Infrastructure and platform services for the entire engineering organization.', 
    key: 'OPE', 
    teamIds: ['T4'], 
    lastActivity: '1 day ago',
    governanceScore: 60,
  },
];

export const MOCK_ISSUES: Issue[] = [
  { id: 'I1', key: 'PHX-101', title: 'Setup CI/CD pipeline', status: 'Done', assignee: 'Bob', spaceId: 'S1', created: '2023-10-01' },
  { id: 'I2', key: 'PHX-102', title: 'Design user authentication flow', status: 'In Progress', assignee: 'Charlie', spaceId: 'S1', created: '2023-10-05' },
  { id: 'I3', key: 'QLI-12', title: 'Evaluate new transformer models', status: 'To Do', assignee: 'David', spaceId: 'S2', created: '2023-10-20' },
  { id: 'I4', key: 'NDS-55', title: 'Create new Button component variants', status: 'In Progress', assignee: 'Grace', spaceId: 'S3', created: '2023-10-28' },
  { id: 'I5', key: 'OPE-201', title: 'Investigate Kubernetes cluster scaling issue', status: 'Blocked', assignee: 'Judy', spaceId: 'S4', created: '2023-10-15' },
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'D1', title: 'Project Phoenix: Architecture Overview', spaceId: 'S1', content: 'This document outlines the high-level architecture...', lastUpdated: '2023-10-15', author: 'Alice' },
  { id: 'D2', title: 'Quantum Leap: Q4 Research Goals', spaceId: 'S2', content: 'Our primary research goals for Q4 are...', lastUpdated: '2023-09-30', author: 'Eve' },
  { id: 'D3', title: 'Nebula Design System: Color Palette', spaceId: 'S3', content: 'Official color tokens and usage guidelines.', lastUpdated: '2023-10-25', author: 'Heidi' },
  { id: 'D4', title: 'Orion Platform: Onboarding Guide', spaceId: 'S4', content: 'A guide for new engineers joining the platform team.', lastUpdated: '2023-09-01', author: 'Mallory' },
];

export const MOCK_GOVERNANCE_ALERTS: GovernanceAlert[] = [
    {
        id: 'GA1',
        spaceId: 'S2',
        severity: 'high',
        title: 'Weak Permissions Detected',
        description: 'The "Quantum Leap Initiative" space has public read access. Please review and restrict access to authorized teams only.'
    },
    {
        id: 'GA2',
        spaceId: 'S4',
        severity: 'medium',
        title: 'Stale Admin Account',
        description: 'An admin account on "Orion Platform Engineering" has not been used in 90 days. Consider deactivating it.'
    }
];
