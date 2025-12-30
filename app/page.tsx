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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BrainCircuit, BookOpen, Clock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the Schema
const startQuizSchema = z.object({
  subject: z.string({
    message: "Please select a subject.",
  }).min(1, "Please select a subject."),
  
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
    // Added a subtle gradient background
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      
      <Card className="w-full max-w-lg shadow-xl border-0 ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-500 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-600/20 mb-4 transform transition-transform hover:scale-105 duration-300">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">
            Edzy Quiz
          </CardTitle>
          <CardDescription className="text-base text-slate-500 max-w-xs mx-auto">
            Ready to challenge yourself? Configure your quiz settings below.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Subject Selection */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" /> Select Subject
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500 text-base">
                          <SelectValue placeholder="Choose your topic..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject} className="cursor-pointer py-3 focus:bg-blue-50">
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Question Count Selection - Converted to Cards for better UX */}
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" /> Number of Questions
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        {["5", "10", "15"].map((count) => (
                          <FormItem key={count} className="space-y-0">
                            <FormControl>
                              <RadioGroupItem value={count} className="peer sr-only" />
                            </FormControl>
                            <FormLabel className={cn(
                                "flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-700 cursor-pointer transition-all duration-200",
                            )}>
                              <span className="text-2xl font-bold">{count}</span>
                              <span className="text-xs font-medium text-slate-500 mt-1">Questions</span>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/20 transition-all duration-300 transform hover:-translate-y-0.5" 
                size="lg"
              >
                Start Quiz <PlayCircle className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center py-6 bg-slate-50/50 border-t border-slate-100 rounded-b-xl">
            <p className="text-xs text-slate-400 font-medium">
                Edzy Frontend Hackathon • Task 3
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}