'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Ambil data dari form
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Kirim ke Supabase Auth
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?message=Gagal login, periksa email/password')
  }

  // Jika sukses, refresh cache & redirect ke dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/register?message=Gagal mendaftar')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}