import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // window.location.href = 'https://www.oneit.gift/privacy.html';
        window.location.href = 'https://localhost:3000/privacy.html';
    }, []);

    return (
        <div>
            <h1>개인정보처리방침</h1>
        </div>
    );
};

export default Privacy;
