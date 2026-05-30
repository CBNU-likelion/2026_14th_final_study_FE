import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import Root from "./pages/Root";

function Layout() {
  return (
    <div>
      <header>
        <h1>
          <a style={{ color: "black" }} href="/">
            LIKELION WEEK8 ASSIGNMENT WEBSITE
          </a>
        </h1>
        <hr />
      </header>

      <main style={{ minHeight: "80vh", padding: "16px" }}>
        <Outlet />
      </main>

      <footer>
        <hr />
        <p style={{ fontSize: "12px", color: "gray", textAlign: "center" }}>
          Developed by BE 이은교, FE 최동하, FE 최예진
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Root />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="forbidden" element={<ForbiddenPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
