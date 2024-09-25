import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Friend} from '@/lib/types';
import {cn} from '@/lib/utils';
import {CircleEllipsis, UserCircle2} from 'lucide-react';
import React, {useEffect} from 'react';
import FriendCard from './Components/FriendCard';
import {useQuery} from '@tanstack/react-query';
import {fetchFriendList, fetchFriendRequests} from '@/api/friend';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/api/auth';
import RequestedFriendCard from './Components/RequestedFriendCard';
const {Kakao} = window;
interface SelectedUser {
    uuid: string;
    id: string;
    profile_nickname: string;
    profile_thumbnail_image: string;
}
interface FriendPickerResponse {
    selectedTotalCount: number;
    users: SelectedUser[];
}
interface RequestedFriend {
    fromUser: Friend;
    requestDate: Date;
}

const Friends = () => {
    const userInfo = useAtomValue(authAtom);

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    const friendListAPI = useQuery({
        queryKey: ['friendList'],
        queryFn: () => fetchFriendList(),
    });

    const friendRequestListAPI = useQuery({
        queryKey: ['friendRequestList'],
        queryFn: () => fetchFriendRequests(),
    });

    // const friendPicker = async () => {
    //     Kakao.Picker.selectFriends({
    //         title: '친구 선택',
    //         maxPickableCount: 1,
    //         minPickableCount: 1,
    //     })
    //         .then((res: FriendPickerResponse) => {
    //             console.log(res);
    //             const uuid = res.users[0].uuid;
    //             Kakao.API.request({
    //                 url: '/v1/api/talk/friends/message/default/send',
    //                 data: {
    //                     receiver_uuids: [uuid],
    //                     template_object: {
    //                         object_type: 'feed',
    //                         content: {
    //                             title: 'ONE!T에서 함께 선물을 골라보아요!',
    //                             description: `${userInfo?.nickname}님이 초대하셨습니다.`,
    //                             image_url: 'https://www.oneit.gift/oneit.png',
    //                             link: {
    //                                 web_url: 'https://www.oneit.gift',
    //                                 mobile_web_url: 'https://www.oneit.gift',
    //                             },
    //                         },
    //                         buttons: [
    //                             {
    //                                 title: '웹으로 보기',
    //                                 link: {
    //                                     mobile_web_url:
    //                                         'https://www.oneit.gift',
    //                                     web_url: 'https://www.oneit.gift',
    //                                 },
    //                             },
    //                         ],
    //                     },
    //                 },
    //             })
    //                 .then((response: any) => {
    //                     console.log(response);
    //                 })
    //                 .catch((error: any) => {
    //                     console.log(error);
    //                 });
    //         })
    //         .catch((err: any) => {
    //             console.log(err);
    //         });
    // };

    const kakaoFriendList = async () => {
        Kakao.API.request({url: '/v1/api/talk/friends'}).then((res: any) => {
            console.log(res);
        });
    };

    const inviteFriends = async () => {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: 'ONE!T에서 함께 선물을 골라보아요!',
                description: `${userInfo?.nickname}님이 초대하셨습니다.`,
                imageUrl: 'https://www.oneit.gift/oneit.png',
                link: {
                    webUrl: 'https://www.oneit.gift',
                    mobileWebUrl: 'https://www.oneit.gift',
                },
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: 'https://www.oneit.gift',
                        webUrl: 'https://www.oneit.gift',
                    },
                },
            ],
        });
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col w-full items-center border-[1px] mt-3 p-2 rounded-md">
                <div className="flex flex-col w-full py-1">
                    <h3>전체 친구 수: {friendListAPI?.data?.length || 0}</h3>
                    <div className="flex gap-2">
                        <span className="text-oneit-gray text-sm">
                            친구 요청: {friendRequestListAPI?.data?.length || 0}
                        </span>
                        {/* <span className="text-oneit-gray text-sm">
                            친구 요청 수락 대기 중:{' '}
                            {friendListAPI?.data?.length || 0}
                        </span> */}
                    </div>
                </div>
                {/* <Button onClick={kakaoFriendList}>친구 찾아보기</Button> */}
                <Button className="w-full" onClick={inviteFriends}>
                    카카오톡 친구 초대하기
                </Button>
            </div>
            {friendRequestListAPI?.data?.length !== 0 && (
                <div className="gap-2 flex w-full border-[1px] rounded-md p-2 flex-col items-center">
                    <h3 className="">친구 요청</h3>
                    {friendRequestListAPI.data?.map(
                        (friend: RequestedFriend, idx: number) => (
                            <RequestedFriendCard friend={friend} key={idx} />
                        ),
                    )}
                </div>
            )}
            {friendRequestListAPI?.data?.length !== 0 && (
                <div className="gap-2 flex w-full border-[1px] rounded-md p-2 flex-col items-center">
                    <h3 className="">친구 요청 상태</h3>
                    {friendRequestListAPI.data?.map(
                        (friend: RequestedFriend, idx: number) => (
                            <RequestedFriendCard friend={friend} key={idx} />
                        ),
                    )}
                </div>
            )}

            {friendListAPI?.data?.length !== 0 && (
                <div className="gap-2 flex w-full border-[1px] rounded-md p-2 flex-col items-center">
                    <h3 className="">친구 목록</h3>
                    {friendListAPI.data?.map((friend: Friend, idx: number) => (
                        <FriendCard friend={friend} key={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Friends;
