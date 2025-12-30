// src/lib/api.ts
import axios from 'axios';
import { QuizApiResponse, Question } from '@/types/quiz';

const API_BASE_URL = 'https://api.paraheights.com/edzy-api/hackathon/task';

interface QuizConfig {
  examSubjectName: string;
  numberOfQuestions: number;
}

export const fetchQuizQuestions = async (config: QuizConfig): Promise<Question[]> => {
  const { data } = await axios.post<QuizApiResponse>(
    `${API_BASE_URL}/quizDetails`, 
    config
  );

  if (!data.success || !data.data?.questions) {
    throw new Error(data.message || "Failed to fetch questions");
  }

  return data.data.questions.map((raw) => {
    
    // 1. Get options
    const optionsList = raw.optionOrdering || [];
    const options = optionsList.map(opt => opt.text);

    // 2. Find correct answer text
    const correctOptionObj = optionsList.find(
      (opt) => opt._id === raw.questionInfo?.option
    );
    const correctAnswer = correctOptionObj ? correctOptionObj.text : "";

    // 3. Get Solution Text (Explanation)
    // Fallback to a default message if missing
    const solutionText = raw.questionInfo?.solution || "No explanation provided.";

    return {
      id: raw._id,
      question: raw.text,
      options: options,
      correctAnswer: correctAnswer,
      solution: solutionText // <--- PASS THIS
    };
  });
};