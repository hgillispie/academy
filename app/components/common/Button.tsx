import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`bg-[#a97ff2] text-white px-6 py-2 rounded-full hover:bg-[#9665d8] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
