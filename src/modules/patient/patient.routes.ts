import { FastifyInstance } from 'fastify'
import { createPatientController, getPatientController } from './patient.controller'
import { createPatientSchema, patientErrorSchema, patientParamsSchema, patientResponseSchema } from './patient.schema'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function patientRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients',
    {
      schema: {
        description: 'Criar um novo paciente',
        tags: ['Pacientes'],
        body: createPatientSchema,
        response: {
          201: patientResponseSchema,
          409: patientErrorSchema,
        },
      },
    },
    createPatientController
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/patient/:patientId',
    {
      schema: {
        description: 'Buscar paciente por ID com suas consultas',
        tags: ['Pacientes'],
        params: patientParamsSchema,
        response: {
          200: {
            description: 'Dados do paciente com consultas',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  appointments: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        date: { type: 'string' },
                        time: { type: 'string' },
                        status: { type: 'string' },
                        doctor: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            specialty: { type: 'string' },
                            price: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Paciente não encontrado',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    getPatientController
  )
}
