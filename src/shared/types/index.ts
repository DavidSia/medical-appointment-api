// Tipos que espelham o schema Prisma
// Estes tipos são usados para tipagem quando o Prisma client não está disponível

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  appointmentPrice: number | string
  createdAt: Date
  updatedAt: Date
}

export interface Agenda {
  id: string
  doctorId: string
  availableFromWeekDay: number
  availableToWeekDay: number
  availableFromTime: string
  availableToTime: string
  createdAt: Date
  updatedAt: Date
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  appointmentAt: Date
  status: AppointmentStatus
  createdAt: Date
  updatedAt: Date
}

// Tipos com relacionamentos
export interface DoctorWithAgendas extends Doctor {
  agendas: Agenda[]
}

export interface AppointmentWithRelations extends Appointment {
  patient: Patient
  doctor: Doctor
}

export interface PatientWithAppointments extends Patient {
  appointments: (Appointment & {
    doctor: Pick<Doctor, 'name' | 'specialty' | 'appointmentPrice'>
  })[]
}
