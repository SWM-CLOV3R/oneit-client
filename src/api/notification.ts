import {firebaseMessagingConfig} from '@/lib/firebase';
import {atomWithDefault} from 'jotai/utils';
import axios from '@/lib/axios';
import {Notif} from '@/lib/types';
import {atom} from 'jotai';
import {atomWithQuery} from 'jotai-tanstack-query';
import {isLoginAtom} from './auth';

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

export const fetchNotifications = async (): Promise<Notif[]> => {
    return axios
        .get('/v2/notification/list')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const notificationAtom = atom<Notif[]>([]);
notificationAtom.debugLabel = 'notificationAtom';

// export const updateNotificationAtom = atomWithQuery((get) => {
//     const isLoggedIn = get(isLoginAtom);
//     return {
//         queryKey: ['notification'],
//         queryFn: async () => {
//             return fetchNotifications().then((data) => {
//                 const prevNotif = get(notificationAtom);
//                 if (prevNotif) {
//                     if (JSON.stringify(prevNotif) !== JSON.stringify(data)) {
//                         return Promise.resolve({updated: true, data});
//                     }
//                 }
//                 return Promise.resolve({updated: false, data});
//             });
//         },
//         enabled: !!isLoggedIn,
//     };
// });
