'use client'

import { logout } from "@/app/(auth)/actions"
import { SubmitButton } from "@/components/submit-button"
import { useQueryClient } from "@tanstack/react-query"

export function LogoutForm() {
  const queryClient = useQueryClient()

  // Fungsi Wrapper: Client Side Logic + Server Action
  const handleLogout = async () => {
    // 1. Bersihkan Cache (Client Side)
    // Ini mencegah data user A muncul sekejap saat user B login
    queryClient.removeQueries()
    queryClient.clear()

    // 2. Panggil Server Action (Server Side)
    await logout()
  }

  return (
    <form action={handleLogout}>
      {/* Karena kita menggunakan action={handleLogout}, 
         React otomatis mengatur loading state (pending) 
         yang akan dibaca oleh SubmitButton via useFormStatus
      */}
      <SubmitButton 
        text="Logout" 
        loadingText="Keluar..." 
        variant="outline" 
        className="bg-white text-black hover:bg-gray-100 border-none"
      />
    </form>
  )
}