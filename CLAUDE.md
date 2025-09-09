# Sistema de Gestión para Peluquería - Campos Estilistas

## 📋 INSTRUCCIONES PARA CLAUDE
- **Carpeta CLAUDE_INSTRUCTIONS**: Contiene archivos .md con instrucciones específicas para chats de Claude
- **OBLIGATORIO LEER**: `CLAUDE_INSTRUCTIONS/DIRECTIVAS.md` - Contiene directivas críticas que DEBEN respetarse en todos los chats

## 🎯 Objetivos del Proyecto
Desarrollar un sistema web completo de gestión para peluquerías que reemplace Wonoma, proporcionando mayor control y capacidad de personalización. El sistema debe gestionar servicios, profesionales, reservas de turnos y facturación.

## 🏗️ Arquitectura Técnica
- **Frontend**: Next.js 15+ con App Router
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Styling**: Tailwind CSS
- **Componentes UI**: Shadcn/UI
- **Estado Global**: Zustand
- **Validación**: Zod

## 📋 Funcionalidades Principales

### 🧑‍💼 Gestión de Profesionales
- Registro de estilistas/barberos
- Configuración de horarios de trabajo por profesional
- Asignación de servicios por especialista
- Control de disponibilidad y descansos
- Sueldo base mensual por profesional

### 💇‍♀️ Gestión de Servicios
- Catálogo completo de servicios (cortes, tintes, tratamientos, etc.)
- Duración estimada por servicio
- Precios por servicio
- Porcentaje de comisión por servicio
- Categorización de servicios
- Servicios combinados/paquetes

### 📅 Sistema de Reservas y Turnos
- **Para Clientes**:
  - Reservas online 24/7
  - Selección de profesional preferido
  - Selección de servicios múltiples
  - Confirmación automática o manual
  - Recordatorios automáticos (SMS/Email)
  - Cancelación y reprogramación
  - Historial de citas

- **Para Administradores**:
  - Vista de agenda por profesional
  - Vista de agenda general
  - Gestión de disponibilidad
  - Bloqueo de horarios
  - Confirmación manual de turnos
  - Lista de espera para horarios ocupados

### 👥 Gestión de Clientes
- Base de datos de clientes completa
- Historial de servicios realizados
- Preferencias de estilo y notas
- Información de contacto
- Programa de fidelización
- Recordatorios de citas pasadas

### 💰 Sistema de Facturación y Pagos
- Registro de servicios cobrados
- Facturación automática
- Múltiples métodos de pago
- Control de caja diaria
- Reportes de ventas
- Gestión de descuentos y promociones
- Cálculo automático de comisiones por servicio

### 📊 Dashboard y Reportes
- **Métricas de negocio**:
  - Ingresos diarios/semanales/mensuales
  - Servicios más solicitados
  - Profesionales más productivos
  - Horarios de mayor demanda
  - Índice de satisfacción del cliente

- **Reportes avanzados**:
  - Análisis de rentabilidad por servicio
  - Tendencias de reservas
  - Estadísticas de cancelaciones
  - Reportes de comisiones por profesional
  - Cálculo de sueldos base + comisiones

### 🔔 Sistema de Notificaciones
- Confirmaciones de reserva automáticas
- Recordatorios 24h antes de la cita
- Notificaciones de cancelación
- Alertas para administradores
- Notificaciones push (PWA)

## 🗄️ Modelo de Base de Datos Normalizado

