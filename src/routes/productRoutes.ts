// Este arquivo define as rotas relacionadas a produtos e conecta cada uma ao controlador.
import { FastifyInstance } from 'fastify'
import * as productController from '../controllers/productController'

export default async function productRoutes(app: FastifyInstance) {
  app.post('/', productController.registerNewProduct)
  app.get('/', productController.getAllProducts)
  app.get('/:id', productController.getProductById)
  app.put('/:id', productController.updateProduct)
  // app.delete('/:barcode', productController.deleteProduct)
}
