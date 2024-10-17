import {Notif} from '@/lib/types';
import React, {useState} from 'react';
import {DropdownMenuItem} from '../ui/dropdown-menu';
import {useMutation} from '@tanstack/react-query';
import {readNotification} from '@/api/notification';

const NotifiCard = (props: {notif: Notif}) => {
    const {notif} = props;
    // todo: manage status to show read or unread
    // const [status, setstatus] = useState(notif?.state)
    const readAPI = useMutation({
        mutationKey: ['readNotif'],
        mutationFn: () => readNotification(notif.idx),
    });
    const handleRead = () => {
        readAPI.mutate();
    };
    return (
        <DropdownMenuItem
            className="flex flex-col w-full items-start"
            onSelect={(e) => {
                e.preventDefault();
                handleRead();
            }}
        >
            <h3 className="text-md font-bold text-start">{notif.title}</h3>
            <p className="text-overflow">{notif.body}</p>
            <span className="text-xs text-[#818181]">
                {notif.createdAt.toString().replace('T', ' ')}
            </span>
        </DropdownMenuItem>
    );
};

export default NotifiCard;
