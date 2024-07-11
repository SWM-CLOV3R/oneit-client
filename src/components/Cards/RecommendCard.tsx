import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAtom, useSetAtom } from 'jotai';
import { gender, occasion, priceRange, recipient } from '@/lib/atoms';
import { Spinner } from '@/components/ui/spinner';
import { startChat } from '@/api/chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LottieContainer from '../common/LottieContainer';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';

const RecommendCard = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false);

    const [price, setPrice] = useAtom<number[]>(priceRange)
    const [userRecipient, setUserRecipient] = useAtom(recipient)
    const [userGender, setUserGender] = useAtom(gender)

    // const start = useSetAtom(startChat)

    const handleStart = async () => {
        const chatID = nanoid(10);
        navigate(`/quiz/${chatID}/1`);
        // setLoading(true);
        // try { 
        //     await start(chatID);
        // } catch (error) {
        //     console.log(error);
        //     setError(true)
        // }finally {
        //     setLoading(false); // End loading
        // }
    }
    
    if(loading) return <Spinner/>


    return(
        <>
        <Card className="w-full bg-gradient-to-br from-[#ffa0a0] to-[#ff9595] hover:from-[#FF9595] hover:to-[#FF9090] transition-colors duration-300 rounded-lg h-[60%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="#" className="w-full h-full flex flex-col justify-between" onClick={()=>setShowModal(true)}>
            <CardHeader className='p-3'>
                <CardTitle>선물 추천</CardTitle>
                <CardDescription className='text-oneit-gray'>질문에 답하고 선물을 추천 받아 보세요!</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <LottieContainer path='/src/assets/surpriseGift_animate.json' className='mt-[-80px]'/>
            </CardContent>
            </Link>
        </Card> 
        {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>시작하기</DialogTitle>
                <p>누구에게 줄 선물인가요?</p>
                <div className="flex items-start gap-2 ">
                    <div className="flex flex-col">
                    <Label htmlFor='recipient'>관계</Label>
                    <RadioGroup id='recipient' onValueChange={setUserRecipient} value={userRecipient} className='flex mt-2' >
                        <RadioGroupItem id='friend' value="친구"></RadioGroupItem>
                        <Label htmlFor='friend'>친구</Label>
                        <RadioGroupItem value="애인" id='lover'>애인</RadioGroupItem>
                        <Label htmlFor='lover'>애인</Label>
                        <RadioGroupItem value="지인" id='others'>지인</RadioGroupItem>
                        <Label htmlFor='others'>지인</Label>
                    </RadioGroup>
                    </div>
                    <Separator orientation='vertical'/>
                    <div className="flex flex-col">
                    <Label htmlFor='gender'>성별</Label>
                    <RadioGroup onValueChange={setUserGender} value={userGender} className='flex mt-2'>
                        <RadioGroupItem value="MALE" id="male"></RadioGroupItem>
                        <Label htmlFor="male">남성</Label>
                        <RadioGroupItem value="FEMALE" id="female"></RadioGroupItem>
                        <Label htmlFor="female">여성</Label>
                    </RadioGroup>
                    </div>
                </div>
                <p>예산이 어떻게 되나요?</p>
                <div className=" w-full border-[#FFDDD5] ">
                    <div className='flex justify-end align-middle'>
                        <div className="flex justify-around text-sm ">
                            <Input value={price[0].toLocaleString()} onChange={(e)=>{
                                const value = Number(e.target.value.replace(/,/g, ''))
                                if (!isNaN(value)) setPrice([value<=500000?value:500000,price[1]])
                                }} className='w-[30%]'/>
                            <p className="content-center">원부터</p>  
                            <Input value={price[1].toLocaleString()} onChange={(e)=>{
                                const value = Number(e.target.value.replace(/,/g, ''))
                                if (!isNaN(value)) setPrice([price[0],value<=500000?value:500000])
                                }} className='w-[30%]'/>
                            <p className="content-center">원까지</p>  
                        </div>
                    </div>
                    <Slider
                    id="gift-price"
                    min={0}
                    max={300000}
                    step={10000}
                    value={price}
                    onValueChange={setPrice}
                    className="w-full mt-2 pt-2"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                    뒤로가기
                    </Button>
                    <Button type="submit" onClick={() => {setShowModal(false); handleStart()}}>
                    추천받기
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
        )}
        {error && (
            <Dialog open={error} onOpenChange={setError}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>문제 발생</DialogTitle>
                </DialogHeader>
                <DialogDescription>문제가 발생했습니다. 다시 시도해주세요.</DialogDescription>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {setError(false); navigate('/'); } }>
                    메인으로
                    </Button>
                    <Button type="submit" onClick={() => {setError(false); handleStart();} }>
                    다시시도
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
        )}
        </>
    )
}

export default RecommendCard