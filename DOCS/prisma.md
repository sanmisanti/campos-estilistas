# 🗄️ Guía de Prisma - Base de Datos

Esta guía explica cómo trabajar con Prisma en el proyecto Campos Estilistas.

## 📋 Comandos Principales

### `npm run db:generate`
**Propósito**: Genera el cliente de Prisma con tipos TypeScript actualizados.

```bash
npm run db:generate
```

**Cuándo usar**:
- Después de modificar `prisma/schema.prisma`
- Para actualizar tipos TypeScript sin cambiar la BD
- Cuando otros desarrolladores modificaron el schema

**Qué hace**:
- Lee el archivo `prisma/schema.prisma`
- Genera código TypeScript en `node_modules/@prisma/client`
- Actualiza tipos e interfaces para autocompletado

---

### `npm run db:migrate`
**Propósito**: Crea y aplica migraciones de base de datos.

```bash
npm run db:migrate
# o con nombre específico
npx prisma migrate dev --name "agregar_campo_telefono"
```

**Cuándo usar**:
- Cuando quieres aplicar cambios del schema a la base de datos
- Para crear un historial versionado de cambios
- En desarrollo cuando modificas modelos

**Qué hace**:
1. Compara schema actual vs base de datos
2. Genera archivo SQL en `prisma/migrations/`
3. Aplica cambios a la base de datos
4. Ejecuta automáticamente `db:generate`

---

### `npm run db:push`
**Propósito**: Empuja cambios directos a la BD sin crear migración.

```bash
npm run db:push
```

**Cuándo usar**:
- Prototipado rápido
- Cambios experimentales
- Cuando no necesitas historial de migraciones

**⚠️ Precaución**: No crea archivos de migración, solo actualiza la BD.

---

## 🔄 Flujo de Trabajo para Modificar la Base de Datos

### Escenario 1: Agregar un campo
```bash
# 1. Modificar prisma/schema.prisma
# Ejemplo: agregar campo 'telefono' al modelo Professional

# 2. Aplicar cambios
npm run db:migrate

# 3. El comando automáticamente:
#    - Crea migración SQL
#    - Aplica cambios a la BD  
#    - Genera cliente actualizado
```

### Escenario 2: Solo probar cambios (sin migración)
```bash
# 1. Modificar prisma/schema.prisma

# 2. Empujar cambios directos
npm run db:push

# 3. Si te gusta el resultado, crear migración formal
npm run db:migrate
```

### Escenario 3: Solo actualizar tipos (sin cambiar BD)
```bash
# 1. Otro desarrollador cambió el schema

# 2. Solo regenerar cliente
npm run db:generate
```

## 📁 Estructura de Archivos

```
prisma/
├── schema.prisma        # Schema principal
├── migrations/          # Historial de migraciones
│   └── 20240101_init/
│       └── migration.sql
└── seed.ts             # Datos iniciales
```

## 🎯 Mejores Prácticas

### ✅ Recomendado
- Usar `db:migrate` para cambios definitivos
- Nombrar migraciones descriptivamente
- Revisar archivos SQL generados antes de aplicar
- Hacer backup antes de migraciones grandes

### ❌ Evitar
- Editar archivos de migración manualmente
- Usar `db:push` en producción
- Aplicar migraciones sin revisar los cambios SQL

## 🆘 Comandos de Emergencia

### Resetear base de datos
```bash
npm run db:reset
# ⚠️ BORRA TODOS LOS DATOS
```

### Ver estado de migraciones
```bash
npx prisma migrate status
```

### Aplicar migraciones pendientes
```bash
npx prisma migrate resolve --applied "nombre_migracion"
```

## 🔍 Herramientas Útiles

### Prisma Studio (Interfaz Visual)
```bash
npm run db:studio
# Abre interfaz web en http://localhost:5555
```

### Ver esquema de BD
```bash
npx prisma db pull
# Sincroniza schema desde BD existente
```

---

## 📞 Soporte
Si tienes dudas sobre migraciones o cambios en la BD, consulta:
- [Documentación oficial de Prisma](https://www.prisma.io/docs/)
- El archivo `CLAUDE_INSTRUCTIONS/DIRECTIVAS.md` para protocolo de comandos