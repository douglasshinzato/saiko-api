//O serviço centraliza as operações relacionadas ao banco de dados.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const registerNewProduct = async (data: {
  barcode: string
  brand: string
  name: string
  category: string
  description?: string
  price: number
  stock?: number
}) => {
  const existingProduct = await prisma.products.findUnique({
    where: { barcode: data.barcode },
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

//alterar para poder buscar o produto por barcode, nome, marca, tipo ou descrição
export const findProductByBarcode = async (barcode: string) => {
  return prisma.products.findUnique({ where: { barcode } })
}
//para atualizar o produto, as propriedades devem ser opcionais
export const updateProduct = async (
  barcode: string,
  data: {
    brand?: string
    name?: string
    description?: string
    price?: number
    stock?: number
  }
) => {
  return prisma.products.update({
    where: { barcode },
    data,
  })
}

export const deleteProduct = async (barcode: string) => {
  return prisma.products.delete({ where: { barcode } })
}
