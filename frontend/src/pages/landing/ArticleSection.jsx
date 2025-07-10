import React from 'react'

import EachUtils from '@/utils/EachUtils'
import { getInitial } from '@/utils/getInitial'
import { LIST_ARTICLE } from '@/constants/listArticle'
import SectionLayout from '@/components/layouts/SectionLayout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ArticleSection = () => {
    return (
        <SectionLayout label="Article Section">
            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Berita dan Cerita Terbaru</h2>
                <p className="mt-2 text-lg/8 text-gray-600">Ikuti perjalanan kami dalam menyebarkan kebaikan melalui berbagai program dan inisiatif.</p>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-300 pt-10 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                <EachUtils
                    of={LIST_ARTICLE}
                    render={(item, index) => (
                        <article key={index} className="flex max-w-xl flex-col items-start justify-between">
                            <figure className="w-full h-full rounded-xl overflow-hidden mb-4">
                                <img src="/1.jpg" alt={item.title} className="w-full h-full object-cover object-center" />
                            </figure>

                            <div>
                                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{item.description}</p>
                            </div>

                            <div className="relative mt-8 flex items-center gap-x-4">
                                <Avatar className="size-10 bg-gray-50">
                                    <AvatarImage src={item.author.imageUrl} />
                                    <AvatarFallback>{getInitial(item.author?.name)}</AvatarFallback>
                                </Avatar>

                                <div className="text-sm/6">
                                    <p className="relative font-semibold text-gray-900">
                                        <span>
                                            {item.author.name}
                                        </span>
                                    </p>
                                    <time dateTime={item.datetime} className="text-gray-500">
                                        {item.date}
                                    </time>
                                </div>
                            </div>
                        </article>
                    )}
                />
            </div>
        </SectionLayout>
    );
};

export default ArticleSection;