import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ProfessionalData {
  id: number
  id_centro: number
  nombre: string
  apellido: string
  url_foto_perfil: string
  descripcion: string | null
  comision_servicio: number | null
  comision_producto: number | null
  online: number
  show: number
  orden: number
  nombre_completo: string
}

interface ProfessionalJSON {
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
  data: ProfessionalData[]
}

function cleanName(name: string): string {
  if (!name || name.trim() === '') return ''
  // Capitalizar correctamente y limpiar espacios extra
  return name.trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function determineSpecialtyId(descripcion: string | null): number | null {
  if (!descripcion) return 1 // Default: Estilista
  
  const desc = descripcion.toLowerCase()
  
  if (desc.includes('barbero')) return 2 // Barbero
  if (desc.includes('estilista')) return 1 // Estilista
  if (desc.includes('colorista')) return 3 // Colorista
  if (desc.includes('manicur')) return 4 // Manicurista
  if (desc.includes('coordinador') || desc.includes('supervisor')) return 1 // Estilista por defecto
  
  return 1 // Default: Estilista
}

function isProfessional(show: number): boolean {
  // show: 1 = puede atender clientes (profesional), 0 = administrativo
  return show === 1
}

function cleanProfileImage(url: string): string | null {
  if (!url || url.includes('/static/anon.jpg')) return null
  return url
}

async function importProfessionalsFromJSON() {
  console.log('🚀 Iniciando importación de profesionales desde JSON...')
  
  try {
    const jsonPath = path.join(process.cwd(), 'extra_data', 'profesionales.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ No se encontró el archivo: ${jsonPath}`)
      return
    }
    
    console.log('📖 Leyendo archivo JSON...')
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
    const professionalData: ProfessionalJSON = JSON.parse(jsonContent)
    
    console.log(`📊 Encontrados ${professionalData.data.length} profesionales para procesar`)
    
    let created = 0
    let skipped = 0
    let errors = 0
    let administrativeSkipped = 0
    let withBio = 0
    let withImage = 0
    const errorDetails: string[] = []
    const specialtyStats: { [key: string]: number } = {}
    
    for (let i = 0; i < professionalData.data.length; i++) {
      const prof = professionalData.data[i]
      
      try {
        // Solo procesar profesionales (show=1), omitir administrativos
        if (!isProfessional(prof.show)) {
          administrativeSkipped++
          console.log(`🏢 Omitiendo administrativo: ${prof.nombre} ${prof.apellido}`)
          continue
        }
        
        // Limpiar y validar datos
        const firstName = cleanName(prof.nombre)
        const lastName = cleanName(prof.apellido)
        const bio = prof.descripcion?.trim() || null
        const profileImage = cleanProfileImage(prof.url_foto_perfil)
        const specialtyId = determineSpecialtyId(prof.descripcion)
        const statusId = 1 // Todos activos
        
        // Validar que tenga nombre válido
        if (!firstName || firstName === '') {
          skipped++
          console.warn(`⚠️  Registro ${i + 1}: Profesional sin nombre válido - OMITIDO`)
          continue
        }
        
        // Contar estadísticas
        if (bio) withBio++
        if (profileImage) withImage++
        
        // Contar por especialidad
        const specialtyName = specialtyId === 1 ? 'Estilista' : 
                             specialtyId === 2 ? 'Barbero' : 
                             specialtyId === 3 ? 'Colorista' : 'Manicurista'
        specialtyStats[specialtyName] = (specialtyStats[specialtyName] || 0) + 1
        
        // Crear profesional
        const professional = await prisma.professional.create({
          data: {
            firstName,
            lastName,
            specialtyId,
            statusId,
            bio,
            profileImage,
            baseSalary: 0 // Se puede configurar después
          }
        })
        
        created++
        console.log(`✅ ${created}. ${firstName} ${lastName} (${specialtyName})`)
        
      } catch (error) {
        errors++
        const errorMsg = `Registro ${i + 1} (${prof.nombre} ${prof.apellido}): ${error instanceof Error ? error.message : 'Error desconocido'}`
        errorDetails.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }
    
    console.log(`\n🎉 Importación completada!`)
    console.log(`✅ Profesionales creados: ${created}`)
    console.log(`🏢 Administrativos omitidos: ${administrativeSkipped}`)
    console.log(`⚠️  Registros omitidos: ${skipped}`)
    console.log(`❌ Errores: ${errors}`)
    
    console.log(`\n📊 Estadísticas de profesionales:`)
    console.log(`  • Todos con estado: Activo`)
    console.log(`  • Con biografía: ${withBio}`)
    console.log(`  • Con foto de perfil: ${withImage}`)
    
    console.log(`\n👥 Por especialidad:`)
    Object.entries(specialtyStats).forEach(([specialty, count]) => {
      console.log(`  • ${specialty}: ${count}`)
    })
    
    const professionalTotal = professionalData.data.filter(p => p.show === 1).length
    console.log(`\n📈 Tasa de éxito: ${((created / professionalTotal) * 100).toFixed(1)}%`)
    
    if (errorDetails.length > 0) {
      console.log(`\n📋 Errores encontrados:`)
      errorDetails.forEach(detail => console.log(`  - ${detail}`))
    }
    
  } catch (error) {
    console.error('💥 Error fatal durante la importación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  importProfessionalsFromJSON()
}

export { importProfessionalsFromJSON }