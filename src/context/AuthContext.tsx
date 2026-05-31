import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigate } from '../api/axiosInstance'
import { loginApi, signupApi } from '../api/auth'
import type { LoginRequest, SignupRequest } from '../api/auth'

interface AuthContextType {
  accessToken: string | null
  userEmail: string | null
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem('accessToken'),
  )
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem('userEmail'),
  )

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  const login = async (data: LoginRequest) => {
    const res = await loginApi(data)
    const token = res.data.result.accessToken
    localStorage.setItem('accessToken', token)
    localStorage.setItem('userEmail', data.email)
    setAccessToken(token)
    setUserEmail(data.email)
    navigate('/mypage')
  }

  const signup = async (data: SignupRequest) => {
    await signupApi(data)
    navigate('/login')
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userEmail')
    setAccessToken(null)
    setUserEmail(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userEmail,
        isAuthenticated: !!accessToken,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
