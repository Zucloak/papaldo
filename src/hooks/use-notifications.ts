"use client";

import { useEffect, useState, useCallback } from 'react';
import { Task } from '@/lib/types';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const status = await Notification.requestPermission();
      setPermission(status);
      return status;
    }
    return 'denied';
  }, []);

  const scheduleNotificationsForDay = useCallback((tasks: Task[]) => {
    if (permission !== 'granted') return;

    const now = new Date();
    
    tasks.forEach(task => {
      if (task.category === 'Meals' || task.title.toLowerCase().includes('sleep')) {
        const [hours, minutes] = task.startTime.split(':').map(Number);
        const notificationTime = new Date();
        notificationTime.setHours(hours, minutes, 0, 0);

        // If time is in the past, don't schedule
        if (notificationTime > now) {
          const delay = notificationTime.getTime() - now.getTime();
          
          setTimeout(() => {
            new Notification('EngiTrack Reminder', {
              body: `Time for ${task.title}!`,
              icon: '/icon.png' // You can add an icon to your public folder
            });
          }, delay);
        }
      }
    });
  }, [permission]);

  return { requestPermission, scheduleNotificationsForDay, permission };
};
