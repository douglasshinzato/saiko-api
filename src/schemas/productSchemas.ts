//Os schemas de validação garantem a integridade dos dados recebidos.
import { z } from 'zod'

export const createProductSchema = z.object({
  // barcode: z.string().min(1, { message: 'Barcode is required' }),
  barcode: z.string().optional(),
  brand: z.string().min(1, { message: 'Brand is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  description: z.string().optional(),
  price: z.number().positive({ message: 'Price must be a positive number' }),
})

export const updateProductSchema = z.object({
  brand: z.string().optional(),
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  description: z.string().optional(),
  price: z
    .number()
    .positive({ message: 'Price must be a positive number' })
    .optional(),
})
