import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/authApi";

function SignupPage() {
  // 이름 입력값 상태
  const [name, setName] = useState("");
  // 이메일 입력값 상태
  const [email, setEmail] = useState("");
  // 비밀번호 입력값 상태
  const [password, setPassword] = useState("");
  // 에러 메시지 상태
  const [error, setError] = useState("");

  // 페이지 이동 훅
  const navigate = useNavigate();

  // 회원가입 버튼 클릭 시 실행
  const handleSignup = async () => {
    // 에러 초기화
    setError("");

    // 비밀번호 8자 이상 클라이언트 유효성 검사
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      // 회원가입 API 호출
      await signup({ name, email, password });

      // 성공 시 로그인 페이지로 이동
      navigate("/login");

    } catch (err: any) {
      // 에러 메시지 표시
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

        {/* 이름 입력 */}
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

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
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {/* 회원가입 버튼 */}
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          회원가입
        </button>

        {/* 로그인 페이지 링크 */}
        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;