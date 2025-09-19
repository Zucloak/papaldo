"use client";

import { ScheduleProvider } from "@/hooks/use-schedule-store";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ScheduleProvider>
      {children}
      <Toaster />
    </ScheduleProvider>
  );
}
