import { z } from 'zod'

// Schemas existentes
export const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  appointmentAt: z.string(),
})

export const appointmentParamsSchema = z.object({
  appointmentId: z.string().uuid(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>

// Response schemas
export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export const appointmentResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string().uuid(),
    date: z.string(),
    time: z.string(),
    status: z.string(),
    patient: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    doctor: z.object({
      id: z.string(),
      name: z.string(),
      specialty: z.string(),
      price: z.string(),
    }),
  }),
})

export const cancelAppointmentResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string().uuid(),
    date: z.string(),
    time: z.string(),
    status: z.string(),
    patient: z.object({
      id: z.string(),
      name: z.string(),
    }),
    doctor: z.object({
      id: z.string(),
      name: z.string(),
      specialty: z.string(),
    }),
  }),
})