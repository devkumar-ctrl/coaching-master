"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
 
export default function SignIn() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.push("/auth/signin")} 
      className="flex rounded-2xl items-center space-x-2"
    >
      Sign In
    </Button>
  )
}