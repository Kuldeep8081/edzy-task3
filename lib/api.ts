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

  // Transform the complex API data into our simple UI format
  return data.data.questions.map((raw) => {
    
    // 1. Get the list of option texts
    const options = raw.optionOrdering.map(opt => opt.text);

    // 2. Find the correct answer text
    // The API gives us the ID of the correct option in 'raw.questionInfo.option'
    // We need to find the matching object in 'optionOrdering' to get its text.
    const correctOptionObj = raw.optionOrdering.find(
      (opt) => opt._id === raw.questionInfo.option
    );

    // Safety fallback: if ID matching fails, default to empty string
    const correctAnswer = correctOptionObj ? correctOptionObj.text : "";

    return {
      id: raw._id,
      question: raw.text,
      options: options,
      correctAnswer: correctAnswer
    };
  });
};