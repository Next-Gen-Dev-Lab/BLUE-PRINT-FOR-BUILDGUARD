export interface User {
  id: string;
  name: string;
  employeeId: string;
  companyName: string;
  email: string;
  phone: string;
  role: 'foreman' | 'engineer' | 'inspector' | 'admin';
  status: 'active' | 'pending';
}

export interface Project {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: 'planning' | 'active' | 'delayed' | 'completed';
  assignedEngineer: string;
  startDate: string;
  endDate: string;
  description: string;
  complianceScore: number;
  recentUpdates: string[];
  documentCount: number;
  inspectionCount: number;
}

export interface BlueprintComment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface BlueprintVersion {
  version: string;
  date: string;
  author: string;
  changeLog: string;
}

export interface Blueprint {
  id: string;
  projectId: string;
  name: string;
  version: string;
  lastUpdated: string;
  comments: BlueprintComment[];
  versionHistory: BlueprintVersion[];
}

export interface ChecklistItem {
  id: string;
  item: string;
  status: 'passed' | 'failed' | 'n/a';
  comments?: string;
}

export interface Inspection {
  id: string;
  projectId: string;
  projectName: string;
  type: string;
  date: string;
  status: 'scheduled' | 'passed' | 'failed' | 'pending_review';
  assignedInspector: string;
  checklist: ChecklistItem[];
  score: number;
  notes?: string;
}

export interface SafetyAlert {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskLevel: string;
  suggestedActions: string[];
  comments: string[];
  status: 'open' | 'resolved' | 'investigating';
  timestamp: string;
  category: 'PPE' | 'Scaffolding' | 'Electrical' | 'Fall Hazard' | 'General';
}

export interface DailyLog {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  location: string;
  workDescription: string;
  materialUsed: string;
  workersCount: number;
  weather: string;
  notes?: string;
  status: 'draft' | 'submitted';
  imageMockups?: string[];
  pdfMockups?: string[];
}

export interface SystemNotification {
  id: string;
  title: string;
  type: 'safety' | 'project' | 'inspection' | 'approval';
  content: string;
  isRead: boolean;
  timestamp: string;
  relatedLink?: string;
}

export interface Schedule {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  date: string;
  time: string;
  type: 'inspection' | 'maintenance' | 'safety_meeting' | 'drill';
  assignedTo: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}
