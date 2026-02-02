'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button' // Pastikan import ButtonProps jika perlu, atau pakai any/type button shadcn
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils' // Utility bawaan shadcn untuk merge class

interface SubmitButtonProps {
  text: string
  loadingText?: string
  className?: string       // Prop baru: untuk custom class
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" // Prop baru: varian tombol shadcn
}

export function SubmitButton({ 
  text, 
  loadingText = "Mohon tunggu...", 
  className, 
  variant = "default" 
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      variant={variant} // Gunakan variant dari props
      // Gunakan cn() untuk menggabungkan class default + class dari props
      className={cn("transition cursor-pointer", className)} 
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  )
}