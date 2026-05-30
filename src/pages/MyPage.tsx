import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

interface UserInfo {
  userId: number;
  email: string;
  nickname: string;
}

function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/forbidden");
        return;
      }

      try {
        const response = await apiFetch("/api/users/me");

        if (response.ok) {
          const data: UserInfo = await response.json();
          setUserInfo(data);
        } else if (response.status === 400) {
          alert("잘못된 요청입니다.");
        } else if (response.status !== 401 && response.status !== 403) {
          const data = await response.json();
          alert("오류가 발생했습니다: " + data["message"]);
          console.error(data);
        }
      } catch {
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  if (!userInfo) {
    return <p>불러오는 중...</p>;
  }

  return (
    <div>
      <h2>마이페이지</h2>
      <table border={1} cellPadding={8}>
        <tbody>
          <tr>
            <th>사용자 ID</th>
            <td>{userInfo.userId}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{userInfo.email}</td>
          </tr>
          <tr>
            <th>닉네임</th>
            <td>{userInfo.nickname}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;
