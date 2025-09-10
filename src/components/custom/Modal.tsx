import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

type Props = {
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    title?: string;
    children?: React.ReactNode;
    buttonLabel?: React.ReactNode;
    buttonClassName?: string;
    disabled?: boolean;
    labelIsNotButton?: boolean;
}

const Modal = ({ open, setOpen, title, buttonLabel, buttonClassName, children, disabled, labelIsNotButton }: Props) => {
  return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* <DialogTrigger asChild> */}
                {labelIsNotButton ? 
                <button onClick={() => setOpen(true)} disabled={disabled}>
                    {buttonLabel}   
                </button>
                :
                <Button className={`${buttonClassName}`} disabled={disabled} onClick={() => setOpen(true)}>
                    {buttonLabel}
                </Button>}
            {/* </DialogTrigger> */}
            <DialogContent aria-describedby=''>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>

        // <Dialog open={open} onOpenChange={setOpen}>
        //     <DialogTrigger asChild>
        //         <Button className={buttonClassName}>
        //         {buttonLabel}
        //         </Button>
        //     </DialogTrigger>
        //     <DialogContent className="max-h-[80vh] overflow-y-auto">
        //         <DialogHeader>
        //         <DialogTitle>{title}</DialogTitle>
        //         </DialogHeader>
        //         <div className="space-y-4 mt-4">
        //             {children}
        //         </div>
        //     </DialogContent>
        // </Dialog>
  )
}

export default Modal
