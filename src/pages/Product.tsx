import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Product as P } from "@/lib/types";
import Gift from '@/assets/giftbox.png'
import { Button } from "@/components/ui/button";
import KakaoShare from "@/components/common/KakaoShare";
import { ChevronLeft, Heart, Star } from "lucide-react";
import Share from "@/components/common/Share";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "./NotFound";

const Product = () => {
    const {productID} = useParams()
    // console.log(productID);
    
    const navigate = useNavigate()
    
    
    const fetchProduct = async () :Promise<P> => {
        return axios.get(`/v1/products/${productID}`)
        .then(res=>{
            if(res.status === 200 && res.data.isSuccess){
                console.log(res.data.result);
                return Promise.resolve(res.data.result)
            }else{
                throw new Error(res.data.message)
            }
        })
        .catch(err=>{
            console.error(err)
            return Promise.reject(err)
        })
    }
    const {data, isError, isLoading} = useQuery({queryKey:['product'],queryFn:fetchProduct})
    
    if(isLoading) return <Spinner/>
    if(isError) return <NotFound/>

    // const product : P = {
    //     "title": " \"당+ 체력 보충\" 꿀빠는시간 스틱꿀 버라이어티팩 21개입(3종 x 7스틱)  ",
    //     "url": "https://gift.kakao.com/product/2915615",
    //     "price": 25400,
    //     "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230906115514_7c56265604bd4a45bd6f90c06a0fdd11.png",
    //     "id": 1
    // }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div className='w-full pb-5'>
            <div className="flex py-3 flex-wrap items-center justify-between">

                <Button variant="ghost" size="icon" className="" onClick={handleGoBack}>
                    <ChevronLeft className=""/>
                </Button>
                {/* <p>{data?.brandName}</p> */}
                <div className="flex">
                    <Button variant="ghost" size="icon">
                        <Heart/>
                    </Button>
                    <Share title="ONE!T" text={data?.name||"ONE!T"} url={`https://oneit.gift/${data?.productIdx}`} />
                </div>
            </div>
            
            <div className='flex justify-center w-full'>
                <img
                    src={data?.thumbnailUrl || Gift}
                    alt="recommended product"
                    // width={200}
                    // height={200}
                    className="object-cover group-hover:opacity-50 transition-opacity"
                />
            </div>
            <div className="py-2 bg-white dark:bg-gray-950">
                <h3 className="text-xl font-bold md:text-xl">{data?.name}</h3>

                <div className="flex items-center justify-end mt-2">
                    <h4 className="text-base font-semibold md:text-lg text-onei">{data?.originalPrice.toLocaleString()}원</h4>
                </div>
            </div>
            {/* <div className="border-[0.3px] my-1"></div> */}
            <div className="flex w-full p-1">
                {data?.keywords.map((keyword) => {
                    return <p className="text-oneit-pink inline-block mr-1">{`#${keyword}`}</p>
                })}
                {/* <p className="text-oneit-pink">#실용적인 #태그 #태그</p> */}
            </div>
            <div className="flex">
                <p>요즘 스트레스를 많이 받는 친구에게 추천</p>
            </div>
            {/* <div className="border-[0.3px] my-1"></div>
            <div>
                <p>상품 설명</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta ante vehicula, gravida nunc at, ullamcorper ligula. Nullam fermentum nec lectus eget consectetur.</p>
                <p>Mauris vestibulum lacus vel orci consectetur semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                <p>Mauris vestibulum lacus vel orci consectetur semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            </div> */}

            <div className="fixed  mx-auto bottom-0 inset-x-0 flex justify-center gap-3 max-w-sm  h-15 w-full bg-slate-100 rounded-t-md">
                <Link to="#" className="w-[40%]">
                    <Button size="lg" className="my-2 w-full bg-oneit-blue hover:bg-oneit-blue/90">
                        바구니에 넣기
                    </Button>
                </Link>
                <a href={data?.productUrl} target='_blank' rel="noreferrer" className="w-[40%]">
                    <Button size="lg" className="my-2 w-full" >
                        {data?.mallName} 바로가기
                    </Button>
                </a>
            </div>
        </div>
    )
}

export default Product