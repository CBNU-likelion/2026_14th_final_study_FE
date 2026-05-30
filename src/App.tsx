import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AccessDenied from './components/AccessDenied'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'

/**
 * [설계 근거 — AuthProvider 위치]
 * AuthProvider 내부에서 useNavigate()를 호출하므로
 * BrowserRouter 안에 위치해야 한다.
 * 라우트 정의도 같은 트리 안에 있어야 하므로
 * Routes를 AuthProvider 아래에 배치한다.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 루트 → 로그인 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 공개 경로 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 403 전용 경로 */}
          <Route path="/forbidden" element={<AccessDenied />} />

          {/* 보호된 경로 */}
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />

          {/* 존재하지 않는 경로 → 로그인 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
