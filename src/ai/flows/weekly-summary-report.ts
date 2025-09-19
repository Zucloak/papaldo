'use server';

/**
 * @fileOverview Generates a weekly summary report for the user, highlighting progress on tasks and adherence to sleep schedule.
 *
 * - generateWeeklySummaryReport - A function that generates the weekly summary report.
 * - WeeklySummaryReportInput - The input type for the generateWeeklySummaryReport function.
 * - WeeklySummaryReportOutput - The return type for the generateWeeklySummaryReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeeklySummaryReportInputSchema = z.object({
  taskCompletionRate: z.number().describe('The overall task completion rate for the week (0-1).'),
  sleepAdherenceRate: z.number().describe('The rate of adherence to the sleep schedule for the week (0-1).'),
  completedTasks: z.array(z.string()).describe('List of tasks completed this week.'),
  missedTasks: z.array(z.string()).describe('List of tasks missed this week.'),
  numberOfDaysSleptOnTime: z.number().describe('Number of days the user slept on time this week.'),
  numberOfDays: z.number().describe('Total number of days in the week.'),
});
export type WeeklySummaryReportInput = z.infer<typeof WeeklySummaryReportInputSchema>;

const WeeklySummaryReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s weekly progress, including task completion and sleep adherence. Also includes suggestions for improvement.'),
  recommendations: z.string().describe('Specific recommendations for the user based on their weekly performance.'),
});
export type WeeklySummaryReportOutput = z.infer<typeof WeeklySummaryReportOutputSchema>;

export async function generateWeeklySummaryReport(input: WeeklySummaryReportInput): Promise<WeeklySummaryReportOutput> {
  return weeklySummaryReportFlow(input);
}

const weeklySummaryReportPrompt = ai.definePrompt({
  name: 'weeklySummaryReportPrompt',
  input: {schema: WeeklySummaryReportInputSchema},
  output: {schema: WeeklySummaryReportOutputSchema},
  prompt: `You are a personal coach helping a student prepare for their Mechanical Engineering board exam. Analyze their weekly progress and provide a summary and recommendations.

  Task Completion Rate: {{taskCompletionRate}}
  Sleep Adherence Rate: {{sleepAdherenceRate}}
  Completed Tasks: {{#each completedTasks}}{{{this}}}, {{/each}}
  Missed Tasks: {{#each missedTasks}}{{{this}}}, {{/each}}
  Number of Days Slept On Time: {{numberOfDaysSleptOnTime}}
  Total Number of Days: {{numberOfDays}}

  Generate a concise summary of the student\'s performance this week. Highlight both strengths and weaknesses.
  Provide specific and actionable recommendations for improvement, focusing on time management, task prioritization, and sleep habits.
  Ensure the summary and recommendations are motivating and encouraging.

  The summary and recommendations should be geared toward improving task completion and sleep adherence for next week.

  Summary:
  
  Recommendations:
  `
});

const weeklySummaryReportFlow = ai.defineFlow(
  {
    name: 'weeklySummaryReportFlow',
    inputSchema: WeeklySummaryReportInputSchema,
    outputSchema: WeeklySummaryReportOutputSchema,
  },
  async input => {
    const {output} = await weeklySummaryReportPrompt(input);
    return output!;
  }
);
