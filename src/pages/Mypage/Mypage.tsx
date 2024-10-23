import {authAtom, logout} from '@/api/auth';

import {Button} from '@/components/common/Button';
import {useAtomValue} from 'jotai';
import {User2Icon, UserIcon} from 'lucide-react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import profileButtonSvg from '@/assets/images/profile_button.svg';
import Header from '@/components/common/Header';
import {useQuery} from '@tanstack/react-query';
import {fetchBasketList} from '@/api/basket';
import {Basket} from '@/lib/types';
import logo from '@/assets/images/oneit.png';
import {fetchFriendList} from '@/api/friend';
import {toast} from 'sonner';

const Mypage = () => {
    const navigate = useNavigate();
    const user = useAtomValue(authAtom);
    const handleLogout = async () => {
        await logout();
    };

    const basketListAPI = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });

    const friendListAPI = useQuery({
        queryKey: ['friend'],
        queryFn: () => fetchFriendList(),
    });

    const handleNotyet = () => {
        toast('아직 준비 중인 기능이에요');
    };

    return (
        <>
            <Header variant="back" />
            <div className="mypage1">
                <div className="rounding_grey">
                    <div className="nickname_area">
                        <div className="picture">
                            <img src={user?.profileImgFromKakao} alt="" />
                        </div>
                        <div className="name">{user?.nickname}</div>
                        <button
                            className="self-center btn_logout ml-auto w-[5.0625rem] h-[2.125rem] flex justify-center items-center bg-[#f01299] text-white text-sm font-bold rounded-lg"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                        <button
                            className="btn_pencil2"
                            onClick={() => navigate('/mypage/edit')}
                        ></button>
                    </div>
                    {/* <div className="wish_area">
                        <div className="title">위시아이템</div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div> */}
                </div>
                <div className="rounding_grey ">
                    <div className="basket_area ">
                        <div className="title">현재 참여중인 바구니</div>
                        <div className="wish_area scrollbar-hide">
                            <ul className="scrollbar-hide">
                                {basketListAPI.data?.map((basket: Basket) => (
                                    <li key={basket.idx}>
                                        <button>
                                            <img
                                                src={basket.imageUrl || logo}
                                                alt=""
                                            />
                                            <p className="text-overflow-one text-sm text-[#5d5d5d] text-center">
                                                {basket.name}
                                            </p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="nav">
                    <ul>
                        <li>
                            <button onClick={() => navigate('/friends')}>
                                친구 목록
                                <em>{friendListAPI?.data?.length || 0}</em>
                            </button>
                        </li>
                        <li>
                            <button onClick={handleNotyet}>
                                받은 선물바구니
                            </button>
                        </li>
                        <li>
                            <button onClick={handleNotyet}>
                                추천 받았던 상품
                            </button>
                        </li>
                        <li>
                            <button onClick={handleNotyet}>
                                참여 바구니 목록
                            </button>
                        </li>
                        <li>
                            <button onClick={handleNotyet}>타임어택</button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
    {
        /* <div className="flex flex-col w-full justify-center items-center">
                <div
                    className="border-y-[1px] w-full text-start p-2 cursor-pointer hover:bg-oneit-gray/10"
                    onClick={() => navigate('/friends')}
                >
                    친구 목록
                </div>
            </div> */
    }
    {
        /* </div> */
    }
    // );
};

export default Mypage;
