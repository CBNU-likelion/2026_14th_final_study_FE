import { useNavigate } from "react-router-dom";

function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>403 Forbidden</h2>
      <p>이 페이지에 접근할 권한이 없습니다.</p>
      <button type="button" onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default ForbiddenPage;
