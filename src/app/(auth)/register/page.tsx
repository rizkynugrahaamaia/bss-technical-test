import { signup } from '@/app/(auth)/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { SubmitButton } from '@/components/submit-button'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#]">Register</h2>
        </div>

        <form action={signup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="admin@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          {/* Menampilkan pesan error jika ada */}
          {params.message && (
            <p className="text-sm text-red-500">{params.message}</p>
          )}

          {/* formAction memungkinkan kita memanggil Server Action dari button */}
            <SubmitButton 
              text="Daftar"
              className="w-full bg-[#007bff] text-white hover:bg-[#006ae6]" 
            />
        </form>
        

        <p className="text-center text-sm">
           Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}