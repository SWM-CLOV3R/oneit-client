import {firebaseMessagingConfig} from '@/lib/firebase';
import {atomWithDefault} from 'jotai/utils';
import axios from '@/lib/axios';

export const sendFCMToken = async (token: string) => {
    return axios
        .get(`/v2/notification/token?token=${token}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
