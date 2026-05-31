import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authApi } from '../api/auth'

type Profile = {
  id: number
  email: string
  name: string
  role: string
  createdAt: string
}

function MyPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  const handleGetProfile = async () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      alert('토큰이 없습니다. 먼저 로그인해주세요.')
      navigate('/login')
      return
    }

    try {
      setIsProfileLoading(true)
      const response = await authApi.getProfile()
      setProfile(response.data.data)
    } catch (error) {
      console.error('내 정보 조회 실패:', error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('로그인이 만료되었습니다.')
          localStorage.clear()
          navigate('/login')
          return
        }

        alert(error.response?.data?.message || '내 정보 조회에 실패했습니다.')
      } else {
        alert('알 수 없는 에러가 발생했습니다.')
      }
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('로그아웃 에러:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      alert('로그아웃되었습니다.')
      navigate('/login')
    }
  }

  useEffect(() => {
    handleGetProfile()
  }, [])


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">마이페이지</h1>
          <p className="mt-2 text-sm text-zinc-400">
            로그인한 사용자 정보를 확인합니다
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-50 p-5">
          {isProfileLoading && (
            <p className="text-center text-sm text-zinc-500">
              내 정보 조회 중...
            </p>
          )}

          {!isProfileLoading && profile && (
            <div className="space-y-3 text-sm text-zinc-700">
              <p>
                <span className="text-zinc-400">id</span> {profile.id}
              </p>
              <p>
                <span className="text-zinc-400">name</span> {profile.name}
              </p>
              <p>
                <span className="text-zinc-400">role</span> {profile.role}
              </p>
              <p>
                <span className="text-zinc-400">email</span> {profile.email}
              </p>
              <p>
                <span className="text-zinc-400">createdAt</span> {profile.createdAt}
              </p>
            </div>
          )}

          {!isProfileLoading && !profile && (
            <p className="text-center text-sm text-zinc-500">
              사용자 정보가 없습니다.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleGetProfile}
          className="mt-4 h-12 w-full rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          내 정보 다시 조회
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 h-12 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;