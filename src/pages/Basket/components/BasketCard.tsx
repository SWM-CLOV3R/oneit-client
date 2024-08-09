import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Basket} from '@/lib/types';
import {CalendarCheck} from 'lucide-react';
import {Link, useParams} from 'react-router-dom';

const BasketCard = ({basket}: {basket: Basket}) => {
    return (
        <div className="rounded-lg overflow-hidden shadow-sm group ">
            <Link to={`/basket/${basket.idx}`} className="block">
                <AspectRatio ratio={1 / 1} className="justify-center flex">
                    <div className="relative w-full h-full flex justify-center">
                        <img
                            src={
                                basket.imageUrl ||
                                'https://via.placeholder.com/400'
                            }
                            alt={basket.name}
                            className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                </AspectRatio>
                <div className="p-4">
                    <h3 className="max-w-full  text-lg font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                        {basket.name}
                    </h3>
                    <span className="text-sm">{basket.description}</span>
                    <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-500">
                            <CalendarCheck className="inline-block mr-1" />
                            {basket.deadline.toString().split('T')[0]}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default BasketCard;
