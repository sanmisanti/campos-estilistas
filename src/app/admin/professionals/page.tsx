import { prisma } from '@/lib/prisma'
import ProfessionalsTable from './components/ProfessionalsTable'

async function getProfessionals() {
  return await prisma.professional.findMany({
    include: {
      specialty: true,
      status: true,
      user: true
    },
    orderBy: {
      firstName: 'asc'
    }
  })
}

async function getSpecialties() {
  return await prisma.professionalSpecialty.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })
}

async function getStatuses() {
  return await prisma.professionalStatus.findMany({
    orderBy: { name: 'asc' }
  })
}

export default async function ProfessionalsPage() {
  const [professionals, specialties, statuses] = await Promise.all([
    getProfessionals(),
    getSpecialties(),
    getStatuses()
  ])

  // Serializar datos para el componente cliente
  const serializedProfessionals = professionals.map(prof => ({
    ...prof,
    baseSalary: prof.baseSalary.toString(),
    hireDate: prof.hireDate ? prof.hireDate.toISOString() : null,
    createdAt: prof.createdAt.toISOString(),
    updatedAt: prof.updatedAt.toISOString()
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profesionales</h1>
          <p className="text-sm text-gray-600">
            Gestiona el equipo de profesionales de la peluquería • {professionals.length} profesional{professionals.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Agregar Profesional
        </button>
      </div>

      {/* Professionals Table Component */}
      <ProfessionalsTable 
        professionals={serializedProfessionals}
        specialties={specialties}
        statuses={statuses}
      />
    </div>
  )
}