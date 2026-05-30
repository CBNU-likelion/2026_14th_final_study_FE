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

/**
 * [설계 근거 — 토큰 저장 전략]
 *
 * Access Token 보관 위치 비교:
 *
 * | 방법              | XSS 취약 | CSRF 취약 | 페이지 새로고침 |
 * |-------------------|----------|-----------|----------------|
 * | 메모리(Context)   | 안전     | 안전      | 토큰 소멸      |
 * | localStorage      | 취약     | 안전      | 유지           |
 * | HttpOnly Cookie   | 안전     | 취약      | 유지           |
 *
 * 이 프로젝트는 Refresh Token 재발급이 요구사항에서 제외되었으므로
 * '새로고침 후 재로그인 필요' 조건을 감수하더라도 XSS에 강한
 * localStorage 전략을 채택했다. (HttpOnly Cookie는 백엔드 Set-Cookie
 * 지원이 필요하여 현 명세에서 불가)
 *
 * 실서비스라면: Access Token → 메모리, Refresh Token → HttpOnly Cookie
 * 조합이 이상적이다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem('accessToken'),
  )
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem('userEmail'),
  )

  /** Axios 인터셉터에 navigate 함수 주입 */
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
