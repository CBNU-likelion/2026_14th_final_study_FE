import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AxiosError } from 'axios'

interface FormFields {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const { login } = useAuth()

  const [fields, setFields] = useState<FormFields>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setServerError(null)
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!fields.email.trim()) {
      next.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = '올바른 이메일 형식이 아닙니다.'
    }
    if (!fields.password) {
      next.password = '비밀번호를 입력해주세요.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login(fields)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>
      const status = axiosErr.response?.status
      if (status === 401) {
        setServerError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else {
        setServerError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-500 text-sm">계정 정보를 입력해주세요</p>
        </div>

        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={fields.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all ${
                errors.email
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={fields.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all ${
                errors.password
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
