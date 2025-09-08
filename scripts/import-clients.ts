import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ClientCSVRow {
  ID: string
  'Nombre y apellido': string
  'E-mail': string
  'Teléfono': string
  'Tipo documento': string
  'Nro de documento': string
  'Cumpleaños (YYYY-MM-DD)': string
  'Cumpleaños (MM/DD/YYYY)': string
  'Cumpleaños (MM/DD)': string
  'Monto facturado': string
  'Reservas cumplidas': string
  'Saldo': string
  'Creación': string
  'Apellido': string
  'Nombre': string
}

function parseCSV(csvContent: string): ClientCSVRow[] {
  // Remover BOM si existe
  const cleanContent = csvContent.replace(/^\uFEFF/, '')
  const lines = cleanContent.split('\n')
  const headers = lines[0].split(';')
  
  const data: ClientCSVRow[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = line.split(';')
    const row: any = {}
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] || ''
    })
    
    data.push(row as ClientCSVRow)
  }
  
  return data
}

function cleanEmail(email: string): string | null {
  if (!email || email.trim() === '') return null
  const cleaned = email.trim().toLowerCase()
  if (!cleaned.includes('@') || cleaned.length < 5) return null
  // Validación básica de formato email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(cleaned) ? cleaned : null
}

function cleanPhone(phone: string): string | null {
  if (!phone || phone.trim() === '') return null
  // Remover espacios y caracteres especiales excepto +
  const cleaned = phone.replace(/[^\d+\-\s]/g, '').trim()
  if (cleaned.length < 7) return null
  return cleaned
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

function parseBirthDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === '') return null
  
  try {
    // El formato es YYYY-MM-DD
    const date = new Date(dateStr + 'T00:00:00.000Z')
    
    // Validar que la fecha es válida y no es futura
    if (isNaN(date.getTime())) return null
    if (date > new Date()) return null
    
    // Validar que no es demasiado antigua (más de 120 años)
    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 120)
    if (date < minDate) return null
    
    return date
  } catch {
    return null
  }
}

async function importClientsFromCSV() {
  console.log('🚀 Iniciando importación de clientes desde CSV...')
  
  try {
    const csvPath = path.join(process.cwd(), 'extra_data', 'clientes.csv')
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ No se encontró el archivo: ${csvPath}`)
      return
    }
    
    console.log('📖 Leyendo archivo CSV...')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const clientsData = parseCSV(csvContent)
    
    console.log(`📊 Encontrados ${clientsData.length} registros para procesar`)
    
    let created = 0
    let skipped = 0
    let errors = 0
    let withBirthDate = 0
    let withEmail = 0
    let withPhone = 0
    const errorDetails: string[] = []
    
    // Procesar en lotes para mejor rendimiento
    const batchSize = 50
    const totalBatches = Math.ceil(clientsData.length / batchSize)
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * batchSize
      const end = Math.min(start + batchSize, clientsData.length)
      const batch = clientsData.slice(start, end)
      
      console.log(`📦 Procesando lote ${batchIndex + 1}/${totalBatches} (registros ${start + 1}-${end})`)
      
      for (let i = 0; i < batch.length; i++) {
        const row = batch[i]
        const rowIndex = start + i + 1
        
        try {
          // Limpiar y validar datos
          const firstName = cleanName(row.Nombre)
          const lastName = cleanName(row.Apellido) || 'Sin apellido'
          const email = cleanEmail(row['E-mail'])
          const phone = cleanPhone(row['Teléfono'])
          const birthDate = parseBirthDate(row['Cumpleaños (YYYY-MM-DD)'])
          
          // Validar que al menos tenga nombre
          if (!firstName || firstName === '') {
            skipped++
            console.warn(`⚠️  Fila ${rowIndex}: Cliente sin nombre válido - OMITIDO`)
            continue
          }
          
          // Contar estadísticas
          if (birthDate) withBirthDate++
          if (email) withEmail++
          if (phone) withPhone++
          
          // Crear cliente
          await prisma.client.create({
            data: {
              firstName,
              lastName,
              email,
              phone,
              birthDate,
              notes: `Importado del sistema anterior. ID original: ${row.ID}`,
              isActive: true
            }
          })
          
          created++
          
          if (created % 100 === 0) {
            console.log(`  ✅ ${created} clientes creados hasta ahora...`)
          }
          
        } catch (error) {
          errors++
          const errorMsg = `Fila ${rowIndex} (${row.Nombre} ${row.Apellido}): ${error instanceof Error ? error.message : 'Error desconocido'}`
          errorDetails.push(errorMsg)
          
          if (errors <= 5) {
            console.error(`❌ ${errorMsg}`)
          }
        }
      }
    }
    
    console.log(`\n🎉 Importación completada!`)
    console.log(`✅ Clientes creados: ${created}`)
    console.log(`⚠️  Registros omitidos: ${skipped}`)
    console.log(`❌ Errores: ${errors}`)
    console.log(`\n📊 Estadísticas de datos:`)
    console.log(`  • Clientes con fecha de nacimiento: ${withBirthDate}`)
    console.log(`  • Clientes con email: ${withEmail}`)
    console.log(`  • Clientes con teléfono: ${withPhone}`)
    console.log(`  • Tasa de éxito: ${((created / clientsData.length) * 100).toFixed(1)}%`)
    
    if (errorDetails.length > 0) {
      console.log(`\n📋 Errores encontrados:`)
      errorDetails.slice(0, 10).forEach(detail => console.log(`  - ${detail}`))
      if (errorDetails.length > 10) {
        console.log(`  ... y ${errorDetails.length - 10} errores más`)
      }
    }
    
  } catch (error) {
    console.error('💥 Error fatal durante la importación:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  importClientsFromCSV()
}

export { importClientsFromCSV }