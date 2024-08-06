import BasketCard from '@/pages/Basket/components/BasketCard';
import Recommend from './components/RecommendCard';

const Main = () => {
    return (
        <div className="flex flex-col overflow-hidden justify-center gap-5 p-1 w-full items-center">
            {/* <BasketCard /> */}
            <Recommend />
        </div>
    );
};

export default Main;
