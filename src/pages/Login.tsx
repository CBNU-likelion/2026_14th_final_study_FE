import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";
import { setAccessToken, setRefreshToken } from "../utils/token";

function LoginPage() {
  // 이메일 입력값 상태
  const [email, setEmail] = useState("");
  // 비밀번호 입력값 상태
  const [password, setPassword] = useState("");
  // 에러 메시지 상태
  const [error, setError] = useState("");

  // 페이지 이동 훅
  const navigate = useNavigate();

  // 로그인 버튼 클릭 시 실행
  const handleLogin = async () => {
    // 에러 초기화
    setError("");

    try {
      // 로그인 API 호출
      const res = await login({ email, password });

      // 받은 토큰 저장
      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);

      // 마이페이지로 이동
      navigate("/mypage");

    } catch (err: any) {
      // 에러 메시지 표시
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          로그인
        </button>

        {/* 회원가입 페이지 링크 */}
        <p className="text-center text-sm text-gray-500 mt-4">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;