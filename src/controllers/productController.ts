//Os controladores lidam com a lógica específica de cada rota, incluindo validação com Zod e chamadas ao serviço.
import { FastifyReply, FastifyRequest } from 'fastify'
import * as productService from '../services/productService'
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/productSchemas'
import { ZodError } from 'zod'

export async function registerNewProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // ✅ Valida os dados com Zod
    const data = createProductSchema.parse(request.body)

    // ✅ Chama o serviço para registrar o produto
    const product = await productService.registerNewProduct(data)

    reply.status(201).send(product)
  } catch (error) {
    if (error instanceof ZodError) {
      // ✅ Retorna erro 400 com detalhes da validação do Zod
      return reply.status(400).send({
        error: 'Erro de validação',
        details: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      })
    }

    if (
      error instanceof Error &&
      error.message.includes('Produto já cadastrado')
    ) {
      // ✅ Retorna erro 409 para produto duplicado
      return reply.status(409).send({ error: 'Produto já cadastrado' })
    }

    // ✅ Qualquer outro erro inesperado
    return reply.status(500).send({ error: 'Erro interno do servidor' })
  }
}

export async function getAllProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const products = await productService.getAllProducts()

    // Em vez de 404, retorna um array vazio com status 200
    reply.status(200).send(products)
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' })
  }
}

// export async function getProductByBarcode(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   try {
//     const { barcode } = request.params as { barcode: string }
//     const product = await productService.findProductByBarcode(barcode)
//     if (!product) {
//       return reply.status(404).send({ message: 'Produto não cadastrado' })
//     }
//     reply.send(product)
//   } catch (error) {
//     reply.status(500).send({ error: 'Erro interno do servidor' })
//   }
// }

// export async function updateProduct(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   try {
//     const { barcode } = request.params as { barcode: string }
//     const data = updateProductSchema.parse(request.body)
//     const product = await productService.updateProduct(barcode, data)
//     reply.send(product)
//   } catch (error) {
//     reply
//       .status(400)
//       .send({ error: error instanceof Error ? error.message : 'Invalid data' })
//   }
// }

// export async function deleteProduct(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   try {
//     const { barcode } = request.params as { barcode: string }
//     await productService.deleteProduct(barcode)
//     reply.status(204).send({ message: 'Produto removido com sucesso' })
//   } catch (error) {
//     reply.status(500).send({ error: 'An unexpected error occurred' })
//   }
// }
