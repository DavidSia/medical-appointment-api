import { FastifyInstance } from 'fastify'
import { createAgendaController } from './agenda.controller'
import { createAgendaSchema, agendaParamsSchema } from './agenda.schema'
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
          201: {
            description: 'Agenda criada com sucesso',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  doctorId: { type: 'string', format: 'uuid' },
                  availableFromWeekDay: { type: 'number' },
                  availableToWeekDay: { type: 'number' },
                  availableFromTime: { type: 'string' },
                  availableToTime: { type: 'string' },
                  weekDayRange: { type: 'string' },
                  timeRange: { type: 'string' },
                },
              },
            },
          },
          404: {
            description: 'Médico não encontrado',
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
            description: 'Conflito com agenda existente',
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
    createAgendaController
  )
}
