import {editBasket, fetchBasketInfo} from '@/api/basket';
import Header from '@/components/common/Header';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import giftBox from './../../assets/images/giftBox.svg';
import friend from './../../assets/images/icon_friend.svg';
import Logo from '@/assets/images/oneit.png';
import {Basket, Friend, Participant} from '@/lib/types';
import {fetchFriendList, requestFriend} from '@/api/friend';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/api/auth';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';

const ParticipantThumbnail = ({participant}: {participant: Participant}) => {
    const user = useAtomValue(authAtom);
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const handleProfile = () => {
        setOpen(!open);
    };

    const requestFriendAPI = useMutation({
        mutationKey: ['requestFriend'],
        mutationFn: () => requestFriend(participant.userIdx?.toString() || ''),
        onSuccess: () => {
            queryClient.setQueryData(['fetchFriends'], (old: Friend[]) => [
                ...old,
                {
                    idx: participant.userIdx,
                    name: participant.nickname,
                    nickname: participant.nickname,
                    profileImage: participant.profileImage,
                    birthDate: new Date(),
                },
            ]);
        },
    });

    const fetchFriends = useQuery({
        queryKey: ['fetchFriends'],
        queryFn: () => fetchFriendList(),
    });

    const handleRequest = () => {
        requestFriendAPI.mutate();
    };

    return (
        <li key={`friend-${participant.userIdx}`}>
            <button onClick={handleProfile}>
                <div>
                    <img
                        src={participant.profileImage || Logo}
                        alt="참여자 프로필"
                    />
                </div>
                <p>{participant.nickname}</p>
                {open && (
                    <div className="overlay">
                        <button
                            className="profile"
                            onClick={() =>
                                navigate(`/user/${participant.userIdx}`)
                            }
                        >
                            <i></i>프로필보기
                        </button>
                        {/* if not on the friendList */}
                        {!fetchFriends?.data?.some(
                            (friend: Friend) =>
                                friend.idx === participant.userIdx,
                        ) &&
                            user?.idx !== participant?.userIdx && (
                                <button
                                    className="profile2"
                                    onClick={handleRequest}
                                >
                                    <i></i>친구 요청
                                </button>
                            )}
                    </div>
                )}
            </button>
        </li>
    );
};

const BasketEdit = ({
    closeModal,
    basket,
}: {
    closeModal: () => void;
    basket: Basket;
}) => {
    const queryClient = useQueryClient();
    const editBasketAPI = useMutation({
        mutationKey: ['editBasket'],
        mutationFn: async ({
            basketID,
            basket,
            image,
        }: {
            basketID: string;
            basket: Basket;
            image: File | null;
        }) => {
            return await editBasket(basketID, basket, image);
        },
        onSuccess: (data, variables) => {
            closeModal();
            //todo: update basket info
            queryClient.setQueryData(['basket', basket.idx], {
                ...basket,
                name: variables.basket.name,
                deadline: variables.basket.deadline,
            });
        },
    });

    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState<Date>(new Date());
    const [imageURL, setImageURL] = useState('https://via.placeholder.com/200');
    const [image, setImage] = useState<File | null>(null);

    const formSchema = z.object({
        title: z
            .string()
            .min(2, {
                message: '바구니 이름은 2자 이상이어야합니다.',
            })
            .max(10, {
                message: '바구니 이름은 10자 이하여야합니다.',
            }),
        image: z.instanceof(File).optional(),
        deadline: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, {
                message: '날짜 형식은 YYYY-MM-DD이어야 합니다.',
            })
            .refine((date) => new Date(date) >= new Date(), {
                message: '과거의 날짜는 선택할 수 없습니다.',
            }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: basket.name,
            deadline: basket.deadline.toString().split('T')[0],
        },
        mode: 'all',
    });

    const fileRef = form.register('image');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {reset} = form;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);

        setTitle(values.title);
        setImage(values.image || null);
        setDeadline(new Date(values.deadline));
        const payload = {
            name: values.title,
            deadline: new Date(values.deadline),
            idx: basket.idx,
        };

        editBasketAPI.mutate({
            basketID: basket.idx.toString() || '',
            basket: payload,
            image: values.image || null,
        });
    };

    useEffect(() => {
        if (basket) {
            console.log(basket);
            setTitle(basket.name || '');
            setDeadline(new Date(basket.deadline) || null);
            setImageURL(basket.imageUrl || 'https://via.placeholder.com/200');
            reset({
                title: basket.name || '',
                deadline: basket.deadline.toString(),
            });
        }
    }, [basket, reset]);

    return (
        <div className="modal_new cartEdit">
            <div className="dim"></div>
            <Form {...form}>
                <form className="inner" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="handler">
                        <button className="close" onClick={closeModal}></button>
                    </div>
                    <div className="input_area">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>바구니 이름</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            autoFocus={true}
                                            {...field}
                                            placeholder="바구니 이름을 입력하세요"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>기념일 수정</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            // autoFocus={true}
                                            {...field}
                                            placeholder="yyyy-mm-dd"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="edit_area">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({field}) => (
                                <FormItem className="flex gap-2 items-baseline">
                                    <FormLabel>바구니 이미지 수정</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fileRef}
                                            ref={fileInputRef}
                                            onChange={(event) => {
                                                const displayUrl: string =
                                                    URL.createObjectURL(
                                                        event.target.files![0],
                                                    );

                                                setImageURL(displayUrl);
                                                console.log(event);
                                                const file =
                                                    event.target.files![0];
                                                console.log(file);

                                                field.onChange(file);
                                            }}
                                            type="file"
                                            accept="image/*"
                                            style={{
                                                display: 'none',
                                            }}
                                        />
                                    </FormControl>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                        }}
                                        className="btn_edit"
                                    >
                                        edit
                                    </button>
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* <div className="public">
                    다른 사람에게 바구니 공개하기
                    <div className="toggle_area">
                        <input type="checkbox" id="toggle" hidden />

                        <label htmlFor="toggle" className="toggleSwitch">
                            <span className="toggleButton"></span>
                        </label>
                    </div>
                </div> */}
                    <button className="btn_public">
                        바구니 정보 수정 완료
                    </button>
                </form>
            </Form>
        </div>
    );
};

