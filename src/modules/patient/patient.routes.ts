import { FastifyInstance } from 'fastify'
import { createPatientController, getPatientController, listPatientsController } from './patient.controller'
import {
  createPatientSchema,
  patientParamsSchema,
  patientResponseSchema,
  patientWithAppointmentsResponseSchema,
  errorResponseSchema,
  patientQuerySchema, patientsListResponseSchema
} from './patient.schema'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function patientRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients',
    {
      schema: {
        description: 'Criar um novo paciente',
        tags: ['Pacientes'],
        body: createPatientSchema,
        response: {
          201: patientResponseSchema,
          409: errorResponseSchema,
        },
      },
    },
    createPatientController
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/patient/:patientId',
    {
      schema: {
        description: 'Buscar paciente por ID com suas consultas',
        tags: ['Pacientes'],
        params: patientParamsSchema,
        response: {
          200: patientWithAppointmentsResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    getPatientController
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/patients',
    {
      schema: {
        description: 'Listar pacientes com paginação',
        tags: ['Pacientes'],
        querystring: patientQuerySchema,
        response: {
          200: patientsListResponseSchema,
        },
      },
    },
    listPatientsController
  )
}