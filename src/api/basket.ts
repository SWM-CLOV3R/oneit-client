import {
    accessStatus,
    basketDeadline,
    basketDescription,
    basketName,
    selectedProduct,
    thumbnail,
} from '@/atoms/basket';
import axios from '@/lib/axios';
import {Basket} from '@/lib/types';
import {atom} from 'jotai';

export const createBasket = atom(null, async (get, set) => {
    const data = {
        name: get(basketName),
        description: get(basketDescription),
        deadline: get(basketDeadline),
        accessStatus: get(accessStatus),
    };

    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    payload.append('image', get(thumbnail) as File);
    set(basketName, '');
    set(basketDescription, '');
    set(basketDeadline, null);
    set(thumbnail, null);
    set(accessStatus, 'PUBLIC');
    return axios
        .post('/v2/giftbox', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            console.log(res);
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
});

export const fetchBasketInfo = async (basketID: string) => {
    return axios
        .get(`/v2/giftbox/${basketID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchBasketList = async () => {
    return axios
        .get('/v2/giftbox')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteBasket = async (basketID: string) => {
    return axios
        .delete(`/v2/giftbox/${basketID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const editBasket = async (
    basketID: string,
    basket: Basket,
    thumbnail: File | null,
) => {
    const data = {
        name: basket.name,
        description: basket.description,
        deadline: basket.deadline,
        accessStatus: basket.accessStatus,
    };

    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    payload.append('image', thumbnail as File);
    return axios
        .put(`/v2/giftbox/${basketID}`, basket, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const addToBasket = atom(null, async (get, set, basketIdx: string) => {
    const selected = get(selectedProduct);
    const products = selected.map((p) => Number(p.idx));
    return axios
        .post(`v2/giftbox/${basketIdx}/products`, products)
        .then((res) => {
            set(selectedProduct, []);
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
});

export const fetchBasketProducts = async (basketIdx: string) => {
    return axios
        .get(`v2/giftbox/${basketIdx}/products`)
        .then((res) => {
            if (res.status === 200) {
                return Promise.resolve(res.data);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteBasketProduct = async (
    basketIdx: string,
    productIdx: number,
) => {
    const payload = [Number(productIdx)];
    return axios
        .delete(`v2/giftbox/${basketIdx}/products`, {
            data: payload,
        })
        .then((res) => {
            if (res.status === 200) {
                return Promise.resolve(res.data);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const basketInvite = async (basketIdx: string) => {
    return axios
        .post(`v2/giftbox/${basketIdx}/invitation`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const confirmInvitation = async (invitationIdx: string) => {
    return axios
        .patch(`v2/giftbox/invitation/${invitationIdx}/status`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};

export const fetcthBasketParticipants = async (basketIdx: string) => {
    return axios
        .get(`v2/giftbox/${basketIdx}/participants`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const basketProductVote = async (
    basketIdx: string,
    productIdx: string,
    browserUuid: string = 'browserUuid',
    vote: 'LIKE' | 'DISLIKE' | 'NONE',
) => {
    return axios
        .put(`v2/giftbox/products/vote`, {
            giftboxIdx: basketIdx,
            productIdx,
            browserUuid,
            vote,
        })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
