import { FastifyReply, FastifyRequest } from 'fastify'
import { createDoctor, listDoctors } from './doctor.service'
import { CreateDoctorInput, DoctorQuery } from './doctor.schema'

export async function createDoctorController(
  request: FastifyRequest<{ Body: CreateDoctorInput }>,
  reply: FastifyReply
) {
  const doctor = await createDoctor(request.body)

  return reply.status(201).send({
    success: true,
    data: doctor,
  })
}

export async function listDoctorsController(
  request: FastifyRequest<{ Querystring: DoctorQuery }>,
  reply: FastifyReply
) {
  const { page, limit } = request.query
  const result = await listDoctors(page, limit)

  return reply.status(200).send({
    success: true,
    ...result,
  })
}