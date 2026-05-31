import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type Page = "login" | "mypage" | "signup" | "error401" | "error403";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myNickname, setMyNickname] = useState("");
  const [page, setPage] = useState<Page>("login");
  const [myId, setMyId] = useState<number | null>(null);
  const [tokenExpireTime, setTokenExpireTime] = useState("");
  const [tokenRemainingTime, setTokenRemainingTime] = useState("");

    const moveToError401 = () => {
      window.history.pushState(null, "", "/error401");
      setPage("error401");
    };

    const moveToError403 = () => {
      window.history.pushState(null, "", "/error403");
      setPage("error403");
    };

    const moveToBack = () => {
      window.history.back();
    };

    const moveToMyPage = () => {
      window.history.pushState(null, "", "/mypage");
      setPage("mypage");
    };

    const moveToLogin = () => {
      window.history.pushState(null, "", "/");
      setPage("login");
    };

    const moveToSignup = () => {
      window.history.pushState(null, "", "/signup");
      setPage("signup");
    };

    const handleError = (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        moveToError401();
        return true;
      }

    if (error.response.status === 403) {
      moveToError403();
      return true;
    }
  }

  return false;
};

    const handleLogin = async () => {
      
      if (!email.includes("@")) {
        alert("이메일 형식이 올바르지 않습니다.");
        return;
      }
      if (!email.includes(".com")&& !email.includes(".net") && !email.includes(".org") && !email.includes(".ac.kr")) {
        alert("이메일 형식이 올바르지 않습니다.");
        return;
      }
      if (password.length < 4) {
        alert("비밀번호는 최소 4자 이상입니다.");
        return;
      }

    try {
      const response = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      const accessToken = response.data.accessToken ?? response.data.token;      
      const refreshToken = response.data.refreshToken;

      if (!accessToken) {
        alert("로그인 응답에 토큰이 없습니다.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      const decoded = jwtDecode(accessToken);
      console.log("디코딩된 토큰:", decoded);

      moveToMyPage();
    } catch (error) {
      console.error("로그인 실패!", error);
      alert("로그인에 실패했습니다.");
      if (handleError(error)) {
        return;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setTokenExpireTime("");
    setTokenRemainingTime("");

    moveToLogin();
  };

  const handlesignup = async () => {
    if (!email.trim()) {
    alert("이메일을 입력해주세요.");
    return;
  }
    if (!email.includes("@")) {
    alert("이메일 형식이 올바르지 않습니다.");
    return;
  }
    if (!email.includes(".com")&& !email.includes(".net") && !email.includes(".org") && !email.includes(".ac.kr")) {
    alert("이메일 형식이 올바르지 않습니다.");
    return;
  }
    if (!password.trim()) {
    alert("비밀번호를 입력해주세요.");
    return;
  }
    if (!nickname.trim()) {
    alert("닉네임을 입력해주세요.");
    return;
  }
    if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
    if (password.length < 4) {
    alert("비밀번호는 최소 4자 이상이어야 합니다.");
    return;
  }

    try {
      const response = await axios.post("/api/v1/auth/signup", {
        email,
        password,
        nickname,
      });
      console.log("회원가입 성공:", response.data);
      alert("회원가입에 성공했습니다.");
      moveToLogin();
    } catch (error) {
      console.error("회원가입 실패!", error);
      if (handleError(error)) {
        return;
      }
      alert("회원가입에 실패했습니다.");
    }
  };

  type tokenPayload = {
    exp? : number;
  };

  const updateTokenRemainingTime = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    setTokenRemainingTime("");
    return;
  }

  try {
    const decoded = jwtDecode<tokenPayload>(token);

    if (!decoded.exp) {
      setTokenRemainingTime("만료 시간이 없습니다.");
      return;
    }

    const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);

    if (remainingSeconds <= 0) {
      setTokenRemainingTime("만료됨");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.history.replaceState(null, "", "/");
      setPage("login");

      alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
      return;
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    setTokenRemainingTime(`${hours}시간 ${minutes}분 ${seconds}초`);
  } catch (error) {
    console.error("토큰 남은 시간 계산 실패!", error);
    setTokenRemainingTime("계산 실패");
  }
  };

  const updateTokenTimeInfo = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    setTokenExpireTime("");
    setTokenRemainingTime("");
    return;
  }

  try {
    const decoded = jwtDecode<tokenPayload>(token);

    if (!decoded.exp) {
      setTokenExpireTime("만료 시간이 없습니다.");
      setTokenRemainingTime("");
      return;
    }

    const expireDate = new Date(decoded.exp * 1000);

    const remainingSeconds = Math.max(
      0,
      decoded.exp - Math.floor(Date.now() / 1000)
    );

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    setTokenExpireTime(
      expireDate.toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      })
    );

    setTokenRemainingTime(`${minutes}분 ${seconds}초`);
  } catch (error) {
    console.error("토큰 시간 계산 실패!", error);
    setTokenExpireTime("토큰 시간 계산 실패");
    setTokenRemainingTime("");
  }
};

  const isTokenValid = async () => {

    const token = localStorage.getItem("accessToken");

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<tokenPayload>(token);

      if (decoded.exp && decoded.exp < Date.now() / 1000) {

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          return false;
        }

        try {
          const response = await axios.post("/api/v1/auth/reissue", {
            refreshToken,
          });        
          const newAccessToken = response.data.accessToken ?? response.data.token;

          if (!newAccessToken) {
            return false;
          }
          localStorage.setItem("accessToken", newAccessToken);

          return true;
        } catch (error) {
          console.error("토큰 재발급 실패!", error);

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          return false;
        } 
      }
      return true;
    } catch (error) {
      console.error("토큰 디코딩 실패!", error);
      return false;
    }
  };

  const getMyData = async () => {
  const valid = await isTokenValid();

  if (!valid) {
    window.history.replaceState(null, "", "/");
    setPage("login");
    alert("로그인이 필요합니다.");
    return;
  }

  updateTokenTimeInfo();

  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.get("/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMyId(response.data.id);
    setMyEmail(response.data.email);
    setMyNickname(response.data.nickname);
  } catch (error) {
    console.error("내 정보 불러오기 실패!", error);

    if (handleError(error)) {
      return;
    }

    alert("내 정보를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    if (page !== "mypage") {
      return;
    }

    updateTokenRemainingTime();

    const timer = setInterval(() => {
      updateTokenRemainingTime();
    }, 1000);

  return () => {
    clearInterval(timer);
  };
}, [page]);

  useEffect(() => {
    const checkRoute = async () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";

      if (path === "/mypage") {
        const valid = await isTokenValid();

        if (!valid) {
          window.history.replaceState(null, "", "/");
          setPage("login");
          setTimeout(() => {
            alert("로그인이 필요합니다.");
          }, 100);
          return;
        }

        setPage("mypage");
        return;
      }

      if (path === "/signup") {
        setPage("signup");
        return;
      }
      if (path !== "/signup" && path !== "/mypage") {
        setPage("login");
        return;
      }

      setPage("login");
    };

    checkRoute();

    window.addEventListener("popstate", checkRoute);

    return () => {
      window.removeEventListener("popstate", checkRoute);
    };
  }, []);

  return (
    <>
  {page === "login" && (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C9F2D8",
        borderRadius: "8px",
      }}
    >
      <div
      style={{
        height: "50vh",
        width: "60vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#96E6B3",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <div>
        <h1 style={{ 
          position: "absolute",
          left: "50%",
          top: "-10px",
          transform: "translateX(-50%)",
        }}>LOGIN PAGE</h1>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            position: "absolute",
            left: "43%",
            top: "130px",
            transform: "translateX(-50%)",
          }}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            position: "absolute",
            left: "43%",
            top: "180px",
            transform: "translateX(-50%)",
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            padding: "35px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            position: "absolute",
            left: "63%",
            top: "130px",
            transform: "translateX(-50%)",
          }}
        >
          login
        </button>
        <button
          onClick={moveToSignup}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            position: "absolute",
            left: "50%",
            top: "230px",
            transform: "translateX(-50%)",
          }}
        >
          signup
        </button>
      </div>
      </div>
    </div>
    )}
    {page === "signup" && (
      <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C9F2D8",
        borderRadius: "8px",
      }}
    >
      <div
      style={{
        height: "50vh",
        width: "60vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#96E6B3",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <div>
        <h1 style={{ 
          position: "absolute",
          left: "50%",
          top: "-10px",
          transform: "translateX(-50%)",
         }}>SIGNUP PAGE</h1>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            position: "absolute",
            left: "50%",
            top: "80px",
            transform: "translateX(-50%)",
          }}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            marginRight: "10px",
            position: "absolute",
            left: "50%",
            top: "130px",
            transform: "translateX(-50%)",
          }}
        />
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            marginRight: "10px",
            position: "absolute",
            left: "50%",
            top: "180px",
            transform: "translateX(-50%)",
          }}
        />
        <input
          type="nickname"
          placeholder="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            marginRight: "10px",
            position: "absolute",
            left: "50%",
            top: "230px",
            transform: "translateX(-50%)",
          }}
        />
        <button
          onClick={handlesignup}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            position: "absolute",
            left: "45%",
            top: "280px",
            transform: "translateX(-50%)",
          }}
        >
          signup
        </button>
        <button
          onClick={moveToBack}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            position: "absolute",
            left: "55%",
            top: "280px",
            transform: "translateX(-50%)",
          }}
        >
          back
        </button>
      </div>  
      </div>
    </div>
    )}
    {page === "mypage" && (
      <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C9F2D8",
      }}
    >
      <div
      style={{
        height: "50vh",
        width: "60vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#96E6B3",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <div>
        <h1 style ={{ 
          position: "absolute",
          left: "50%",
          top: "-10px",
          transform: "translateX(-50%)",
         }}>MY PAGE</h1>
        <button
          onClick={getMyData}
          style={{
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "8px",
            position: "absolute",
            left: "50%",
            top: "230px",
            transform: "translateX(-50%)",
          }}
        >
          내 정보 불러오기
        </button>
        {myEmail && myNickname && myId && (
          <div style={{
            position: "absolute",
            left: "50%",
            top: "90px",
            transform: "translateX(-50%)",
          }}>
            <div style={{
            position: "absolute",
            left: "50%",
            top: "-15px",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap"
          }}>
              <span >id:{myId}</span> <br />
              <span>email:{myEmail}</span> <br />
              <span>nickname:{myNickname}</span>
            </div>
            <div style={{
            position: "absolute",
            left: "50%",
            top: "70px",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap"
          }}>
              <span>토큰 만료 시간: {tokenExpireTime}</span> <br />
              <span>토큰 남은 시간: {tokenRemainingTime}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          style={{ 
          position: "absolute",
          left: "50%",
          top: "280px",
          transform: "translateX(-50%)",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
        >
          logout
        </button>
      </div>
    </div>
    </div>
    )}
    {page === "error401" && (
      <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C9F2D8",
      }}
    >
      <div
      style={{
        height: "50vh",
        width: "60vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#96E6B3",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <div>
        <h1 style ={{ 
          position: "absolute",
          left: "50%",
          top: "10px",
          transform: "translateX(-50%)",
         }}>ERROR : 401</h1>
        <button
          onClick={moveToLogin}
          style={{ 
          position: "absolute",
          left: "50%",
          top: "250px",
          transform: "translateX(-50%)",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
        >
          go to login
        </button>
      </div>
    </div>
    </div>
    )}
    {page === "error403" && (
      <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C9F2D8",
      }}
    >
      <div
      style={{
        height: "50vh",
        width: "60vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#96E6B3",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <div>
        <h1 style ={{ 
          position: "absolute",
          left: "50%",
          top: "10px",
          transform: "translateX(-50%)",
         }}>ERROR : 403</h1>
        <button
          onClick={moveToLogin}
          style={{ 
          position: "absolute",
          left: "50%",
          top: "250px",
          transform: "translateX(-50%)",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
        >
          go to login
        </button>
      </div>
    </div>
    </div>
    )}
    </>
  )
};

export default App;
