import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Friend} from '@/lib/types';
import {cn} from '@/lib/utils';
import {CircleEllipsis, UserCircle2} from 'lucide-react';
import React from 'react';
import FriendCard from './Components/FriendCard';
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

const mockFriends: Friend[] = [
    {
        idx: 1,
        name: '김철수',
        nickName: '철수',
        profileImg: 'https://via.placeholder.com/320?text=oneit',
        birthDate: new Date(),
    },
    {
        idx: 2,
        name: '김영희',
        nickName: '영희',
        profileImg: 'https://via.placeholder.com/320?text=oneit',
        birthDate: new Date(),
    },
    {
        idx: 3,
        name: '박영수',
        nickName: '영수',
        profileImg: 'https://via.placeholder.com/320?text=oneit',
        birthDate: new Date(),
    },
    {
        idx: 4,
        name: '이영미',
        nickName: '영미',
        profileImg: 'https://via.placeholder.com/320?text=oneit',
        birthDate: new Date(),
    },
    {
        idx: 5,
        name: '정영희',
        nickName: '영희',
        profileImg: 'https://via.placeholder.com/320?text=oneit',
        birthDate: new Date(),
    },
];

const Friends = () => {
    const friendPicker = async () => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
        Kakao.Picker.selectFriends({
            title: '친구 선택',
            maxPickableCount: 1,
            minPickableCount: 1,
        })
            .then((res: FriendPickerResponse) => {
                console.log(res);
                const uuid = res.users[0].uuid;
                Kakao.API.request({
                    url: '/v1/api/talk/friends/message/default/send',
                    data: {
                        receiver_uuids: [uuid],
                        template_object: {
                            object_type: 'feed',
                            content: {
                                title: 'test',
                                description: 'test test',
                                image_url: 'https://www.oneit.gift/oneit.png',
                                link: {
                                    web_url: 'https://www.oneit.gift',
                                    mobile_web_url: 'https://www.oneit.gift',
                                },
                            },
                            buttons: [
                                {
                                    title: '웹으로 보기',
                                    link: {
                                        mobile_web_url:
                                            'https://www.oneit.gift',
                                        web_url: 'https://www.oneit.gift',
                                    },
                                },
                            ],
                        },
                    },
                })
                    .then((response: any) => {
                        console.log(response);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    return (
        <div className="flex w-full flex-col">
            {mockFriends.map((friend: Friend, idx: number) => (
                <FriendCard friend={friend} key={idx} />
            ))}
        </div>
    );
};

export default Friends;
