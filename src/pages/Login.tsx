import { Button } from '@/components/ui/button'
import kakaoLoginImage from '@/assets/kakao_login_medium_wide.png'
import Axios from 'axios'

const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI}`;

const Login = () => {


  return (
    <div className='flex flex-col content-center mt-3 w-fit justify-center gap-2'>
        ONE!T에 가입하고 더 많은 서비스를 이용하세요!
        <div>
            <a href={kakaoURL}>
                <img src={kakaoLoginImage} alt="카카오 로그인" />
            </a>
        </div>
    </div>
  )
}

export default Login