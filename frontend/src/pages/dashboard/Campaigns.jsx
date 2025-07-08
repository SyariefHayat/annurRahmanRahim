import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import { allCampaignsAtom } from '@/jotai/atoms'
import useCampaignFilters from '@/hooks/useCampaignFilters'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import CampaignDbTable from '@/components/modules/campaign/CampaignDbTable'
import CampaignDbToolbar from '@/components/modules/campaign/CampaignDbToolbar'
import CampaignDbPagination from '@/components/modules/campaign/CampaignDbPagination'
import DeleteCampaignDialog from '@/components/modules/dashboard/DeleteCampaignDialog'

const Campaigns = () => {
    const { userData } = useAuth()
    const [campaigns] = useAtom(allCampaignsAtom)
    const navigate = useNavigate()
    
    const [DeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState([])

    const {
        searchQuery,
        filterCampaign,
        currentPage,
        totalPages,
        itemsPerPage,
        filteredCampaigns,
        currentItems,
        handleSearchChange,
        handleFilterChange,
        handlePageChange
    } = useCampaignFilters(campaigns)

    const handleAddCampaign = () => {
        navigate(`/dashboard/program/sosial/create/${userData._id}`)
    }

    const handleViewDetail = (campaign) => {
        navigate(`/program/sosial/${campaign._id}`)
    }

    const handleEdit = (campaign) => {
        navigate(`/dashboard/program/sosial/edit/${campaign._id}`)
    }

    const handleDelete = (campaign) => {
        setSelectedCampaign(campaign)
        setDeleteDialogOpen(true)
    }

    return (
        <DashboardLayout>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <CampaignDbToolbar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    filterCampaign={filterCampaign}
                    onFilterChange={handleFilterChange}
                    onAddCampaign={handleAddCampaign}
                />

                <CampaignDbTable
                    campaigns={currentItems}
                    onViewDetail={handleViewDetail}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {filteredCampaigns.length > 0 && (
                    <CampaignDbPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredCampaigns.length}
                        onPageChange={handlePageChange}
                    />
                )}
                
                <DeleteCampaignDialog 
                    selectedCampaign={selectedCampaign}
                    setSelectedCampaign={setSelectedCampaign}
                    deleteDialogOpen={DeleteDialogOpen}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                />
            </div>
        </DashboardLayout>
    )
}

export default Campaigns