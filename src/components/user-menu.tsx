"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full cursor-pointer hover:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
        >
        <Link href='/settings' className="flex">
        <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </Link>
         
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}