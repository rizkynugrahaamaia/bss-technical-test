'use client'

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation" // Untuk redirect setelah simpan
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormValues } from "@/types/schema" // Pastikan import ini ada
import { useCreateProduct, useUpdateProduct, type Product } from "@/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Tambahkan Props
interface ProductFormProps {
  initialData?: Product | null // PERBAIKAN: Ganti 'any' jadi 'Product | null'
  isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {

  const router = useRouter()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct() // Hook update

  // PERBAIKAN: Hapus <ProductFormValues> dari sini
  // Biarkan resolver yang menentukan tipenya agar tidak konflik dengan coerce
  const form = useForm({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        price: initialData?.price || 0,
        // PERBAIKAN: Handle null dari database. Jika null, ganti jadi string kosong ""
        description: initialData?.description || "",
        image: initialData?.image || "",
      },
    })

  // Tipe values di sini akan otomatis terdeteksi sebagai ProductFormValues
  function onSubmit(values: ProductFormValues) {
      if (isEdit && initialData) {
        // MODE EDIT
        updateMutation.mutate({ id: initialData.id, values }, {
          onSuccess: () => router.push('/dashboard') // Balik ke dashboard
        })
      } else {
        // MODE CREATE
        createMutation.mutate(values, {
          onSuccess: () => {
            form.reset()
            router.push('/dashboard') // Balik ke dashboard
          }
        })
      }
    }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-8 rounded-lg bg-white">
        <h3 className="text-lg font-semibold text-center mb-8">{isEdit ? "Edit Produk" : "Tambah Produk"}</h3>
      
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Gitar Yamaha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (Unik)</FormLabel>
                <FormControl>
                  <Input placeholder="gitar-yamaha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga</FormLabel>
                <FormControl>
                    <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                        // Menggunakan e.target.value agar bisa mendeteksi string kosong
                        // Jika kosong (""), set ke 0. Jika ada angka, parse ke float.
                        const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                        field.onChange(val);
                     }}
                        // PERBAIKAN: Tambahkan (field.value as number) agar TypeScript tahu ini pasti angka
                        value={(field.value as number) === 0 ? "" : (field.value as number)}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan detail produk..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/foto-produk.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
            <Button className="flex-1 cursor-pointer" type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                Batal
            </Button>
            <Button className="flex-1 cursor-pointer bg-[#FBBC05] text-white hover:bg-[#fba300] transition" type="submit" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : (isEdit ? "Update" : "Simpan")}
            </Button>
        </div>
      </form>
    </Form>
  )
}