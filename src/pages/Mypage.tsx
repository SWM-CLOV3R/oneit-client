import {logout} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
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

const Mypage = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
    };

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
        <div>
            Mypage
            <div>
                <Button onClick={handleLogout}>Logout</Button>
                <Button onClick={friendPicker}>친구 고르기</Button>
            </div>
        </div>
    );
};

export default Mypage;
