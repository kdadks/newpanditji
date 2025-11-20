/**
 * Simple authentication service
 * Replaces GitHub Spark authentication
 */

export interface User {
  username: string
  isOwner: boolean
}

// Test account credentials (will be replaced with database authentication later)
const TEST_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

class AuthService {
  private currentUser: User | null = null

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('auth_user')
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('auth_user')
      }
    }
  }

  /**
   * Login with username and password
   */
  login(username: string, password: string): boolean {
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
      this.currentUser = {
        username: username,
        isOwner: true
      }
      localStorage.setItem('auth_user', JSON.stringify(this.currentUser))
      return true
    }
    return false
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.currentUser = null
    localStorage.removeItem('auth_user')
  }

  /**
   * Get current user (mimics window.spark.user() API)
   */
  async user(): Promise<User | null> {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  /**
   * Check if current user is owner
   */
  isOwner(): boolean {
    return this.currentUser?.isOwner ?? false
  }
}

// Export singleton instance
export const authService = new AuthService()
