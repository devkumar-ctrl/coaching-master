
"use client"

import { signOut } from "next-auth/react"
import { Button } from "../ui/button"
import { LogOut } from "lucide-react"
 
export default function SignOut() {
  return (
    <Button 
      onClick={() => signOut({ callbackUrl: "/" })} 
      variant="ghost" 
      className="w-full justify-start p-0 h-auto font-normal"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}