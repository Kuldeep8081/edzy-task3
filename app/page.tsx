'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BrainCircuit } from "lucide-react";

// Define the Schema
const startQuizSchema = z.object({
  subject: z.string({
    message: "Please select a subject.",
  }).min(1, "Please select a subject."), // Ensures empty string triggers error
  
  questionCount: z.enum(["5", "10", "15"], {
    message: "Please select the number of questions.",
  }),
});

type StartQuizValues = z.infer<typeof startQuizSchema>;

// Subject Options
const SUBJECTS = [
  "Class 10 - English",
  "Class 10 - Mathematics",
  "Class 10 - Science",
  "Class 10 - Social Science",
];

export default function StartScreen() {
  const router = useRouter();

  const form = useForm<StartQuizValues>({
    resolver: zodResolver(startQuizSchema),
    // FIX: Initialize default values to prevent "uncontrolled input" errors
    defaultValues: {
      subject: "", 
      questionCount: "5",
    },
  });

  function onSubmit(data: StartQuizValues) {
    const params = new URLSearchParams({
      subject: data.subject,
      count: data.questionCount,
    });
    
    router.push(`/quiz?${params.toString()}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-2">
            <BrainCircuit className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Welcome to Edzy Quiz</CardTitle>
          <CardDescription>
            Test your knowledge! Select a subject and question limit to begin.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Subject Selection */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    {/* FIX: Bind 'value' explicitly so React Hook Form controls the input */}
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Count Selection */}
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        {["5", "10", "15"].map((count) => (
                          <FormItem key={count} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={count} />
                            </FormControl>
                            <Label className="font-normal cursor-pointer">
                              {count} Questions
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Start Quiz
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-slate-400">
          Edzy Frontend Hackathon Task 3
        </CardFooter>
      </Card>
    </div>
  );
}