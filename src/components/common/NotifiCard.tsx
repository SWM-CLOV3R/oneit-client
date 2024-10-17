import {Notif} from '@/lib/types';
import React from 'react';
import {DropdownMenuItem} from '../ui/dropdown-menu';

const NotifiCard = (props: {notif: Notif}) => {
    const {notif} = props;
    return (
        <DropdownMenuItem className="flex flex-col w-full items-start">
            <h3 className="text-md font-bold text-start">{notif.title}</h3>
            <p className="text-overflow">{notif.body}</p>
            <span className="text-xs text-[#818181]">
                {notif.createdAt.toString().replace('T', ' ')}
            </span>
        </DropdownMenuItem>
    );
};

export default NotifiCard;
