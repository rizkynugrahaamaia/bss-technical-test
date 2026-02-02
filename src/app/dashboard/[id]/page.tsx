'use client'

import { useProduct } from "@/hooks/useProducts"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Tag } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: product, isLoading, isError } = useProduct(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 animate-pulse">Memuat detail produk...</p>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500">Gagal memuat data produk.</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    )
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price)

  const formattedDate = new Date(product.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Dashboard
      </Button>

      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-0">
          
          <div className="bg-gray-100 flex items-center justify-center min-h-75 p-4 border-r">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-100 w-auto object-contain rounded-md shadow-sm"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <span className="text-4xl">🖼️</span>
                <span className="text-sm mt-2">Tidak ada gambar</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                   <CardDescription className="flex items-center gap-1 mb-2">
                    <Calendar className="h-3 w-3" /> {formattedDate}
                   </CardDescription>
                   <CardTitle className="text-3xl font-bold text-gray-800">{product.name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs uppercase tracking-wider">
                  #{product.slug}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 pt-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Harga Satuan</p>
                <div className="text-2xl font-bold text-green-600">
                  {formattedPrice}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-500 mb-2 font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Deskripsi Produk
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description || "Tidak ada deskripsi yang tersedia untuk produk ini."}
                </p>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 border-t pt-6 pb-6">
                <p className="text-xs text-gray-400 w-full text-center">
                  Product ID: {product.id}
                </p>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}