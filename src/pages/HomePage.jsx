import { Button } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    // navigate
    const navigate = useNavigate();
    const handleNavigateScannerPage = () => {
        navigate('/scanner');
    }

    return (
        <div>
            <div>THIS IS MY HOME PAGE</div>
            <Button
                type="primary"
                style={{ height: '40px', width: '170px', borderRadius: '25px' }}
                onClick={handleNavigateScannerPage}
                danger>
                Go To Scanner
            </Button>
        </div>
    )
};

export default HomePage;

