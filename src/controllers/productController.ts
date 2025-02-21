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

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // ✅ Obtém o ID do produto a partir dos parâmetros da URL
    const { id } = request.params as { id: string }

    // ✅ Valida os dados com Zod
    const data = updateProductSchema.parse(request.body)

    // ✅ Chama o serviço para atualizar o produto
    const product = await productService.updateProduct(id, data)

    reply.status(200).send(product)
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
      error.message.includes('Produto não encontrado')
    ) {
      // ✅ Retorna erro 404 se o produto não for encontrado
      return reply.status(404).send({ error: 'Produto não encontrado' })
    }

    // ✅ Qualquer outro erro inesperado
    return reply.status(500).send({ error: 'Erro interno do servidor' })
  }
}