### Tablas de Catálogo (Maestras)
```sql
-- Roles de usuario
UserRoles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  permissions JSON,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Super Admin, Manager, Staff, Client

-- Especialidades de profesionales
ProfessionalSpecialties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Estilista, Barbero, Colorista, Manicurista, etc.

-- Estados de profesionales
ProfessionalStatuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7), -- Color hex para UI
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Activo, Inactivo, Vacaciones, Licencia, etc.

-- Categorías de servicios
ServiceCategories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Icono para UI
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Cortes, Coloración, Tratamientos, Uñas, etc.

-- Estados de servicios
ServiceStatuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Activo, Inactivo, Descontinuado, Temporal, etc.

-- Días de la semana
WeekDays (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE,
  short_name VARCHAR(3) NOT NULL,
  day_number INTEGER NOT NULL UNIQUE, -- 0=Domingo, 1=Lunes, etc.
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Lunes, Martes, Miércoles, etc.

-- Estados de citas
AppointmentStatuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  is_final BOOLEAN DEFAULT false, -- Si es un estado final
  allows_modification BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Pendiente, Confirmada, En progreso, Completada, Cancelada, No Show

-- Métodos de pago
PaymentMethods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  requires_reference BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Efectivo, Tarjeta Débito, Tarjeta Crédito, Transferencia, etc.

-- Estados de pago
PaymentStatuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7),
  is_final BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Valores: Pendiente, Pagado, Fallido, Reembolsado, etc.
```

### Entidades Principales
```sql
-- Usuarios del sistema
Users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER REFERENCES UserRoles(id),
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profesionales
Professionals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  specialty_id INTEGER REFERENCES ProfessionalSpecialties(id),
  status_id INTEGER REFERENCES ProfessionalStatuses(id),
  base_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  hire_date DATE,
  bio TEXT,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Servicios disponibles
Services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES ServiceCategories(id),
  status_id INTEGER REFERENCES ServiceStatuses(id),
  duration_minutes INTEGER NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  requires_consultation BOOLEAN DEFAULT false,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Relación profesional-servicio (qué servicios puede hacer cada profesional)
ProfessionalServices (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES Professionals(id),
  service_id INTEGER REFERENCES Services(id),
  custom_price DECIMAL(10,2), -- Precio personalizado si difiere del base
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, service_id)
);

-- Horarios de trabajo
WorkSchedules (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES Professionals(id),
  weekday_id INTEGER REFERENCES WeekDays(id),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, weekday_id)
);

-- Clientes
Clients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  birth_date DATE,
  gender VARCHAR(20),
  notes TEXT,
  preferences JSON, -- Preferencias de estilo, alergias, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reservas/Turnos
Appointments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES Clients(id),
  professional_id INTEGER REFERENCES Professionals(id),
  service_id INTEGER REFERENCES Services(id),
  status_id INTEGER REFERENCES AppointmentStatuses(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  internal_notes TEXT, -- Notas solo para staff
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pagos y facturación
Payments (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES Appointments(id),
  method_id INTEGER REFERENCES PaymentMethods(id),
  status_id INTEGER REFERENCES PaymentStatuses(id),
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  reference_number VARCHAR(100), -- Número de transacción, cheque, etc.
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Configuración del sistema
Settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
  is_public BOOLEAN DEFAULT false, -- Si es accesible desde frontend
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Auditoría y logs
AuditLogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES Users(id),
  table_name VARCHAR(50) NOT NULL,
  record_id INTEGER NOT NULL,
  action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Índices Recomendados
```sql
-- Índices para optimización
CREATE INDEX idx_appointments_date_professional ON Appointments(appointment_date, professional_id);
CREATE INDEX idx_appointments_client ON Appointments(client_id);
CREATE INDEX idx_appointments_status ON Appointments(status_id);
CREATE INDEX idx_payments_appointment ON Payments(appointment_id);
CREATE INDEX idx_payments_status ON Payments(status_id);
CREATE INDEX idx_work_schedules_professional ON WorkSchedules(professional_id);
CREATE INDEX idx_professional_services_active ON ProfessionalServices(professional_id, is_active);
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_clients_phone ON Clients(phone);
CREATE INDEX idx_audit_logs_table_record ON AuditLogs(table_name, record_id);
```

## 🎨 Características de UX/UI

### Diseño Responsivo
- Optimizado para desktop, tablet y móvil
- PWA (Progressive Web App) para instalación en móviles
- Modo oscuro/claro

### Interfaz de Usuario
- Dashboard intuitivo para administradores
- Calendario visual interactivo
- Formularios de reserva simplificados
- Portal del cliente con historial

### Experiencia del Cliente
- Proceso de reserva en 3 pasos máximo
- Vista previa de disponibilidad en tiempo real
- Confirmación inmediata
- Recordatorios automáticos

## 🔒 Seguridad y Permisos

### Roles de Usuario
- **Super Admin**: Control total del sistema
- **Manager**: Gestión de profesionales y configuración
- **Staff**: Acceso a agenda y clientes asignados
- **Client**: Portal de cliente con funciones limitadas

### Medidas de Seguridad
- Autenticación robusta con NextAuth.js
- Validación de datos con Zod
- Rate limiting en APIs
- Logs de auditoría
- Backup automático de datos

## 📱 Funcionalidades Avanzadas

### Integraciones
- WhatsApp Business API para notificaciones
- Google Calendar sync
- Sistemas de pago (Stripe, MercadoPago)
- SMS/Email providers

### Características Premium
- Sistema de lista de espera inteligente
- Recomendaciones de servicios basadas en historial
- Programa de fidelización con puntos
- Marketing automation
- Multi-sucursal (futuro)

## 🎯 Estado Actual del Proyecto

### ✅ Completado
- **Configuración inicial**: Next.js 15, TypeScript, Tailwind CSS configurados
- **Base de datos**: PostgreSQL + Prisma con schema completo (13 modelos)
- **Datos maestros**: Seeding completado con 37 registros de catálogo
- **UI Framework**: Shadcn/UI instalado y configurado con tema Stone
- **Panel de administración**: Layout profesional con sidebar, navegación y dashboard
- **Documentación**: Guía de Prisma y directivas para desarrollo
- **🆕 Importación masiva de datos**:
  - **3,547 clientes** importados desde CSV con validaciones
  - **8 profesionales** importados desde JSON con especialidades
  - **12 usuarios** creados con roles y vinculación automática
- **🆕 Scripts de importación**: Sistema completo para migración de datos

### 📂 Estructura Actual
```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Layout del panel admin
│   │   ├── page.tsx            # Dashboard principal
│   │   └── professionals/
│   │       └── page.tsx        # Vista de profesionales
│   ├── globals.css             # Estilos con Shadcn/UI
│   └── layout.tsx              # Layout raíz
├── lib/
│   ├── prisma.ts              # Cliente de Prisma
│   └── utils.ts               # Utilidades de Shadcn/UI
└── components/ui/             # Componentes Shadcn/UI

