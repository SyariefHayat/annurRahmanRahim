import { Heart } from 'lucide-react'
import React, { useState } from 'react'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

import EachUtils from '@/utils/EachUtils'
import { Toggle } from "@/components/ui/toggle"
import { getInitial } from '@/utils/getInitial'
import { LIST_PRAY } from "@/constants/listPray"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LIST_DONATUR } from '@/constants/listDonatur'

const TabsCampaign = () => {
    const [prayers, setPrayers] = useState([10, 17, 4, 27, 8]);
    const [isPrays, setIsPrays] = useState([false, false, false, false, false]);

    const handleTogglePray = (index) => {
        setPrayers((prev) => {
            const updated = [...prev];
            updated[index] = isPrays[index] ? updated[index] - 1 : updated[index] + 1;
            return updated;
        });

        setIsPrays((prev) => {
            const updated = [...prev];
            updated[index] = !prev[index];
            return updated;
        })
    }

    return (
        <Tabs defaultValue="campaign-donation" className="w-full mt-0 sm:mt-14">
            <TabsList className="gap-4 w-full sm:w-fit">
                <TabsTrigger value="campaign-donation">Donasi <span className="text-blue-500">1000</span></TabsTrigger>
                <TabsTrigger value="campaign-pray">Doa Orang Baik</TabsTrigger>
            </TabsList>

            <TabsContent value="campaign-donation" className="mt-4">
                <ScrollArea className={`${LIST_DONATUR.length > 8 ? "h-[420px]" : "h-auto"} w-full pr-2`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EachUtils
                            of={LIST_DONATUR}
                            render={(item, index) => (
                                <Card key={index}>
                                    <CardContent className="flex items-center gap-x-4">
                                        <Avatar className="w-14 h-14">
                                            <AvatarImage src={item.isAnonim ? "https://github.com/shadcn.png" : item.imageUrl} />
                                            <AvatarFallback>{item.isAnonim ? getInitial("Orang Baik") : getInitial(item.name)}</AvatarFallback>
                                        </Avatar>

                                        <div className="text-sm/6">
                                            <p className="font-semibold text-gray-900">
                                                {item.name}
                                            </p>
                                            <p className="text-gray-600">
                                                Berdonasi sebesar <span className="font-semibold text-gray-900">{item.amount}</span>
                                            </p>
                                            <p className="text-xs/6 text-gray-600">{item.time}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        />
                    </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="campaign-pray" className="mt-4">
                <ScrollArea className={`${LIST_PRAY.length > 5 ? "h-[600px] sm:h-[540px]" : "h-auto"} w-full pr-2`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EachUtils
                            of={LIST_PRAY}
                            render={(item, index) => (
                                <Card key={index} className="gap-2 pb-0">
                                    <CardHeader>
                                        <div className="flex items-center gap-x-4">
                                            <Avatar className="w-14 h-14">
                                                <AvatarImage src={item.isAnonim ? "https://github.com/shadcn.png" : item.imageUrl} />
                                                <AvatarFallback>{item.isAnonim ? getInitial("Orang Baik") : getInitial(item.name)}</AvatarFallback>
                                            </Avatar>

                                            <div className="text-sm/6">
                                                <p className="font-semibold text-gray-900">
                                                    {item.name}
                                                </p>
                                                <p className="text-gray-600">{item.time}</p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex flex-col">
                                            <p className="text-gray-600">{item.pray}</p>
                                            <p className=" text-sm/6 mt-5 text-gray-600"><span className="text-gray-900 font-semibold">{prayers[index]} Orang</span> mengaminkan doa ini</p>
                                        </div>
                                    </CardContent>

                                    <Separator className="mt-2"/>

                                    <CardFooter className="mb-3 mt-1">
                                        <Toggle aria-label="Pray" pressed={isPrays[index]} onPressedChange={() => handleTogglePray(index)} className="mx-auto cursor-pointer">
                                            <Heart className={`${isPrays[index] ? "text-red-400" : ""}`}/> Amin
                                        </Toggle>
                                    </CardFooter>
                                </Card>
                            )}
                        />
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    )
}

export default TabsCampaign