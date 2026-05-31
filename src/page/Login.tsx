import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authApi } from '../api/auth'

function Login() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('likelion')
  const [password, setPassword] = useState('1234')
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.')
      return
    }

    try {
      setIsLoginLoading(true)

      const response = await authApi.login({
        email: username,
        password,
      })

      const loginData = response.data.data

      localStorage.setItem('accessToken', loginData.accessToken)
      localStorage.setItem('refreshToken', loginData.refreshToken)
      localStorage.setItem('userId', String(loginData.userId))
      localStorage.setItem('userEmail', loginData.email)
      localStorage.setItem('userName', loginData.name)

      alert(`${loginData.name}님 로그인 성공`)

      navigate('/mypage')
    } catch (error) {
      console.error('로그인 에러:', error)

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '로그인에 실패했습니다.')
      } else {
        alert('알 수 없는 에러가 발생했습니다.')
      }
    } finally {
      setIsLoginLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">로그인</h1>
          <p className="auth-subtitle">
            아이디 또는 이메일과 비밀번호를 입력해주세요.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디 또는 이메일"
              className="auth-input"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            className="auth-btn auth-btn-primary"
            disabled={isLoginLoading}
          >
            {isLoginLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="auth-btn auth-btn-secondary"
            onClick={() => navigate('/signup')}
          >
            회원가입으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login