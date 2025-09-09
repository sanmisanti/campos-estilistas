import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Aquí se puede agregar lógica adicional de autorización si es necesario
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Permitir acceso a login sin autenticación
        if (pathname.startsWith("/login")) {
          return true
        }
        
        // Proteger rutas de admin - por ahora permitir todos los roles autenticados
        if (pathname.startsWith("/admin")) {
          return !!token
        }
        
        // Para otras rutas, verificar si hay token válido
        return !!token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ]
}