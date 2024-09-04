import axios from '@/lib/axios';

export const fetchCollectionList = async () => {
    return axios
        .get('/v2/collections')
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data);

                return Promise.resolve(res.data);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
};

export const fetchCollectionDetail = async (collectionID: string) => {
    return axios
        .get(`/v2/collections/${collectionID}`)
        .then((res) => {
            if (res.status === 200) {
                console.log(res.data);

                return Promise.resolve(res.data);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
};
