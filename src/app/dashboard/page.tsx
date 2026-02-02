import Link from 'next/link'
import ProductTable from '@/components/product-table'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { LogoutForm } from '@/components/logout-form'


export default async function DashboardPage() {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto p-8 max-w-6xl">

      <div className="flex justify-between items-center mb-8 bg-[#4285F4] p-4 rounded-md">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
           <p className="text-blue-100 mt-1">
             Hello, <span className="font-medium text-white">{user ? user.email : 'User'}</span>
           </p>
        </div>

        <LogoutForm />

      </div>

      <div className="p-4 space-y-8 border-2 rounded-lg">
        <section>
          <div className='mb-4 flex justify-between items-center'>
            <h2 className="text-xl font-semibold">Daftar Produk</h2>
            <Link href="/dashboard/create">
              <Button className="cursor-pointer bg-[#FBBC05] text-white hover:bg-[#fba300] transition">
                + Tambah Produk
              </Button>
            </Link>
          </div>

          <ProductTable />
        </section>
      </div>

    </div>
  )
}