prisma/
├── schema.prisma              # Schema completo de BD
├── migrations/                # Migraciones aplicadas
└── seed.ts                   # Script de datos maestros

scripts/                       # 🆕 Scripts de importación
├── import-clients.ts          # Importar clientes desde CSV
├── import-professionals.ts    # Importar profesionales desde JSON
└── import-users.ts           # Crear usuarios y vincular profesionales

extra_data/                    # 🆕 Datos fuente para importación
├── clientes.csv              # 3,547 clientes del sistema anterior
└── profesionales.json       # 12 profesionales con roles

DOCS/
└── prisma.md                 # Guía de comandos Prisma

CLAUDE_INSTRUCTIONS/
└── DIRECTIVAS.md             # Reglas para desarrollo
```

### 🔧 Scripts Configurados
```bash
# Desarrollo
npm run dev              # Desarrollo con Turbopack
npm run build            # Build de producción
npm run start            # Servidor de producción

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:migrate       # Crear migraciones
npm run db:seed          # Poblar datos maestros
npm run db:studio        # Interfaz visual de BD

# 🆕 Importación de datos
npm run import:clients       # Importar 3,547 clientes desde CSV
npm run import:professionals # Importar 8 profesionales desde JSON
npm run import:users        # Crear 12 usuarios con roles y vinculación
```

## 📊 Sistema de Importación de Datos

### 🎯 Resumen de Importación Completada

| Entidad | Registros | Origen | Script | Estado |
|---------|-----------|---------|---------|---------|
| **Clientes** | 3,547 | `clientes.csv` | `import-clients.ts` | ✅ Completado |
| **Profesionales** | 8 | `profesionales.json` | `import-professionals.ts` | ✅ Completado |
| **Usuarios** | 12 | `profesionales.json` | `import-users.ts` | ✅ Completado |

### 🔧 Características de los Scripts

#### `import-clients.ts`
- **Fuente**: CSV con separador `;` y encoding UTF-8
- **Validaciones**: Emails, teléfonos, fechas de nacimiento
- **Procesamiento**: Lotes de 50 registros para optimización
- **Datos**: 59 clientes con fechas de nacimiento válidas
- **Limpieza**: Capitalización automática de nombres

#### `import-professionals.ts`
- **Fuente**: JSON estructurado del sistema anterior
- **Filtrado**: Solo profesionales con `show=1` (pueden atender clientes)
- **Especialidades**: Mapeo automático basado en descripción del puesto
- **Estados**: Todos marcados como "Activo"
- **Omitidos**: 4 administrativos (se procesan en import-users)

#### `import-users.ts`
- **Generación**: Emails automáticos (`nombre.apellido@camposestilistas.com`)
- **Roles**: Máximo Movsovich → Manager, resto → Staff
- **Vinculación**: Usuarios linkados automáticamente con profesionales
- **Seguridad**: Contraseñas hasheadas con bcrypt
- **Credenciales**: Contraseña temporal `Campos2024!` para todos

### 📈 Estadísticas de Base de Datos

```
📊 Datos en producción:
├── 37 registros de catálogo (especialidades, estados, etc.)
├── 3,547 clientes con historiales
├── 8 profesionales activos
├── 12 usuarios del sistema
└── 4 roles configurados (Super Admin, Manager, Staff, Client)

