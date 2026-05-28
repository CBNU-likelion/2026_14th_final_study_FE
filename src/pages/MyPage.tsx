import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, logout } from "../api/auth";

export default function MyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  const fetchMyInfo = async () => {
    try {
      const response = await getMyInfo();

      setUser(response.data);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  fetchMyInfo();
}, []);

  const handleLogout = async () => {
  try {
    await logout();

    localStorage.removeItem("accessToken");

    alert("로그아웃되었습니다.");

    navigate("/");
  } catch (error) {
    console.error(error);
  }
};

  if (!user) {
    return (
      <main style={pageStyle}>
        <section style={cardStyle}>
          <div style={badgeStyle}>ACCESS REQUIRED</div>
          <h1 style={titleStyle}>로그인이 필요합니다</h1>
          <p style={subtitleStyle}>마이페이지는 로그인 후 이용할 수 있어요.</p>

          <button type="button" style={buttonStyle} onClick={() => navigate("/")}>
            로그인하러 가기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={badgeStyle}>MY PAGE</div>

        <h1 style={titleStyle}>마이페이지</h1>

        <p style={subtitleStyle}>final_study_BE&FE #5</p>

        <div style={profileBoxStyle}>
          <div style={avatarStyle}>{user.name?.slice(0, 1) || "U"}</div>

          <div>
            <h2 style={nameStyle}>{user.name}</h2>
            <p style={emailStyle}>{user.email}</p>
          </div>
        </div>

        <div style={infoListStyle}>
          <div style={infoItemStyle}>
            <span style={labelStyle}>Name</span>
            <strong style={valueStyle}>{user.name}</strong>
          </div>

          <div style={infoItemStyle}>
            <span style={labelStyle}>Phone</span>
            <strong style={valueStyle}>{user.phoneNumber}</strong>
          </div>

          <div style={infoItemStyle}>
            <span style={labelStyle}>Email</span>
            <strong style={valueStyle}>{user.email}</strong>
          </div>
        </div>

        <button type="button" style={buttonStyle} onClick={handleLogout}>
          로그아웃
        </button>
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
  marginBottom: "28px",
  color: "#9ca3af",
  fontSize: "15px",
};

const profileBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  borderRadius: "20px",
  backgroundColor: "#fff7fa",
  marginBottom: "18px",
  textAlign: "left" as const,
};

const avatarStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #f9a8d4, #f472b6)",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "22px",
  fontWeight: 800,
  flexShrink: 0,
};

const nameStyle = {
  margin: 0,
  marginBottom: "4px",
  fontSize: "18px",
  color: "#111827",
};

const emailStyle = {
  margin: 0,
  fontSize: "14px",
  color: "#9ca3af",
};

const infoListStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  marginBottom: "24px",
};

const infoItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 16px",
  border: "1px solid #fbcfe8",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
};

const labelStyle = {
  color: "#9ca3af",
  fontSize: "14px",
};

const valueStyle = {
  color: "#111827",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  height: "56px",
  border: "none",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #f9a8d4, #f472b6)",
  color: "white",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
};