import { FastifyReply, FastifyRequest } from 'fastify'
import { createAgenda } from './agenda.service'
import { CreateAgendaInput, AgendaParams } from './agenda.schema'

export async function createAgendaController(
  request: FastifyRequest<{ Params: AgendaParams; Body: CreateAgendaInput }>,
  reply: FastifyReply
) {
  const { doctorId } = request.params
  const agenda = await createAgenda(doctorId, request.body)

  return reply.status(201).send({
    success: true,
    data: agenda,
  })
}
