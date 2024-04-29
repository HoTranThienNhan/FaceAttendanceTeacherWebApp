import { Button, Card, Col, Image, List, Row } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FaceAttendanceHomepageAdd from '../assets/images/face-attendance-homepage-add.png';

const HomePage = () => {

    const user = useSelector((state) => state.user);
    console.log(user);

    // navigate
    const navigate = useNavigate();

    const navigateAttendanceClassesPage = () => {
        navigate('/attendance-classes');
    }
    const navigateSignInPage = () => {
        navigate('/signin');
    }

    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row justify="space-between">
                <Col span={24} style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '30px', fontWeight: '700', color: '#4d4d7f', marginBottom: '10px' }}>FACE ATTENDANCE SYSTEM</div>
                    <div style={{ fontSize: '16px', color: 'grey', marginBottom: '10px' }}>This is website for Teachers to manage classes and attendance. Let's {user?.fullname ? "find out!" : "sign in!"}</div>
                </Col>
            </Row>
            <Row style={{ margin: '40px 0px 0px 30px' }} align="middle">
                <Col span={11} align="start">
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#4d4d7f', marginBottom: '10px' }}>TAKING FACE ATTENDANCE</div>
                    <div>
                        After choosing an attendance type (in/out) of an available class,
                        teacher is able to take students' face attendance through the camera.
                        The system also records the time and student ID when student has already did a roll call.
                        {user?.fullname === "" &&
                            <span style={{ fontStyle: 'italic', color: 'orange' }}><br />Please sign in to use the website features.</span>
                        }
                    </div>
                    {user?.fullname ?
                        <div style={{ marginTop: '15px' }}>
                            <ButtonCustom onClick={navigateAttendanceClassesPage}>
                                TAKE ATTENDANCE
                            </ButtonCustom>
                        </div>
                        :
                        <div style={{ marginTop: '15px' }}>
                            <ButtonCustom onClick={navigateSignInPage}>
                                SIGN IN
                            </ButtonCustom>
                        </div>
                    }
                </Col>
                <Col span={12} offset={1}>
                    <Image
                        src={FaceAttendanceHomepageAdd}
                        style={{ width: "70%", height: "60%", borderTopRightRadius: "20px", borderBottomRightRadius: '20px' }}
                        draggable="false"
                        preview={false}
                    />
                </Col>
            </Row>
        </Card >
    )
};

export default HomePage;

const ButtonCustom = styled(Button)`
    border-radius: 15px;
    background-color: #a0a0e1;
    color: #fff;
    padding: 0px 40px;
`

const CardCustom = styled(Card)`
    border: 2px solid #a0a0e1;
    height: 193px;
    width: 345px;
`
