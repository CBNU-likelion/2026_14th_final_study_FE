import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <h1>LIKELION WEEK8 ASSIGNMENT WEBSITE</h1>
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
          {/* 페이지 라우트는 여기에 추가 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
