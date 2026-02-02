import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Setup Response Awal
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Setup Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          
          supabaseResponse = NextResponse.next({
            request,
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Cek User (PENTING: Jangan dihapus, ini merefresh session)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- LOGIC REDIRECT GLOBAL ---
  
  const url = request.nextUrl.clone()
  const { pathname } = url

  // A. SKENARIO ROOT (/): Cek login
  if (pathname === '/') {
    if (user) {
      // Sudah login -> Dashboard
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    } else {
      // Belum login -> Login
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // B. SKENARIO AUTH PAGE (/login & /register): Jika sudah login, tendang ke dashboard
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (user) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // C. SKENARIO PROTECTED (/dashboard): Jika belum login, tendang ke login
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Jika tidak ada redirect, kembalikan response aslinya
  return supabaseResponse
}