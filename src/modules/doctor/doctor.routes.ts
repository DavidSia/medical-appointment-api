import { FastifyInstance } from 'fastify'
import { createDoctorController, listDoctorsController } from './doctor.controller'
import { createDoctorSchema, doctorQuerySchema, doctorResponseSchema, doctorsListResponseSchema, errorResponseSchema } from './doctor.schema'
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

  app.withTypeProvider<ZodTypeProvider>().get(
    '/doctors',
    {
      schema: {
        description: 'Listar médicos com paginação',
        tags: ['Médicos'],
        querystring: doctorQuerySchema,
        response: {
          200: doctorsListResponseSchema,
        },
      },
    },
    listDoctorsController
  )
}