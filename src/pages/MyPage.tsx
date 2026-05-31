import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyInfoApi } from '../api/auth'
import type { UserInfo } from '../api/auth'

export default function MyPage() {
  const { logout, userEmail } = useAuth()

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyInfoApi()
      .then((res) => setUserInfo(res.data.result))
      .catch(() => {
        if (userEmail) setUserInfo({ email: userEmail, name: '' })
        else setError('회원 정보를 불러오지 못했습니다.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-blue-500">
              {userInfo?.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
        </div>

        <dl className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-500">이름</dt>
            <dd className="text-sm text-gray-900 font-semibold">{userInfo?.name ?? '-'}</dd>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-500">이메일</dt>
            <dd className="text-sm text-gray-900">{userInfo?.email ?? '-'}</dd>
          </div>
        </dl>

        <button
          onClick={logout}
          className="w-full mt-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
