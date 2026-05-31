import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import Login from './page/Login';
import Signup from './page/Signup';
import MyPage from './page/MyPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;