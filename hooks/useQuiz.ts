import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/quiz';

interface UseQuizProps {
  questions: Question[];
}

const QUESTION_TIMER_SECONDS = 60;

export const useQuiz = ({ questions }: UseQuizProps) => {
  // Game State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Status: 'idle' (start), 'correct', 'wrong', 'time_up'
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'time_up'>('idle');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Stats
  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER_SECONDS);
  const [totalTime, setTotalTime] = useState(0);

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;

  // --- TIMER LOGIC ---
  useEffect(() => {
    // Reset state when index changes
    setTimeLeft(QUESTION_TIMER_SECONDS);
    setStatus('idle');
    setSelectedAnswer(null);
  }, [currentIndex]);

  useEffect(() => {
    if (isCompleted || !currentQuestion || status === 'correct') return;

    // Handling Time Up Logic
    if (timeLeft <= 0) {
      if (status !== 'time_up' && status !== 'correct') {
         setStatus('time_up');
         setIncorrectAttempts((prev) => prev + 1); // Count as mistake
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setTotalTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, currentQuestion, status, timeLeft]);

  // --- HANDLERS ---

  // 1. Just select the option (Visual only)
  const handleOptionSelect = (answer: string) => {
    if (status === 'correct' || status === 'time_up') return; // Locked
    // If already submitted wrong, don't allow changing unless retry clicked? 
    // Usually standard is: must click retry to unlock.
    if (status === 'wrong') return; 
    
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

  // 3. Retry Button Logic (Resets only the current question)
  const handleRetry = () => {
    setStatus('idle');
    setSelectedAnswer(null);
    setTimeLeft(QUESTION_TIMER_SECONDS); // Reset timer for the retry
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
    setTimeLeft(QUESTION_TIMER_SECONDS);
    setTotalTime(0);
  }, []);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    status, // Exported status instead of booleans
    isCompleted,
    score,
    incorrectAttempts,
    timeLeft,
    totalTime,
    handleOptionSelect,
    handleSubmit,
    handleRetry,
    handleNextQuestion,
    resetQuiz
  };
};