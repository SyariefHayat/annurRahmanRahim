import DefaultLayout from '@/components/layouts/DefaultLayout'
import React from 'react'
import Navbar from '../landing/Navbar'
import ProgramHeader from '@/components/modules/program/ProgramHeader'
import Footer from '../landing/Footer'
import ProgramList from '@/components/modules/program/ProgramList'

const Program = () => {
  return (
    <DefaultLayout>
      <Navbar/>
      <ProgramHeader />
      <main className="relative">
        <ProgramList />
      </main>
      <Footer />
    </DefaultLayout>
  )
}

export default Program