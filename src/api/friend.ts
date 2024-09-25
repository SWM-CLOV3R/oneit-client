import axios from '@/lib/axios';

export const fetchFriendList = async () => {
    return axios
        .get('/v2/friends')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteFriend = async (friendIdx: string) => {
    return axios
        .delete(`/v2/friends/${friendIdx}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchFriendRequests = async () => {
    return axios
        .get('/v2/friends/requests')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const requestFriend = async (friendIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/request`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const cancelFriendRequest = async (friendIdx: string) => {
    return axios
        .delete(`/v2/friends/${friendIdx}/request`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const acceptFriend = async (friendIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/accept`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const rejectFriend = async (friendIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/reject`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
