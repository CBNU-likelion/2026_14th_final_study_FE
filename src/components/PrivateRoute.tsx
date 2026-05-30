import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

/**
 * [설계 근거]
 * 보호된 경로에 접근할 때 토큰 유무만으로 렌더링 여부를 결정.
 * replace prop을 사용해 브라우저 뒤로가기로 보호 경로에
 * 재진입하는 것을 방지한다.
 */
export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
