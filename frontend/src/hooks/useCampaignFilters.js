import { useState, useEffect, useMemo } from 'react'

const useCampaignFilters = (campaigns) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterCampaign, setFilterCampaign] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredCampaigns = useMemo(() => {
        return campaigns
            .filter((campaign) => 
                campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (filterCampaign === 'newest') {
                    return new Date(b.createdAt) - new Date(a.createdAt)
                }
                if (filterCampaign === 'lowest') {
                    return new Date(a.createdAt) - new Date(b.createdAt)
                }
                if (filterCampaign === 'collected') {
                    return b.collectedAmount - a.collectedAmount
                }
                return 0
            })
    }, [campaigns, searchQuery, filterCampaign])

    const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / itemsPerPage))

    useEffect(() => {
        setCurrentPage(1)
    }, [campaigns, filterCampaign, searchQuery])

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    }, [totalPages, currentPage])

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage
        const indexOfFirstItem = indexOfLastItem - itemsPerPage
        return filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem)
    }, [filteredCampaigns, currentPage, itemsPerPage])

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleFilterChange = (value) => {
        setFilterCampaign(value)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return {
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
    }
}

export default useCampaignFilters