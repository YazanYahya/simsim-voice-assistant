"use client"

import {useEffect, useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Skeleton} from "@/components/ui/skeleton"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Calendar, Clock, Play, Search, User} from "lucide-react"
import {motion} from "framer-motion"

type Call = {
    id: string
    user: string
    timestamp: string
    duration: string
    question: string
    response: string
    topic: string
}

export function AdminCalls() {
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [calls, setCalls] = useState<Call[]>([])

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false)
            setCalls(mockCalls)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const filteredCalls = calls.filter(
            (call) =>
                    call.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    call.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    call.topic.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const playAudio = (id: string) => {
        console.log(`Playing audio for call ${id}`)
    }

    return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold dark:text-[#f9b23d] text-[#1e2761]">Recent Calls</h2>

                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                                placeholder="Search calls..."
                                className="pl-8 w-[250px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Call History</CardTitle>
                        <CardDescription>
                            {isLoading
                                    ? "Loading calls..."
                                    : filteredCalls.length === 0
                                            ? "No calls found"
                                            : `Showing ${filteredCalls.length} calls`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            {isLoading ? (
                                    <div className="space-y-4">
                                        {Array(5)
                                                .fill(null)
                                                .map((_, i) => (
                                                        <div key={i} className="border rounded-lg p-4">
                                                            <div className="flex justify-between mb-2">
                                                                <Skeleton className="h-4 w-32"/>
                                                                <Skeleton className="h-4 w-24"/>
                                                            </div>
                                                            <Skeleton className="h-16 w-full"/>
                                                        </div>
                                                ))}
                                    </div>
                            ) : filteredCalls.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">No calls matching your
                                        search</div>
                            ) : (
                                    <motion.div
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            transition={{duration: 0.5}}
                                            className="space-y-4"
                                    >
                                        {filteredCalls.map((call, index) => (
                                                <motion.div
                                                        key={call.id}
                                                        initial={{opacity: 0, y: 20}}
                                                        animate={{opacity: 1, y: 0}}
                                                        transition={{delay: index * 0.05, duration: 0.3}}
                                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline"
                                                                   className="bg-[#4e68d7]/10 text-[#4e68d7] border-[#4e68d7]/30">
                                                                {call.topic}
                                                            </Badge>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <User className="h-3 w-3 mr-1"/>
                                                                {call.user}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-3 w-3 mr-1"/>
                                                                {call.timestamp}
                                                            </div>
                                                            <div className="flex items-center">
                                                                <Clock className="h-3 w-3 mr-1"/>
                                                                {call.duration}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 mt-3">
                                                        <div>
                                                            <div className="text-xs font-medium text-muted-foreground mb-1">User
                                                                Question:
                                                            </div>
                                                            <p className="text-sm bg-muted p-2 rounded-md">{call.question}</p>
                                                        </div>

                                                        <div>
                                                            <div className="text-xs font-medium text-muted-foreground mb-1">Simsim
                                                                Response:
                                                            </div>
                                                            <p className="text-sm bg-muted p-2 rounded-md">{call.response}</p>
                                                        </div>

                                                        <div className="flex justify-end">
                                                            <Button variant="outline" size="sm"
                                                                    onClick={() => playAudio(call.id)}>
                                                                <Play className="h-3 w-3 mr-2"/>
                                                                Play Audio
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                        ))}
                                    </motion.div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
    )
}

// Mock data
const mockCalls: Call[] = [
    {
        id: "1",
        user: "john@example.com",
        timestamp: "Today, 10:23 AM",
        duration: "0:42",
        question: "What's the status of invoice #1234?",
        response:
                "Invoice #1234 was sent on May 2nd and is due on June 2nd. The current status is 'Pending Payment'. Would you like me to send a reminder to the client?",
        topic: "Invoices",
    },
    {
        id: "2",
        user: "sarah@example.com",
        timestamp: "Today, 9:15 AM",
        duration: "1:05",
        question: "Can you schedule a meeting with the design team for tomorrow?",
        response:
                "I've scheduled a meeting with the design team for tomorrow at 2:00 PM. I've sent calendar invites to all team members. Would you like me to add an agenda to the invitation?",
        topic: "Scheduling",
    },
    {
        id: "3",
        user: "mike@example.com",
        timestamp: "Yesterday, 3:45 PM",
        duration: "0:38",
        question: "What's our current account balance?",
        response:
                "Your current account balance is $12,458.32. There are 3 pending transactions totaling $345.67. Would you like to see the recent transaction history?",
        topic: "Finances",
    },
    {
        id: "4",
        user: "lisa@example.com",
        timestamp: "Yesterday, 1:20 PM",
        duration: "0:55",
        question: "Send an invoice to Acme Corp for the website project",
        response:
                "I've prepared an invoice for Acme Corp for the website project. The total amount is $3,500. Would you like to review it before I send it?",
        topic: "Invoices",
    },
    {
        id: "5",
        user: "david@example.com",
        timestamp: "May 3, 2023",
        duration: "1:12",
        question: "What are our business hours this week?",
        response:
                "Your business hours this week are Monday to Friday, 9:00 AM to 5:00 PM. Note that this Friday is a holiday, so the office will be closed. Would you like me to update your website with this information?",
        topic: "General",
    },
]
