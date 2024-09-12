import {Link, useNavigate} from 'react-router-dom';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

const BasketCard = ({text, login}: {text: string; login: boolean}) => {
    return (
        <>
            <div className="w-full bg-gradient-to-br from-oneit-blue to-[#a3dbff] hover:from-[#a3dbff] hover:to-[#98d5fb] transition-colors duration-300 rounded-lg h-[20%] flex flex-col justify-between shadow-md border-0 max-w-md">
                <Link
                    to={login ? '/basket' : '/login?redirect=/basket'}
                    className="w-full h-full flex flex-col justify-between"
                >
                    <div className="p-3">
                        <h3 className="text-2xl font-bold">이 중에 뭐 주지?</h3>
                        <p className="text-oneit-gray text-sm">
                            뭘 좋아할지 몰라서 다 준비해봤어
                        </p>
                    </div>
                    <Button className="m-2 bg-white hover:bg-slate-50">
                        {text}
                    </Button>
                </Link>
            </div>
        </>
    );
};

export default BasketCard;
