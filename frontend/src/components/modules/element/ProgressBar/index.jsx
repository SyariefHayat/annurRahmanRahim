import React from 'react'

const ProgressBar = ({ targetAmount, collectedAmount }) => {
    const percentage = Math.round((collectedAmount / targetAmount) * 100);
    
    return (
        <div className="w-full h-2 rounded-md bg-gray-300 my-2">
            <div
                style={{ width: `${percentage}%` }} 
                className="h-full bg-sky-500 rounded-md"
            />
        </div>
    )
}

export default ProgressBar