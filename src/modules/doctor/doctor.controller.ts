import { FastifyReply, FastifyRequest } from 'fastify'
import { createDoctor } from './doctor.service'
import { CreateDoctorInput } from './doctor.schema'

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
