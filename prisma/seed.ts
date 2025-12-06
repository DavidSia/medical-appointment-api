import { PrismaClient, AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean database
  await prisma.appointment.deleteMany()
  await prisma.agenda.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.patient.deleteMany()

  console.log('🗑️  Database cleaned')

  // Create Patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-1111',
    },
  })

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '(11) 99999-2222',
    },
  })

  console.log('👥 Patients created:', patient1.name, patient2.name)

  // Create Doctors with single agenda
  const doctor1 = await prisma.doctor.create({
    data: {
      name: 'Dr. Carlos Mendes',
      specialty: 'Cardiologia',
      appointmentPrice: 250.0,
      agendas: {
        create: {
          availableFromWeekDay: 1, // Segunda
          availableToWeekDay: 5, // Sexta
          availableFromTime: '08:00:00',
          availableToTime: '17:00:00',
        },
      },
    },
    include: { agendas: true },
  })

  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'Dra. Ana Paula Santos',
      specialty: 'Dermatologia',
      appointmentPrice: 180.0,
      agendas: {
        create: {
          availableFromWeekDay: 2, // Terça
          availableToWeekDay: 6, // Sábado
          availableFromTime: '09:00:00',
          availableToTime: '18:00:00',
        },
      },
    },
    include: { agendas: true },
  })

  console.log('👨‍⚕️ Doctors with single agenda created:', doctor1.name, doctor2.name)

  // Create Doctors with multiple agendas
  const doctor3 = await prisma.doctor.create({
    data: {
      name: 'Dr. Roberto Fernandes',
      specialty: 'Ortopedia',
      appointmentPrice: 300.0,
      agendas: {
        create: [
          {
            availableFromWeekDay: 1, // Segunda
            availableToWeekDay: 3, // Quarta
            availableFromTime: '08:00:00',
            availableToTime: '14:00:00',
          },
          {
            availableFromWeekDay: 4, // Quinta
            availableToWeekDay: 6, // Sábado
            availableFromTime: '08:00:00',
            availableToTime: '11:00:00',
          },
        ],
      },
    },
    include: { agendas: true },
  })

  const doctor4 = await prisma.doctor.create({
    data: {
      name: 'Dra. Fernanda Lima',
      specialty: 'Pediatria',
      appointmentPrice: 200.0,
      agendas: {
        create: [
          {
            availableFromWeekDay: 1, // Segunda
            availableToWeekDay: 2, // Terça
            availableFromTime: '07:00:00',
            availableToTime: '12:00:00',
          },
          {
            availableFromWeekDay: 4, // Quinta
            availableToWeekDay: 5, // Sexta
            availableFromTime: '14:00:00',
            availableToTime: '20:00:00',
          },
        ],
      },
    },
    include: { agendas: true },
  })

  console.log('👨‍⚕️ Doctors with multiple agendas created:', doctor3.name, doctor4.name)

  // Create some appointments for demonstration
  const nextMonday = getNextWeekday(1) // Get next Monday
  nextMonday.setHours(10, 0, 0, 0)

  const nextTuesday = getNextWeekday(2)
  nextTuesday.setHours(14, 30, 0, 0)

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentAt: nextMonday,
      status: AppointmentStatus.SCHEDULED,
    },
  })

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor3.id,
      appointmentAt: nextTuesday,
      status: AppointmentStatus.SCHEDULED,
    },
  })

  console.log('📅 Sample appointments created')

  console.log('')
  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log('   - 2 Patients')
  console.log('   - 2 Doctors with single agenda')
  console.log('   - 2 Doctors with multiple agendas')
  console.log('   - 2 Sample appointments')
}

function getNextWeekday(dayOfWeek: number): Date {
  const today = new Date()
  const currentDay = today.getDay()
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7 || 7
  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysUntilTarget)
  return targetDate
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
