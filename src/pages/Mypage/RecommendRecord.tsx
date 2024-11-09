import {authAtom} from '@/api/auth';
import {fetchRecommendRecord} from '@/api/chat';
import {useQuery} from '@tanstack/react-query';
import {useAtomValue} from 'jotai';
import React from 'react';

const RecommendRecord = () => {
    const user = useAtomValue(authAtom);
    const fetchRecommendRecordAPI = useQuery({
        queryKey: ['recommendRecord'],
        queryFn: () => fetchRecommendRecord(user?.idx.toString() || ''),
    });
    if (fetchRecommendRecordAPI.isSuccess) {
        console.log(fetchRecommendRecordAPI.data);
    }
    return <div>RecommendRecord</div>;
};

export default RecommendRecord;
