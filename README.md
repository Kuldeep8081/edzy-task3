# Edzy Quiz App 🧠

A responsive, interactive quiz application built for the **Edzy Frontend Hackathon (Task 3)**. This application allows students to test their knowledge across various subjects with real-time feedback, progress tracking, and performance summaries.

## 🚀 Features

* **Customizable Quiz Setup:** Select from multiple subjects (English, Math, Science, Social Science) and choose the number of questions (5, 10, 15).
* **Interactive Gameplay:**
    * **Immediate Feedback:** Answers are instantly validated. Correct answers turn green; incorrect answers turn red.
    * **Retry Logic:** Users must attempt a question until they get it correct before moving forward.
    * **Per-Question Timer:** A dynamic timer resets for every new question to track speed (Bonus Feature).
* **Progress Tracking:** Visual progress bar showing completion percentage.
* **Performance Summary:** A detailed end-screen displaying the final score and total incorrect attempts.
* **Robust Architecture:** Built with **clean code** principles using a custom hook (`useQuiz`) to separate game logic from UI.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & Shadcn UI
* **State Management & API:**
    * TanStack Query (Caching & State)
    * Axios (HTTP Requests)
* **Form Handling:** React Hook Form & Zod
* **Icons:** Lucide React

## 📦 Installation & Setup

Follow these steps to run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/edzy-quiz-app.git](https://github.com/YOUR_USERNAME/edzy-quiz-app.git)
    cd edzy-quiz-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit http://localhost:3000 in your browser.

## 📂 Project Structure

```text
src/
├── app/
│   ├── page.tsx            # Start Screen (Subject Selection)
│   ├── layout.tsx          # Root Layout & Font Setup
│   └── quiz/
│       └── page.tsx        # Main Quiz Interface
├── components/
│   ├── ui/                 # Reusable Shadcn UI components (Card, Button, etc.)
│   └── providers/          # QueryClientProvider setup
├── hooks/
│   └── useQuiz.ts          # Custom Hook containing all Game Logic & Timer
├── lib/
│   ├── api.ts              # Axios instance & API Adapter pattern
│   └── utils.ts            # Tailwind class merger
└── types/
    └── quiz.ts             # TypeScript interfaces for API & UI
