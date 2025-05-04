"use client"

import {useState} from "react"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {AdminHeader} from "@/components/admin-header"
import {AdminDashboard} from "@/components/admin-dashboard"
import {AdminCalls} from "@/components/admin-calls"
import {AdminSettings} from "@/components/admin-settings"
import {AdminLogin} from "@/components/admin-login"

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)}/>
    }

    return (
            <div className="min-h-screen flex flex-col">
                <AdminHeader/>

                <main className="flex-1 container mx-auto py-8 px-4">
                    <Tabs defaultValue="dashboard" className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <TabsList>
                                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                                <TabsTrigger value="calls">Calls</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="dashboard">
                            <AdminDashboard/>
                        </TabsContent>

                        <TabsContent value="calls">
                            <AdminCalls/>
                        </TabsContent>

                        <TabsContent value="settings">
                            <AdminSettings/>
                        </TabsContent>
                    </Tabs>
                </main>

                <footer className="border-t py-6">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Simsim AI Voice Assistant. Admin Dashboard.
                    </div>
                </footer>
            </div>
    )
}
