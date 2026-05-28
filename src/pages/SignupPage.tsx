import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

 const handleSignup = async () => {
  try {
    setErrorMessage("");

    if (!name || !email || !password || !passwordCheck) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordCheck) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    await signup({
      email,
      password,
      passwordConfirm: passwordCheck,
      name,
    });

    alert("회원가입이 완료되었습니다.");
    navigate("/");
  } catch (error: any) {
    const message =
      error.response?.data?.message || "회원가입에 실패했습니다.";

    setErrorMessage(message);
  }
};

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={badgeStyle}>LIKELION STUDY</div>

        <h1 style={titleStyle}>회원가입</h1>

        <p style={subtitleStyle}>final_study_BE&FE #5</p>

        <input
          type="text"
          placeholder="Name"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone number"
          style={inputStyle}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          style={{ ...inputStyle, marginBottom: "10px" }}
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}

        <button type="button" style={buttonStyle} onClick={handleSignup}>
          Sign Up
        </button>

        <p style={linkTextStyle}>
          Already have an account?{" "}
          <Link to="/" style={linkStyle}>
            Login
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
  letterSpacing: "0.5px",
};

const titleStyle = {
  margin: 0,
  marginBottom: "10px",
  fontSize: "30px",
  fontWeight: 800,
  color: "#111827",
  letterSpacing: "-1px",
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
  transition: "0.2s ease",
};

const linkTextStyle = {
  marginTop: "22px",
  marginBottom: 0,
  color: "#9ca3af",
  fontSize: "14px",
};

const linkStyle = {
  color: "#ec4899",
  fontWeight: 700,
  textDecoration: "none",
};