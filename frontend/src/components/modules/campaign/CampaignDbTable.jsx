import React from 'react'

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table'

import EachUtils from '@/utils/EachUtils'
import CampaignDbTableRow from './CampaignDbTableRow'

const CampaignDbTable = ({ 
    campaigns, 
    onViewDetail, 
    onEdit, 
    onDelete 
}) => {
    return (
        <div className="bg-white rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Terkumpul</TableHead>
                        <TableHead>Donatur</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Berakhir</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.length > 0 ? (
                        <EachUtils 
                            of={campaigns}
                            render={(campaign, index) => (
                                <CampaignDbTableRow
                                    key={index}
                                    campaign={campaign}
                                    onViewDetail={onViewDetail}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            )}
                        />
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                                Tidak ada campaign ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default CampaignDbTable