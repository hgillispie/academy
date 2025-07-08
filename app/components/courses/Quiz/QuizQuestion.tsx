import { Module } from '@/types/builder';
import { CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Button } from '../../common/Button';

interface QuizQuestionProps {
  question: Module['quizQuestions'][number];
  userAnswers?: string[];
  isSubmitted?: boolean;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
  showFeedback?: boolean;
}

/**
 * Component for displaying a single question and collecting user answers
 */
export default function QuizQuestion({
  question: { question, answers = [] },
  userAnswers = [],
  isSubmitted = false,
  onSelectAnswer,
  onSubmit,
  onNext,
  isLastQuestion,
  showFeedback = true,
}: QuizQuestionProps) {
  // Calculate information about correct answers
  const correctAnswers = (answers || [])
    .filter(answer => answer && typeof answer === 'object')
    .filter(a => a?.isCorrect === true);

  const isCorrect =
    isSubmitted &&
    correctAnswers.length === userAnswers.length &&
    correctAnswers.every(a => userAnswers.includes(a.answer));

  return (
    <div className="p-6 mb-8 question">
      <h3 className="text-lg font-medium mb-6">
        <Markdown>{question}</Markdown>
      </h3>
      <div className="space-y-3">
        {(answers || []).map((answer, index) => {
          // Skip invalid answers
          if (!answer || typeof answer !== 'object') return null;

          const isAnswerCorrect = answer.isCorrect === true;
          return (
            <button
              key={`answer-${index}-${answer.answer}`}
              onClick={() => !isSubmitted && onSelectAnswer(answer.answer)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-lg border transition-colors relative
                ${
                  userAnswers?.includes(answer.answer)
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-gray-200 hover:border-gray-300'
                }
                ${isSubmitted && isAnswerCorrect ? 'bg-green-50 border-green-500' : ''}
                ${
                  isSubmitted && userAnswers?.includes(answer.answer) && !isAnswerCorrect
                    ? 'bg-red-50 border-red-500'
                    : ''
                }
              `}
            >
              <Markdown>{answer.answer}</Markdown>
              {isSubmitted && isAnswerCorrect && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
              )}
              {isSubmitted && userAnswers?.includes(answer.answer) && !isAnswerCorrect && (
                <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      {isSubmitted && showFeedback && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            isCorrect ? 'bg-green-50' : 'bg-orange-50'
          }`}
        >
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            {!isCorrect && correctAnswers.length > 0 && (
              <p className="text-sm text-orange-700 mt-1">
                The correct answer is: {correctAnswers.map(a => a.answer).join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        {!isSubmitted ? (
          <Button
            onClick={onSubmit}
            disabled={!userAnswers?.length}
            className="px-6 py-2 flex items-center rounded-lg"
          >
            Submit
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onNext} className="px-6 py-2 flex items-center rounded-lg">
            {!isLastQuestion ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Finish Quiz
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
