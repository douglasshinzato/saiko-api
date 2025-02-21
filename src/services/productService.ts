//O serviço centraliza as operações relacionadas ao banco de dados.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function registerNewProduct(data: {
  // barcode: string
  brand: string
  name: string
  category: string
  description?: string
  price: number
}) {
  const existingProduct = await prisma.products.findUnique({
    where: { name: data.name },
  })

  if (existingProduct) {
    throw new Error('Produto já cadastrado')
  }

  return prisma.products.create({ data })
}

export async function getAllProducts() {
  const products = await prisma.products.findMany() // Busca todos os produtos cadastrados no banco

  return products.map((product) => ({
    ...product,
    price: Number(product.price).toFixed(2), // Converte e mantém 2 casas decimais
  }))
}

export async function updateProduct(
  id: string,
  data: {
    brand?: string
    name?: string
    category?: string
    description?: string
    price?: number
  }
) {
  const existingProduct = await prisma.products.findUnique({
    where: { id },
  })

  if (!existingProduct) {
    throw new Error('Produto não encontrado')
  }

  return prisma.products.update({
    where: { id },
    data,
  })
}
