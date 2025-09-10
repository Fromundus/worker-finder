import React from 'react'
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const ButtonWithLoading = ({ loading, disabled, children, className, ...props }: ButtonProps) => {
  return (
    <div>
      <Button
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
