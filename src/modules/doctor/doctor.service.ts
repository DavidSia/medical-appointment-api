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

export async function listDoctors(page: number, limit: number) {
  const skip = (page - 1) * limit

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        specialty: true,
        appointmentPrice: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.doctor.count(),
  ])

  const formattedDoctors = doctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    appointmentPrice: formatPrice(doctor.appointmentPrice),
  }))

  return {
    data: formattedDoctors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
