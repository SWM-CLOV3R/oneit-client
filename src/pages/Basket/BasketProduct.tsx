import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import Gift from '@/assets/giftbox.png';
import {Button} from '@/components/ui/button';
import KakaoShare from '@/components/common/KakaoShare';
import {CalendarCheck, ChevronLeft, Heart, MoveRight} from 'lucide-react';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {Separator} from '@/components/ui/separator';
import {fetchProduct} from '@/api/product';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {addToBasket, fetchBasketList} from '@/api/basket';
import {Basket} from '@/lib/types';
import {useAtom, useAtomValue} from 'jotai';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {isLoginAtom} from '@/api/auth';

const Product = () => {
    const {basketID, productID} = useParams();
    const loggedIn = useAtomValue(isLoginAtom);
    const navigate = useNavigate();

    const productAPI = useQuery({
        queryKey: ['product', productID],
        queryFn: () => fetchProduct(productID || ''),
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <div className={cn('w-full', loggedIn ? 'pb-20' : 'pb-16')}>
            <div className="flex py-3 flex-wrap items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={handleGoBack}
                >
                    <ChevronLeft className="" />
                </Button>
                {/* <p>{data?.brandName}</p> */}
                <div className="flex">
                    <Button variant="ghost" size="icon">
                        <Heart />
                    </Button>
                    <KakaoShare
                        title="ONE!T - 선물 추천"
                        description={productAPI.data?.name || 'ONE!T'}
                        url={`/product/${productAPI.data?.idx}`}
                        image={
                            productAPI.data?.thumbnailUrl ||
                            'https://www.oneit.gift/oneit.png'
                        }
                    />
                </div>
            </div>

            <div className="flex justify-center w-full">
                <img
                    src={productAPI.data?.thumbnailUrl || Gift}
                    alt="recommended product"
                    // width={200}
                    // height={200}
                    className="object-cover group-hover:opacity-50 transition-opacity"
                />
            </div>
            <div className="py-2 bg-white dark:bg-gray-950">
                <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {productAPI.data?.categoryDisplayName}
                </p>
                <a
                    href={productAPI.data?.productUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <h3 className="text-xl font-bold md:text-xl">
                        {productAPI.data?.name}
                    </h3>
                </a>
                <div className="flex items-center justify-between mt-2">
                    <p>{productAPI.data?.brandName}</p>
                    <h4 className="text-base font-semibold md:text-lg text-onei">
                        {productAPI.data?.originalPrice.toLocaleString()}원
                    </h4>
                </div>
            </div>
            <Separator className="mb-2" />
            <div className="flex flex-col">
                <div className="flex w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <p className="text-oneit-pink text-sm inline-block">
                        {productAPI.data?.keywords?.map((keyword, idx) => (
                            <span
                                key={idx}
                                className="mr-1"
                            >{`#${keyword}`}</span>
                        ))}
                    </p>
                </div>
                <div className="flex">
                    <p className="break-words  whitespace-normal">
                        {productAPI.data?.description}
                    </p>
                </div>
                <div className="flex items-center gap-2"></div>
            </div>
        </div>
    );
};

export default Product;
