import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          로그인 성공!
        </h1>
        <p className="text-gray-500 mb-8">환영합니다. 홈 페이지입니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors cursor-pointer"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
