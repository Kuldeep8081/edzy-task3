// src/types/quiz.ts

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solution: string; // <--- ADD THIS
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  incorrectAttempts: number;
  isCompleted: boolean;
  answers: Record<number, string>;
}

export interface ApiOption {
  _id: string;
  text: string;
  media: string | null;
}

export interface ApiQuestion {
  _id: string;
  text: string;           
  type: string;           
  optionOrdering: ApiOption[]; 
  questionInfo: {
    _id: string;
    question: string;
    solution: string; // This exists in API
    option: string;
  };
}

export interface QuizApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    examSubject: {
      _id: string;
      title: string;
    };
    questions: ApiQuestion[];
  };
}