import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-red-400 mb-4">403</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          접근 권한이 없습니다
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          이 페이지에 접근할 권한이 없습니다.
          <br />
          관리자에게 문의하거나 다른 계정으로 로그인해주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            이전 페이지
          </button>
          <button
            onClick={() => navigate('/mypage')}
            className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            마이페이지로 이동
          </button>
        </div>
      </div>
    </div>
  )
}
