import {basketProductVote, deleteBasketProduct} from '@/api/basket';
import {selctedProductCount, selectProduct} from '@/atoms/basket';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {Product} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useMutation} from '@tanstack/react-query';
import {useAtomValue, useSetAtom} from 'jotai';
import {Heart, MinusSquare} from 'lucide-react';
import {useEffect, useState} from 'react';
import likeit from '@/assets/images/icon_likeit.svg';
import mageHeart from '@/assets/images/mage_heart.svg';
import mageHeartFill from '@/assets/images/mage_heart_fill.svg';
import {useNavigate} from 'react-router-dom';

interface ProductCardProps {
    product: Product;
    basketID: string;
    shared: boolean;
    likeCount: number;
    voteStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    purchaseStatus: 'PURCHASED' | 'NOT_PURCHASED';
}

const BasketProductCard = (props: ProductCardProps) => {
    const {product, basketID, shared, likeCount, voteStatus, purchaseStatus} =
        props;
    const navigate = useNavigate();
    const [vote, setVote] = useState<'LIKE' | 'DISLIKE' | 'NONE'>(voteStatus);
    const [count, setCount] = useState(likeCount);
    const [isOpen, setIsOpen] = useState(false);
    const onSelect = useSetAtom(selectProduct);
    const [isSelected, setIsSelected] = useState(false);
    const selectedCount = useAtomValue(selctedProductCount);

    const deleteAPI = useMutation({
        mutationFn: () => deleteBasketProduct(basketID || '', product.idx),
        onSuccess: () => window.location.reload(),
    });

    const voteAPI = useMutation({
        mutationFn: () =>
            basketProductVote(basketID, product.idx.toString(), 'uuid', vote),
    });

    useEffect(() => {
        if (selectedCount === 0) {
            setIsSelected(false);
        }
    });

    const handleClick = () => {
        setIsSelected(!isSelected);
        onSelect(product);
    };

    const handleDelete = async () => {
        deleteAPI.mutate();
    };

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

    return (
        <div
            className={cn('box', purchaseStatus === 'PURCHASED' && 'solid')}
            onClick={() =>
                navigate(`/basket/${basketID}/product/${product.idx}`)
            }
        >
            <div className="image">
                <div className="photo">
                    <img src={product.thumbnailUrl} alt="제품 이미지" />
                    <div className="heart" onClick={handleVote}>
                        {vote == 'LIKE' ? (
                            <i
                                className="w-7 h-7 mr-0.5 bg-center bg-contain bg-no-repeat block"
                                style={{
                                    backgroundImage: `url(${mageHeartFill})`,
                                }}
                            ></i>
                        ) : (
                            <i
                                className="w-7 h-7 mr-0.5 bg-center bg-contain bg-no-repeat block"
                                style={{
                                    backgroundImage: `url(${mageHeart})`,
                                }}
                            ></i>
                        )}
                        <span
                            className={cn(vote == 'LIKE' && 'text-[#FF5757]')}
                        >
                            {count}
                        </span>
                    </div>
                    <div className="desc">
                        <i>
                            <img src={likeit} alt="좋아요 아이콘" />
                        </i>
                        너무 맘에 들어
                    </div>
                </div>
            </div>
            <p className="title text-overflow h-10">{product.name}</p>
            <p className="price">₩ {product.originalPrice.toLocaleString()}</p>
            <div className="tags">
                {product.keywords
                    ?.splice(0, 3)
                    .map((tag, idx) => <span key={idx}>#{tag}</span>)}
            </div>
        </div>
    );
};

export default BasketProductCard;
