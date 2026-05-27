import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import MyPage from "../pages/MyPage";
import ForbiddenPage from "../pages/ForbiddenPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
    </Routes>
  );
}