import axios from 'axios'


/**
 * [설계 근거 — navigate 브릿지]
 * Axios 인터셉터는 React 컴포넌트 트리 밖에서 동작하므로
 * useNavigate() 훅을 직접 호출할 수 없다.
 * 모듈 수준 변수에 navigate 함수를 주입받아 두면,
 * 인터셉터가 React Router의 히스토리 스택을 정상적으로 사용할 수 있다.
 * (window.location.href = '/login' 대신 사용해 SPA 상태를 보전)
 */
let navigateFn: ((path: string) => void) | null = null

export function setNavigate(fn: (path: string) => void) {
  navigateFn = fn
}

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

/** 요청 인터셉터: localStorage의 토큰을 모든 요청 헤더에 자동 첨부 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/**
 * 응답 인터셉터: 401 / 403 전역 처리
 *
 * 401 Unauthorized — "당신이 누구인지 모른다"
 *   → 토큰 만료 또는 미발급 상태이므로 즉시 토큰을 제거하고 로그인으로 이동
 *
 * 403 Forbidden — "당신이 누구인지는 알지만, 이 자원에 접근할 권한이 없다"
 *   → 로그아웃 없이 권한 없음 페이지로 이동 (현재 세션은 유지)
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status

    if (status === 401) {
      localStorage.removeItem('accessToken')
      navigateFn?.('/login')
    } else if (status === 403) {
      navigateFn?.('/forbidden')
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
