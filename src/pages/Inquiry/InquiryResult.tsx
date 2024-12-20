import {getInquiry, submitInquiry} from '@/api/inquiry';
import {Button} from '@/components/ui/button';
import {Product} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import React, {Key} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import EmojiList from '@/data/emoji.json';
import {useAtom, useAtomValue} from 'jotai';
import {choices} from '@/atoms/inquiry';
import Header from '@/components/common/Header';
import logo from '@/assets/images/oneit.png';

const InquiryResult = () => {
    const {inquiryID} = useParams();
    const navigate = useNavigate();
    const [choiceList, setChoiceList] = useAtom(choices);
    const [{mutate}] = useAtom(submitInquiry);

    // console.log(choiceList);

    const inquiryAPI = useQuery({
        queryKey: ['inquiry', inquiryID],
        queryFn: () => getInquiry(inquiryID || ''),
    });

    const handleSubmit = () => {
        mutate(inquiryID || '');
        navigate(`/inquiry/after`, {replace: true});
    };

    return (
        <>
            <Header btn_back variant="back" profile />
            <div className="question3 scrollbar-hide mb-4">
                <div className="title">
                    {inquiryAPI.data?.target ? (
                        <>
                            <span>{inquiryAPI.data?.target}</span>님의 Pick!
                        </>
                    ) : (
                        '당신의 Pick!'
                    )}
                </div>

                <div className="info_area scrollbar-hide">
                    <ul>
                        {inquiryAPI.data?.selectedProducts.map(
                            (product: Product, idx: number) => {
                                // console.log(product);
                                // console.log(idx);
                                // console.log(
                                //     EmojiList[choiceList[idx]?.emojiIdx - 1],
                                // );

                                return (
                                    <li key={product.idx}>
                                        <div className="picture">
                                            <img
                                                src={
                                                    product?.thumbnailUrl ||
                                                    logo
                                                }
                                                alt="상품 대표 이미지"
                                            />
                                        </div>
                                        <div className="info min-w-40 justify-center">
                                            <div className="title text-overflow">
                                                {product?.name ||
                                                    '제품정보없음'}
                                            </div>
                                            <div className="text text-overflow">
                                                {product?.description}
                                            </div>
                                            <button
                                                className={`${
                                                    EmojiList[
                                                        choiceList[idx]
                                                            ?.emojiName ||
                                                            'LOVE'
                                                    ]?.name || 'like'
                                                }`}
                                            >
                                                <i></i>
                                                {EmojiList[
                                                    choiceList[idx].emojiName ||
                                                        'LOVE'
                                                ]?.content || '완전 좋아!'}
                                            </button>
                                        </div>
                                    </li>
                                );
                            },
                        )}
                    </ul>
                </div>
            </div>
            <div className="btn_area_fixed pl-4 pr-4">
                <button
                    className="btn_border"
                    onClick={() =>
                        navigate(`/inquiry/${inquiryID}`, {replace: true})
                    }
                >
                    다시 하기
                </button>
                <button className="btn_pink2" onClick={handleSubmit}>
                    결과 보내기
                </button>
            </div>
        </>
    );
};

export default InquiryResult;
