//Os controladores lidam com a lógica específica de cada rota, incluindo validação com Zod e chamadas ao serviço.
import { FastifyReply, FastifyRequest } from 'fastify'
import * as productService from '../services/productService'
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/productSchemas'

export async function registerNewProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = createProductSchema.parse(request.body)
    const product = await productService.registerNewProduct(data)
    reply.status(201).send(product)
  } catch (error) {
    if (error instanceof Error && error.message === 'Produto já cadastrado') {
      // Retorna um status 409 (Conflict) caso o produto já exista
      reply
        .status(409)
        .send({ error: 'Product with this barcode already exists' })
    } else if (error instanceof Error) {
      // Para outros erros, retorna 400 ou 500 com a mensagem do erro
      reply.status(400).send({ error: error.message })
    } else {
      // Caso o erro não seja uma instância de Error, retorna um erro genérico
      reply.status(500).send({ error: 'An unexpected error occurred' })
    }
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

export async function getProductByBarcode(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { barcode } = request.params as { barcode: string }
    const product = await productService.findProductByBarcode(barcode)
    if (!product) {
      return reply.status(404).send({ message: 'Produto não cadastrado' })
    }
    reply.send(product)
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' })
  }
}

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { barcode } = request.params as { barcode: string }
    const data = updateProductSchema.parse(request.body)
    const product = await productService.updateProduct(barcode, data)
    reply.send(product)
  } catch (error) {
    reply
      .status(400)
      .send({ error: error instanceof Error ? error.message : 'Invalid data' })
  }
}

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { barcode } = request.params as { barcode: string }
    await productService.deleteProduct(barcode)
    reply.status(204).send({ message: 'Produto removido com sucesso' })
  } catch (error) {
    reply.status(500).send({ error: 'An unexpected error occurred' })
  }
}
