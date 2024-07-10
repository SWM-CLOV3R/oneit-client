import LottieContainer from '@/components/common/LottieContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'


const Basket = () => {
    return (
        <div className='flex flex-col content-center mt-4 w-full'>
            <div className='flex w-full rounded-lg bg-oneit-pink px-3 py-1 my-1'>
                <h1 className='text-xl'>선물 바구니</h1>
            </div>
            <div className='flex flex-col gap-2'>
                {/* decription of basket */}
                <Card className='py-2 px-0'>
                    <CardContent>
                        <div>
                            <p className='text-sm px-0'>
                                찾아본 상품은 많은데... <br/> 이 중 무엇을 주어야할지 모르겠다면?
                                어쩌구 저쩌구
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className='relative flex flex-col text-center'>
                <LottieContainer path={"/src/assets/construction_animate.json"} />
                <p className=''>
                    Team CLOV3R가 열심히 개발 중이에요 <br/>
                    ONE!T 카카오 채널톡을 추가하면 <br/>
                    공식 오픈시 알림을 드려요!
                </p>
                {/* <img src='https://via.placeholder.com/400' className='w-full' /> */}
            </div>
        </div>
    )
}

export default Basket