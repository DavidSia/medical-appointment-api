import { FastifyReply, FastifyRequest } from 'fastify'
import { createPatient, getPatientById } from './patient.service'
import { CreatePatientInput, PatientParams } from './patient.schema'

export async function createPatientController(
  request: FastifyRequest<{ Body: CreatePatientInput }>,
  reply: FastifyReply
) {
  const patient = await createPatient(request.body)

  return reply.status(201).send({
    success: true,
    data: patient,
  })
}

export async function getPatientController(
  request: FastifyRequest<{ Params: PatientParams }>,
  reply: FastifyReply
) {
  const { patientId } = request.params
  const patient = await getPatientById(patientId)

  return reply.status(200).send({
    success: true,
    data: patient,
  })
}
