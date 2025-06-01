export interface TaskList {
  id: string;
  etag: string;
  kind: string;
  selfLink: string;
  title: string;
  updated: string;
}

export interface TaskListResponse {
  etag: string;
  items: TaskList[];
  kind: string;
}

export interface Task {
  id: string;
  position: string;
  etag: string;
  kind: string;
  notes?: string;
  selfLink: string;
  links?: string[];
  hidden?: boolean;
  completed?: string;
  webViewLink: string;
  title: string;
  updated: string;
  status: "needsAction" | "completed";
  due?: string;
}

export interface TaskResponse {
  etag: string;
  items: Task[];
  kind: string;
}
