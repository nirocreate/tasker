'use client';

import { ListTodo, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex items-center justify-between gap-3 h-16">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-sm">
            <ListTodo className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-headline tracking-tight">
            TaskerNext
          </h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
