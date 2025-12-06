import { FastifyInstance } from 'fastify'
import { createAgendaController } from './agenda.controller'
import {
  createAgendaSchema,
  agendaParamsSchema,
  agendaResponseSchema,
  errorResponseSchema,
} from './agenda.schema'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function agendaRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/doctors/:doctorId/agenda',
    {
      schema: {
        description: 'Criar agenda para um médico',
        tags: ['Agenda'],
        params: agendaParamsSchema,
        body: createAgendaSchema,
        response: {
          201: agendaResponseSchema,
          404: errorResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    createAgendaController
  )
}