import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import {Toaster} from "@/components/ui/toaster"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Simsim - AI Voice Assistant",
    description: "Your intelligent voice assistant for small businesses"
}

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode
}>) {
    return (
            <html lang="en">
            <body className={inter.className}>
            {children}
            <Toaster/>
            </body>
            </html>
    )
}
