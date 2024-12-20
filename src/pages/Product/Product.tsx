import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {fetchProduct, productLike} from '@/api/product';
import {addToBasket, fetchBasketList} from '@/api/basket';
import {Basket, Product as ProductType} from '@/lib/types';
import {useAtom, useAtomValue} from 'jotai';
import {cn} from '@/lib/utils';
import {isLoginAtom} from '@/api/auth';
import Header from '@/components/common/Header';
import logo from '@/assets/images/oneit.png';
import {Button} from '@/components/common/Button';
import {ArrowUp, Sparkles} from 'lucide-react';
import mageHeart from '@/assets/images/mage_heart_pink.svg';
import mageHeartFill from '@/assets/images/mage_heart_fill_pink.svg';
import {useState} from 'react';

const Product = () => {
    const {productID} = useParams();
    const queryClikent = useQueryClient();
    const [{mutate}] = useAtom(addToBasket);
    const loggedIn = useAtomValue(isLoginAtom);
    const navigate = useNavigate();
    // const [like, setLike] = useState<'NONE' | 'LIKE' | 'DISLIKE'>('NONE');

    // console.log(productID);

    const productLikeAPI = useMutation({
        mutationKey: ['productLike', productID],
        mutationFn: () => productLike(productID || ''),
        onSuccess: (data) => {
            queryClikent.setQueryData(
                ['product', productID],
                (oldData: ProductType) => {
                    return {
                        ...oldData,
                        likeStatus: data.likeStatus,
                        likeCount: data.likeCount,
                    };
                },
            );
        },
    });

    const basketAPI = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
        enabled: loggedIn,
    });

    const productAPI = useQuery({
        queryKey: ['product', productID],
        queryFn: () => {
            return fetchProduct(productID || '').then((res) => {
                // setLike(res.likeStatus || 'NONE');
                return res;
            });
        },
    });

    const handleGoBack = () => {
        navigate(-1);
    };
    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleAddToBasket = (basketID: string) => {
        if (productAPI.data) {
            mutate({basketIdx: basketID || '', selected: [productAPI.data]});
        }
    };

    const handleLike = () => {
        productLikeAPI.mutate();
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <>
            <Header variant="back" btn_back={false} />
            <div className="giftRecommDetail scrollbar-hide">
                <div className="prd_area ">
                    <div
                        className={cn(
                            'photo',
                            productAPI?.data?.productStatus === 'INVALID' &&
                                'sold',
                        )}
                    >
                        <img
                            src={productAPI.data?.thumbnailUrl}
                            alt="제품 대표 이미지"
                        />
                        <div className="heart" onClick={handleLike}>
                            <img
                                src={
                                    productAPI?.data?.likeStatus === 'LIKE'
                                        ? mageHeartFill
                                        : mageHeart
                                }
                                alt="Heart"
                                className="w-full h-full object-contain"
                            />
                            <span className="text-white ">
                                {productAPI?.data?.likeCount || 0} 명이 이
                                상품을 좋아해요
                            </span>
                        </div>
                    </div>

                    <div className="info">
                        <div className="brand">
                            {productAPI.data?.brandName || '상품정보없음'}
                        </div>
                        <div className="name">
                            {productAPI.data?.name || '상품정보없음'}
                        </div>
                        <div className="price">
                            ₩{' '}
                            {productAPI.data?.originalPrice?.toLocaleString() ||
                                0}
                        </div>
                        <div className="options scrollbar-hide">
                            {Object.keys(productAPI.data?.options || {})?.map(
                                (key: string, idx) => (
                                    <div
                                        className="option-group scrollbar-hide"
                                        key={key}
                                    >
                                        <p className="title">{key}</p>
                                        {productAPI.data?.options[key]?.map(
                                            (option, idx) => (
                                                <span key={idx}>{option}</span>
                                            ),
                                        )}
                                    </div>
                                ),
                            )}
                            {/* <p className="title">옵션</p>

                            <span>옵션내용</span>
                            <span>옵션내용</span>
                            <span>옵션내용</span>
                            <span>옵션내용</span> */}
                        </div>
                        <div className="essense items-center  flex">
                            <span className="text-[#ffabe6eb] mr-1">AI</span>{' '}
                            제품요약
                            <Sparkles className="inline-block h-3 -ml-1 text-[#ffabe6eb]" />
                        </div>
                        <div className="contents">
                            {productAPI.data?.description}
                        </div>
                        <div className="tags">
                            {productAPI.data?.displayTags
                                ?.slice(0, 10)
                                .map((tag, idx) => (
                                    <span key={idx}>{tag}</span>
                                ))}
                        </div>
                    </div>

                    {!loggedIn &&
                        productAPI?.data?.productStatus !== 'INVALID' && (
                            <div className="flex justify-center mb-[-20px]">
                                <Button className="px-3 h-8" variant="primary">
                                    로그인하고 바구니에 추가하기
                                </Button>
                            </div>
                        )}

                    {productAPI?.data?.productStatus !== 'INVALID' && (
                        <div className="cart_prd scrollbar-hide">
                            <ul className="scrollbar-hide">
                                {basketAPI.data?.map((basket: Basket) => {
                                    return (
                                        <li key={basket.idx}>
                                            <div
                                                className="photo"
                                                onClick={() =>
                                                    navigate(
                                                        `/basket/${basket.idx}`,
                                                    )
                                                }
                                            >
                                                <img
                                                    src={
                                                        basket.imageUrl || logo
                                                    }
                                                    alt=""
                                                />
                                                {basket.dday > 0 ? (
                                                    <div className="capsule_pink">
                                                        D-
                                                        {basket.dday}
                                                    </div>
                                                ) : basket.dday === 0 ? (
                                                    <div className="capsule_pink">
                                                        D-Day
                                                    </div>
                                                ) : (
                                                    <div className="capsule_pink">
                                                        마감
                                                    </div>
                                                )}
                                            </div>
                                            <div className="name text-overflow-one h-8">
                                                {basket.name || '바구니 이름'}
                                            </div>
                                            <div className="btn_add_cart_area">
                                                <button
                                                    className="btn_add_cart"
                                                    onClick={() =>
                                                        handleAddToBasket(
                                                            basket.idx.toString(),
                                                        )
                                                    }
                                                >
                                                    <i></i>바구니에 추가하기
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div className="desc">
                        {/* todo: product detail images */}
                        {productAPI.data?.detailImages && (
                            <>
                                <div className="title">제품 설명</div>

                                <div className="texts">
                                    {productAPI.data?.detailImages?.map(
                                        (img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt="상품 상세 이미지"
                                            />
                                        ),
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* <Button
                className="fixed bottom-0 right-0 z-[999] px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button> */}
        </>
    );
};

export default Product;
