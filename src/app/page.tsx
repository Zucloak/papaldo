"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { DailyProgress } from "@/components/daily-progress";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import { WeeklySummaryReport } from "@/components/weekly-summary-report";
import { useNotifications } from "@/hooks/use-notifications";
import { useSchedule } from "@/hooks/use-schedule-store";
import { dayOrder } from "@/lib/types";

export default function DashboardPage() {
  const { requestPermission, scheduleNotificationsForDay, permission } = useNotifications();
  const { schedule, isLoading } = useSchedule();

  useEffect(() => {
    if (!isLoading && schedule && permission === 'granted') {
      const todayKey = dayOrder[new Date().getDay()];
      scheduleNotificationsForDay(schedule[todayKey]);
    }
  }, [schedule, isLoading, permission, scheduleNotificationsForDay]);

  const handleEnableNotifications = () => {
    requestPermission().then(status => {
      if (status === 'granted' && schedule) {
        const todayKey = dayOrder[new Date().getDay()];
        scheduleNotificationsForDay(schedule[todayKey]);
      }
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <div className="flex-1 space-y-6 p-4 pt-0 md:p-6 md:pt-0">
        {permission !== 'granted' && (
          <div className="rounded-lg border bg-card text-card-foreground p-4 flex items-center justify-between">
            <p className="text-sm">Enable notifications for reminders.</p>
            <Button onClick={handleEnableNotifications} size="sm">
              Enable
            </Button>
          </div>
        )}
        <div className="grid gap-6">
          <DailyProgress />
          <WeeklyCalendar />
          <WeeklySummaryReport />
        </div>
      </div>
       <footer className="py-6 px-4 md:px-6 border-t">
        <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EngiTrack. Focus on your success.</p>
        </div>
      </footer>
    </main>
  );
}
