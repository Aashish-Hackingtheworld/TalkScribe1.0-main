export interface User {
  id: string
  email: string
  createdAt: string
}

export const simpleAuth = {
  // Sign up a new user
  signUp: (email: string, password: string): { success: boolean; error?: string; user?: User } => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if user already exists
      if (users.find((u: User) => u.email === email)) {
        return { success: false, error: "User already exists" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        createdAt: new Date().toISOString(),
      }

      // Store user credentials (in real app, hash the password)
      const credentials = JSON.parse(localStorage.getItem("credentials") || "{}")
      credentials[email] = password

      // Save user and credentials
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("credentials", JSON.stringify(credentials))
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: "Failed to create account" }
    }
  },

  // Sign in existing user
  signIn: (email: string, password: string): { success: boolean; error?: string; user?: User } => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const credentials = JSON.parse(localStorage.getItem("credentials") || "{}")

      const user = users.find((u: User) => u.email === email)

      if (!user || credentials[email] !== password) {
        return { success: false, error: "Invalid email or password" }
      }

      localStorage.setItem("currentUser", JSON.stringify(user))
      return { success: true, user }
    } catch (error) {
      return { success: false, error: "Failed to sign in" }
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    try {
      const currentUser = localStorage.getItem("currentUser")
      return currentUser ? JSON.parse(currentUser) : null
    } catch (error) {
      return null
    }
  },

  // Sign out
  signOut: (): void => {
    localStorage.removeItem("currentUser")
  },
}
