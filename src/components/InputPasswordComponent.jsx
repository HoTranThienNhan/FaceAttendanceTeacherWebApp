import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';

const InputPasswordComponent = (props) => {
    const { placeholder = 'Nhập text', prefix, suffix, style, onChange, ...rests } = props;
    const handleOnChangeInput = (e) => {
        props.onChange(e.target.value);
    }
    return (
        <Input.Password
            placeholder={placeholder}
            prefix={prefix}
            suffix={suffix}
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            style={style}
            value={props.value}
            onChange={handleOnChangeInput}
            {...rests}
        />
    )
};

export default InputPasswordComponent;