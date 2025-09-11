import React from 'react'
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children?: React.ReactNode;
    className?: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
}

const ButtonWithLoading = ({ loading, disabled, children, className, variant, ...props }: ButtonProps) => {
  return (
    <div>
      <Button
        variant={variant}
        className={className}
        disabled={disabled}
        {...props}
      >
        {loading ? <Loader className='animate-spin' /> : children}
      </Button>
    </div>
  )
}

export default ButtonWithLoading
