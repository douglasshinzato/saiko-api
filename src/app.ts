import fastify from 'fastify'
import cors from '@fastify/cors'
import productRoutes from './routes/productRoutes'

export const app = fastify()

app.register(cors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(productRoutes, { prefix: '/product' })
