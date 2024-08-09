import {deleteBasketProduct} from '@/api/basket';
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
import {MinusSquare} from 'lucide-react';

interface ProductCardProps {
    product: Product;
    basketID: string;
}

const BasketProductCard = (props: ProductCardProps) => {
    const {product, basketID} = props;

    const handleDelete = async () => {
        await deleteBasketProduct(basketID || '', product.idx);
        //refresh page
        window.location.reload();
    };
    return (
        <div
            key={product.idx}
            className="rounded-lg overflow-hidden shadow-sm flex flex-col"
        >
            <div className="relative group">
                <a href={`/product/${product.idx}`} className="block">
                    <AspectRatio ratio={1 / 1} className="justify-center flex">
                        <div className="relative w-full h-full flex justify-center">
                            <img
                                src={
                                    product.thumbnailUrl ||
                                    'https://via.placeholder.com/400'
                                }
                                alt={product.name}
                                className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                    </AspectRatio>
                </a>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className="absolute top-0 right-0  transition-colors w-full justify-end flex">
                            <Button variant={null} size="icon">
                                <MinusSquare
                                    stroke="#ffa0a0"
                                    className="group-hover:stroke-red-500 bg-white rounded-sm"
                                />
                            </Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                바구니에서 해당 상품을 삭제할까요?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                삭제하기
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <a href={`/product/${product.idx}`} className="block">
                <div className="p-4">
                    <h3 className="max-w-full text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-end">
                        <span className="font-bold text-lg">
                            {product.originalPrice.toLocaleString()}원
                        </span>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default BasketProductCard;
