import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../api/authApi";
import { clearTokens } from "../utils/token";
import type { MemberResponse } from "../types/auth";

function MyPage() {
  // 유저 정보 상태
  const [user, setUser] = useState<MemberResponse | null>(null);
  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 페이지 이동 훅
  const navigate = useNavigate();

  // 페이지 진입 시 내 정보 조회
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 내 정보 API 호출
        const data = await getMyInfo();
        // 받아온 유저 정보 저장
        setUser(data);
      } catch {
        // 실패 시 (401/403) 인터셉터에서 처리되므로 별도 처리 불필요
      } finally {
        // 로딩 종료
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 로그아웃 버튼 클릭 시 실행
  const handleLogout = () => {
    // 저장된 토큰 삭제
    clearTokens();
    // 로그인 페이지로 이동
    navigate("/login");
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-center mb-6">마이페이지</h1>

        {/* 유저 정보 표시 */}
        {user && (
          <div className="mb-6 space-y-3">
            {/* 이름 */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">이름</span>
              <span className="font-medium">{user.name}</span>
            </div>
            {/* 이메일 */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">이메일</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {/* 아이디 */}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">아이디</span>
              <span className="font-medium">{user.id}</span>
            </div>
          </div>
        )}

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          로그아웃
        </button>

      </div>
    </div>
  );
}

export default MyPage;