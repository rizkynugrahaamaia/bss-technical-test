import { createClient } from '@/utils/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProductFormValues } from '@/types/schema'

export type Product = {
  id: string
  name: string
  price: number
  description: string | null
  image: string | null
  slug: string
}

export const useProducts = (page: number, search: string, limit: number) => {
  const supabase = createClient()

  return useQuery({
   queryKey: ['products', 'user-specific', page, search, limit],
    
   queryFn: async () => {

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { data: [], count: 0 }

      const from = (page - 1) * limit
      const to = from + limit - 1

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error, count } = await query

      console.log('🔍 CEK DATA SUPABASE:', { data, count, error })

      if (error) {
        throw new Error(error.message)
      }

      return { data, count }
    },
  })
}

export const useCreateProduct = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User tidak terautentikasi")

      const { data, error } = await supabase.from('products').insert({
        name: values.name,
        description: values.description,
        price: values.price,
        slug: values.slug,
        image: values.image,
        user_id: user.id
      }).select()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      alert("Produk berhasil ditambahkan!")
    },
    onError: (error) => {
      alert(error.message)
    }
  })
}

export const useProduct = (id: string) => {
  const supabase = createClient()
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!id,
  })
}

export const useUpdateProduct = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: ProductFormValues }) => {
      const { data, error } = await supabase
        .from('products')
        .update({
            name: values.name,
            description: values.description,
            price: values.price,
            slug: values.slug,
            image: values.image,
        })
        .eq('id', id)
        .select()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      alert("Produk berhasil diupdate!")
    },
    onError: (err) => alert(err.message),
  })
}

export const useDeleteProduct = () => {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err) => alert(err.message),
  })
}