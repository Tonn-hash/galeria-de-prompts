"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useSession } from "@/components/SessionProvider"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link" // Import Link

export function AuthActions() {
  const router = useRouter()
  const supabase = createClient()
  const { session, loading } = useSession()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error logging out:", error)
    } else {
      router.push("/login")
    }
  }

  if (loading) {
    return <Skeleton className="h-10 w-24 rounded-md" />
  }

  if (session) {
    const userEmail = session.user?.email || "Usuário"
    const avatarFallback = userEmail.charAt(0).toUpperCase()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userEmail}`} alt={userEmail} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-gray-900 text-white border-gray-700 rounded-lg shadow-lg"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-gray-100">{userEmail}</p>
              <p className="text-xs leading-none text-gray-400">{session.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
            <Link href="/profile">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
            <Link href="/favorites">Favoritos</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-700 text-white">
      Login
    </Button>
  )
}
