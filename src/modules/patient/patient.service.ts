import { prisma } from '../../config/prisma'
import { ConflictError, NotFoundError } from '../../shared/errors'
import { formatDate, formatTime, formatPrice } from '../../shared/utils'
import { CreatePatientInput } from './patient.schema'

interface AppointmentWithDoctor {
  id: string
  appointmentAt: Date
  status: string
  doctor: {
    name: string
    specialty: string
    appointmentPrice: number | string
  }
}

export async function createPatient(data: CreatePatientInput) {
  const existingPatient = await prisma.patient.findUnique({
    where: { email: data.email },
  })

  if (existingPatient) {
    throw new ConflictError('Já existe um paciente cadastrado com este email')
  }

  const patient = await prisma.patient.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  })

  return patient
}

export async function getPatientById(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      appointments: {
        include: {
          doctor: {
            select: {
              name: true,
              specialty: true,
              appointmentPrice: true,
            },
          },
        },
        orderBy: { appointmentAt: 'desc' },
      },
    },
  })

  if (!patient) {
    throw new NotFoundError('Paciente')
  }

  // Formatar dados de retorno
  const formattedAppointments = patient.appointments.map((appointment: AppointmentWithDoctor) => ({
    id: appointment.id,
    date: formatDate(appointment.appointmentAt),
    time: formatTime(appointment.appointmentAt),
    status: formatStatus(appointment.status),
    doctor: {
      name: appointment.doctor.name,
      specialty: appointment.doctor.specialty,
      price: formatPrice(appointment.doctor.appointmentPrice),
    },
  }))

  return {
    id: patient.id,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    appointments: formattedAppointments,
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
