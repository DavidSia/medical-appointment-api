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
