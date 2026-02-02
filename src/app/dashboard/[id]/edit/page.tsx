'use client'

import { ProductForm } from "@/components/product-form"
import { useProduct } from "@/hooks/useProducts"
import { useParams } from "next/navigation"

export default function EditProductPage() {

  const params = useParams()
  const id = params.id as string

  const { data: product, isLoading, isError } = useProduct(id)

  if (isLoading) return <div className="p-8">Loading data...</div>
  if (isError) return <div className="p-8 text-red-500">Gagal memuat data.</div>

  return (
    <div className="max-w-2xl mx-auto p-8">
      <ProductForm initialData={product} isEdit={true} />
    </div>
  )
}