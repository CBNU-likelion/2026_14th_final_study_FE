import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        let token: string = data.accessToken;
        if (token.startsWith("Bearer ")) {
          token = token.slice(7);
        }
        localStorage.setItem("accessToken", token);
        alert("로그인 성공!");
        navigate("/");
      } else if (response.status === 401) {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (response.status === 400) {
        alert("입력 정보를 확인해주세요.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } catch {
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">로그인</button>
        <span> </span>
        <button type="button" onClick={() => navigate("/signup")}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
