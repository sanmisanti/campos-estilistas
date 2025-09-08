# DIRECTIVAS Y OBLIGACIONES PARA CLAUDE

## 🚫 REGLA CRÍTICA: NO EJECUTAR COMANDOS

**OBLIGATORIO**: Claude **NUNCA** debe ejecutar comandos bash, npm, scripts o cualquier tipo de comando del sistema por su cuenta.

### Protocolo Obligatorio:
1. Cuando se necesite ejecutar un comando, Claude debe:
   - Explicar qué comando se necesita ejecutar
   - Explicar por qué es necesario
   - Proporcionar el comando exacto para que el usuario lo ejecute
   - Esperar a que el usuario ejecute el comando y proporcione la salida
   - Continuar el trabajo basándose en la salida proporcionada

2. Ejemplos de comandos que requieren autorización del usuario:
   - `npm install`
   - `npm run build`
   - `npx prisma generate`
   - `git commit`
   - Cualquier comando bash
   - Creación/eliminación de directorios con mkdir/rm
   - Modificación de permisos

### Excepciones Permitidas:
- Lectura de archivos (Read tool)
- Escritura/edición de archivos (Write/Edit tools)
- Búsqueda de archivos (Glob/Grep tools)

## ⚡ OTRAS DIRECTIVAS IMPORTANTES

1. **Confirmación Explícita**: Siempre pedir confirmación antes de hacer cambios significativos
2. **Transparencia**: Explicar claramente qué se va a hacer antes de hacerlo
3. **Documentación**: Mantener actualizado CLAUDE.md con cambios importantes
4. **Backup Mental**: Antes de cambios grandes, recordar al usuario hacer backup

## 📝 FORMATO DE SOLICITUD DE COMANDOS

```
Para continuar necesito que ejecutes este comando:

**Comando**: `npm install prisma @prisma/client`
**Propósito**: Instalar Prisma y el cliente para gestión de base de datos
**Ubicación**: Ejecutar en la raíz del proyecto

Después de ejecutarlo, compárteme la salida para continuar.
```

---
*Esta directiva debe ser respetada en TODOS los chats futuros sin excepción.*