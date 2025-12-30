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
  
  // Timer State
  const [timeElapsed, setTimeElapsed] = useState(0); // Per question
  const [totalTime, setTotalTime] = useState(0);     // Whole quiz

  // Safety fallback
  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;

  // --- TIMER LOGIC ---

  // Effect 1: Reset PER-QUESTION timer when index changes
  useEffect(() => {
    setTimeElapsed(0);
  }, [currentIndex]);

  // Effect 2: Run the timer interval (Ticks both counters)
  useEffect(() => {
    if (isCompleted || totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
      setTotalTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted, totalQuestions]);

  // --- END TIMER LOGIC ---

  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion) return;
    if (isAnswerCorrect === true) return;

    setSelectedAnswer(answer);
    
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

  const handleNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setIncorrectAttempts(0);
    setIsAnswerCorrect(null);
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
    isAnswerCorrect,
    isCompleted,
    score,
    incorrectAttempts,
    timeElapsed,
    totalTime, // Exported new state
    handleAnswerSelect,
    handleNextQuestion,
    resetQuiz
  };
};