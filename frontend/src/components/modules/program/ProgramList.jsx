import { LIST_PROGRAM } from '@/constants/listProgram'
import EachUtils from '@/utils/EachUtils'
import React from 'react'
import ProgramCard from './ProgramCard'

const ProgramList = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 border-t border-gray-300 pt-10 sm:my-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <EachUtils 
          of={LIST_PROGRAM}
          render={(item, index) => (
            <ProgramCard key={index} item={item} />
          )}
        />
      </div>
    </div>
  )
}

export default ProgramList