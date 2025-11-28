import MapModal from '@/components/custom/LocationPicker'
import React, { useState } from 'react'

const Test = () => {
  const [data, setData] = useState({});

  console.log(data);

  return (
    <div>
      <MapModal setData={setData} />
    </div>
  )
}

export default Test
