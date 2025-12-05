import { prisma } from '../../config/prisma'
import { ConflictError, NotFoundError } from '../../shared/errors'
import { timeToMinutes } from '../../shared/utils'
import { CreateAgendaInput } from './agenda.schema'
import { Agenda } from '../../shared/types'

export async function createAgenda(doctorId: string, data: CreateAgendaInput) {
  // Verificar se o médico existe
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: { agendas: true },
  })

  if (!doctor) {
    throw new NotFoundError('Médico')
  }

  // Normalizar horários para formato HH:MM:SS
  const fromTime = normalizeTime(data.availableFromTime)
  const toTime = normalizeTime(data.availableToTime)

  // Verificar conflito com agendas existentes
  const hasConflict = doctor.agendas.some((existingAgenda: Agenda) => {
    return checkAgendaOverlap(
      {
        fromWeekDay: data.availableFromWeekDay,
        toWeekDay: data.availableToWeekDay,
        fromTime,
        toTime,
      },
      {
        fromWeekDay: existingAgenda.availableFromWeekDay,
        toWeekDay: existingAgenda.availableToWeekDay,
        fromTime: existingAgenda.availableFromTime,
        toTime: existingAgenda.availableToTime,
      }
    )
  })

  if (hasConflict) {
    throw new ConflictError('Esta agenda conflita com uma agenda já existente do médico')
  }

  const agenda = await prisma.agenda.create({
    data: {
      doctorId,
      availableFromWeekDay: data.availableFromWeekDay,
      availableToWeekDay: data.availableToWeekDay,
      availableFromTime: fromTime,
      availableToTime: toTime,
    },
    select: {
      id: true,
      doctorId: true,
      availableFromWeekDay: true,
      availableToWeekDay: true,
      availableFromTime: true,
      availableToTime: true,
    },
  })

  return {
    ...agenda,
    weekDayRange: formatWeekDayRange(agenda.availableFromWeekDay, agenda.availableToWeekDay),
    timeRange: `${formatTimeDisplay(agenda.availableFromTime)} às ${formatTimeDisplay(agenda.availableToTime)}`,
  }
}

function normalizeTime(time: string): string {
  // Se vier no formato HH:MM, adiciona :00
  if (time.length === 5) {
    return `${time}:00`
  }
  return time
}

interface AgendaRange {
  fromWeekDay: number
  toWeekDay: number
  fromTime: string
  toTime: string
}

function checkAgendaOverlap(newAgenda: AgendaRange, existingAgenda: AgendaRange): boolean {
  // Verificar overlap de dias da semana
  const daysOverlap = checkWeekDayOverlap(
    newAgenda.fromWeekDay,
    newAgenda.toWeekDay,
    existingAgenda.fromWeekDay,
    existingAgenda.toWeekDay
  )

  if (!daysOverlap) {
    return false
  }

  // Verificar overlap de horários
  const timeOverlap = checkTimeOverlap(
    newAgenda.fromTime,
    newAgenda.toTime,
    existingAgenda.fromTime,
    existingAgenda.toTime
  )

  return timeOverlap
}

function checkWeekDayOverlap(
  newFrom: number,
  newTo: number,
  existFrom: number,
  existTo: number
): boolean {
  // Gerar array de dias para cada range
  const newDays = getWeekDaysInRange(newFrom, newTo)
  const existDays = getWeekDaysInRange(existFrom, existTo)

  // Verificar interseção
  return newDays.some((day) => existDays.includes(day))
}

function getWeekDaysInRange(from: number, to: number): number[] {
  const days: number[] = []
  if (from <= to) {
    for (let i = from; i <= to; i++) {
      days.push(i)
    }
  } else {
    // Range que cruza o fim de semana (ex: Sexta a Segunda)
    for (let i = from; i <= 6; i++) {
      days.push(i)
    }
    for (let i = 0; i <= to; i++) {
      days.push(i)
    }
  }
  return days
}

function checkTimeOverlap(
  newFrom: string,
  newTo: string,
  existFrom: string,
  existTo: string
): boolean {
  const newFromMinutes = timeToMinutes(newFrom)
  const newToMinutes = timeToMinutes(newTo)
  const existFromMinutes = timeToMinutes(existFrom)
  const existToMinutes = timeToMinutes(existTo)

  // Overlap existe se um range começa antes do outro terminar
  return newFromMinutes < existToMinutes && newToMinutes > existFromMinutes
}

const WEEK_DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function formatWeekDayRange(from: number, to: number): string {
  return `${WEEK_DAYS[from]} a ${WEEK_DAYS[to]}`
}

function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':')
  return `${hours}h${minutes !== '00' ? minutes : ''}`
}
