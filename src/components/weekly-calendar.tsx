
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchedule } from "@/hooks/use-schedule-store";
import { dayOrder, DayKey, Task, TaskStatus } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "./task-card";
import { EditTaskDialog } from './edit-task-dialog';

export function WeeklyCalendar() {
  const { schedule, isLoading, updateTaskStatus } = useSchedule();
  const [editingTask, setEditingTask] = useState<{task: Task, day: DayKey} | null>(null);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Set the active tab only on the client to avoid hydration mismatch
    setActiveTab(dayOrder[new Date().getDay()]);
  }, []);

  const handleEdit = (task: Task, day: DayKey) => {
    setEditingTask({ task, day });
  };
  
  const handleStatusChange = (day: DayKey, taskId: string, status: TaskStatus) => {
    updateTaskStatus(day, taskId, status);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">This Week&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {!activeTab ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 h-auto flex-wrap">
                {dayOrder.map((day) => (
                  <TabsTrigger key={day} value={day} className="text-xs sm:text-sm">{day.substring(0,3)}</TabsTrigger>
                ))}
              </TabsList>
              {dayOrder.map((day) => (
                <TabsContent key={day} value={day}>
                  <div className="space-y-3 mt-4">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
                    ) : schedule && schedule[day] ? (
                      schedule[day].map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          day={day}
                          onStatusChange={(status) => handleStatusChange(day, task.id, status)}
                          onEdit={() => handleEdit(task, day)}
                        />
                      ))
                    ) : (
                      <p>No tasks for {day}.</p>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
      <EditTaskDialog
        isOpen={!!editingTask}
        onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
        task={editingTask?.task || null}
        day={editingTask?.day || null}
      />
    </>
  );
}
