import Link from 'next/link';
import { Button } from '../common/Button';

export interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface ActionCardsProps {
  cards: ActionCardProps[];
}

export function ActionCards({ cards }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-black">
      {cards.map((card, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-medium mb-4 text-black">{card.title}</h2>
          <p className="mb-4 text-gray-600 !important">{card.description}</p>
          <Link href={card.buttonLink} legacyBehavior passHref>
            <a className="inline-block">
              <Button className="px-4 py-2 w-full">{card.buttonText}</Button>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
