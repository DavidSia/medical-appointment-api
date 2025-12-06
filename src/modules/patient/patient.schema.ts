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

// Response schemas
export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export const patientResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
})

export const patientWithAppointmentsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    appointments: z.array(z.object({
      id: z.string(),
      date: z.string(),
      time: z.string(),
      status: z.string(),
      doctor: z.object({
        name: z.string(),
        specialty: z.string(),
        price: z.string(),
      }),
    })),
  }),
})

export const patientsListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  })),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
})