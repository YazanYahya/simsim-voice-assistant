import Link from "next/link"
import {Button} from "@/components/ui/button"
import {ArrowLeft} from "lucide-react"
import Image from "next/image"

export function AdminHeader() {
    return (
            <header className="border-b bg-background sticky top-0 z-10">
                <div className="container mx-auto py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Image src="/images/simsim-logo.png" alt="Simsim Logo" width={60} height={60} className="mr-2"/>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Back to App
                        </Link>
                    </Button>
                </div>
            </header>
    )
}
