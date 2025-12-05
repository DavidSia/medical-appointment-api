import { z } from 'zod'

export const createPatientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 caracteres'),
})

export const patientParamsSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
})

export const patientQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type PatientParams = z.infer<typeof patientParamsSchema>
export type PatientQuery = z.infer<typeof patientQuerySchema>
