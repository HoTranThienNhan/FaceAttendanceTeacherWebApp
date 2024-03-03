import React, { useState } from 'react';
import { styled } from "styled-components";

const FloatingLabelComponent = props => {
    const [focus, setFocus] = useState(false);
    const { children, label, value, styleBefore, styleAfter } = props;

    const labelClass = focus || (value && value.length !== 0) ? "label label-float" : "label";
    var style = focus || (value && value.length !== 0) ? styleAfter : styleBefore;

    return (
       <FloatLabelDiv className='float-label' onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
          {children}
          <label style={style} className={labelClass}>{label}</label>
       </FloatLabelDiv>
    );
};

export default FloatingLabelComponent;

const FloatLabelDiv = styled.div`
    .float-label {
        position: relative;
        margin-bottom: 12px;
    }
  
    .label {
        font-size: 14px;
        font-weight: lighter;
        position: absolute;
        pointer-events: none;
        z-index: 10;
        color: #c4c4c4;
        transition: 0.2s ease all;
    }
  
    .label-float {
        font-weight: normal;
        color: #a4a4a4;
        font-size: 10px;
    }
`