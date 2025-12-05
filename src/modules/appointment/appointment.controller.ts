import { FastifyReply, FastifyRequest } from 'fastify'
import { createAppointment, cancelAppointment } from './appointment.service'
import { CreateAppointmentInput, AppointmentParams } from './appointment.schema'

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
