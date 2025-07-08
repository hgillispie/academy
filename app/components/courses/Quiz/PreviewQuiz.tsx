import { Module } from '@/types/builder';
import { CheckCircle } from 'lucide-react';
import Markdown from 'markdown-to-jsx';

export default function PreviewQuizQuestions({
  questions,
}: {
  questions: Module['quizQuestions'];
}) {
  // Ensure we have valid questions to render
  const safeQuestions = Array.isArray(questions) ? questions : [];

  return (
    <>
      <h2 className="text-xl font-medium text-orange-700">(Preview Mode)</h2>
      {safeQuestions.map((questionItem, idx) => {
        // Skip invalid questions
        if (!questionItem) return null;

        const { question = '', answers = [] } = questionItem;

        return (
          <div className="p-6 mb-4 question" key={`question-${idx}`}>
            <h3 className="text-lg font-medium mb-6">
              {idx + 1 + ')'} <Markdown>{question}</Markdown>
            </h3>
            <div className="space-y-3">
              {(answers || []).map((option, index) => {
                // Skip invalid answers
                if (!option) return null;

                const isAnswerCorrect = option.isCorrect === true;

                return (
                  <button
                    key={`answer-${index}-${option.answer || 'empty'}`}
                    className={`w-full text-left p-4 rounded-lg border transition-colors relative
                      ${isAnswerCorrect ? 'bg-green-50 border-green-500' : ''}
                    `}
                  >
                    <Markdown>{option.answer || ''}</Markdown>
                    {isAnswerCorrect && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
