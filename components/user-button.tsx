"use client"

import {Avatar, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {LogOut} from "lucide-react"

export function UserButton() {
    return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src="/placeholder.svg" alt="User"/>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">John Doe</p>
                            <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4"/>
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
    )
}
