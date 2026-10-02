import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: "STUDENT" | "COACH" | "ADMIN"
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "STUDENT" | "COACH" | "ADMIN"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "STUDENT" | "COACH" | "ADMIN"
  }
}

// MongoDB User Document interface for reference
export interface MongoUser {
  _id: string
  name?: string
  email?: string
  image?: string
  role: "STUDENT" | "COACH" | "ADMIN"
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}
