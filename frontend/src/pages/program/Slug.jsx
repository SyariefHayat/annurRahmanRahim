import React from 'react';
import { useAtom } from 'jotai';
import { useParams } from 'react-router-dom';

import Navbar from '../landing/Navbar';
import { programDataAtom } from '@/jotai/atoms';
import { useProgramDetail } from '@/hooks/useProgramDetail';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import SlugDetail from '@/components/modules/program/SlugDetail';
import SlugSkeleton from '@/components/modules/program/SlugSkeleton';

const Slug = () => {
    const { id } = useParams();
    const { loading } = useProgramDetail(id);
    const [programData] = useAtom(programDataAtom);

    return (
        <DefaultLayout>
            <Navbar position="relative" textColor="text-gray-900" />
            {loading ? (
                <SlugSkeleton />
            ) : (
                programData && (
                    <SlugDetail />
                )
            )}
        </DefaultLayout>
    );
};

export default Slug;