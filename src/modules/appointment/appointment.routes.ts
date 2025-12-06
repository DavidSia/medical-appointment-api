import { FastifyInstance } from 'fastify'
import { createAppointmentController, cancelAppointmentController, listAppointmentsController } from './appointment.controller'
import {
  createAppointmentSchema,
  appointmentParamsSchema,
  appointmentResponseSchema,
  cancelAppointmentResponseSchema,
  errorResponseSchema,
  appointmentQuerySchema,
  appointmentsListResponseSchema,
} from './appointment.schema'
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
          201: appointmentResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
          422: errorResponseSchema,
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
          200: cancelAppointmentResponseSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    cancelAppointmentController
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/appointments',
    {
      schema: {
        description: 'Listar agendamentos com paginação',
        tags: ['Agendamentos'],
        querystring: appointmentQuerySchema,
        response: {
          200: appointmentsListResponseSchema,
        },
      },
    },
    listAppointmentsController
  )
}