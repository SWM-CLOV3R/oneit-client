import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Gift from '@/assets/images/giftbox.png';
import {Button} from '@/components/ui/button';
import KakaoShare from '@/components/common/KakaoShare';
import {
    ArrowRightSquare,
    CalendarCheck,
    ChevronLeft,
    CircleEllipsis,
    EllipsisVertical,
    Heart,
    MoveRight,
    Send,
    Trash2,
    XCircleIcon,
} from 'lucide-react';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {Separator} from '@/components/ui/separator';
import {fetchProduct} from '@/api/product';
import {useAtom, useAtomValue} from 'jotai';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {authAtom, isLoginAtom} from '@/api/auth';
import {useState} from 'react';
import {
    addBasketProductComment,
    basketProductVote,
    deleteBasketProduct,
    deleteBasketProductComment,
    fetchBasketProductComments,
} from '@/api/basket';
import {Comment} from '@/lib/types';
import {set} from 'date-fns';
import Header from '@/components/common/Header';
import mageHeart from '@/assets/images/mage_heart.svg';
import mageHeartFill from '@/assets/images/mage_heart_fill.svg';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {DropdownMenuTrigger} from '@radix-ui/react-dropdown-menu';

const BasketProduct = () => {
    const {basketID, productID} = useParams();
    const loggedIn = useAtomValue(isLoginAtom);
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();
    //todo: get vote info from API
    const [vote, setVote] = useState<'LIKE' | 'DISLIKE' | 'NONE'>('NONE');
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');
    const queryClient = useQueryClient();

    const fetchCommentsAPI = useQuery({
        queryKey: ['comments', basketID, productID],
        queryFn: () =>
            fetchBasketProductComments(basketID || '', productID || ''),
    });

    const productAPI = useQuery({
        queryKey: ['product', productID],
        queryFn: () => fetchProduct(productID || ''),
    });

    const addCommentAPI = useMutation({
        mutationFn: () =>
            addBasketProductComment(basketID || '', productID || '', text),
        mutationKey: ['addComment'],
        onSuccess: (data) => {
            queryClient.setQueryData(
                ['comments', basketID, productID],
                (prev: Comment[]) => (prev ? [...prev, data] : [data]),
            );
            setText('');
        },
    });

    const deleteCommentAPI = useMutation({
        mutationFn: (commentID: number) =>
            deleteBasketProductComment(commentID),
        mutationKey: ['deleteComment'],
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['comments', basketID, productID],
                (prev: Comment[]) =>
                    prev?.filter((comment) => comment.idx !== variables),
            );
        },
    });

    const voteAPI = useMutation({
        mutationFn: () =>
            basketProductVote(basketID || '', productID || '', 'uuid', vote),
    });

    const deleteBasketProductAPI = useMutation({
        mutationKey: ['deleteBasketProduct'],
        mutationFn: () =>
            deleteBasketProduct(basketID || '', productID?.toString() || ''),
    });

    const handleVote = () => {
        let newVote: 'LIKE' | 'DISLIKE' | 'NONE';
        let newCount: number;

        if (vote === 'LIKE') {
            newVote = 'NONE';
            newCount = count - 1;
        } else {
            newVote = 'LIKE';
            newCount = count + 1;
        }

        setVote(newVote);
        setCount(newCount);

        // console.log(basketID, product.idx, 'uuid', newVote);

        voteAPI.mutate();
    };
    const handleText = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        console.log(text);
        addCommentAPI.mutateAsync();
    };

    const handleDeleteComment = (commentID: number) => {
        deleteCommentAPI.mutate(commentID);
    };

    const handleDelete = () => {
        deleteBasketProductAPI.mutate();
        navigate(`/basket/${basketID}`);
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <>
            <Header variant="back" btn_back={false} />

            <div className="cardDetail scrollbar-hide pt-24">
                <div className="image_area">
                    <img
                        src={productAPI?.data?.thumbnailUrl}
                        alt="상품 썸네일"
                    />

                    <div className="black_area">
                        {vote == 'LIKE' ? (
                            <i
                                className="w-7 h-7 mr-0.5 bg-center bg-contain bg-no-repeat block"
                                style={{
                                    backgroundImage: `url(${mageHeartFill})`,
                                }}
                                onClick={handleVote}
                            ></i>
                        ) : (
                            <i
                                className="w-7 h-7 mr-0.5 bg-center bg-contain bg-no-repeat block"
                                style={{
                                    backgroundImage: `url(${mageHeart})`,
                                }}
                                onClick={handleVote}
                            ></i>
                        )}
                        <span
                            className={cn(vote == 'LIKE' && 'text-[#FF5757]')}
                        >
                            {count}
                        </span>
                        <span>명이 이 선물을 좋아하고 있어요!</span>
                        <div className="flex justify-end ml-16 pr-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <button>
                                        <EllipsisVertical />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="mr-2">
                                    <DropdownMenuItem>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/product/${productID}`,
                                                )
                                            }
                                            className="flex justify-between w-full"
                                        >
                                            더 알아보기
                                            <ArrowRightSquare />
                                        </button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button
                                            className="flex w-full justify-between"
                                            onClick={handleDelete}
                                        >
                                            삭제하기
                                            <XCircleIcon className="text-[#FF5757]" />
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div className="prd_info">
                    <div className="brand">{productAPI?.data?.brandName}</div>
                    <div className="title">{productAPI?.data?.name}</div>
                    <div className="price">
                        <span>₩</span>{' '}
                        {productAPI?.data?.originalPrice.toLocaleString()}
                    </div>
                </div>
                <div className="tag_area">
                    <div className="title">Tag</div>
                    <ul>
                        {productAPI.data?.keywords?.map((keyword, idx) => (
                            <li key={idx}>
                                <button>{keyword}</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="talk_area ">
                    <div className="title">선물 토크</div>
                    <div className="chat_area min-h-32">
                        {fetchCommentsAPI?.data?.length === 0 && (
                            <div className="flex justify-center text-center">
                                첫 번째 댓글을 남겨보세요!
                            </div>
                        )}
                        {fetchCommentsAPI?.data?.map(
                            (comment: Comment, idx: number) => {
                                if (comment.writerIdx == user?.idx) {
                                    return (
                                        <div
                                            key={comment.idx}
                                            className={cn('talking me')}
                                        >
                                            <div className="del">
                                                <button
                                                    className="btn_del"
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment.idx,
                                                        )
                                                    }
                                                >
                                                    토크삭제
                                                </button>
                                            </div>
                                            <div className="info">
                                                <div className="ballon">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            className="talking you"
                                            key={comment.idx}
                                        >
                                            <div className="thum">
                                                {/* todo: get profile of writer */}
                                                <img
                                                    src={
                                                        productAPI?.data
                                                            ?.thumbnailUrl
                                                    }
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div className="info">
                                                <p className="name">
                                                    {comment.writerNickName}
                                                </p>
                                                <div className="ballon">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            },
                        )}
                    </div>
                </div>
                <form className="talk_input_fixed" onSubmit={handleText}>
                    <input
                        type="text"
                        placeholder="이 제품을 추천/비추천하는 이유를 작성해보세요!"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    />
                    <button className="btn_send" type="submit"></button>
                </form>
            </div>
        </>
    );

    // return (
    //     <div className={cn('w-full', loggedIn ? 'pb-20' : 'pb-16')}>
    //         <div className="flex py-3 flex-wrap items-center justify-between">
    //             <Button
    //                 variant="ghost"
    //                 size="icon"
    //                 className=""
    //                 onClick={handleGoBack}
    //             >
    //                 <ChevronLeft className="" />
    //             </Button>
    //             {/* <p>{data?.brandName}</p> */}
    //             <div className="flex">
    //                 <Button variant="ghost" size="icon">
    //                     <Heart />
    //                 </Button>
    //                 <KakaoShare
    //                     title="ONE!T - 선물 추천"
    //                     description={productAPI.data?.name || 'ONE!T'}
    //                     url={`/product/${productAPI.data?.idx}`}
    //                     image={
    //                         productAPI.data?.thumbnailUrl ||
    //                         'https://www.oneit.gift/oneit.png'
    //                     }
    //                 />
    //             </div>
    //         </div>

    //         <div className="flex justify-center w-full">
    //             <img
    //                 src={productAPI.data?.thumbnailUrl || Gift}
    //                 alt="recommended product"
    //                 // width={200}
    //                 // height={200}
    //                 className="object-cover group-hover:opacity-50 transition-opacity"
    //             />
    //         </div>
    //         <div className="py-2 bg-white dark:bg-gray-950">
    //             <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
    //                 {productAPI.data?.categoryDisplayName}
    //             </p>
    //             <a
    //                 href={productAPI.data?.productUrl}
    //                 target="_blank"
    //                 rel="noreferrer"
    //             >
    //                 <h3 className="text-xl font-bold md:text-xl">
    //                     {productAPI.data?.name}
    //                 </h3>
    //             </a>
    //             <div className="flex items-center justify-between mt-2">
    //                 <p>{productAPI.data?.brandName}</p>
    //                 <h4 className="text-base font-semibold md:text-lg text-onei">
    //                     {productAPI.data?.originalPrice.toLocaleString()}원
    //                 </h4>
    //             </div>
    //         </div>
    //         <Separator className="mb-2" />
    //         <div className="flex flex-col">
    //             <div className="flex w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
    //                 <p className="text-oneit-pink text-sm inline-block">
    //                     {productAPI.data?.keywords?.map((keyword, idx) => (
    //                         <span
    //                             key={idx}
    //                             className="mr-1"
    //                         >{`#${keyword}`}</span>
    //                     ))}
    //                 </p>
    //             </div>
    //             <div className="flex">
    //                 <p className="break-words  whitespace-normal">
    //                     {productAPI.data?.description}
    //                 </p>
    //             </div>
    //         </div>
    //         <div className="pt-1">
    //             <p>선물 토크</p>
    //             <div className="bg-[#FEF1FA] w-full min-h-32">
    //                 <div className="flex w-full gap-2 flex-col">
    //                     {fetchCommentsAPI?.data?.map(
    //                         (comment: Comment, idx: number) => {
    //                             if (comment.writerIdx == user?.idx) {
    //                                 return (
    //                                     <div
    //                                         key={idx}
    //                                         className={cn(
    //                                             'flex gap-2',
    //                                             'justify-end',
    //                                         )}
    //                                     >
    //                                         <div className="flex items-center gap-2">
    //                                             <p>{comment.writerNickName}</p>
    //                                             <button
    //                                                 onClick={() =>
    //                                                     handleDeleteComment(
    //                                                         comment.idx,
    //                                                     )
    //                                                 }
    //                                             >
    //                                                 <Trash2 />
    //                                             </button>
    //                                         </div>
    //                                         <p>{comment.content}</p>
    //                                     </div>
    //                                 );
    //                             }

    //                             return (
    //                                 <div
    //                                     key={idx}
    //                                     className={cn(
    //                                         'flex gap-2',
    //                                         user?.idx == comment.writerIdx
    //                                             ? 'justify-end'
    //                                             : 'justify-start',
    //                                     )}
    //                                 >
    //                                     <div className="flex items-center gap-2">
    //                                         <p>{comment.writerNickName}</p>
    //                                     </div>
    //                                     <p>{comment.content}</p>
    //                                 </div>
    //                             );
    //                         },
    //                     )}
    //                 </div>
    //             </div>
    //             <form className="flex w-full gap-2" onSubmit={handleText}>
    //                 <input
    //                     className="w-full border-[#D1D1D1] border-2 rounded-md"
    //                     onChange={(e) => setText(e.target.value)}
    //                     value={text}
    //                 ></input>
    //                 <button type="submit">
    //                     <Send />
    //                 </button>
    //             </form>
    //         </div>
    //     </div>
    // );
};

export default BasketProduct;
