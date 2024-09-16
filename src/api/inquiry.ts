import {Product} from '@/lib/types';
import {atomWithMutation} from 'jotai-tanstack-query';
import axios from '@/lib/axios';
const {Kakao} = window;

type CreateInquiryVariables = {
    basketIdx: string;
    selected: Product[];
    target: string;
};

export const createInquiry = atomWithMutation<unknown, CreateInquiryVariables>(
    (get) => ({
        mutationKey: ['createInquiry'],
        mutationFn: async ({
            basketIdx,
            selected,
            target,
        }: CreateInquiryVariables) => {
            // console.log(selected);

            const products = selected.map((p) => Number(p.idx));
            const payload = {
                productIdxList: products,
                giftboxIdx: Number(basketIdx),
                target,
            };
            return axios
                .post(`v2/inquiry`, payload)
                .then((res) => {
                    return Promise.resolve(res.data);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        },
        onSuccess: (data, variables, context) => {
            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/inquiry/${data}`;

            Kakao.Share.sendDefault({
                objectType: 'text',
                text: `친구들이 ${variables.target}님의 선물을 고르고 있어요! 도와주세요!`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            });
        },
    }),
);
