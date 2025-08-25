export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  subtasks: Subtask[];
  userId: string;
};
