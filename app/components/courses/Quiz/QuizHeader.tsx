/**
 * This utility component helps show the quiz progress and score
 */
export default function QuizHeader({
  currentQuestionIndex,
  totalQuestions,
  correctCount,
}: {
  currentQuestionIndex: number;
  totalQuestions: number;
  correctCount: number;
}) {
  // Calculate the score percentage with one decimal place
  const scorePercentage = ((correctCount / totalQuestions) * 100).toFixed(1);

  // TODO: Show a Progress bar instead of Score?

  return (
    <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
      <span>
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </span>
      <span>Score: {scorePercentage}%</span>
    </div>
  );
}
