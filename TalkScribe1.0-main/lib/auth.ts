export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const authService = {
  login: (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    return new Promise((resolve) => {
      // Simple validation
      if (!email || !password) {
        resolve({ success: false, error: "Email and password are required" })
        return
      }

      // Get stored users or create empty array
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if user exists
      let user = users.find((u: any) => u.email === email)

      if (!user) {
        // Create new user if doesn't exist
        user = {
          id: Date.now().toString(),
          email,
          password, // In real app, this would be hashed
          name: email.split("@")[0],
        }
        users.push(user)
        localStorage.setItem("users", JSON.stringify(users))
      } else if (user.password !== password) {
        resolve({ success: false, error: "Invalid password" })
        return
      }

      // Store current user
      const authUser = { id: user.id, email: user.email, name: user.name }
      localStorage.setItem("currentUser", JSON.stringify(authUser))

      resolve({ success: true, user: authUser })
    })
  },

  logout: () => {
    localStorage.removeItem("currentUser")
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("currentUser")
  },
}
