import BasketCard from '@/pages/Basket/components/BasketCard';
import BasketIntroCard from './components/BasketCard';
import Recommend from './components/RecommendCard';
import {useQuery} from '@tanstack/react-query';
import {fetchBasketList} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {Basket} from '@/lib/types';
import {Key} from 'react';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/api/auth';

const Main = () => {
    const user = useAtomValue(authAtom);
    console.log('User:', user);

    const CurationList = () => {
        const {data, isLoading, isError} = useQuery({
            queryKey: ['basket'],
            queryFn: () => fetchBasketList(),
            enabled: user !== null,
        });
        if (isLoading) return <Spinner />;
        if (isError) {
            return <div>생성한 바구니가 없습니다.</div>;
        }
        if (data.length === 0) {
            return (
                <BasketIntroCard
                    text="새로운 바구니를 만들어보세요"
                    login={true}
                />
            );
        }
        return (
            <Carousel
                className="w-full"
                opts={{loop: true}}
                autoplay={true}
                autoplayInterval={2500}
            >
                <CarouselContent>
                    {data?.map(
                        (basket: Basket, index: Key | null | undefined) => (
                            <CarouselItem key={index}>
                                <BasketCard basket={basket} />
                            </CarouselItem>
                        ),
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        );
    };

    return (
        <div className="flex flex-col overflow-hidden justify-center gap-2 p-1 w-full items-center mt-4 mb-5">
            {user === null && (
                <BasketIntroCard
                    text="카카오 로그인하고 바구니를 만들어보세요"
                    login={false}
                />
            )}
            {user && <CurationList />}
            <Recommend />
        </div>
    );
};

export default Main;
