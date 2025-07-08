import { PopupButton } from '@typeform/embed-react';

interface TypeFormButtonProps {
  id: string;
  size?: number;
  buttonText?: string;
  className?: string;
  children?: React.ReactNode;
}

export function TypeFormButton({
  id,
  size = 80,
  buttonText = 'Take Survey',
  className = 'bg-[#a97ff2] text-white px-6 py-2 rounded-full hover:bg-[#9665d8] transition-colors',
  children,
}: TypeFormButtonProps) {
  return (
    <PopupButton id={id} size={size} className={className}>
      {children || buttonText}
    </PopupButton>
  );
}
