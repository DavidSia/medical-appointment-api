import { FastifyReply, FastifyRequest } from 'fastify'
import { createAppointment, cancelAppointment, listAppointments } from './appointment.service'
import { CreateAppointmentInput, AppointmentParams, AppointmentQuery } from './appointment.schema'

export async function createAppointmentController(
  request: FastifyRequest<{ Body: CreateAppointmentInput }>,
  reply: FastifyReply
) {
  const appointment = await createAppointment(request.body)

  return reply.status(201).send({
    success: true,
    data: appointment,
  })
}

export async function cancelAppointmentController(
  request: FastifyRequest<{ Params: AppointmentParams }>,
  reply: FastifyReply
) {
  const { appointmentId } = request.params
  const appointment = await cancelAppointment(appointmentId)

  return reply.status(200).send({
    success: true,
    data: appointment,
    message: 'Agendamento cancelado com sucesso',
  })
}

export async function listAppointmentsController(
  request: FastifyRequest<{ Querystring: AppointmentQuery }>,
  reply: FastifyReply
) {
  const { page, limit } = request.query
  const result = await listAppointments(page, limit)

  return reply.status(200).send({
    success: true,
    ...result,
  })
}