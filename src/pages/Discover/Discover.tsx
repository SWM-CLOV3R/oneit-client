import React from 'react';
import DiscoverCard from './components/DiscoverCard';
const mockCollection = {
    idx: 1,
    name: 'Collection Name',
    description: 'Collection Description',
    thumbnailUrl: 'https://via.placeholder.com/400',
};

const Discover = () => {
    return (
        <div className="w-full pb-5 pt-4">
            <div className="flex flex-col gap-3">
                <h3 className="text-lg text-center">컬렉션 둘러보기</h3>
                <DiscoverCard collection={mockCollection} />
            </div>
        </div>
    );
};

export default Discover;
