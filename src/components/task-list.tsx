'use client';

import { useMemo } from 'react';
import type { Task } from '@/lib/types';
import { TaskItem } from '@/components/task-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderKanban } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onToggleSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onUpdateTask: (task: Task) => void;
}

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="text-center p-8 mt-4 bg-card rounded-lg border-2 border-dashed">
    <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
  </div>
);

export function TaskList({ tasks, ...props }: TaskListProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      return 0;
    });
  }, [tasks]);

  const pendingTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        {sortedTasks.length > 0 ? (
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedTasks.map((task) => (
              <TaskItem key={task.id} task={task} {...props} />
            ))}
          </div>
        ) : (
          <EmptyState title="No tasks yet" description="Click 'New Task' to add your first task." />
        )}
      </TabsContent>

      <TabsContent value="pending">
        {pendingTasks.length > 0 ? (
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} {...props} />
            ))}
          </div>
        ) : (
          <EmptyState title="All caught up!" description="You have no pending tasks." />
        )}
      </TabsContent>

      <TabsContent value="completed">
        {completedTasks.length > 0 ? (
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} {...props} />
            ))}
          </div>
        ) : (
          <EmptyState title="No completed tasks" description="Complete a task to see it here." />
        )}
      </TabsContent>
    </Tabs>
  );
}
