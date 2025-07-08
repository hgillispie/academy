import { TypeFormButton } from './TypeFormButton';

export interface SurveyCardProps {
  title: string;
  description: string;
  buttonText: string;
  typeformId: string;
}

export function SurveyCard({ title, description, buttonText, typeformId }: SurveyCardProps) {
  return (
    <div className="bg-[#f5f0ff] p-6 rounded-lg border border-[#a97ff2] mb-8">
      <h2 className="text-xl font-medium mb-2 text-black">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <TypeFormButton id={typeformId} buttonText={buttonText} />
    </div>
  );
}
