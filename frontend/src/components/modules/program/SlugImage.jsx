import React from 'react';
import { useAtom } from 'jotai';

import { programDataAtom } from '@/jotai/atoms';

const SlugImage = () => {
    const [programData] = useAtom(programDataAtom);

    return (
        <div className="lg:col-span-1">
            <img
                src={programData.image}
                alt={programData.title}
                className="w-full h-64 lg:h-full object-cover rounded-lg shadow-md"
            />
        </div>
    );
};

export default SlugImage;