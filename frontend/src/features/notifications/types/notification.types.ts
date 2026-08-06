export interface UniversityNotification {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  createdAt: string;
  isRead: boolean;
  priority?: string;
}
