import { prisma } from '../../config/prisma'
import { ConflictError, NotFoundError, ForbiddenError, ValidationError } from '../../shared/errors'
import { formatDate, formatTime, formatPrice, isWeekDayInRange, isTimeInRange, dateToTimeString } from '../../shared/utils'
import { sendAppointmentConfirmationEmail } from '../../shared/email'
import { CreateAppointmentInput } from './appointment.schema'
import { Agenda, AppointmentStatus } from '../../shared/types'

export async function createAppointment(data: CreateAppointmentInput) {
  const appointmentDate = new Date(data.appointmentAt)

  // 1. Verificar se o paciente existe
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
  })

  if (!patient) {
    throw new NotFoundError('Paciente')
  }

  // 2. Verificar se o médico existe e buscar suas agendas
  const doctor = await prisma.doctor.findUnique({
    where: { id: data.doctorId },
    include: { agendas: true },
  })

  if (!doctor) {
    throw new NotFoundError('Médico')
  }

  // 3. Verificar se o médico tem disponibilidade na agenda para este dia/horário
  const dayOfWeek = appointmentDate.getDay()
  const appointmentTime = dateToTimeString(appointmentDate)

  const hasAvailability = doctor.agendas.some((agenda: Agenda) => {
    const dayInRange = isWeekDayInRange(
      dayOfWeek,
      agenda.availableFromWeekDay,
      agenda.availableToWeekDay
    )
    const timeInRange = isTimeInRange(
      appointmentTime,
      agenda.availableFromTime,
      agenda.availableToTime
    )
    return dayInRange && timeInRange
  })

  if (!hasAvailability) {
    throw new ValidationError(
      `O médico ${doctor.name} não possui disponibilidade na agenda para este dia e horário`
    )
  }

  // 4. Verificar se já existe consulta para o mesmo médico no mesmo horário
  const existingDoctorAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
      appointmentAt: appointmentDate,
      status: {
        notIn: [AppointmentStatus.CANCELED],
      },
    },
  })

  if (existingDoctorAppointment) {
    throw new ConflictError('Já existe uma consulta agendada para este médico neste horário')
  }

  // 5. Verificar se o paciente já tem consulta no mesmo dia/horário com outro médico
  const existingPatientAppointment = await prisma.appointment.findFirst({
    where: {
      patientId: data.patientId,
      appointmentAt: appointmentDate,
      status: {
        notIn: [AppointmentStatus.CANCELED],
      },
    },
  })

  if (existingPatientAppointment) {
    throw new ConflictError('O paciente já possui uma consulta agendada neste horário')
  }

  // 6. Criar o agendamento
  const appointment = await prisma.appointment.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentAt: appointmentDate,
      status: AppointmentStatus.SCHEDULED,
    },
    include: {
      patient: true,
      doctor: true,
    },
  })

  // 7. Enviar email de confirmação
  await sendAppointmentConfirmationEmail({
    patientName: appointment.patient.name,
    patientEmail: appointment.patient.email,
    doctorName: appointment.doctor.name,
    specialty: appointment.doctor.specialty,
    appointmentAt: appointment.appointmentAt,
    price: appointment.doctor.appointmentPrice,
  })

  // 8. Retornar dados formatados
  return {
    id: appointment.id,
    date: formatDate(appointment.appointmentAt),
    time: formatTime(appointment.appointmentAt),
    status: 'Agendado',
    patient: {
      id: appointment.patient.id,
      name: appointment.patient.name,
      email: appointment.patient.email,
    },
    doctor: {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      specialty: appointment.doctor.specialty,
      price: formatPrice(appointment.doctor.appointmentPrice),
    },
  }
}

export async function cancelAppointment(appointmentId: string) {
  // 1. Buscar o agendamento
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      doctor: true,
    },
  })

  if (!appointment) {
    throw new NotFoundError('Agendamento')
  }

  // 2. Verificar se já está cancelado
  if (appointment.status === AppointmentStatus.CANCELED) {
    throw new ValidationError('Este agendamento já foi cancelado')
  }

  // 3. Verificar se a consulta já aconteceu ou está em andamento
  if (appointment.status === AppointmentStatus.IN_PROGRESS) {
    throw new ForbiddenError('Não é possível cancelar uma consulta em andamento')
  }

  if (appointment.status === AppointmentStatus.FINISHED) {
    throw new ForbiddenError('Não é possível cancelar uma consulta já finalizada')
  }

  // 4. Verificar regra das 2 horas
  const now = new Date()
  const appointmentTime = new Date(appointment.appointmentAt)
  const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilAppointment < 2) {
    throw new ForbiddenError(
      'Não é possível cancelar a consulta com menos de 2 horas de antecedência'
    )
  }

  // 5. Atualizar status para cancelado
  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: AppointmentStatus.CANCELED,
    },
    include: {
      patient: true,
      doctor: true,
    },
  })

  return {
    id: updatedAppointment.id,
    date: formatDate(updatedAppointment.appointmentAt),
    time: formatTime(updatedAppointment.appointmentAt),
    status: 'Cancelado',
    patient: {
      id: updatedAppointment.patient.id,
      name: updatedAppointment.patient.name,
    },
    doctor: {
      id: updatedAppointment.doctor.id,
      name: updatedAppointment.doctor.name,
      specialty: updatedAppointment.doctor.specialty,
    },
  }
}

export async function listAppointments(page: number, limit: number) {
  const skip = (page - 1) * limit

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      skip,
      take: limit,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            appointmentPrice: true,
          },
        },
      },
      orderBy: { appointmentAt: 'desc' },
    }),
    prisma.appointment.count(),
  ])

  const formattedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    date: formatDate(appointment.appointmentAt),
    time: formatTime(appointment.appointmentAt),
    status: formatStatus(appointment.status),
    patient: {
      id: appointment.patient.id,
      name: appointment.patient.name,
      email: appointment.patient.email,
    },
    doctor: {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      specialty: appointment.doctor.specialty,
      price: formatPrice(appointment.doctor.appointmentPrice),
    },
  }))

  return {
    data: formattedAppointments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    SCHEDULED: 'Agendado',
    IN_PROGRESS: 'Em Consulta',
    FINISHED: 'Finalizado',
    CANCELED: 'Cancelado',
  }
  return statusMap[status] || status
}