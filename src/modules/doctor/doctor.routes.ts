import { FastifyInstance } from 'fastify'
import { createDoctorController } from './doctor.controller'
import { createDoctorSchema, doctorResponseSchema, errorResponseSchema } from './doctor.schema'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function doctorRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/doctor',
    {
      schema: {
        description: 'Criar um novo médico',
        tags: ['Médicos'],
        body: createDoctorSchema,
        response: {
          201: doctorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    createDoctorController
  )
}