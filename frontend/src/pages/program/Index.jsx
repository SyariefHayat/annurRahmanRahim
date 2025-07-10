import React from 'react'

import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import useProgram from '@/hooks/useProgram'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ProgramList from '@/components/modules/program/ProgramList'
import ProgramHeader from '@/components/modules/program/ProgramHeader'
import ProgramPagination from '@/components/modules/program/ProgramPagination'

const Program = () => {
    const { loading, programData, pagination, currentPage, setCurrentPage } = useProgram();
    
    return (
        <DefaultLayout>
            <Navbar />
            <ProgramHeader />
            <main className="relative">
                <ProgramList loading={loading} programData={programData} />
                <ProgramPagination
                    pagination={pagination}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </main>
            <Footer />
        </DefaultLayout>
    )
}

export default Program