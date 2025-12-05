import { FastifyInstance } from 'fastify'
import { createAppointmentController, cancelAppointmentController } from './appointment.controller'
import { createAppointmentSchema, appointmentParamsSchema } from './appointment.schema'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function appointmentRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/appointments',
    {
      schema: {
        description: 'Criar um novo agendamento de consulta',
        tags: ['Agendamentos'],
        body: createAppointmentSchema,
        response: {
          201: {
            description: 'Agendamento criado com sucesso',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  date: { type: 'string' },
                  time: { type: 'string' },
                  status: { type: 'string' },
                  patient: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                    },
                  },
                  doctor: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      specialty: { type: 'string' },
                      price: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Paciente ou médico não encontrado',
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
          409: {
            description: 'Conflito de horário',
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
          422: {
            description: 'Médico sem disponibilidade',
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
    createAppointmentController
  )

  app.withTypeProvider<ZodTypeProvider>().patch(
    '/appointments/:appointmentId/cancel',
    {
      schema: {
        description: 'Cancelar um agendamento',
        tags: ['Agendamentos'],
        params: appointmentParamsSchema,
        response: {
          200: {
            description: 'Agendamento cancelado com sucesso',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  date: { type: 'string' },
                  time: { type: 'string' },
                  status: { type: 'string' },
                  patient: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                    },
                  },
                  doctor: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      specialty: { type: 'string' },
                    },
                  },
                },
              },
              message: { type: 'string' },
            },
          },
          403: {
            description: 'Cancelamento não permitido',
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
          404: {
            description: 'Agendamento não encontrado',
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
    cancelAppointmentController
  )
}
