import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AxiosError } from 'axios'

interface FormFields {
  email: string
  password: string
  confirmPassword: string
  name: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
}

export default function SignupPage() {
  const { signup } = useAuth()

  const [fields, setFields] = useState<FormFields>({ email: '', password: '', confirmPassword: '', name: '' })
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
    if (!fields.name.trim()) {
      next.name = '이름을 입력해주세요.'
    }
    if (!fields.email.trim()) {
      next.email = '이메일을 입력해주세요.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = '올바른 이메일 형식이 아닙니다.'
    }
    if (!fields.password) {
      next.password = '비밀번호를 입력해주세요.'
    } else if (fields.password.length < 6) {
      next.password = '비밀번호는 6자 이상이어야 합니다.'
    }
    if (!fields.confirmPassword) {
      next.confirmPassword = '비밀번호 확인을 입력해주세요.'
    } else if (fields.password !== fields.confirmPassword) {
      next.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const { confirmPassword: _, ...signupData } = fields
      await signup(signupData)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>
      const status = axiosErr.response?.status
      if (status === 409) {
        setServerError('이미 사용 중인 이메일입니다.')
      } else {
        setServerError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-500 text-sm">새 계정을 만들어주세요</p>
        </div>

        {serverError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="홍길동"
              value={fields.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all ${
                errors.name
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

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
              placeholder="6자 이상 입력해주세요"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              value={fields.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 text-sm outline-none transition-all ${
                errors.confirmPassword
                  ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                  : fields.confirmPassword && fields.password === fields.confirmPassword
                  ? 'border-green-400 bg-white focus:ring-2 focus:ring-green-300'
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
            {!errors.confirmPassword && fields.confirmPassword && fields.password === fields.confirmPassword && (
              <p className="mt-1 text-xs text-green-500">비밀번호가 일치합니다.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-500 hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
