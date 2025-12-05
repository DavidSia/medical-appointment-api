import { prisma } from '../../config/prisma'
import { formatPrice } from '../../shared/utils'
import { CreateDoctorInput } from './doctor.schema'

export async function createDoctor(data: CreateDoctorInput) {
  const doctor = await prisma.doctor.create({
    data: {
      name: data.name,
      specialty: data.specialty,
      appointmentPrice: data.appointmentPrice,
    },
    select: {
      id: true,
      name: true,
      specialty: true,
      appointmentPrice: true,
    },
  })

  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    appointmentPrice: formatPrice(doctor.appointmentPrice),
  }
}

export async function getDoctorById(doctorId: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      agendas: true,
    },
  })

  return doctor
}
