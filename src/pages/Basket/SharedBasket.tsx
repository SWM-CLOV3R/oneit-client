import {
    deleteBasket,
    fetchBasketInfo,
    fetchBasketProducts,
    fetcthBasketParticipants,
} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {Button} from '@/components/ui/button';
import {
    ArrowUp,
    CalendarCheck,
    ChevronLeft,
    Crown,
    Edit,
    Heart,
    LockKeyhole,
    PlusSquare,
    Settings,
    Trash,
} from 'lucide-react';
import Share from '@/components/common/Share';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {Separator} from '@/components/ui/separator';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Participant, Product} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import ParticipantAvatar from './components/ParticipantAvatar';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {AspectRatio} from '@/components/ui/aspect-ratio';

const SharedBasket = () => {
    const {basketID} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const basketProductAPI = useQuery({
        queryKey: ['basket', basketID, 'products'],
        queryFn: () => fetchBasketProducts(basketID || ''),
    });
    // console.log(data);
    const basketParticipantsAPI = useQuery({
        queryKey: ['basket', basketID, 'participants'],
        queryFn: () => fetcthBasketParticipants(basketID || ''),
        enabled: basketInfoAPI.isSuccess && !basketInfoAPI.isError,
    });

    const handleGoBack = () => {
        navigate(-1);
    };
    const handleDelete = async () => {
        try {
            await deleteBasket(basketID || '');
            navigate('/');
        } catch (error) {
            console.error(error);
            setError(true);
        }
    };

    const handleEdit = () => {
        navigate(`/basket/edit/${basketID}`);
    };

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <div className="w-full pb-5">
                <div className="flex py-3 flex-wrap items-center justify-end">
                    <div className="flex">
                        <Button variant="ghost" size="icon">
                            <Heart />
                        </Button>
                    </div>
                </div>

                <AspectRatio ratio={1 / 1} className="justify-center flex">
                    <div className="relative w-full h-full flex justify-center">
                        <img
                            src={
                                basketInfoAPI.data.imageUrl ||
                                'https://www.oneit.gift/oneit.png'
                            }
                            alt={basketInfoAPI.data.name}
                            className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                </AspectRatio>
                <div className="py-2 bg-white dark:bg-gray-950">
                    <div className="flex w-full">
                        <div className="flex flex-col w-full">
                            <h3 className="text-xl font-bold md:text-xl">
                                {basketInfoAPI.data?.name}
                            </h3>
                            <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                                {basketInfoAPI.data?.description}
                            </p>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex -space-x-3">
                                    {basketParticipantsAPI.data
                                        ?.slice(0, 5)
                                        .map(
                                            (
                                                participant: Participant,
                                                idx: number,
                                            ) => (
                                                <ParticipantAvatar
                                                    key={idx}
                                                    nickname={
                                                        participant.nickname ||
                                                        '익명의 참여자'
                                                    }
                                                    profileImage={
                                                        participant.profileImage ||
                                                        'https://via.placeholder.com/one!t'
                                                    }
                                                    userRole={
                                                        participant.userRole
                                                    }
                                                />
                                            ),
                                        )}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-fit flex justify-center"
                                align="end"
                            >
                                <div className="grid gap-2">
                                    <h3>참여자 목록</h3>
                                    {basketParticipantsAPI.data?.map(
                                        (
                                            participant: Participant,
                                            idx: number,
                                        ) => (
                                            <div
                                                className="flex w-full items-center"
                                                key={idx}
                                            >
                                                <Avatar
                                                    className={cn(
                                                        participant.userRole ==
                                                            'MANAGER' &&
                                                            'border-2 border-oneit-pink',
                                                    )}
                                                >
                                                    <AvatarImage
                                                        src={
                                                            participant.profileImage
                                                        }
                                                    />
                                                </Avatar>
                                                <span className="ml-2">
                                                    {participant.nickname ||
                                                        '익명의 참여자'}
                                                    {participant.userRole ===
                                                        'MANAGER' && (
                                                        <Crown className="inline-block ml-1 text-oneit-pink" />
                                                    )}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-500">
                            <CalendarCheck className="inline-block mr-1" />
                            {
                                basketInfoAPI.data?.deadline
                                    .toString()
                                    .split('T')[0]
                            }
                        </span>
                    </div>
                </div>
                <div className="p-1 w-full text-center justify-center bg-oneit-blue flex items-center rounded-md mb-3">
                    <h3 className="text-lg font-bold align-middle">
                        상품 목록
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {basketProductAPI.data?.map((product: Product) => (
                        <BasketProductCard
                            shared={true}
                            key={product.idx}
                            product={product}
                            basketID={basketID || ''}
                        />
                    ))}
                    <div
                        className="rounded-lg overflow-hidden shadow-sm flex items-center justify-center hover:bg-primary-foreground text-center"
                        onClick={(e) => navigate(`/login`)}
                    >
                        카카오 로그인하고
                        <br /> 상품 추가하기
                    </div>
                </div>
            </div>
            {error && (
                <Dialog open={error} onOpenChange={setError}>
                    <DialogContent
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e: {
                            preventDefault: () => void;
                        }) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>문제 발생</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            문제가 발생했습니다. 다시 시도해주세요.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setError(false);
                                    navigate('/');
                                }}
                            >
                                메인으로
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setError(false);
                                }}
                            >
                                다시시도
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Button
                className="fixed bottom-16 right-0 px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button>
        </>
    );
};

export default SharedBasket;
