import { Module } from '@/types/builder';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizResultsProps {
  questions: Module['quizQuestions'];
  selectedOptions: { [questionIndex: number]: string[] };
  correctCount: number;
  passingScore: number;
}

/**
 * Component for displaying the quiz results
 */
export default function QuizResults({
  questions,
  selectedOptions,
  correctCount,
  passingScore,
}: QuizResultsProps) {
  // Calculate the score percentage with one decimal place
  const scorePercentage = formatPercent(correctCount / questions.length);
  const scorePassed = (correctCount / questions.length) * 100 >= passingScore;

  return (
    <div className="p-8 text-center">
      <div className="mb-6">
        {scorePassed ? (
          <div className="text-green-600 flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8" />
            <h3 className="text-2xl font-medium">Congratulations!</h3>
          </div>
        ) : (
          <div className="text-red-600 flex items-center justify-center gap-2">
            <XCircle className="w-8 h-8" />
            <h3 className="text-2xl font-medium">Keep Practicing</h3>
          </div>
        )}
        <p className="text-gray-600 mt-2">
          You scored {scorePercentage}% ({correctCount} of {questions.length} correct)
        </p>
      </div>

      <div className="space-y-4 mt-8">
        {questions.map((question, index) => {
          const userAnswers = selectedOptions[index] || [];
          const correctAnswers = (question?.answers || [])
            .filter(answer => answer && typeof answer === 'object')
            .filter(a => a?.isCorrect === true);

          // Check if the user's answer was correct
          const isCorrect =
            correctAnswers.every(answer => answer?.answer && userAnswers.includes(answer.answer)) &&
            correctAnswers.length === userAnswers.length;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg text-left ${
                isCorrect
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-red-50 border border-red-100'
              }`}
            >
              <p className="font-medium">Question {index + 1}</p>
              <p className="text-sm text-gray-600 mb-2">{question?.question}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm">
                  Your answer:{' '}
                  <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {userAnswers.join(', ') || 'No answer'}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-green-600">
                    Correct:{' '}
                    {correctAnswers
                      .filter(answer => answer?.answer)
                      .map(answer => answer.answer)
                      .join(', ')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}
