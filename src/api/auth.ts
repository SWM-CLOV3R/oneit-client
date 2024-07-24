import axios from 'axios'
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const baseURL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api';

const userAPI = axios.create({
    baseURL
})

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}


export const login = async (token: string) => {
    try {
        const res = await axios.post("/v1/kakao/login", {
            kakaoAccessToken: token
        });

        if (res.status == 200 && res.data.isSuccess) {
            const { accessToken, refreshToken } = res.data as LoginResponse;
            localStorage.setItem("token", accessToken);
            cookies.set("refreshToken", refreshToken, { path: "/", httpOnly: true });
            return Promise.resolve();
        } else {
            throw new Error("Failed to login");
        }
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

export const logout = async () => {
    localStorage.removeItem("token")
}


const getRefreshToken = async (): Promise<string> => {
    return axios.get("/auth/refresh", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            refreshToken: localStorage.getItem("refreshToken"),
        }
    })
    .then((res)=>{
        if(res.status == 200 && res.data.isSuccess && res.data.accessToken){
            return Promise.resolve(res.data.accessToken)
        }
        else if (res.status == 200 && res.data.code == 4000) { //todo: check code
            logout()
            return Promise.reject("Refresh token expired")
        }
        else{
            throw new Error("Failed to refresh token")
        }
    }).catch((err)=>{
        console.log(err);
        return Promise.reject(err)
    })

};

userAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(config.headers && token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }, 
    (error) => {
        return Promise.reject(error)
    }
)

userAPI.interceptors.response.use(
    (res) => {
        return res;
    },
    async (error) => {
        const { config, response } = error;
        //  401에러가 아니거나 재요청이거나 refresh 요청인 경우 그냥 에러 발생
        if (response.status !== 401 || config.sent || config.url === '/auth/refresh') {
            return Promise.reject(error);
        }

        // 아닌 경우 토큰 갱신
        config.sent = true; // 무한 재요청 방지
        getRefreshToken()
        .then((accessToken)=>{
            localStorage.setItem("token", accessToken)
            config.headers.Authorization = `Bearer ${accessToken}`
            return axios(config)
        }).catch((err)=>{
            console.log(err);
            logout()
        })

        return userAPI(config); // 재요청
    },
);

export default userAPI