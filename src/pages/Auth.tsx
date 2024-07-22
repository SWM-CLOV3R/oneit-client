import { Spinner } from '@/components/ui/spinner'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
    const navigate = useNavigate()

    const getToken = async () => {
        const token = new URL(window.location.href).searchParams.get("code");
        const res = axios.post("https://kauth.kakao.com/oauth/token",
        {
            grant_type: "authorization_code",
            client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
            redirect_uri: import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI,
            code: token,
        },
        {
            headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        })
        return res
    }
    useEffect(() => {
        getToken()
        .then((res)=>{
            console.log(res);
            localStorage.setItem("token", JSON.stringify(res.data.access_token));
            navigate("/");
        })
        .catch((err)=>{
            console.log(err);
            
        })
    }, [])
    
    return (
        <Spinner/>
    )
}

export default Auth