"use client"

import type React from "react"
import {useState} from "react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Loader2} from "lucide-react"
import {motion} from "framer-motion"
import Image from "next/image"

interface AdminLoginProps {
    onLogin: () => void
}

export function AdminLogin({onLogin}: AdminLoginProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Mock authentication
        setTimeout(() => {
            if (email === "admin@example.com" && password === "password") {
                onLogin()
            } else {
                setError("Invalid email or password")
                setIsLoading(false)
            }
        }, 1000)
    }

    return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
                <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                    <Card className="w-full max-w-md shadow-lg">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-center mb-4">
                                <Image src="/images/simsim-logo.png" alt="Simsim Logo" width={120} height={120}/>
                            </div>
                            <CardTitle className="text-2xl text-center text-[#1e2761]">Admin Login</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access the admin dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                    />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full bg-[#4e68d7] hover:bg-[#3f56c8]"
                                        disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : null}
                                    {isLoading ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-xs text-muted-foreground">Demo credentials: admin@example.com /
                                password</p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
    )
}
