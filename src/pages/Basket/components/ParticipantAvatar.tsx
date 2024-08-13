import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';
import React from 'react';

interface Participant {
    nickname: string;
    profileImage: string;
    userRole?: string;
}

const ParticipantAvatar = (props: Participant) => {
    return (
        <TooltipProvider>
            <div>
                <a>
                    <Tooltip>
                        <TooltipTrigger>
                            <Avatar
                                className={cn(
                                    props.userRole == 'MANAGER' &&
                                        'border-2 border-oneit-pink',
                                )}
                            >
                                <AvatarImage src={props.profileImage} />
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{props.nickname}</TooltipContent>
                    </Tooltip>
                </a>
            </div>
        </TooltipProvider>
    );
};

export default ParticipantAvatar;
