import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    const savedUser = localStorage.getItem("signupUser");

    if (!savedUser) {
      setErrorMessage("가입된 회원 정보가 없습니다.");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.email !== email || user.password !== password) {
      setErrorMessage("이메일 또는 비밀번호가 일치하지 않습니다.");
      return;
    }

    localStorage.setItem("accessToken", "mock-access-token");
    localStorage.setItem("loginUser", JSON.stringify(user));

    alert("로그인되었습니다.");
    navigate("/mypage");
  };

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={badgeStyle}>LIKELION STUDY</div>

        <h1 style={titleStyle}>로그인</h1>

        <p style={subtitleStyle}>final_study_BE&FE #5</p>

        <input
          type="email"
          placeholder="example@email.com"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          style={{ ...inputStyle, marginBottom: "10px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}

        <button type="button" style={buttonStyle} onClick={handleLogin}>
          Login
        </button>

        <p style={linkTextStyle}>
          계정이 없나요?{" "}
          <Link to="/signup" style={linkStyle}>
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
}

const pageStyle = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #fff7fa 0%, #ffffff 48%, #fff3f8 100%)",
};

const cardStyle = {
  width: "420px",
  padding: "42px 36px",
  borderRadius: "28px",
  background: "#ffffff",
  boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
  textAlign: "center" as const,
};

const badgeStyle = {
  display: "inline-block",
  padding: "8px 18px",
  borderRadius: "999px",
  backgroundColor: "#ffe4ec",
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "24px",
};

const titleStyle = {
  margin: 0,
  marginBottom: "10px",
  fontSize: "30px",
  fontWeight: 800,
  color: "#111827",
};

const subtitleStyle = {
  margin: 0,
  marginBottom: "32px",
  color: "#9ca3af",
  fontSize: "15px",
};

const inputStyle = {
  width: "100%",
  height: "54px",
  borderRadius: "16px",
  border: "1px solid #fbcfe8",
  padding: "0 18px",
  marginBottom: "14px",
  fontSize: "15px",
  outline: "none",
  color: "#111827",
};

const errorStyle = {
  margin: "0 0 14px",
  color: "#db2777",
  fontSize: "13px",
  fontWeight: 700,
};

const buttonStyle = {
  width: "100%",
  height: "56px",
  border: "none",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #ec4899, #db2777)",
  color: "white",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
};

const linkTextStyle = {
  marginTop: "24px",
  marginBottom: 0,
  color: "#9ca3af",
  fontSize: "14px",
};

const linkStyle = {
  color: "#ec4899",
  fontWeight: 800,
  textDecoration: "none",
};