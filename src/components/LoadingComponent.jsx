import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingComponent = ({ children, isLoading, delay = 200 }) => {
    return (
        <Spin
            indicator={
                <LoadingOutlined
                    style={{
                        fontSize: 24,
                    }}
                />
            }
            spinning={isLoading} delay={delay}
        >
            {children}
        </Spin>
    )
};

export default LoadingComponent;