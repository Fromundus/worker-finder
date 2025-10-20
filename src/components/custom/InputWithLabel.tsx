import React from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    error?: string;
    type?: string;
}

const InputWithLabel = ({ label, containerClassName, labelClassName, inputClassName, error, type, ...props }: InputProps) => {
  const [show, setShow] = React.useState<boolean>(false);

  return (
    <div className={`flex flex-col gap-3 ${containerClassName}`}>
        <div className='flex flex-col gap-3 relative'>
          {label && <Label htmlFor={props.id} className={`${labelClassName} cursor-pointer`}>
              {label}
          </Label>}
          <Input
              type={type === "password" ? show ? "text" : "password" : type}
              className={`${inputClassName}`}
              {...props}
          />
          {type === "password" &&
            <>
              {!show ?
              <EyeOff className='absolute right-3 size-5 bottom-2.5 cursor-pointer' onClick={() => setShow(true)} />
              :
              <Eye className='absolute right-3 size-5 bottom-2.5 cursor-pointer' onClick={() => setShow(false)} />
              }
            </>
          }
        </div>
        {error && <span className='text-destructive text-sm'>{error}</span>}
    </div>
  )
}

export default InputWithLabel
