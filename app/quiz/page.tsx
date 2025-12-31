'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizQuestions } from '@/lib/api';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle2, XCircle, Timer, RotateCcw, Trophy, Target, Clock, AlertTriangle, Lightbulb, PlayCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper for Timer Display
function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const subject = searchParams.get('subject') || 'General';
  const count = Number(searchParams.get('count')) || 5;

  const { data: questions = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['quiz', subject, count],
    queryFn: () => fetchQuizQuestions({ examSubjectName: subject, numberOfQuestions: count }),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
  
  const quiz = useQuiz({ questions });

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-500">Generating your quiz...</p>
      </div>
    );
  }

  if (isError || !questions.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">Failed to load quiz</h2>
        <p className="text-slate-500">We couldn&apos;t fetch questions for this subject.</p>
        <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/')}>Go Home</Button>
            <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // --- SUMMARY SCREEN ---
  if (quiz.isCompleted) {
    const accuracy = Math.round((quiz.score / quiz.totalQuestions) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-4 rounded-full mb-4">
               <Trophy className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Quiz Completed!</h1>
            <p className="text-slate-500">Here is how you performed</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-1">
                    <p className="text-xs uppercase text-blue-600 font-semibold tracking-wider">Score</p>
                    <p className="text-2xl font-bold text-blue-900">{quiz.score} / {quiz.totalQuestions}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1 text-xs uppercase text-green-600 font-semibold tracking-wider">
                        <Target className="h-3 w-3" /> Accuracy
                    </div>
                    <p className="text-2xl font-bold text-green-900">{accuracy}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1 text-xs uppercase text-purple-600 font-semibold tracking-wider">
                        <Clock className="h-3 w-3" /> Time Spent
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{formatTime(quiz.totalTime)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center justify-center gap-1">
                     <div className="flex items-center gap-1 text-xs uppercase text-red-600 font-semibold tracking-wider">
                        <AlertTriangle className="h-3 w-3" /> Mistakes
                    </div>
                    <p className="text-2xl font-bold text-red-900">{quiz.incorrectAttempts}</p>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={quiz.resetQuiz}>
               <RotateCcw className="mr-2 h-4 w-4" /> Reattempt Quiz
            </Button>
            <Button variant="ghost" onClick={() => router.push('/')}>Select New Subject</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- MAIN QUIZ UI ---
  const { currentQuestion, status, selectedAnswer, timeLeft } = quiz;
  const progressPercentage = ((quiz.currentIndex + 1) / quiz.totalQuestions) * 100;

  if (!currentQuestion) return null;

  // Visual Helper States
  const isTimeUp = status === 'time_up';
  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';
  const isSubmitted = isCorrect || isWrong;
  const isLocked = isSubmitted || isTimeUp;

  // Timer Color Logic
  const timerVariant = timeLeft <= 10 ? "destructive" : "secondary";
  const timerBg = timeLeft <= 10 ? "bg-red-100 text-red-700" : "";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col gap-1 w-1/2">
                <span className="text-sm font-medium text-slate-500">
                    Question {quiz.currentIndex + 1} of {quiz.totalQuestions}
                </span>
                <Progress value={progressPercentage} className="h-2" />
            </div>
            {/* Timer Badge */}
            <Badge variant={timerVariant} className={cn("px-3 py-1 flex gap-2 text-lg transition-colors", timerBg)}>
                <Timer className="h-4 w-4" /> 
                {formatTime(timeLeft)}
            </Badge>
        </div>

        {/* Question Card */}
        <Card className="shadow-md border-0 transition-all duration-300">
          <CardContent className="pt-6">
             <h2 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
                {currentQuestion.question}
             </h2>

             {/* Options List */}
             <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    
                    // Default Styles
                    let variantClass = "border-slate-200 hover:bg-slate-50"; 
                    let icon = null;
                    let numberClass = "bg-slate-100 text-slate-600";

                    // Styling Logic based on Status
                    if (isCorrect && option === currentQuestion.correctAnswer) {
                         // Highlight Correct Answer Green
                         variantClass = "border-green-500 bg-green-50 text-green-700";
                         numberClass = "bg-green-200 text-green-800";
                         icon = <CheckCircle2 className="h-5 w-5 text-green-600" />;
                    } else if (isWrong && isSelected) {
                         // Highlight Wrong Selection Red
                         variantClass = "border-red-500 bg-red-50 text-red-700";
                         numberClass = "bg-red-200 text-red-800";
                         icon = <XCircle className="h-5 w-5 text-red-600" />;
                    } else if (isSelected) {
                         // Highlight Selected (Before Submit)
                         variantClass = "border-blue-500 bg-blue-50 text-blue-700";
                         numberClass = "bg-blue-200 text-blue-800";
                    }

                    return (
                        <div 
                            key={index}
                            // Only allow selection if not locked
                            onClick={() => !isLocked && quiz.handleOptionSelect(option)}
                            className={cn(
                                "p-3 border-2 rounded-lg transition-all flex justify-between items-center",
                                isLocked ? "cursor-default" : "cursor-pointer", 
                                variantClass,
                                // Dim unselected options when submitted
                                (isSubmitted || isTimeUp) && !isSelected &&  "opacity-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                                    numberClass
                                )}>
                                    {index + 1}
                                </span>
                                <span className="font-medium">{option}</span>
                            </div>
                            {icon}
                        </div>
                    );
                })}
             </div>

             {/* --- STATUS MESSAGES --- */}

             {/* 1. Time Up Message */}
             {isTimeUp && (
                <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md animate-in slide-in-from-top-1">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Time&apos;s Up! You ran out of time.</span>
                </div>
             )}

             {/* 2. Wrong Answer Message */}
             {isWrong && (
                <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md animate-in slide-in-from-top-1">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Incorrect answer. Try again!</span>
                </div>
             )}

             {/* 3. Correct Answer Solution */}
             {isCorrect && (
               <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span>Explanation</span>
                  </div>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {currentQuestion.solution}
                  </p>
               </div>
             )}

          </CardContent>

          {/* --- FOOTER BUTTONS --- */}
          <CardFooter className="justify-end pt-2 pb-6 gap-3">
             
             {/* SUBMIT BUTTON: Show only when an answer is selected but not submitted */}
             {!isSubmitted && !isTimeUp && (
                 <Button 
                    onClick={quiz.handleSubmit} 
                    disabled={!selectedAnswer}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 animate-in fade-in"
                 >
                    Submit Answer
                 </Button>
             )}

             {/* RETRY BUTTON: Show when Wrong OR Time Up */}
             {(isWrong || isTimeUp) && (
                 <Button 
                    onClick={quiz.handleRetry} 
                    variant="secondary"
                    className="w-full sm:w-auto animate-in fade-in flex gap-2"
                 >
                    <RotateCcw className="h-4 w-4" /> Retry Question
                 </Button>
             )}

             {/* NEXT BUTTON: Show only when Correct */}
             {isCorrect && (
                 <Button 
                    onClick={quiz.handleNextQuestion} 
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 animate-in fade-in flex gap-2"
                 >
                    Next Question <ArrowRight className="h-4 w-4" />
                 </Button>
             )}

          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-slate-500">Loading quiz...</p>
        </div>
    }>
      <QuizContent />
    </Suspense>
  );
}