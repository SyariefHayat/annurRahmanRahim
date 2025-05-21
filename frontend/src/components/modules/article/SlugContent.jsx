import React from 'react'

import EachUtils from '@/utils/EachUtils'
import { ScrollArea } from '@/components/ui/scroll-area'

const SlugContent = ({ article }) => {
    return (
        <ScrollArea className="pr-4">
            <div className="space-y-6 mb-8">
                <EachUtils 
                    of={article.content}
                    render={(item, index) => {
                        if (item.type === "heading-1") {
                            return (
                                <h2 key={index} className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4">
                                {item.value}
                                </h2>
                            )
                        }

                        if (item.type === "heading-2") {
                            return (
                                <h3 key={index} className="text-xl sm:text-2xl font-semibold text-slate-900 mt-8 mb-3">
                                {item.value}
                                </h3>
                            )
                        }

                        if (item.type === "heading-3") {
                            return (
                                <h4 key={index} className="text-lg sm:text-xl font-medium text-slate-900 mt-6 mb-2">
                                {item.value}
                                </h4>
                            )
                        }

                        if (item.type === "text") {
                            return (
                                <p key={index} className="text-slate-600 leading-relaxed">
                                {item.value}
                                </p>
                            )
                        }

                        if (item.type === "image") {
                            return (
                                <figure key={index} className="my-8">
                                <img 
                                    src={`${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}${item.value}`} 
                                    alt="Article image" 
                                    className="w-full h-auto object-cover rounded-lg shadow-sm" 
                                />
                                </figure>
                            )
                        }
                    }}
                />
            </div>
        </ScrollArea>
    )
}

export default SlugContent