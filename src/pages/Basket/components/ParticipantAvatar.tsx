import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
                            <Avatar>
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
