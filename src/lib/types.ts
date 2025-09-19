export type TaskCategory = 'Review Class' | 'Problem Sets' | 'Meals' | 'Rest/Sleep' | 'Exams' | 'Other';

export type TaskStatus = 'pending' | 'done' | 'skipped' | 'partial';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  notes?: string;
  status: TaskStatus;
}

export type DaySchedule = Task[];

export type DayKey = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const dayOrder: DayKey[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export type WeeklySchedule = Record<DayKey, DaySchedule>;
