import React from 'react'

import ProgramCard from './ProgramCard'
import EachUtils from '@/utils/EachUtils'
import ProgramCardSkeleton from './ProgramCardSkeleton'

const ProgramList = ({ loading, programData }) => {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:my-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <ProgramCardSkeleton key={index} />
                    ))
                ) : programData && programData.length > 0 ? (
                    <EachUtils 
                        of={programData}
                        render={(item, index) => <ProgramCard key={index} item={item} />}
                    />
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20">
                        <div className="text-center">
                            <svg 
                                className="mx-auto h-24 w-24 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                                />
                            </svg>
                            <h3 className="mt-6 text-lg font-semibold text-gray-900">
                                Belum ada program
                            </h3>
                            <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto">
                                Program akan ditampilkan di sini ketika tersedia.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProgramList