export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: number;
  category: string;
  created_at: string;
  updated_at: string;
  dueDate?: string;
  tags: string[];
  customOrder?: number;
}

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  color: string;
}

export interface Filters {
  status: string;
  priority: number | null;
  category: string;
  search: string;
}

export interface NewTask {
  title: string;
  priority: number;
  category: string;
  dueDate: string;
  tags: string;
}