import {VoiceAssistant} from "@/components/voice-assistant"
import {Button} from "@/components/ui/button"
import {UserButton} from "@/components/user-button"
import Link from "next/link"
import {BarChart3} from "lucide-react"
import Image from "next/image"

export default function Home() {
    return (
            <div className="min-h-screen flex flex-col">
                <header className="border-b bg-background sticky top-0 z-10">
                    <div className="container mx-auto py-3 px-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <Image src="/images/simsim-logo.png" alt="Simsim Logo" width={60} height={60}
                                   className="mr-2"/>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin">
                                    <BarChart3 className="h-4 w-4"/>
                                    Admin
                                </Link>
                            </Button>
                            <UserButton/>
                        </div>
                    </div>
                </header>

                <main className="flex-1 container mx-auto py-8 px-4 flex flex-col items-center justify-center">
                    <div className="w-full max-w-3xl">
                        <VoiceAssistant/>
                    </div>
                </main>

                <footer className="border-t py-6">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Simsim AI Voice Assistant. All rights reserved.
                    </div>
                </footer>
            </div>
    )
}
