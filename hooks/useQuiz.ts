import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/quiz';

interface UseQuizProps {
  questions: Question[];
}

export const useQuiz = ({ questions }: UseQuizProps) => {
  // Game State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Status: 'idle' (start), 'correct', 'wrong'
  // Removed 'time_up' as per instruction to not stop for intervals
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Stats
  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  
  // Timer State (Straight Counter 0 -> Infinity)
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;

  // --- TIMER LOGIC (Count Up) ---
  useEffect(() => {
    // Reset state when index changes
    setTimeElapsed(0);
    setStatus('idle');
    setSelectedAnswer(null);
  }, [currentIndex]);

  useEffect(() => {
    // Stop timer if quiz completed, data missing, or answer is Correct.
    // We DO NOT stop on 'wrong' so the user sees time ticking while they retry.
    if (isCompleted || !currentQuestion || status === 'correct') return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
      setTotalTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, currentQuestion, status]);

  // --- HANDLERS ---

  // 1. Select Option
  const handleOptionSelect = (answer: string) => {
    if (status === 'correct') return; // Locked only if correct
    
    // Allow changing selection even if currently "wrong" before they submit again
    if (status === 'wrong') {
        setStatus('idle'); // Reset status to allow re-submission visually
    }
    
    setSelectedAnswer(answer);
  };

  // 2. Submit Button Logic
  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const cleanAnswer = selectedAnswer.trim();
    const cleanCorrect = currentQuestion.correctAnswer.trim();

    if (cleanAnswer === cleanCorrect) {
      setStatus('correct');
      setScore((prev) => prev + 1);
    } else {
      setStatus('wrong');
      setIncorrectAttempts((prev) => prev + 1);
    }
  };

  // 3. Retry Logic (Resets mostly visual state, keeps timer running?)
  // Usually "Retry" implies starting the question attempt over.
  const handleRetry = () => {
    setStatus('idle');
    setSelectedAnswer(null);
    // Note: We do NOT reset timeElapsed here based on "straight way" request, 
    // but if you want per-attempt timing, you could setTimeElapsed(0).
    // For now, I'll reset it to give a "fresh start" feeling for the specific question.
    setTimeElapsed(0); 
  };

  // 4. Next Question Logic
  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setIncorrectAttempts(0);
    setStatus('idle');
    setSelectedAnswer(null);
    setIsCompleted(false);
    setTimeElapsed(0);
    setTotalTime(0);
  }, []);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    status,
    isCompleted,
    score,
    incorrectAttempts,
    timeElapsed, // Returning the count-up timer
    totalTime,
    handleOptionSelect,
    handleSubmit,
    handleRetry,
    handleNextQuestion,
    resetQuiz
  };
};