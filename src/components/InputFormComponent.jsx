import { Input } from 'antd';
import React from 'react';

const InputFormComponent = (props) => {
    const { placeholder = 'Nhập text', prefix, suffix, style, onChange, disabled = false, ...rests } = props;
    const handleOnChangeInput = (e) => {
        props.onChange(e);
    }
    return (
       <Input 
            placeholder={placeholder} 
            prefix={prefix}
            suffix={suffix} 
            style={style}
            value={props.value}
            onChange={handleOnChangeInput}
            disabled={disabled}
            {...rests}
        /> 
    )
};

export default InputFormComponent;