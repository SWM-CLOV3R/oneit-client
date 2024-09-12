import {useAtomValue, useSetAtom} from 'jotai';
import {
    answers,
    comment,
    gift,
    isValidGift,
    name,
    recipient,
    title,
} from '@/atoms/recommend';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import React, {Suspense, useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Spinner} from '@/components/ui/spinner';
import {getGift} from '@/api/product';
import {Card, CardTitle} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Share from '@/components/common/Share';
import KakaoShare from '@/components/common/KakaoShare';
import {isLoginAtom} from '@/api/auth';
import {toast} from 'sonner';
import {GiftIcon, Link} from 'lucide-react';
const GiftCard = React.lazy(() => import('./components/GiftCard'));
const NotFound = React.lazy(() => import('../NotFound'));

const Results = () => {
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();
    const {chatID} = useParams();
    const isLogin = useAtomValue(isLoginAtom);

    const getResult = useSetAtom(getGift);
    const product = useAtomValue(gift);
    const isValid = useAtomValue(isValidGift);
    const removeAnswers = useSetAtom(answers);

    const userName = useAtomValue(name);
    const userRecipient = useAtomValue(recipient);

    const userType = useAtomValue(title);
    const userComment = useAtomValue(comment);

    const handleRetry = () => {
        removeAnswers({} as {[key: string]: string});
        navigate('/recommend');
    };

    useEffect(() => {
        if (!chatID || chatID === '') {
            navigate('/recommend');
        }
        getResult(chatID);
    }, []);

    return (
        <>
            <div className="flex flex-col content-center w-full gap-2 justify-center">
                <Card className="flex rounded-lg shadow-md max-w-md w-full flex-col justify-center h-fit py-5">
                    <CardTitle className=" mb-4 flex justify-between px-4">
                        {/* <strong className='font-Bayon text-3xl'>One!t</strong>  */}
                        <div className="flex flex-col">
                            <h3 className="text-lg">{userType}</h3>
                            <span className="text-oneit-gray text-sm">
                                {userComment}
                            </span>
                        </div>
                        {isValid && (
                            // <KakaoShare
                            //     title={`ONE!T - ${userName === '' ? '' : userName + '을 위한 '}선물 추천`}
                            //     description="WANNA GIFT IT, ONE!T"
                            //     url={`https://www.oneit.gift/result/${chatID}`}
                            //     image={product[0].thumbnailUrl}
                            // />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(
                                        `https://oneit.gift/result/${chatID}`,
                                    );
                                    toast('클립보드에 복사되었습니다.');
                                }}
                            >
                                <Link />
                            </Button>
                        )}

                        {/* <Share
                            url={`https://oneit.gift/result/${chatID}`}
                            title={`ONE!T - ${userName === '' ? '' : userName + '위한 '}선물 추천`}
                            text={product
                                .map((item) => item.name)
                                .join('\n')}
                        /> */}
                        {/* <Share2Icon/> */}
                    </CardTitle>
                    <div className="w-full">
                        <Suspense fallback={<Spinner />}>
                            {isValid ? (
                                <Carousel
                                    className="w-full"
                                    opts={{loop: true}}
                                    autoplay={true}
                                    autoplayInterval={2500}
                                >
                                    <CarouselContent>
                                        {product.map((item, index) => (
                                            <CarouselItem key={index}>
                                                <GiftCard product={item} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            ) : (
                                <NotFound />
                            )}
                        </Suspense>
                    </div>
                    {isValid && (
                        <div className="flex flex-col justify-evenly px-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        // onClick={() => navigate('/curation')}
                                        className="w-full mt-2"
                                    >
                                        더 찾아보기
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            더 많은 선물을 보려면?
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-3 gap-2 h-32">
                                        <Button
                                            className="h-full bg-oneit-blue hover:bg-oneit-blue/90"
                                            onClick={() =>
                                                navigate('/discover')
                                            }
                                        >
                                            <span className="break-keep whitespace-normal">
                                                주제별 컬렉션 탐색하기
                                            </span>
                                        </Button>
                                        <Button
                                            className="h-full"
                                            onClick={() => {
                                                navigate('/curation');
                                            }}
                                        >
                                            <span className="break-keep whitespace-normal">
                                                ONE!T 선물 목록 살펴보기
                                            </span>
                                        </Button>
                                        <Button
                                            className="h-full bg-oneit-orange hover:bg-oneit-orange/90"
                                            onClick={() => {
                                                navigate('/recommend');
                                            }}
                                        >
                                            <span className="break-keep whitespace-normal">
                                                ONE!T에게 다시 추천 받기
                                            </span>
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {!isLogin && (
                                <div className="flex items-center">
                                    <Button
                                        onClick={() => {
                                            const uri = new URL(
                                                window.location.href,
                                            ).pathname;
                                            // console.log(uri);

                                            navigate('/login?redirect=' + uri);
                                        }}
                                        className="bg-kakao-yellow hover:bg-kakao-yellow/90 w-full mt-2"
                                    >
                                        <span>
                                            카카오 로그인 후 바구니에 추가하기
                                        </span>
                                    </Button>
                                </div>
                            )}
                            <div className="flex items-center">
                                <Dialog defaultOpen={true}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="fixed bottom-16 right-0 px-3 py-6 rounded-full shadow-lg m-1 bg-gradient-to-br from-oneit-blue to-oneit-pink text-oneit-gray hover:from-oneit-pink hover:to-oneit-blue"
                                        >
                                            <GiftIcon className="w-6 h-6" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                ONE!T 선물 추천 이벤트 진행 중
                                            </DialogTitle>
                                            <DialogDescription className="text-oneit-gray">
                                                <p>
                                                    선물 추천 결과를 공유하고
                                                    경품을 받아가세요!
                                                </p>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2 text-center">
                                            <div>
                                                <strong className="">
                                                    설문조사 이벤트
                                                </strong>
                                                <p className="text-start">
                                                    추천 결과 페이지 링크를
                                                    복사하여 <br />
                                                    아래 폼에 등록해주시면{' '}
                                                    <br />
                                                    추첨을 통해 총 3 분께 <br />
                                                    추천 상품 중 하나를
                                                    드립니다.
                                                </p>
                                            </div>
                                            <div className="flex justify-around gap-2 w-full">
                                                <Button
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText(
                                                            `https://oneit.gift/result/${chatID}`,
                                                        );
                                                        toast(
                                                            '클립보드에 복사되었습니다.',
                                                        );
                                                    }}
                                                    className="w-full"
                                                >
                                                    결과 링크 복사
                                                </Button>
                                                {/* todo: instagram event link */}
                                                <a className="w-full">
                                                    <Button className="w-full">
                                                        SNS 공유하기
                                                    </Button>
                                                </a>
                                            </div>
                                            <div>
                                                <strong>
                                                    인스타그램 이벤트
                                                </strong>
                                                <p className="text-start">
                                                    추천 결과 페이지를 캡쳐하여{' '}
                                                    <br />
                                                    인스타그램에 공유하면 <br />
                                                    추첨을 통해 총 10 분께{' '}
                                                    <br />
                                                    스타벅스 기프티콘을
                                                    드립니다.
                                                </p>
                                            </div>
                                        </div>

                                        <a>
                                            <Button className="w-full">
                                                인스타그램 이벤트 페이지
                                                바로가기
                                            </Button>
                                        </a>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Results;
