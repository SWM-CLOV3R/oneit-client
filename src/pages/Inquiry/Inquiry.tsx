import {Button} from '@/components/ui/button';
import boxImage from '@/assets/giftbox2.png';

const IntroCard = () => {
    return (
        <>
            <div className="rounded-lg overflow-hidden shadow-sm border-[1px] w-full p-3">
                <div className="flex flex-col gap-2 w-full justify-center">
                    <h2 className="flex text-3xl">
                        000님을 위한 <br /> 선물이 준비되었어요!
                    </h2>
                    <img src={boxImage} className="w-full p-3" />

                    <p className="text-center">어떤 선물이 있는지 살펴보고</p>
                    <p className="text-center">이모지로 반응을 남겨주세요</p>
                    <Button>시작하기</Button>
                </div>
            </div>
        </>
    );
};

const Inquiry = () => {
    return (
        <div className="flex flex-col content-center w-full gap-2 justify-center">
            <IntroCard />
        </div>
    );
};

export default Inquiry;
