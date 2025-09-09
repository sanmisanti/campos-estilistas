import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as bcrypt from 'bcrypt'

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
  return name.trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function generateEmail(firstName: string, lastName: string): string {
  const cleanFirst = firstName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z]/g, '')
  
  const cleanLast = lastName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z]/g, '')
  
  return `${cleanFirst}.${cleanLast}@camposestilistas.com`
}

function determineRole(firstName: string, lastName: string): number {
  // Máximo Movsovich → Manager (roleId: 2)
  if (firstName.toLowerCase() === 'maximo' && lastName.toLowerCase() === 'movsovich') {
    return 2 // Manager
  }
  
  // Todos los demás → Staff (roleId: 3)
  return 3 // Staff
}

async function findOrCreateProfessionalId(firstName: string, lastName: string): Promise<number | null> {
  // Buscar si ya existe un profesional con este nombre
  const existingProfessional = await prisma.professional.findFirst({
    where: {
      firstName: {
        equals: firstName,
        mode: 'insensitive'
      },
      lastName: {
        equals: lastName,
        mode: 'insensitive'
      }
    }
  })
  
  return existingProfessional?.id || null
}

async function importUsersFromProfessionals() {
  console.log('🚀 Iniciando creación de usuarios desde profesionales...')
  
  try {
    const jsonPath = path.join(process.cwd(), 'extra_data', 'profesionales.json')
    
    if (!fs.existsSync(jsonPath)) {
      console.error(`❌ No se encontró el archivo: ${jsonPath}`)
      return
    }
    
    console.log('📖 Leyendo archivo JSON...')
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
    const professionalData: ProfessionalJSON = JSON.parse(jsonContent)
    
    console.log(`📊 Encontrados ${professionalData.data.length} registros para procesar`)
    
    // Contraseña temporal para todos
    const tempPassword = 'Campos2024!'
    const hashedPassword = await bcrypt.hash(tempPassword, 10)
    
    let created = 0
    let linked = 0
    let errors = 0
    let managerCount = 0
    let staffCount = 0
    const errorDetails: string[] = []
    const createdUsers: { name: string, email: string, role: string }[] = []
    
    for (let i = 0; i < professionalData.data.length; i++) {
      const prof = professionalData.data[i]
      
      try {
        const firstName = cleanName(prof.nombre)
        const lastName = cleanName(prof.apellido)
        const email = generateEmail(firstName, lastName)
        const roleId = determineRole(firstName, lastName)
        const roleName = roleId === 2 ? 'Manager' : 'Staff'
        
        // Validar que tenga nombre válido
        if (!firstName || firstName === '') {
          errors++
          console.warn(`⚠️  Registro ${i + 1}: Sin nombre válido - OMITIDO`)
          continue
        }
        
        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })
        
        if (existingUser) {
          console.warn(`⚠️  Usuario ya existe: ${email} - OMITIDO`)
          continue
        }
        
        // Buscar si es un profesional (para linkear)
        const professionalId = await findOrCreateProfessionalId(firstName, lastName)
        
        // Crear usuario
        const user = await prisma.user.create({
          data: {
            email,
            passwordHash: hashedPassword,
            roleId,
            emailVerified: false,
            isActive: true
          }
        })
        
        // Si es un profesional, linkear el usuario con el profesional
        if (professionalId) {
          await prisma.professional.update({
            where: { id: professionalId },
            data: { userId: user.id }
          })
          linked++
          console.log(`🔗 ${firstName} ${lastName} → Usuario creado y linkeado a Professional`)
        } else {
          console.log(`👤 ${firstName} ${lastName} → Usuario creado (solo administrativo)`)
        }
        
        created++
        
        // Contar roles
        if (roleId === 2) managerCount++
        else staffCount++
        
        // Guardar para reporte final
        createdUsers.push({
          name: `${firstName} ${lastName}`,
          email,
          role: roleName
        })
        
      } catch (error) {
        errors++
        const errorMsg = `Registro ${i + 1} (${prof.nombre} ${prof.apellido}): ${error instanceof Error ? error.message : 'Error desconocido'}`
        errorDetails.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }
    
    console.log(`\n🎉 Importación de usuarios completada!`)
    console.log(`✅ Usuarios creados: ${created}`)
    console.log(`🔗 Profesionales linkeados: ${linked}`)
    console.log(`❌ Errores: ${errors}`)
    
    console.log(`\n📊 Estadísticas por rol:`)
    console.log(`  • Manager: ${managerCount}`)
    console.log(`  • Staff: ${staffCount}`)
    
    console.log(`\n👥 Usuarios creados:`)
    createdUsers.forEach(user => {
      console.log(`  • ${user.name} (${user.role}) → ${user.email}`)
    })
    
    console.log(`\n🔐 Credenciales:`)
    console.log(`  • Contraseña temporal para todos: ${tempPassword}`)
    console.log(`  • Los usuarios deben cambiar su contraseña en el primer login`)
    
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
  importUsersFromProfessionals()
}

export { importUsersFromProfessionals }