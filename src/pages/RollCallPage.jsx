import { Avatar, Breadcrumb, Button, Card, Col, Form, Image, Input, Popconfirm, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import * as ServerService from '../services/ServerService';
import ImageNotFound from '../assets/images/404-image-not-found.png';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { getDayOfToday } from '../utils';
import _ from "lodash";
import * as MessagePopup from '../components/MessagePopupComponent';

const RollCallPage = () => {
    const user = useSelector((state) => state.user);
    const { classid, attendancetype } = useParams();
    const [today, setToday] = useState(getDayOfToday() + ' - ' + new Date().toLocaleDateString() + '');

    const [attendanceClass, setAttendanceClass] = useState('');
    const [attendanceStudents, setAttendanceStudents] = useState([{
        student: '',
        time: ''
    }]);

    // get class by teacher and class id
    const getClassByTeacherAndClassId = async () => {
        const res = await ServerService.getClassByTeacherAndClassId(user?.id, classid);
        return res;
    }
    const queryClassByTeacherAndClassId = useQuery({
        queryKey: ['class-by-teacher-and-class-id'],
        queryFn: getClassByTeacherAndClassId
    });
    const { isLoading: isLoadingClassByTeacherAndClassId, data: classByTeacherAndClassId } = queryClassByTeacherAndClassId;

    // set attendance
    const setAttendance = async () => {
        setAttendanceClass(classid);
        const res = await ServerService.setAttendance(classid, attendancetype, user?.id);
        return res;
    }
    const queryAttendance = useQuery({
        queryKey: ['attendance-info'],
        queryFn: setAttendance
    });
    const { isLoading: isLoadingAttendanceInfo, data: attendanceInfo } = queryAttendance;


    const handleOnChangeClassAttendance = async (classAttendance) => {
        setAttendanceClass(classAttendance);
        const res = await ServerService.setAttendance(classAttendance);
        return res;
    }


    // video stream
    const [scanURL, setScanURL] = useState(ImageNotFound);
    const [reloadImage, setReloadImage] = useState(1);
    const resetImage = () => {
        setReloadImage(Math.random());
    }
    const [isActiveStartButton, setIsActiveStartButton] = useState(true);
    const [isActiveStopButton, setIsActiveStopButton] = useState(false);

    const startRecoginition = async () => {
        // await ServerService.startRecognition();
        setScanURL(`${process.env.REACT_APP_API_URL}/face_rec`);
        setIsActiveStartButton(false);
        setIsActiveStopButton(true);
        MessagePopup.warning("Please wait a few seconds for preparing camera");
    }

    const stopVideoStream = async () => {
        const data = await ServerService.stopVideoStream();
        setAttendanceStudents(data);
        setScanURL(ImageNotFound);
        resetImage();
        setIsActiveStopButton(false);
        MessagePopup.success("Take attendance successfully");
    }


    // search student
    const [searchStudentValue, setSearchStudentValue] = useState('');
    const [arr, setArr] = useState([
        {
            student: 'B2005767',
            time: '10:00:00'
        },
        {
            student: 'B2005768',
            time: '10:00:00'
        },
        {
            student: 'B2005769',
            time: '10:00:00'
        },
        {
            student: 'B2005770',
            time: '10:00:00'
        },
        {
            student: 'B2005771',
            time: '10:00:00'
        },
        {
            student: 'B2005772',
            time: '10:00:00'
        },
        {
            student: 'B2005773',
            time: '10:00:00'
        },
        {
            student: 'B2005774',
            time: '10:00:00'
        },
        {
            student: 'B2005775',
            time: '10:00:00'
        },
        {
            student: 'B2005776',
            time: '10:00:00'
        },
        {
            student: 'B2005777',
            time: '10:00:00'
        },
    ]);
    // !!!! change arr to attendanceStudents 
    const [searchedStudents, setSearchedStudents] = useState(arr);
    const handleOnChangeSearchStudentValue = (e) => {
        setSearchStudentValue(e.target.value);
        const searchedStudentId = e.target.value.toLowerCase();
        let tempSearchedStudents = [];
        arr?.map((student) => {
            const studentId = student?.student.toLowerCase();
            if (studentId.includes(searchedStudentId)) {
                tempSearchedStudents.push(student);
            }
        });
        setSearchedStudents(tempSearchedStudents);
    }

    // navigate
    const navigate = useNavigate();
    const navigateToHomePage = () => {
        navigate('/');
    }
    const navigateToAttendanceClasses = () => {
        navigate('/attendance-classes');
    }



    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row>
                <Col>
                    <Breadcrumb
                        items={[
                            {
                                title: <span style={{ cursor: 'pointer' }} onClick={navigateToHomePage}>Home</span>,
                            },
                            {
                                title: <span style={{ cursor: 'pointer' }} onClick={navigateToAttendanceClasses}>Attendance Classes</span>,
                            },
                            {
                                title: 'Roll Call',
                            },
                        ]}
                    />
                </Col>
            </Row>
            <Row justify="space-between">
                <Col span={24} style={{ fontSize: '30px', fontWeight: '600', color: '#4d4d7f' }}>
                    ROLL CALL - {attendancetype === 'in' ? 'IN' : 'OUT'} ({today})
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col span={17}>
                    <Row justify="space-between">
                        <Col style={{ fontSize: '20px' }}>
                            Class:&nbsp;<b>{classid}</b>
                        </Col>
                        <Col style={{ fontSize: '20px' }}>
                            Course:&nbsp;<b>{classByTeacherAndClassId?.courseid} - {classByTeacherAndClassId?.name}</b>
                        </Col>
                        <Col style={{ fontSize: '20px' }}>
                            Time:&nbsp;<b>{attendancetype === 'in' ? classByTeacherAndClassId?.timein : classByTeacherAndClassId?.timeout}</b>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }} justify="center">
                        <Col>
                            <Button
                                style={{ borderRadius: '15px', backgroundColor: '#a0a0e1' }}
                                type='primary'
                                onClick={() => startRecoginition()}
                                disabled={!isActiveStartButton}
                            >
                                START RECOGNITION
                            </Button>
                            <Button
                                style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginLeft: '20px' }}
                                type='primary'
                                onClick={() => stopVideoStream()}
                                disabled={!isActiveStopButton}
                            >
                                STOP RECOGNITION
                            </Button>
                        </Col>
                    </Row>
                    <Image
                        src={scanURL}
                        style={{ width: "856px", height: "485px", borderRadius: "20px", marginTop: '20px' }}
                        draggable="false"
                        preview={false}
                        key={reloadImage}
                    />
                </Col>
                <Col span={6} offset={1} style={{ marginTop: '40px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '25px' }}>STUDENT INFORMATION</div>
                    <Row>
                        <Col span={24}>
                            <Input
                                placeholder="Search Student ID"
                                style={{
                                    borderRadius: '15px',
                                    height: '40px',
                                    marginBottom: '25px'
                                }}
                                value={searchStudentValue}
                                onChange={handleOnChangeSearchStudentValue}
                            />
                        </Col>
                    </Row>

                    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {searchedStudents && searchedStudents?.map((studentAttendance) => {
                            //{attendanceStudents && attendanceStudents?.map((studentAttendance) => {
                            if (studentAttendance?.student !== '' && studentAttendance?.time !== '') {
                                return (
                                    <Row justify="space-evenly" style={{ marginBottom: '20px' }} align="middle">
                                        <Col>
                                            <Avatar
                                                shape="square"
                                                size={32}
                                                icon={<UserOutlined />}
                                                style={{ backgroundColor: '#91caff' }}
                                            />
                                        </Col>
                                        <Col style={{ fontSize: '18px' }}>{studentAttendance?.student}</Col>
                                        <Col style={{ fontSize: '18px' }}>{studentAttendance?.time}</Col>
                                    </Row>
                                );
                            }
                        })}
                    </div>

                    {/* <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {
                            _.times(20, (i) => {
                                return (
                                    <Row justify="space-evenly" style={{ marginBottom: '20px' }} align="middle">
                                        <Col>
                                            <Avatar
                                                shape="square"
                                                size={32}
                                                icon={<UserOutlined />}
                                                style={{ backgroundColor: '#91caff' }}
                                            />
                                        </Col>
                                        <Col style={{ fontSize: '18px' }}>B2005767</Col>
                                        <Col style={{ fontSize: '18px' }}>Thien Nhan</Col>
                                    </Row>
                                );
                            })
                        }
                    </div> */}

                </Col>
            </Row >
        </Card >
    )
};

export default RollCallPage;

const AddNewForm = styled(Form)`
    .input-select-class {
        height: 45px;
        border-radius: 25px;
        padding: 0px 18px;
        margin-top: 20px; 
    }

    .input-select-class .ant-select-selector {
        border-radius: 25px;
    }

    .input-select-class .ant-select-selector .ant-select-selection-item{
        text-align: start;
        padding: 7px 0px 0px 7px;
    }

    .input-select-class .ant-select-arrow {
        margin-right: 20px;
    }
`