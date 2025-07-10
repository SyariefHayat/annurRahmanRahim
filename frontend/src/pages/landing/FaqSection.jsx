import React from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import EachUtils from '@/utils/EachUtils'
import { LIST_FAQ } from '@/constants/listFaq'
import SectionLayout from '@/components/layouts/SectionLayout'

const FaqSection = () => {
    return (
        <SectionLayout label="Faq Section">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-center text-gray-900 sm:text-5xl mb-10 sm:mb-14">Tanya Jawab Umum</h2>

            <Accordion type="single" collapsible className="w-full">
                <EachUtils
                    of={LIST_FAQ}
                    render={(item, index) => (
                        <AccordionItem key={index} value={index + 1}>
                            <AccordionTrigger className="text-lg/6">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base">{item.answer}</AccordionContent>
                        </AccordionItem>
                    )}
                />
            </Accordion>
        </SectionLayout>
    );
};

export default FaqSection;