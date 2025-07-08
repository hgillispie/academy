'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Module } from '@/types/builder';
import config from '@/data/config';
import { useIsPreviewing } from '@builder.io/react';
import QuizHeader from './QuizHeader';
import QuizResults from './QuizResults';
import QuizQuestion from './QuizQuestion';
import PreviewQuizQuestions from './PreviewQuiz';
import { generateSeed, seededRandomGenerator } from './utils';
import { useAnalytics } from '@/providers/analytics';

// Support both the original module format and the direct Builder.io format
interface QuizSectionProps {
  // New properties for Builder.io integration
  module: Module;
  moduleId: string;
  passingScore?: number;
  successMessage?: string; // Unused
  failureMessage?: string; // Unused
  onComplete?: (score: number, passed: boolean) => void;
}

/**
 * Main Quiz component that manages the overall quiz state and logic
 */
export default function QuizSection({ module, moduleId, onComplete = () => {} }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[][]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const passingScore = module.passingScore || config.PASSING_SCORE;
  const isPreviewing = useIsPreviewing();
  const [clientRenderOnly, setClientRenderOnly] = useState(false);
  const { trackEvent } = useAnalytics();

  // Don't render quiz on server for now; fixing hydration errors
  useEffect(() => {
    setClientRenderOnly(true);
  }, []);

  // Reset state when questions change
  useEffect(() => {
    setCorrectCount(0);
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
  }, [module, module.quizQuestions]);

  const seed = generateSeed(module.title || 'quiz');

  // Randomize questions only when they change or on new session
  const questions = useMemo(() => {
    // Fast Exit
    if (
      !clientRenderOnly ||
      isPreviewing ||
      !Array.isArray(module.quizQuestions) ||
      module.quizQuestions.length === 0
    )
      return Array.isArray(module.quizQuestions) ? module.quizQuestions : [];

    const random = seededRandomGenerator(seed);

    // deep-clone the module quizQuestions to avoid mutating the original data
    const rq = random.shuffleArray(
      JSON.parse(JSON.stringify(module.quizQuestions)) as Module['quizQuestions'],
    );
    rq.forEach(q => {
      if (q && Array.isArray(q.answers)) {
        q.answers = random.shuffleArray([...q.answers]);
      } else {
        q.answers = [];
      }
    });
    return rq;
  }, [module.quizQuestions, seed, clientRenderOnly, isPreviewing]);

  // Skip Rendering if no questions available
  if (!questions || !questions.length) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Abstracts the logic for determining if an answer to a question is correct
  const isAnswerCorrect = (questionIndex: number, userAnswers: string[]) => {
    const question = questions[questionIndex];
    const correctAnswers = (question?.answers || [])
      .filter(answer => answer && typeof answer === 'object')
      .filter(a => a?.isCorrect === true);

    return (
      correctAnswers.length === userAnswers.length &&
      correctAnswers.every(a => userAnswers.includes(a.answer))
    );
  };

  // Handler for when an answer option is selected
  const handleSelectAnswer = (answer: string) => {
    const currentAnswers = selectedOptions[currentQuestionIndex] || [];
    const isAlreadySelected = currentAnswers.includes(answer);

    if (!currentQuestion?.isMultipleChoice) {
      // For single-select questions, replace the selection
      setSelectedOptions({
        ...selectedOptions,
        [currentQuestionIndex]: [answer],
      });
    } else {
      // For multi-select questions, toggle the selection
      setSelectedOptions({
        ...selectedOptions,
        [currentQuestionIndex]: isAlreadySelected
          ? currentAnswers.filter(a => a !== answer)
          : [...currentAnswers, answer],
      });
    }
  };

  // Handler for submitting an answer
  const handleSubmit = () => {
    setIsSubmitted(true);

    const userAnswers = selectedOptions[currentQuestionIndex] || [];
    const correct = isAnswerCorrect(currentQuestionIndex, userAnswers);

    trackEvent('submit quiz answer', {
      moduleId,
      question: currentQuestion.question,
      isCorrect: correct,
      userAnswers,
    });

    // Update the correct count if the answer is correct
    if (correct) {
      setCorrectCount(prevCount => prevCount + 1);
    }
  };

  // Handler for moving to the next question or finishing the quiz
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      // Calculate score percentage for the onComplete callback
      const scorePercentage = (correctCount / questions.length) * 100;
      onComplete(scorePercentage, scorePercentage >= passingScore);
    }
  };

  if (isFinished) {
    return (
      <QuizResults
        questions={questions}
        selectedOptions={selectedOptions}
        correctCount={correctCount}
        passingScore={passingScore}
      />
    );
  }

  if (isPreviewing) {
    // Show the unrandomized ones here
    return <PreviewQuizQuestions questions={module.quizQuestions || []} />;
  }

  // Hydration fixer
  if (!clientRenderOnly) {
    return null;
  }

  return (
    <>
      <QuizHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        correctCount={correctCount}
      />
      <QuizQuestion
        question={currentQuestion}
        userAnswers={selectedOptions[currentQuestionIndex] || []}
        isSubmitted={isSubmitted}
        onSelectAnswer={handleSelectAnswer}
        onSubmit={handleSubmit}
        onNext={handleNext}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </>
  );
}
