import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear roles de usuario
  const superAdminRole = await prisma.userRole.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Control total del sistema',
      permissions: {
        all: true
      }
    }
  })

  const managerRole = await prisma.userRole.upsert({
    where: { name: 'Manager' },
    update: {},
    create: {
      name: 'Manager',
      description: 'Gestión de profesionales y configuración',
      permissions: {
        manage_professionals: true,
        manage_services: true,
        view_reports: true
      }
    }
  })

  const staffRole = await prisma.userRole.upsert({
    where: { name: 'Staff' },
    update: {},
    create: {
      name: 'Staff',
      description: 'Acceso a agenda y clientes asignados',
      permissions: {
        manage_appointments: true,
        view_clients: true
      }
    }
  })

  const clientRole = await prisma.userRole.upsert({
    where: { name: 'Client' },
    update: {},
    create: {
      name: 'Client',
      description: 'Portal de cliente con funciones limitadas',
      permissions: {
        book_appointments: true,
        view_own_history: true
      }
    }
  })

  // Crear especialidades de profesionales
  const specialties = [
    { name: 'Estilista', description: 'Especialista en cortes y peinados' },
    { name: 'Barbero', description: 'Especialista en cortes masculinos' },
    { name: 'Colorista', description: 'Especialista en coloración y tintes' },
    { name: 'Manicurista', description: 'Especialista en cuidado de uñas' }
  ]

  for (const specialty of specialties) {
    await prisma.professionalSpecialty.upsert({
      where: { name: specialty.name },
      update: {},
      create: specialty
    })
  }

  // Crear estados de profesionales
  const professionalStatuses = [
    { name: 'Activo', description: 'Profesional disponible', color: '#22c55e' },
    { name: 'Inactivo', description: 'Profesional no disponible', color: '#ef4444' },
    { name: 'Vacaciones', description: 'Profesional en vacaciones', color: '#f59e0b' },
    { name: 'Licencia', description: 'Profesional en licencia médica', color: '#8b5cf6' }
  ]

  for (const status of professionalStatuses) {
    await prisma.professionalStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status
    })
  }

  // Crear categorías de servicios
  const serviceCategories = [
    { name: 'Cortes', description: 'Servicios de corte de cabello', icon: 'scissors', displayOrder: 1 },
    { name: 'Coloración', description: 'Servicios de tintes y coloración', icon: 'palette', displayOrder: 2 },
    { name: 'Tratamientos', description: 'Tratamientos capilares', icon: 'heart', displayOrder: 3 },
    { name: 'Uñas', description: 'Servicios de manicura y pedicura', icon: 'hand', displayOrder: 4 }
  ]

  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
  }

  // Crear estados de servicios
  const serviceStatuses = [
    { name: 'Activo', description: 'Servicio disponible', color: '#22c55e' },
    { name: 'Inactivo', description: 'Servicio no disponible', color: '#ef4444' },
    { name: 'Descontinuado', description: 'Servicio descontinuado', color: '#6b7280' },
    { name: 'Temporal', description: 'Servicio temporal/promocional', color: '#f59e0b' }
  ]

  for (const status of serviceStatuses) {
    await prisma.serviceStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status
    })
  }

  // Crear días de la semana
  const weekDays = [
    { name: 'Domingo', shortName: 'Dom', dayNumber: 0 },
    { name: 'Lunes', shortName: 'Lun', dayNumber: 1 },
    { name: 'Martes', shortName: 'Mar', dayNumber: 2 },
    { name: 'Miércoles', shortName: 'Mié', dayNumber: 3 },
    { name: 'Jueves', shortName: 'Jue', dayNumber: 4 },
    { name: 'Viernes', shortName: 'Vie', dayNumber: 5 },
    { name: 'Sábado', shortName: 'Sáb', dayNumber: 6 }
  ]

  for (const day of weekDays) {
    await prisma.weekDay.upsert({
      where: { name: day.name },
      update: {},
      create: day
    })
  }

  // Crear estados de citas
  const appointmentStatuses = [
    { name: 'Pendiente', description: 'Cita pendiente de confirmación', color: '#f59e0b', isFinal: false, allowsModification: true },
    { name: 'Confirmada', description: 'Cita confirmada', color: '#3b82f6', isFinal: false, allowsModification: true },
    { name: 'En Progreso', description: 'Cita en progreso', color: '#8b5cf6', isFinal: false, allowsModification: false },
    { name: 'Completada', description: 'Cita completada exitosamente', color: '#22c55e', isFinal: true, allowsModification: false },
    { name: 'Cancelada', description: 'Cita cancelada por el cliente', color: '#ef4444', isFinal: true, allowsModification: false },
    { name: 'No Show', description: 'Cliente no se presentó', color: '#6b7280', isFinal: true, allowsModification: false }
  ]

  for (const status of appointmentStatuses) {
    await prisma.appointmentStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status
    })
  }

  // Crear métodos de pago
  const paymentMethods = [
    { name: 'Efectivo', description: 'Pago en efectivo', isActive: true, requiresReference: false },
    { name: 'Tarjeta Débito', description: 'Pago con tarjeta de débito', isActive: true, requiresReference: true },
    { name: 'Tarjeta Crédito', description: 'Pago con tarjeta de crédito', isActive: true, requiresReference: true },
    { name: 'Transferencia', description: 'Transferencia bancaria', isActive: true, requiresReference: true },
    { name: 'QR/Digital', description: 'Pago digital por QR', isActive: true, requiresReference: true }
  ]

  for (const method of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { name: method.name },
      update: {},
      create: method
    })
  }

  // Crear estados de pago
  const paymentStatuses = [
    { name: 'Pendiente', description: 'Pago pendiente', color: '#f59e0b', isFinal: false },
    { name: 'Pagado', description: 'Pago completado', color: '#22c55e', isFinal: true },
    { name: 'Fallido', description: 'Pago fallido', color: '#ef4444', isFinal: true },
    { name: 'Reembolsado', description: 'Pago reembolsado', color: '#6b7280', isFinal: true }
  ]

  for (const status of paymentStatuses) {
    await prisma.paymentStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status
    })
  }

  console.log('✅ Seed completado exitosamente!')
  console.log(`📊 Datos creados:
  - ${specialties.length} especialidades de profesionales
  - ${professionalStatuses.length} estados de profesionales
  - ${serviceCategories.length} categorías de servicios
  - ${serviceStatuses.length} estados de servicios
  - ${weekDays.length} días de la semana
  - ${appointmentStatuses.length} estados de citas
  - ${paymentMethods.length} métodos de pago
  - ${paymentStatuses.length} estados de pago
  - 4 roles de usuario`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })