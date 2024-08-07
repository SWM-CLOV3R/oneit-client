import {Product} from '@/lib/types';
import {atom} from 'jotai';

//create basket
export const basketName = atom('');
basketName.debugLabel = 'basketName';
export const basketDescription = atom('');
basketDescription.debugLabel = 'basketDescription';
export const basketDeadline = atom<null | Date>(null);
basketDeadline.debugLabel = 'basketDeadline';
export const thumbnail = atom<null | File>(null);
thumbnail.debugLabel = 'thumbnail';
export const imageUrl = atom('');
imageUrl.debugLabel = 'imageUrl';
export const accessStatus = atom<'PUBLIC' | 'PRIVATE'>('PUBLIC');
accessStatus.debugLabel = 'accessStatus';

//select product
export const selectedProduct = atom<Product[]>([] as Product[]);
selectedProduct.debugLabel = 'selectedProduct';
export const selectProduct = atom(null, (get, set, product: Product) => {
    const selected = get(selectedProduct);
    if (selected.find((p) => p.idx === product.idx)) {
        set(
            selectedProduct,
            selected.filter((p) => p.idx !== product.idx),
        );
    } else {
        set(selectedProduct, [...selected, product]);
    }
});
