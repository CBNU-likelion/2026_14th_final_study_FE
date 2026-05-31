import { useNavigate } from "react-router-dom";

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>FORBIDDEN</h2>
      <p>인증에 실패했습니다. 로그인이 필요합니다.</p>
      <button type="button" onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default ForbiddenPage;
