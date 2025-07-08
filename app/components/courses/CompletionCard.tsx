'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Award, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';

export function CompletionCard({ courseId, score }: { courseId: string; score: number }) {
  const [certificateId, setCertificateId] = useState<string | null>(null);

  useEffect(() => {
    if (score >= 70) {
      // Trigger confetti effect when component mounts with a passing score
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Generate a fake certificate ID
    setCertificateId(
      `BUILDER-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`,
    );
  }, [score]);

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e0e0e0] shadow-sm animate-slideUp">
      <div className="flex items-center justify-center mb-4">
        {score >= 70 ? (
          <div className="h-16 w-16 rounded-full bg-[#ecfdf3] flex items-center justify-center">
            <Trophy className="h-8 w-8 text-[#039855]" />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-full bg-[#fff4ed] flex items-center justify-center">
            <Award className="h-8 w-8 text-[#ef6820]" />
          </div>
        )}
      </div>

      <h2 className="text-xl font-medium text-center mb-2">
        {score >= 70 ? 'Course Completed!' : 'Almost There!'}
      </h2>

      <p className="text-gray-600 text-center mb-4">
        {score >= 70
          ? `You scored ${score}% and have completed this course.`
          : `You scored ${score}%. You need a score of at least 70% to pass.`}
      </p>

      {score >= 70 && certificateId && (
        <div className="bg-[#f9f9f9] p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
          <p className="font-mono text-sm">{certificateId}</p>
        </div>
      )}

      <div className="space-y-3">
        {score >= 70 ? (
          <>
            <Link
              href="/courses"
              className="flex items-center justify-between w-full px-4 py-2 rounded-md border border-[#e0e0e0] hover:bg-[#f9f9f9] transition-colors"
            >
              <span className="font-medium">Explore more courses</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href={`/courses/${courseId}`}
              className="flex items-center justify-between w-full px-4 py-2 rounded-md border border-[#e0e0e0] hover:bg-[#f9f9f9] transition-colors"
            >
              <span className="font-medium">Retake this course</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          </>
        ) : (
          <Button onClick={() => window.location.reload()} className="w-full py-2 rounded-md">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
