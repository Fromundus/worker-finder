import React from 'react'
import { Badge } from '../ui/badge'

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge className={`text-white
        ${status === "active" && "bg-blue-500 hover:bg-blue-600"}
        ${status === "inactive" && "bg-red-500 hover:bg-red-600"}
        ${status === "pending" && "bg-orange-500 hover:bg-orange-600"}
    `}>
        <span className='capitalize'>
            {status === "active" ? "Verified" : status === "inactive" ? "Inactive" : "Pending"}
        </span>
    </Badge>
  )
}

export default StatusBadge
