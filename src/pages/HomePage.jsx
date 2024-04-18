import { Button, Card, Col, List, Row } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomePage = () => {

    const user = useSelector((state) => state.user);
    console.log(user);

    // navigate
    const navigate = useNavigate();

    const navigateSignInPage = () => {
        navigate('/sign-in');
    }
    const navigateAddStudentPage = () => {
        navigate('/add-student');
    }
    const navigateCourseManagementPage = () => {
        navigate('/course-management');
    }
    const navigateStudentManagementPage = () => {
        navigate('/student-management');
    }
    const navigateTeacherManagementPage = () => {
        navigate('/teacher-management');
    }
    const navigateClassAssignmentPage = () => {
        navigate('/class-assignment');
    }
    const navigateClassManagementPage = () => {
        navigate('/class-management');
    }

    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row justify="space-between">
                <Col span={24} style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '30px', fontWeight: '700', color: '#4d4d7f', marginBottom: '10px' }}>FACE ATTENDANCE SYSTEM</div>
                    <div style={{ fontSize: '16px', color: 'grey', marginBottom: '10px' }}>This is website for Teachers to manage classes and attendance. Let's {user?.fullname ? "find out!" : "sign in!"}</div>
                </Col>
            </Row>
        </Card>
    )
};

export default HomePage;

const ButtonCustom = styled(Button)`
    border-radius: 15px;
    background-color: #a0a0e1;
    margin-left: 20px;
    color: #fff;
    padding: 0px 40px;
`
const CardCustom = styled(Card)`
    border: 2px solid #a0a0e1;
    height: 193px;
    width: 345px;
`
