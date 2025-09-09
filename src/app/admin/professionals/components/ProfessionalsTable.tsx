'use client'

import { useState, useMemo } from 'react'

interface Professional {
  id: number
  firstName: string
  lastName: string
  phone: string | null
  bio: string | null
  profileImage: string | null
  baseSalary: string
  hireDate: string | null
  createdAt: string
  updatedAt: string
  specialty: {
    id: number
    name: string
  } | null
  status: {
    id: number
    name: string
  } | null
  user: {
    id: number
    email: string
  } | null
}

interface Specialty {
  id: number
  name: string
}

interface Status {
  id: number
  name: string
}

interface ProfessionalsTableProps {
  professionals: Professional[]
  specialties: Specialty[]
  statuses: Status[]
}

export default function ProfessionalsTable({ 
  professionals, 
  specialties, 
  statuses 
}: ProfessionalsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((professional) => {
      // Filtro por nombre
      const matchesSearch = searchTerm === '' || 
        `${professional.firstName} ${professional.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      // Filtro por especialidad
      const matchesSpecialty = selectedSpecialty === '' || 
        professional.specialty?.id.toString() === selectedSpecialty

      // Filtro por estado
      const matchesStatus = selectedStatus === '' || 
        professional.status?.id.toString() === selectedStatus

      return matchesSearch && matchesSpecialty && matchesStatus
    })
  }, [professionals, searchTerm, selectedSpecialty, selectedStatus])

  return (
    <>
      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre del profesional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Especialidad
            </label>
            <select 
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Results counter */}
        {(searchTerm || selectedSpecialty || selectedStatus) && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredProfessionals.length} de {professionals.length} profesionales
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Profesionales
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Ingreso
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron profesionales
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {searchTerm || selectedSpecialty || selectedStatus 
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'No hay profesionales registrados'
                        }
                      </p>
                      {(!searchTerm && !selectedSpecialty && !selectedStatus) && (
                        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                          Agregar Profesional
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map((professional) => (
                  <tr key={professional.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {professional.profileImage ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={professional.profileImage}
                              alt={`${professional.firstName} ${professional.lastName}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {professional.firstName[0]}{professional.lastName[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {professional.firstName} {professional.lastName}
                          </div>
                          {professional.bio && (
                            <div className="text-sm text-gray-500">
                              {professional.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {professional.specialty?.name || 'Sin especialidad'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        professional.status?.name === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {professional.status?.name || 'Sin estado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {professional.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {professional.hireDate 
                        ? new Date(professional.hireDate).toLocaleDateString('es-ES')
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}