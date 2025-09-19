"use client";

import { useState } from "react";
import { addDays, startOfWeek, format } from "date-fns";
import { Sparkles } from "lucide-react";
import { useSchedule } from "@/hooks/use-schedule-store";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { dayOrder } from "@/lib/types";
import { generateWeeklySummaryReport, WeeklySummaryReportOutput } from "@/ai/flows/weekly-summary-report";
import { useToast } from "@/hooks/use-toast";

export function WeeklySummaryReport() {
  const { schedule } = useSchedule();
  const [report, setReport] = useState<WeeklySummaryReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!schedule) {
        toast({
            title: "Error",
            description: "Schedule data not available.",
            variant: "destructive"
        });
        return;
    }
    setIsLoading(true);

    try {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
        let completedTasks: string[] = [];
        let missedTasks: string[] = [];
        let totalTasks = 0;
        let doneTasks = 0;
        let sleepTasks = 0;
        let onTimeSleep = 0;

        for (let i = 0; i < 7; i++) {
            const day = addDays(weekStart, i);
            const dayKey = dayOrder[day.getDay()];
            const dayTasks = schedule[dayKey];
            
            dayTasks.forEach(task => {
                if(task.category !== 'Meals' && task.category !== 'Rest/Sleep') {
                    totalTasks++;
                    if(task.status === 'done') {
                        doneTasks++;
                        completedTasks.push(task.title);
                    } else if (task.status === 'skipped' || task.status === 'pending') {
                        missedTasks.push(task.title);
                    }
                }
                if(task.category === 'Rest/Sleep' && task.title.toLowerCase() === 'sleep' && task.startTime.startsWith('22')) {
                    sleepTasks++;
                    if(task.status === 'done') {
                        onTimeSleep++;
                    }
                }
            });
        }
        
        const input = {
            taskCompletionRate: totalTasks > 0 ? doneTasks / totalTasks : 0,
            sleepAdherenceRate: sleepTasks > 0 ? onTimeSleep / sleepTasks : 0,
            completedTasks: [...new Set(completedTasks)],
            missedTasks: [...new Set(missedTasks)],
            numberOfDaysSleptOnTime: onTimeSleep,
            numberOfDays: 7
        };

        const result = await generateWeeklySummaryReport(input);
        setReport(result);
    } catch(error) {
        console.error("Failed to generate report:", error);
        toast({
            title: "Report Generation Failed",
            description: "There was an error generating your weekly report. Please try again later.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <Button onClick={handleGenerateReport} disabled={isLoading} size="lg" className="w-full md:w-auto">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? "Generating Your Report..." : "Get AI-Powered Weekly Summary"}
        </Button>
      </div>

      <AlertDialog open={!!report} onOpenChange={(isOpen) => !isOpen && setReport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> Weekly Performance Report</AlertDialogTitle>
            <AlertDialogDescription>
              Here is your AI-powered summary and recommendations for the week.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {report && (
            <div className="text-sm max-h-[60vh] overflow-y-auto pr-2">
                <h3 className="font-bold mb-2">Summary</h3>
                <p className="mb-4 text-muted-foreground">{report.summary}</p>
                <h3 className="font-bold mb-2">Recommendations</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{report.recommendations}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
