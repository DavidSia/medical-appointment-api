import { FastifyReply, FastifyRequest } from 'fastify'
import { createAgenda, listAgendas } from './agenda.service'
import { CreateAgendaInput, AgendaParams, AgendaQuery } from './agenda.schema'

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

export async function listAgendasController(
  request: FastifyRequest<{ Querystring: AgendaQuery }>,
  reply: FastifyReply
) {
  const { page, limit } = request.query
  const result = await listAgendas(page, limit)

  return reply.status(200).send({
    success: true,
    ...result,
  })
}