🎯 Datos listos para:
├── Sistema de reservas
├── Gestión de servicios  
├── Asignación de horarios
└── Panel administrativo
```

## 🚀 Roadmap de Desarrollo

### Fase 1 - MVP (4-6 semanas)
- [x] Configuración inicial del proyecto
- [x] Diseño de base de datos y modelos
- [x] Panel de administración base con Shadcn/UI
- [x] **🆕 Importación masiva de datos del sistema anterior**
- [x] **🆕 Gestión completa de usuarios y profesionales**
- [ ] Autenticación básica
- [ ] CRUD de servicios y asignación a profesionales
- [ ] Sistema básico de reservas
- [ ] Dashboard administrativo funcional

### Fase 2 - Core Features (4-6 semanas)
- [ ] Sistema completo de gestión de clientes
- [ ] Calendario interactivo avanzado
- [ ] Portal del cliente
- [ ] Sistema de notificaciones
- [ ] Reportes básicos
- [ ] Facturación simple

### Fase 3 - Advanced Features (6-8 semanas)
- [ ] Reportes avanzados y analytics
- [ ] Sistema de pagos integrado
- [ ] Cálculo automático de comisiones y sueldos
- [ ] Notificaciones push (PWA)
- [ ] Optimizaciones de rendimiento
- [ ] Testing completo
- [ ] Deployment y monitoreo

### Fase 4 - Premium Features (Futuro)
- [ ] Integraciones externas
- [ ] Machine learning para recomendaciones
- [ ] Multi-sucursal
- [ ] API pública
- [ ] Mobile app nativa

## 🛠️ Configuración de Desarrollo

### Scripts de Desarrollo
```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Base de datos
npm run db:generate  # Generar migraciones Prisma
npm run db:push      # Aplicar cambios a la DB
npm run db:seed      # Datos de prueba

# Testing
npm run test
npm run test:e2e

# Build y deploy
npm run build
npm run start
```

### Variables de Entorno
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
SMTP_HOST="..."
SMTP_USER="..."
SMTP_PASSWORD="..."
```

## 📞 Soporte y Mantenimiento

### Monitoring
- Health checks automatizados
- Logging centralizado
- Alertas de rendimiento
- Backup automático diario

### Actualizaciones
- Versionado semántico
- Changelog detallado
- Rollback automático en caso de errores
- Testing antes de cada release

---

**Proyecto iniciado**: Septiembre 2025
**Desarrollado para**: Campos Estilistas
**Tecnologías**: Next.js, PostgreSQL, Prisma, Tailwind CSS