"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Skeleton} from "@/components/ui/skeleton"
import {AreaChart} from "@/components/ui/chart"

export function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    // Mock data for charts
    const areaChartData = [
        {name: "Mon", value: 12},
        {name: "Tue", value: 18},
        {name: "Wed", value: 15},
        {name: "Thu", value: 25},
        {name: "Fri", value: 32},
        {name: "Sat", value: 20},
        {name: "Sun", value: 14},
    ]

    return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-[#f9b23d] text-[#1e2761]">Dashboard Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                            Array(4)
                                    .fill(null)
                                    .map((_, i) => (
                                            <Card key={i}>
                                                <CardHeader className="pb-2">
                                                    <Skeleton className="h-4 w-24"/>
                                                </CardHeader>
                                                <CardContent>
                                                    <Skeleton className="h-8 w-16"/>
                                                </CardContent>
                                            </Card>
                                    ))
                    ) : (
                            <>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">1,248</div>
                                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">1.8s</div>
                                        <p className="text-xs text-muted-foreground">-0.3s from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">94%</div>
                                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Actions Triggered</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">328</div>
                                        <p className="text-xs text-muted-foreground">+18% from last month</p>
                                    </CardContent>
                                </Card>
                            </>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-5 w-40"/>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <Skeleton className="h-full w-full"/>
                                </CardContent>
                            </Card>
                    ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Conversations Over Time</CardTitle>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <AreaChart
                                            data={areaChartData}
                                            index="name"
                                            categories={["value"]}
                                            colors={["blue"]}
                                            valueFormatter={(value: number) => `${value} calls`}
                                            className="h-full"
                                    />
                                </CardContent>
                            </Card>
                    )}
                </div>
            </div>
    )
}
