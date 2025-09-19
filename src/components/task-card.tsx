"use client";

import { CheckCircle2, Circle, Edit, MinusCircle, MoreVertical, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DayKey, Task, TaskStatus } from "@/lib/types";

type TaskCardProps = {
  task: Task;
  day: DayKey;
  onStatusChange: (status: TaskStatus) => void;
  onEdit: () => void;
};

const statusConfig = {
  pending: { icon: Circle, color: "text-muted-foreground" },
  done: { icon: CheckCircle2, color: "text-green-500" },
  skipped: { icon: XCircle, color: "text-destructive" },
  partial: { icon: MinusCircle, color: "text-yellow-500" },
};

const categoryColorConfig = {
  'Review Class': 'border-task-review',
  'Problem Sets': 'border-task-problems',
  'Meals': 'border-task-meals',
  'Rest/Sleep': 'border-task-rest',
  'Exams': 'border-task-exams',
  'Other': 'border-muted'
};

export function TaskCard({ task, onStatusChange, onEdit }: TaskCardProps) {
  const StatusIcon = statusConfig[task.status].icon;

  return (
    <Card className={cn(
      "relative flex items-center p-3 transition-all hover:shadow-md border-l-4",
      categoryColorConfig[task.category]
    )}>
      <StatusIcon className={cn("h-5 w-5 mr-3 shrink-0", statusConfig[task.status].color)} />
      <div className="flex-1">
        <p className="font-medium">{task.title}</p>
        <p className="text-sm text-muted-foreground">{task.startTime} - {task.endTime}</p>
        {task.notes && <p className="text-xs text-muted-foreground mt-1 italic">Note: {task.notes}</p>}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStatusChange('done')}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Done</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('partial')}>
            <MinusCircle className="mr-2 h-4 w-4" />
            <span>Partial</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('skipped')}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Skipped</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange('pending')}>
            <Circle className="mr-2 h-4 w-4" />
            <span>Pending</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
