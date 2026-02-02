'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useProducts, type Product } from '@/hooks/useProducts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteProduct } from '@/hooks/useProducts'

export default function ProductTable() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  // 1. Ambil State dari URL (Default Value jika tidak ada)
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ''
  const limit = Number(searchParams.get('limit')) || 5

  // 2. Fetch Data
  const { data, isLoading, isError } = useProducts(page, search, limit)

  // 3. Logic Update URL (Search)
  // Kita gunakan debounce manual sederhana agar tidak reload setiap ketik huruf
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    params.set('page', '1') // Reset ke halaman 1 jika search berubah
    replace(`${pathname}?${params.toString()}`)
  }

  // 4. Logic Update URL (Pagination & Limit)
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    if (key === 'limit') params.set('page', '1') // Reset page jika limit berubah
    replace(`${pathname}?${params.toString()}`)
  }

  // Hitung Total Halaman
  const totalPages = data?.count ? Math.ceil(data.count / limit) : 1

//   console.log('ProductTable render with', data ? data: 'no data')

const deleteMutation = useDeleteProduct()

  return (
    <div className="space-y-4">
      {/* --- TOOLBAR (Search & Limit) --- */}
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Cari produk..."
          defaultValue={search}
          onChange={(e) => {
            // Delay search 500ms agar user selesai mengetik dulu
            setTimeout(() => handleSearch(e.target.value), 500)
          }}
          className="max-w-sm"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select 
            value={limit.toString()} 
            onValueChange={(val) => updateParam('limit', val)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="rounded-md border bg-gray-50 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="">Price</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            )}
            
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                  Gagal memuat data.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && data?.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada produk ditemukan.
                </TableCell>
              </TableRow>
            )}

            {data?.data?.map((product: Product) => (
              <TableRow key={product.id}>

                <TableCell>
                  {product.image ? (
                   // Gunakan img tag biasa agar mudah (Next/Image butuh config domain)
                   // eslint-disable-next-line @next/next/no-img-element
                   <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No img</div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-gray-500">{product.slug}</TableCell>
                <TableCell className="">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                </TableCell>
                 
                <TableCell className="text-center">

                  <div className="flex items-center justify-center gap-2">

                    <Link href={`/dashboard/${product.id}`}>
                      <Button className="w-20 cursor-pointer border-2 border-[#007bff] bg-white text-[#007bff] hover:bg-[#007bff] hover:text-white " size="sm">
                        Detail
                      </Button>
                    </Link>

                    {/* Tombol Edit */}
                    <Link href={`/dashboard/${product.id}/edit`}>
                      <Button className="w-20 cursor-pointer" variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>

                    {/* Tombol Delete dengan Konfirmasi */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-20 cursor-pointer" variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                          {deleteMutation.isPending ? "..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Produk <b>{product.name}</b> akan dihapus permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteMutation.mutate(product.id)}
                          >
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Halaman {page} dari {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParam('page', String(page - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParam('page', String(page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}