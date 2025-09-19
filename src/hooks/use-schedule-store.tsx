"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { WeeklySchedule, Task, DayKey, TaskStatus, dayOrder } from '@/lib/types';
import { initialSchedule } from '@/lib/data';

interface ScheduleContextType {
  schedule: WeeklySchedule | null;
  isLoading: boolean;
  updateTask: (day: DayKey, taskId: string, updatedTask: Partial<Task>) => void;
  updateTaskStatus: (day: DayKey, taskId: string, status: TaskStatus) => void;
  getTasksForDay: (day: DayKey) => Task[];
  streak: number;
  todayProgress: { completed: number, total: number };
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEY = 'papalDoRoutineSchedule';
const STREAK_KEY = 'papalDoRoutineStreak';

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const savedSchedule = localStorage.getItem(STORAGE_KEY);
      const savedStreak = localStorage.getItem(STREAK_KEY);
      
      if (savedSchedule) {
        const parsedSchedule = JSON.parse(savedSchedule);
        // Basic validation
        if (typeof parsedSchedule === 'object' && dayOrder.every(day => day in parsedSchedule)) {
            setSchedule(parsedSchedule);
        } else {
            setSchedule(initialSchedule);
        }
      } else {
        setSchedule(initialSchedule);
      }
      
      if (savedStreak) {
        const { value, date } = JSON.parse(savedStreak);
        const today = new Date().toLocaleDateString();
        // Reset streak if it's not from today or yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (date === today || date === yesterday.toLocaleDateString()) {
            setStreak(value);
        } else {
            setStreak(0);
        }
      }

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setSchedule(initialSchedule);
      setStreak(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (schedule && !isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      } catch (error) {
        console.error("Failed to save schedule to localStorage", error);
      }
    }
  }, [schedule, isLoading]);

  useEffect(() => {
      try {
        const today = new Date().toLocaleDateString();
        localStorage.setItem(STREAK_KEY, JSON.stringify({ value: streak, date: today }));
      } catch (error) {
        console.error("Failed to save streak to localStorage", error);
      }
  }, [streak]);

  const updateTask = useCallback((day: DayKey, taskId: string, updatedProperties: Partial<Task>) => {
    setSchedule(prev => {
      if (!prev) return null;
      const newSchedule = { ...prev };
      const dayTasks = newSchedule[day].map(task =>
        task.id === taskId ? { ...task, ...updatedProperties } : task
      );
      // sort tasks by start time after update
      dayTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      newSchedule[day] = dayTasks;
      return newSchedule;
    });
  }, []);
  
  const updateTaskStatus = useCallback((day: DayKey, taskId: string, status: TaskStatus) => {
    updateTask(day, taskId, { status });
  },[updateTask]);

  const getTasksForDay = useCallback((day: DayKey) => {
    return schedule?.[day] || [];
  }, [schedule]);

  const todayProgress = React.useMemo(() => {
    if (!schedule) return { completed: 0, total: 0 };
    const today = new Date();
    const todayKey = dayOrder[today.getDay()];
    const todayTasks = schedule[todayKey] || [];
    const trackableTasks = todayTasks.filter(t => t.category !== 'Meals' && t.category !== 'Rest/Sleep');
    const completed = trackableTasks.filter(t => t.status === 'done').length;
    return { completed, total: trackableTasks.length };
  }, [schedule]);

  useEffect(() => {
    if(schedule && todayProgress.total > 0 && todayProgress.completed === todayProgress.total) {
        const savedStreak = localStorage.getItem(STREAK_KEY);
        if(savedStreak) {
            const { date } = JSON.parse(savedStreak);
            const today = new Date().toLocaleDateString();
            if(date !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if(date === yesterday.toLocaleDateString()) {
                    setStreak(s => s + 1);
                } else {
                    setStreak(1);
                }
            }
        } else {
            setStreak(1);
        }
    }
  }, [todayProgress, schedule]);


  const value = { schedule, isLoading, updateTask, updateTaskStatus, getTasksForDay, streak, todayProgress };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
