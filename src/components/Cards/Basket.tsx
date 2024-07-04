import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {  ArrowRight } from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Basket = () => {
    const navigate = useNavigate();

    return(
        <>
        <Card className="w-full hover:bg-white/90 h-[40%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <CardHeader className='p-3'>
                <CardTitle>선물 바구니</CardTitle>
                <CardDescription>선물을 담아 보아요!</CardDescription>
            </CardHeader>
            <CardFooter className='justify-end flex m-1 p-2'>
                <Button variant="outline"  className="">
                    <ArrowRight className="h-6 w-6"/>
                </Button>
            </CardFooter>
        </Card>
        
        </>
    )
}

export default Basket