import { FastifyInstance } from 'fastify'
import { createDoctorController } from './doctor.controller'
import { createDoctorSchema } from './doctor.schema'
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
          201: {
            description: 'Médico criado com sucesso',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  specialty: { type: 'string' },
                  appointmentPrice: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    createDoctorController
  )
}
