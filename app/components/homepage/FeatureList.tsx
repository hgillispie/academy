'use client';

interface Feature {
  text: string;
}

interface FeatureListProps {
  title?: string;
  features?: Feature[];
}

export function FeatureList({ title = 'Why Builder Academy?', features = [] }: FeatureListProps) {
  return (
    <div className="w-full py-12">
      <h2 className="text-3xl font-medium text-black mb-8 text-center">{title}</h2>

      <div className="max-w-[800px] mx-auto">
        <ul className="space-y-4">
          {features?.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-lg text-gray-600">
              <span className="text-[#a97ff2] text-2xl">•</span>
              {feature?.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
