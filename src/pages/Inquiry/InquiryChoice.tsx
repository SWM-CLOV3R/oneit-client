import {getInquiry} from '@/api/inquiry';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {Emoji} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import {Smile} from 'lucide-react';
import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const dummyEmoji: Emoji = {
    idx: 1,
    name: 'GOOD',
    content: '마음에 들어요',
    emojiImageURL:
        'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMThfYV9jdXRlXzNkX29mX2Ffc21pbGVfZW1vamlfZmFjZV9pc29sYXRlZF9vbl9hX18xMjIzNzVhYi01YWIzLTQzYjQtODA5Ny0xN2YwMjMzNWVjMmQucG5n.png',
};

const InquiryChoice = () => {
    const {inquiryID} = useParams();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    const naigate = useNavigate();

    const inquiryAPI = useQuery({
        queryKey: ['inquiry', inquiryID],
        queryFn: () => getInquiry(inquiryID || ''),
    });

    const handleEmoji = (emoji: Emoji) => {
        setIsSelected(true);
    };

    const handleNext = () => {
        if (currentIdx === inquiryAPI.data.selectedProducts.length - 1) {
            //todo: submit inquiry result to server
            naigate(`/inquiry/${inquiryID}/result`);
        } else {
            setCurrentIdx((prev) => prev + 1);
        }
    };
    // console.log(inquiryAPI.data?.selectedProducts);

    return (
        <div className="flex flex-col content-center w-full gap-2 justify-center items-center">
            <div className="rounded-lg overflow-hidden shadow-sm border-[1px] w-full p-3">
                <div className="flex flex-col justify-center">
                    <AspectRatio ratio={1 / 1} className="justify-center flex">
                        <div className="relative w-full h-full flex justify-center">
                            <img
                                src={
                                    inquiryAPI.data?.selectedProducts[
                                        currentIdx
                                    ].thumbnailUrl ||
                                    'https://via.placeholder.com/400'
                                }
                                alt={
                                    inquiryAPI.data?.selectedProducts[
                                        currentIdx
                                    ].name
                                }
                                className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                    </AspectRatio>
                    <h3 className="max-w-full text-lg font-semibold m-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {inquiryAPI.data?.selectedProducts[currentIdx].name}
                    </h3>
                </div>
                <div className="w-full flex justify-between px-2">
                    {[
                        dummyEmoji,
                        dummyEmoji,
                        dummyEmoji,
                        dummyEmoji,
                        dummyEmoji,
                    ].map((emoji, idx) => (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="w-5"
                                        onClick={() => handleEmoji(emoji)}
                                    >
                                        {/* <img src={dummyEmoji.emojiImageURL} /> */}
                                        <Smile className="text-oneit-gray hover:text-oneit-pink" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{emoji.content}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
            {isSelected && (
                <Button className="w-[50%]" onClick={handleNext}>
                    {currentIdx === inquiryAPI.data?.selectedProducts.length - 1
                        ? '결과 확인하기'
                        : '다음 상품 보기'}
                </Button>
            )}
        </div>
    );
};

export default InquiryChoice;
