function SignupPage() {
  return (
    <div>
      <h2>회원가입</h2>
      <form>
        <div>
          <label htmlFor="name">이름</label>
          <br />
          <input type="text" id="name" name="name" />
        </div>
        <br />
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <input type="email" id="email" name="email" />
        </div>
        <br />
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <input type="password" id="password" name="password" />
        </div>
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupPage;
