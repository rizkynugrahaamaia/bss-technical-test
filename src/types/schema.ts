import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().optional(),
  price: z.coerce.number().min(100, "Harga minimal 100"),
  slug: z.string().min(3, "Slug wajib diisi"),
  image: z.string().url("Format URL tidak valid").optional().or(z.literal('')), 
})

export type ProductFormValues = z.infer<typeof productSchema>