const BasketInfo = () => {
    const {basketID} = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [dDay, setDDay] = useState(0);
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();

    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () =>
            fetchBasketInfo(basketID || '').then((data) => {
                const dDay =
                    Math.ceil(
                        (new Date(data?.deadline).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                    ) || 0;
                setDDay(dDay);
                return data;
            }),
    });

    // const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // const openModal = () => setIsOpen(true);
    const closeModal2 = () => setIsOpen2(false);

    return (
        <>
            <Header variant="back" btn_back profile />
            <div className="cardInfo">
                <div className="list_rounding">
                    <div className="writing">
                        <div>
                            <img
                                src={basketInfoAPI?.data?.imageUrl || Logo}
                                alt=""
                            />
                        </div>
                        <div>
                            {dDay >= 0 ? (
                                <div className="dDay">
                                    D-
                                    {dDay}
                                </div>
                            ) : (
                                <div className="text-[#ff5757] text-sm font-semibold">
                                    {-dDay}일 지남
                                </div>
                            )}
                            <div className="title min-w-48">
                                {basketInfoAPI?.data?.name}
                            </div>
                        </div>
                        {basketInfoAPI.data.participants.some(
                            (parti: Participant) =>
                                parti.userRole == 'MANAGER' &&
                                parti.userIdx == user?.idx,
                        ) && (
                            <div>
                                <button
                                    className="btn_pencil"
                                    onClick={() => setIsOpen(true)}
                                ></button>
                            </div>
                        )}
                    </div>
                    <button
                        className="btn_shadow"
                        onClick={() => navigate(`/basket/${basketID}`)}
                    >
                        <i>
                            <img src={giftBox} alt="" />
                        </i>
                        선물 바구니 보러가기
                    </button>
                </div>
                <div className="list_rounding">
                    <div className="friend_list">
                        <div>
                            <p className="title">참여중인 친구목록</p>
                            {/* <button className="btn_txt">모두 친구추가</button> */}
                        </div>
                        <div>
                            <ul>
                                {basketInfoAPI?.data?.participants?.map(
                                    (participant: Participant, idx: number) => (
                                        <ParticipantThumbnail
                                            participant={participant}
                                        />
                                    ),
                                )}
                            </ul>
                        </div>

                        <div>
                            <button
                                className="btn_shadow"
                                onClick={() => setIsOpen2(true)}
                            >
                                <i>
                                    <img src={friend} alt="" />
                                </i>
                                새로운 친구 초대하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <BasketEdit
                    closeModal={closeModal}
                    basket={basketInfoAPI?.data}
                />
            )}
            {isOpen2 && (
                <div className="modal_new share">
                    <div className="dim"></div>

                    <div className="inner">
                        <div className="handler">
                            <button
                                className="close"
                                onClick={closeModal2}
                            ></button>
                        </div>
                        <div className="title">
                            친한 친구를 바구니에 초대해보세요
                        </div>
                        <div className="btn_share_area">
                            <button className="kakao">카카오톡</button>
                            <button className="link">링크복사</button>
                        </div>
                        <button
                            className="btn_text"
                            onClick={() => navigate('/friends')}
                        >
                            친구목록에서 초대하기
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BasketInfo;
