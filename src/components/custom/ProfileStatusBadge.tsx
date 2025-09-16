import { Badge, BadgeAlert, BadgeCheck } from 'lucide-react'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const ProfileStatusBadge = ({ status }: { status: string }) => {
  return (
    <>
        <Tooltip>
            <TooltipTrigger>
                {status === "active" && <BadgeCheck className='text-blue-500' />}
                {status === "pending" && <Badge className='text-orange-500' />}
                {status === "inactive" && <BadgeAlert className='text-red-500' />}
            </TooltipTrigger>
            <TooltipContent>
                {status === "active" && <p className='text-blue-500'>Verified account</p>}
                {status === "pending" && <p className='text-orange-500'>Pending account</p>}
                {status === "inactive" && <p className='text-red-500'>Inactive account</p>}
            </TooltipContent>
        </Tooltip>
    </>
  )
}

export default ProfileStatusBadge
