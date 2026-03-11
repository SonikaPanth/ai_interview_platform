
import Agent from '@/app/component/agent'
import React from 'react'

function page() {
  return (
    <div>
      <h1 className='mb-9 text-2xl '>Interview Generation</h1>
     <Agent userName='You' userId='id' type='generate'/>
    </div>
  )
}

export default page
