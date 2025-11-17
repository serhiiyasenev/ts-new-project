import type { Dispatch, SetStateAction } from 'react';

interface InputProps {
  value: string;
  // Use a distinct prop name to avoid any accidental confusion with the DOM's onChange
  onValueChange: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

const Input = ({ value, onValueChange }: InputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder="Enter your name"
    />
  );
};

export default Input;