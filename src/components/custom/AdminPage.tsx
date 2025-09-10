import React from 'react'
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardTitle } from '../ui/card';

type Props = {
    children: React.ReactNode, 
    className?: string;
    withBackButton?: boolean;
    backbuttonAction?: () => void;
    title?: string;
    description?: string;
    titleAction?: React.ReactNode;
}

const AdminPage = ({ children, className, withBackButton, backbuttonAction, title, description, titleAction }: Props) => {
    const navigate = useNavigate();
    
    return (
        <div className={`${className}`}>
            {withBackButton && <div className='flex gap-6 flex-col lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex gap-4 flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <Button className='w-fit' variant='outline' type='button' onClick={() => backbuttonAction ? backbuttonAction : navigate(-1)}>
                        <ArrowLeft /> Back
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div>
                    {titleAction}
                </div>
            </div>}
            <div className={`${withBackButton && "mt-6"} flex flex-col gap-6`}>
                {children}
            </div>
        </div>
    )
}

export default AdminPage
