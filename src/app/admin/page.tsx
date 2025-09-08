import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Scissors, 
  UserCheck, 
  Calendar,
  TrendingUp,
  Clock,
  DollarSign,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Profesionales",
      value: "0",
      description: "Equipo activo",
      icon: Users,
      trend: "+0%",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Servicios",
      value: "0",
      description: "Catálogo disponible",
      icon: Scissors,
      trend: "+0%",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Clientes",
      value: "0",
      description: "Base registrada",
      icon: UserCheck,
      trend: "+0%",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Citas Hoy",
      value: "0",
      description: "Programadas",
      icon: Calendar,
      trend: "+0%",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ]

  const quickActions = [
    {
      title: "Agregar Profesional",
      description: "Registra un nuevo miembro del equipo",
      icon: Users,
      href: "/admin/professionals",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Crear Servicio",
      description: "Añade un nuevo servicio al catálogo",
      icon: Scissors,
      href: "/admin/services",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Registrar Cliente",
      description: "Añade un cliente a la base de datos",
      icon: UserCheck,
      href: "/admin/clients",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  const recentActivity = [
    {
      title: "Sistema inicializado",
      description: "Base de datos creada con datos maestros",
      time: "Hace 1 hora",
      type: "system"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-2">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Bienvenido al Panel de Administración
              </CardTitle>
              <CardDescription>
                Gestiona profesionales, servicios, clientes y citas desde este panel central.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-md p-2 ${stat.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="mt-2 flex items-center text-xs">
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                  <span className="ml-2 text-muted-foreground">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Acciones Rápidas</span>
            </CardTitle>
            <CardDescription>
              Accesos directos a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-accent">
                    <div className={`rounded-lg p-2 ${action.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ir
                    </Button>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Actividad Reciente</span>
            </CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty state for when there's no activity */}
            <div className="mt-6 rounded-lg border-2 border-dashed p-6 text-center">
              <Clock className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">
                ¡Comienza a usar el sistema!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Una vez que agregues datos, verás la actividad aquí.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}