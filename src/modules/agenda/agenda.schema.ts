import { z } from 'zod'

export const createAgendaSchema = z.object({
  availableFromWeekDay: z.number().min(0).max(6, 'Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)'),
  availableToWeekDay: z.number().min(0).max(6, 'Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)'),
  availableFromTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido (use HH:MM ou HH:MM:SS)'),
  availableToTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido (use HH:MM ou HH:MM:SS)'),
})

export const agendaParamsSchema = z.object({
  doctorId: z.string().uuid('ID do médico inválido'),
})

export type CreateAgendaInput = z.infer<typeof createAgendaSchema>
export type AgendaParams = z.infer<typeof agendaParamsSchema>

// Response schemas
export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export const agendaResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    id: z.string().uuid(),
    doctorId: z.string().uuid(),
    availableFromWeekDay: z.number(),
    availableToWeekDay: z.number(),
    availableFromTime: z.string(),
    availableToTime: z.string(),
    weekDayRange: z.string(),
    timeRange: z.string(),
  }),
})