import { z } from 'zod'

export const createDoctorSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  specialty: z.string().min(3, 'Especialidade deve ter pelo menos 3 caracteres'),
  appointmentPrice: z.number().positive('Valor da consulta deve ser positivo'),
})

export const doctorParamsSchema = z.object({
  doctorId: z.string().uuid('ID do médico inválido'),
})

export const doctorQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
})

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>
export type DoctorParams = z.infer<typeof doctorParamsSchema>
export type DoctorQuery = z.infer<typeof doctorQuerySchema>
