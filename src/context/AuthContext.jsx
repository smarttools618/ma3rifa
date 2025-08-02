import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children, supabase }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null) // 'user', 'admin', 'assistant'
  const [userGrade, setUserGrade] = useState(null) // 1-6
  const [userPlan, setUserPlan] = useState(null) // 'free', 'paid'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (data.session) {
        setUser(data.session.user)
        // Fetch user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, grade, plan')
          .eq('id', data.session.user.id)
          .single()
        
        if (profileData) {
          setUserRole(profileData.role)
          setUserGrade(profileData.grade)
          setUserPlan(profileData.plan)
        }
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user)
          // Fetch user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role, grade, plan')
            .eq('id', session.user.id)
            .single()
          
          if (profileData) {
            setUserRole(profileData.role)
            setUserGrade(profileData.grade)
            setUserPlan(profileData.plan)
          }
        } else {
          setUser(null)
          setUserRole(null)
          setUserGrade(null)
          setUserPlan(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  // Sign up function
  const signUp = async (email, password, name, grade) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              grade,
              role: 'user', // Default role
              plan: 'free', // Default plan
              created_at: new Date(),
            },
          ])

        if (profileError) throw profileError
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Update password
  const updatePassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    userRole,
    userGrade,
    userPlan,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}