"use client";

import { Flame } from "lucide-react";
import { useSchedule } from "@/hooks/use-schedule-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DailyProgress() {
  const { todayProgress, streak } = useSchedule();
  const { completed, total } = todayProgress;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Daily Progress</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame className="h-5 w-5 text-accent" />
          <span className="font-bold text-lg">{streak}</span>
          <span className="text-sm">Day Streak</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} aria-label={`${Math.round(percentage)}% of tasks complete`} />
          <p className="text-sm text-muted-foreground">
            You completed {completed} of {total} tasks today.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
