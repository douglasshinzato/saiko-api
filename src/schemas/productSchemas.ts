//Os schemas de validação garantem a integridade dos dados recebidos.
import { z } from 'zod'

export const createProductSchema = z.object({
  // barcode: z.string().min(1, { message: 'Barcode is required' }),
  barcode: z.string().optional(),
  brand: z.string().min(1, 'A marca é obrigatória'),
  name: z.string().min(1, 'O nome do produto é obrigatório'),
  category: z.string().min(1, 'A categoria é obrigatória'),
  description: z.string().optional(),
  price: z
    .string()
    .refine(
      (value) => {
        // Permite os formatos: 1000, 1.000, 1000,00, 1.000,00
        return /^(?:\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value)
      },
      {
        message:
          'Formato de preço inválido. (digite por exemplo: "1000", "1.000", "1000,00" ou "1.000,00")',
      }
    )
    .transform((value) => {
      // Remove os pontos de milhar
      let normalized = value.replace(/\.(?=\d{3}(?:,|$))/g, '')

      // Substitui a vírgula por ponto
      normalized = normalized.replace(',', '.')

      return parseFloat(normalized)
    }),
})

export const getProductByIdSchema = z.object({
  barcode: z.string().optional(),
  brand: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.string(),
})

export const updateProductSchema = z.object({
  barcode: z.string().optional(),
  brand: z.string().min(1, 'A marca é obrigatória').optional(),
  name: z.string().min(1, 'O nome do produto é obrigatório').optional(),
  category: z.string().min(1, 'A categoria é obrigatória').optional(),
  description: z.string().optional(),
  price: z
    .string()
    .refine(
      (value) => {
        return /^(?:\d{1,3}(\.\d{3})*|\d+)(,\d{2})?$/.test(value)
      },
      {
        message:
          'Formato de preço inválido. (digite por exemplo: "1000", "1.000", "1000,00" ou "1.000,00")',
      }
    )
    .transform((value) => {
      let normalized = value.replace(/\.(?=\d{3}(?:,|$))/g, '')
      normalized = normalized.replace(',', '.')
      return parseFloat(normalized)
    })
    .optional(),
})
