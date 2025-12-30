import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/types/quiz';

interface UseQuizProps {
  questions: Question[];
}

export const useQuiz = ({ questions }: UseQuizProps) => {
  // Game State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Stats
  const [score, setScore] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  
  // Timer State (Bonus: Per question timer)
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Safety fallback: Ensure we don't crash if questions array is empty during loading
  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;

  // --- TIMER LOGIC (Split into two effects for stability) ---

  // Effect 1: Reset timer whenever the question index changes
  useEffect(() => {
    setTimeElapsed(0);
  }, [currentIndex]);

  // Effect 2: Run the timer interval
  useEffect(() => {
    // Stop if quiz is done or no questions are loaded
    if (isCompleted || totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, totalQuestions]); // Dependencies are now simple numbers/booleans

  // --- END TIMER LOGIC ---

  // Handler: User selects an answer
  const handleAnswerSelect = (answer: string) => {
    // Safety check
    if (!currentQuestion) return;

    // Prevent changing answer if already correct (waiting for "Next")
    if (isAnswerCorrect === true) return;

    setSelectedAnswer(answer);
    
    // Check correctness immediately
    // Trim strings to avoid issues with hidden whitespace
    const cleanAnswer = answer.trim();
    const cleanCorrect = currentQuestion.correctAnswer.trim();

    if (cleanAnswer === cleanCorrect) {
      setIsAnswerCorrect(true);
      setScore((prev) => prev + 1);
    } else {
      setIsAnswerCorrect(false);
      setIncorrectAttempts((prev) => prev + 1);
    }
  };

  // Handler: Move to next question
  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setIsCompleted(true);
    }
  };

  // Handler: Reset Quiz
  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setIncorrectAttempts(0);
    setIsAnswerCorrect(null);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setTimeElapsed(0);
  }, []);

  return {
    // State
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    isAnswerCorrect,
    isCompleted,
    score,
    incorrectAttempts,
    timeElapsed,
    
    // Actions
    handleAnswerSelect,
    handleNextQuestion,
    resetQuiz
  };
};