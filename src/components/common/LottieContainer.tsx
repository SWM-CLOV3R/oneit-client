import { useRef, useEffect } from "react";
import Lottie from "lottie-web";

type LottieContainerProps = {
    path: string;
}
export const LottieContainer = ({ path }: LottieContainerProps) => {
    const lottieContainer = useRef<HTMLDivElement>(null);

    // Lottie 애니메이션 로드 및 초기화
    useEffect(() => {
        Lottie.loadAnimation({
            container: lottieContainer.current!,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: path,
        });

        return () => Lottie.destroy();
    })

    return <div className="w-full h-full" ref={lottieContainer} />;
};

export default LottieContainer;