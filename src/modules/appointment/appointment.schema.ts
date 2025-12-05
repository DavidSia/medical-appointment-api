import { z } from 'zod'

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  doctorId: z.string().uuid('ID do médico inválido'),
  appointmentAt: z.string().datetime({ message: 'Data/hora inválida. Use formato ISO 8601' }),
})

export const appointmentParamsSchema = z.object({
  appointmentId: z.string().uuid('ID do agendamento inválido'),
})

export const appointmentQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type AppointmentParams = z.infer<typeof appointmentParamsSchema>
export type AppointmentQuery = z.infer<typeof appointmentQuerySchema>
