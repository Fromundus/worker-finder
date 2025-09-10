import React from 'react'
import { Button } from '../ui/button'

type Props = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string;
    disabled?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const IconButton = ({ children, onClick, className, disabled, variant }: Props) => {
  return (
    <Button className={`${className} w-10 h-10`} onClick={onClick} disabled={disabled} variant={variant}>
        {children}
    </Button>
  )
}

export default IconButton
