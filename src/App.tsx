import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import { getAccessToken } from "./utils/token";
import type { JSX } from "react";

import SignupPage from "./pages/Signup";

// 인증이 필요한 페이지 보호 컴포넌트
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // 토큰 없으면 로그인 페이지로 리다이렉트
  return getAccessToken() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로는 토큰 유무에 따라 마이페이지 또는 로그인으로 이동 */}
        <Route path="/" element={<Navigate to={getAccessToken() ? "/mypage" : "/login"} />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 마이페이지는 인증 필요 */}
        <Route path="/mypage" element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;