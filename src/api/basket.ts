import {
    basketDeadline,
    basketDescription,
    basketName,
    thumbnail,
} from '@/atoms/basket';
import axios from '@/lib/axios';
import {atom} from 'jotai';

export const createBasket = atom(null, async (get, set) => {
    const data = {
        name: get(basketName),
        description: get(basketDescription),
        deadline: get(basketDeadline),
        createdUserIdx: 1,
        accessStatus: 'PUBLIC',
    };

    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    payload.append('image', get(thumbnail) as File);
    axios
        .post('/v1/giftbox', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
});
