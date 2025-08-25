'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Task, Subtask } from '@/lib/types';
import { Header } from '@/components/header';
import { TaskList } from '@/components/task-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskDialog } from '@/components/task-dialog';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userTasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          userTasks.push({ id: doc.id, ...doc.data() } as Task);
        });
        setTasks(userTasks);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddTask = async (taskData: { title: string; dueDate: Date | null }) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        title: taskData.title,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : null,
        completed: false,
        subtasks: [],
        userId: user.uid,
      });
    } catch (error) {
      console.error('Error adding task: ', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add task.' });
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const taskRef = doc(db, 'tasks', updatedTask.id);
    const { id, ...taskData } = updatedTask;
    try {
      await updateDoc(taskRef, taskData);
    } catch (error) {
      console.error('Error updating task: ', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update task.' });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task: ', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete task.' });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    const taskRef = doc(db, 'tasks', taskId);
    updateDoc(taskRef, { completed });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string, completed: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedSubtasks = task.subtasks.map(st => st.id === subtaskId ? { ...st, completed } : st);
      const taskRef = doc(db, 'tasks', taskId);
      updateDoc(taskRef, { subtasks: updatedSubtasks });
    }
  };

  const handleSaveTask = (data: { title: string; dueDate: Date | null }) => {
    if (editingTask) {
      handleUpdateTask({
        ...editingTask,
        title: data.title,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      });
    } else {
      handleAddTask(data);
    }
  };

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold font-headline text-foreground">My Tasks</h2>
          <Button onClick={() => { setEditingTask(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
          onToggleSubtask={handleToggleSubtask}
          onUpdateTask={handleUpdateTask}
        />
      </main>
      <TaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
      />
    </div>
  );
}
