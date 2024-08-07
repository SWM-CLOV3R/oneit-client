import {selectProduct} from '@/atoms/basket';
import {Product} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useSetAtom} from 'jotai';
import {useState} from 'react';
import {Link} from 'react-router-dom';

const AddProductCard = ({product}: {product: Product}) => {
    const onSelect = useSetAtom(selectProduct);
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(!isSelected);
        onSelect(product);
    };

    return (
        <div
            className={cn(
                'rounded-lg overflow-hidden shadow-sm ',
                isSelected && 'border-2 border-oneit-pink',
            )}
            onClick={handleClick}
        >
            <img
                src={product.thumbnailUrl || 'https://via.placeholder.com/400'}
                alt={product.name}
                width={400}
                height={300}
                className="relative z-[-10] w-full object-cover hover:opacity-80 transition-opacity"
            />
            <div className={cn('p-4')}>
                <h3 className="max-w-full  text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {product.name}
                </h3>
                <div className="flex items-center justify-end">
                    <span className="font-bold text-lg">
                        {product.originalPrice.toLocaleString()}원
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AddProductCard;
