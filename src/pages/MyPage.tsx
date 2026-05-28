import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: UserInfo = await response.json();
          setUserInfo(data);
        } else if (response.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("accessToken");
          navigate("/login");
        } else if (response.status === 403) {
          alert("접근 권한이 없습니다.");
          navigate("/forbidden");
        } else if (response.status === 400) {
          alert("잘못된 요청입니다.");
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
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
