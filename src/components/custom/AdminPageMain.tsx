import React from 'react'

type Props = {
    children: React.ReactNode;
    topAction?: React.ReactNode;
    title: string;
    description: string;
}

const AdminPageMain = ({ children, topAction, title, description }: Props) => {
  return (
    <div className="space-y-6">
      {/* Search + Bulk Actions */}
      <div className="flex gap-6 flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="space-x-4">
            {topAction}
        </div>
      </div>
      {children}
    </div>
  )
}

export default AdminPageMain
