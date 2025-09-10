import React from 'react'
import { Badge } from '../ui/badge'

const PatientStatusBadge = ({ status }: { status: string }) => {
  return (
    <>
        <Badge className={`
            ${(status === "Severe" || status === "Stunted" || status === "Underweight" || status === "Overweight" || status === "Wasted" || status === "Obese" ) && "bg-red-500"}    
            ${(status === "Moderate" || status === "Tall") && "bg-orange-500"}    
            ${status === "At Risk" && "bg-yellow-500"}    
            ${(status === "Healthy" || status === "Normal" ) && "bg-green-500"}    
        `}>{status}</Badge>
    </>
  )
}

export default PatientStatusBadge
