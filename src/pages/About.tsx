import LottieContainer from "@/components/common/LottieContainer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className='flex flex-col content-center mt-0 w-full items-center'>
        <div className='flex w-full rounded-lg bg-oneit-pink px-3 py-1 my-2'>
            <h1 className='text-2xl'>WANNA GIFT IT, ONE!T</h1>
        </div>
        <Card className='py-2 px-0'>
            <CardHeader className="py-0 px-3">
                <h1 className='text-xl'>선물은 특별해야하니까</h1>
            </CardHeader>
            <CardDescription className='px-3 pb-2'>서비스 소개</CardDescription>
            <CardContent className='pb-3 px-3'>
                <p className="font-thin">
                    ONE!T(워닛)은 선물 고르기에 지친 우리들을 위한 서비스입니다.
                    다채로운 선물 제품의 홍수 속에서 어떤 선물을 해주어야할지 고민되는 요즘, 
                    소중한 사람을 위한 맞춤 선물을 함께 골라보아요!
                </p>
                <div className="flex gap-2 mt-3">
                    <Link to="/recommend" className="w-full">
                        <Button className="w-full rounded-lg py-2">선물 추천 받기</Button>
                    </Link>
                    <Link to="/basket" className="w-full">
                        <Button className="w-full rounded-lg py-2">선물 바구니</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
        <LottieContainer path="/src/assets/giftpop_animate.json" className="w-[70%] mt-3 mb-[-50px]" />
    </div>
  )
}

export default About