import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {Participant} from '@/lib/types';
import {cn} from '@/lib/utils';
import React from 'react';

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
