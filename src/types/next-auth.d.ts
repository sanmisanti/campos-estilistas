import "next-auth"

declare module "next-auth" {
  interface User {
    role: string
    professionalId?: number
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      professionalId?: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    professionalId?: number
  }
}