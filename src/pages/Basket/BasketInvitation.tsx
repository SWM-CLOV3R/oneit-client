import {
    confirmInvitation,
    fetchBasketInfo,
    fetcthBasketParticipants,
} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import BasketCard from './components/BasketCard';
import {CalendarCheck, Crown} from 'lucide-react';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import NotFound from '../NotFound';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Participant} from '@/lib/types';
import ParticipantAvatar from './components/ParticipantAvatar';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';

const BasketInvitation = () => {
    const {basketID, inviteID} = useParams();
    const navigate = useNavigate();
    const isLogin = useAtomValue(isLoginAtom);
    const [error, setError] = useState(false);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const basketParticipantsAPI = useQuery({
        queryKey: ['basket', basketID, 'participants'],
        queryFn: () => fetcthBasketParticipants(basketID || ''),
        enabled: basketInfoAPI.isSuccess && !basketInfoAPI.isError,
    });
    console.log(basketParticipantsAPI.data);

    const handleLogin = () => {
        console.log(window.location.pathname);

        navigate('/login?redirect=' + window.location.pathname);
    };

    const handleConfirm = async () => {
        confirmInvitation(inviteID || '')
            .then((res) => {
                console.log(res);
                if (res) {
                    navigate(`/basket/${basketID}`);
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    };
    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <div className="flex flex-col justify-center w-full items-center">
                <h3 className="text-2xl font-semibold mb-4">바구니 초대</h3>
                <div className="rounded-lg overflow-hidden shadow-sm group border-[0.5px] w-full ">
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
                    <div className="py-2 bg-white ">
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
                </div>

                <div className="flex flex-col gap-2 mt-2 w-full">
                    {!isLogin && (
                        <Button
                            className="w-full bg-kakao-yellow hover:bg-kakao-yellow/90"
                            onClick={handleLogin}
                        >
                            카카오 로그인하고 초대 수락하기
                        </Button>
                    )}
                    {isLogin && (
                        <Button
                            className="w-full bg-oneit-blue hover:bg-oneit-blue/90"
                            onClick={handleConfirm}
                        >
                            초대 수락하기
                        </Button>
                    )}
                    <Button className="w-full">메인으로</Button>
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
        </>
    );
};

export default BasketInvitation;
