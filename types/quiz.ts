// src/types/quiz.ts

// --- 1. The Clean UI Types (Kept simple for the UI) ---
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  incorrectAttempts: number;
  isCompleted: boolean;
  answers: Record<number, string>;
}

// --- 2. The Raw API Response Types (Updated to match your JSON) ---
export interface ApiOption {
  _id: string;
  text: string;
  media: string | null;
}

export interface ApiQuestion {
  _id: string;
  text: string;           
  type: string;           
  
  // The options are in this specific array
  optionOrdering: ApiOption[]; 

  // The correct answer ID is hidden inside here
  questionInfo: {
    _id: string;
    question: string;
    solution: string;
    option: string; // This is the ID of the correct answer
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