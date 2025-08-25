'use client';

import type { Task, Subtask } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateSubtasks } from '@/ai/flows/generate-subtasks';
import {
  Calendar,
  Edit,
  Trash2,
  MoreVertical,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onToggleSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onUpdateTask: (task: Task) => void;
}

export function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleSubtask,
  onUpdateTask,
}: TaskItemProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateSubtasks = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSubtasks({ taskDescription: task.title });
      const newSubtasks = result.subtasks.map((text) => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
      }));
      onUpdateTask({ ...task, subtasks: [...task.subtasks, ...newSubtasks] });
      toast({
        title: 'Subtasks generated!',
        description: `${result.subtasks.length} new subtasks have been added.`,
      });
    } catch (error) {
      console.error('Failed to generate subtasks:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not generate subtasks. Please try again later.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getDueDateBadgeVariant = (dueDate: Date): 'default' | 'destructive' | 'secondary' => {
    if (isPast(dueDate) && !isToday(dueDate)) {
      return 'destructive';
    }
    if (isToday(dueDate)) {
      return 'secondary';
    }
    return 'default';
  };

  return (
    <Card className={cn('transition-all', task.completed && 'bg-muted/50')}>
      <CardHeader className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, !!checked)}
            className="mt-1"
            aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1">
            <CardTitle
              className={cn(
                'text-base font-medium',
                task.completed && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </CardTitle>
            {task.dueDate && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="mr-1.5 h-4 w-4" />
                <Badge
                  variant={task.completed ? 'outline' : getDueDateBadgeVariant(new Date(task.dueDate))}
                  className="py-0.5 px-1.5 text-xs"
                >
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </Badge>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(task.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {(task.subtasks.length > 0) && (
        <CardContent className="px-4 pb-4 pt-0">
          <Collapsible defaultOpen>
            <Separator className="mb-4" />
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between px-2 text-muted-foreground">
                  <span>Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})</span>
                  <div className="flex items-center">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </Button>
              </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="space-y-3 pt-3">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-3 pl-5">
                    <Checkbox
                      id={`subtask-${subtask.id}`}
                      checked={subtask.completed}
                      onCheckedChange={(checked) => onToggleSubtask(task.id, subtask.id, !!checked)}
                      aria-label={`Mark subtask as ${subtask.completed ? 'incomplete' : 'complete'}`}
                    />
                    <label
                      htmlFor={`subtask-${subtask.id}`}
                      className={cn(
                        'text-sm flex-1 cursor-pointer',
                        subtask.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {subtask.text}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}

      <div className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleGenerateSubtasks}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-accent-foreground" />
          )}
          Generate Subtasks with AI
        </Button>
      </div>
    </Card>
  );
}
