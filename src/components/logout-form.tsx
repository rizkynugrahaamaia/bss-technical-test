'use client'

import { logout } from "@/app/(auth)/actions"
import { SubmitButton } from "@/components/submit-button"
import { useQueryClient } from "@tanstack/react-query"

export function LogoutForm() {
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    queryClient.removeQueries()
    queryClient.clear()
    await logout()
  }

  return (
    <form action={handleLogout}>
      <SubmitButton 
        text="Logout" 
        loadingText="Keluar..." 
        variant="outline" 
        className="bg-white text-black hover:bg-gray-100 border-none"
      />
    </form>
  )
}