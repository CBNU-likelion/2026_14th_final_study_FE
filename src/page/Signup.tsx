import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authApi } from '../api/auth'

function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [isSignupLoading, setIsSignupLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password || !name) {
      alert('모든 값을 입력해주세요.')
      return
    }

    try {
      setIsSignupLoading(true)

      await authApi.signup({
        email,
        password,
        name
      })

      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (error) {
      console.error('회원가입 에러:', error)

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '회원가입에 실패했습니다.')
      } else {
        alert('알 수 없는 에러가 발생했습니다.')
      }
    } finally {
      setIsSignupLoading(false)
    }
  }


  return (
    <div className="auth-page">
      <div className="auth-card">


        <div className="auth-header">
          <h1 className="auth-title">회원가입</h1>
          <p className="auth-subtitle">간단한 정보로 빠르게 가입하세요.</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="auth-input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="auth-input"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="auth-input"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-btn auth-btn-primary" disabled={isSignupLoading}>
            {isSignupLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          <button type="button" className="auth-btn auth-btn-secondary" onClick={() => navigate('/login')}>
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;