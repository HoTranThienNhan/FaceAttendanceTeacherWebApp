import { Button, Card, Col, Form, Input, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ServerService from '../services/ServerService';
import { useMutationHook } from '../hooks/useMutationHook';
import * as MessagePopup from '../components/MessagePopupComponent';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/slices/userSlice';
import InputFormComponent from '../components/InputFormComponent';
import InputPasswordComponent from '../components/InputPasswordComponent';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import FloatingLabelComponent from '../components/FloatingLabelComponent';
import { styled } from "styled-components";

const SignInPage = () => {
    const user = useSelector((state) => state.user);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // dispatch
    const dispatch = useDispatch();

    // mutation
    const mutation = useMutationHook(
        (data) => {
            const { username, password } = data;
            const res = ServerService.signIn(username, password);
            return res;
        }
    );
    const { data, isLoading, isSuccess, isError } = mutation;

    // sign in
    const handleSignIn = async (username, password) => {
        if (username.length === 0) {
            setUsernameError('Username cannot be empty');
        }
        if (password.length === 0) {
            setPasswordError('Password cannot be empty');
        }
        if (username.length > 0 && password.length > 0) {
            mutation.mutate({
                username,
                password
            });
        }
    }

    useEffect(() => {
        if (isSuccess) {
            MessagePopup.success("Sign in successfully");
            const { id, fullname, email, phone, gender } = data;
            dispatch(updateUser({ id: id, fullname: fullname, email: email, phone: phone, gender: gender }));
            handleNavigateHomePage();
        } else if (isError) {
            MessagePopup.error('Username or password incorrect');
        }
    }, [isSuccess, isError]);
    useEffect(() => {
        // navigate back to home page if already signed in 
        if (user?.fullname) {
            handleNavigateHomePage();
        }
    }, [user]);

    // handle on change input
    const handleOnChangeUsername = (e) => {
        setUsername(e.target.value);
        setUsernameError('');
    }
    const handleOnChangePassword = (e) => {
        setPassword(e);
        setPasswordError('');
    }

    // navigate
    const navigate = useNavigate();
    const handleNavigateHomePage = () => {
        navigate('/');
    }

    return (
        <SignInCard>
            <Row justify='center'>
                <Col span={10}>
                    <div style={{ fontSize: '32px', color: '#4d4d7f', fontWeight: '600', marginBottom: '10px' }}>SIGN IN</div>
                    <div style={{ marginBottom: '20px', color: '#646464' }}>
                        Welcome To Face Attendance!
                    </div>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label=""
                            validateStatus={"validating"}
                            help=""
                            style={{ marginBottom: '0px' }}
                            className='auth-form-item-username'
                        >
                            <FloatingLabelComponent
                                label="Username"
                                value={username}
                                styleBefore={{ left: '37px', top: '31px' }}
                                styleAfter={{ left: '37px', top: '23px' }}
                            >
                                <InputFormComponent
                                    placeholder=""
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    className='auth-input-username'
                                    value={username}
                                    onChange={handleOnChangeUsername}
                                />
                            </FloatingLabelComponent>
                        </Form.Item>
                        {usernameError?.length > 0 && <ErrorMessage>{usernameError}</ErrorMessage>}

                        <Form.Item
                            label=""
                            validateStatus={"validating"}
                            help=""
                            style={{ marginBottom: '0px' }}
                            className='auth-form-item-password'
                        >
                            <FloatingLabelComponent
                                label="Password"
                                value={password}
                                styleBefore={{ left: '37px', top: '31px' }}
                                styleAfter={{ left: '37px', top: '23px' }}
                            >
                                <InputPasswordComponent
                                    placeholder=""
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    className='auth-input-password'
                                    value={password}
                                    onChange={handleOnChangePassword}
                                />
                            </FloatingLabelComponent>
                        </Form.Item>
                        {passwordError?.length > 0 && <ErrorMessage>{passwordError}</ErrorMessage>}

                        <Form.Item
                            wrapperCol={{ span: 24 }}
                        >
                            <Button
                                className='auth-button-signin'
                                type="primary"
                                htmlType="submit"
                                onClick={() => handleSignIn(username, password)}
                            >
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>

                <Col span={10}>

                </Col>
            </Row>
        </SignInCard>
    )
};

export default SignInPage;

const SignInCard = styled(Card)`
    border-radius: 25px;
    border: 2px solid #000; 
    margin: 70px 100px;
    padding: 50px 0px;

    .ant-card-body {
        padding: 0px;
    }

    &:where(.css-dev-only-do-not-override-17a39f8).ant-card .ant-card-body {
        padding: 0px;
        border-radius: 0 0 8px 8px;
    }

    .auth-input-username, .auth-input-password {
        height: 45px;
        border-radius: 25px;
        padding: 0px 18px;
        margin-top: 20px; 
    }
    
    .auth-input-username .ant-input, 
    .auth-input-password .ant-input {
        padding-top: 7px;
    }

    .auth-button-signin {
        height: 50px; 
        width: 100%; 
        border-radius: 25px; 
        margin-bottom: 20px; 
        margin-top: 20px;
        background-color: #a0a0e1;
    }

    .ant-btn-primary:not(:disabled):not(.ant-btn-disabled):hover {
        background-color: #8961ed;
    }
`

const ErrorMessage = styled.div`
    text-align: start;
    margin: 5px 0px 0px 20px;
    color: #ff000d;
`

