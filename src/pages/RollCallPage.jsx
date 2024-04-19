import { Avatar, Breadcrumb, Button, Card, Col, Form, Image, Input, Popconfirm, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import * as ServerService from '../services/ServerService';
import FaceAttendanceCameraBackground from '../assets/images/face-attendance-camera-background.png';
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
    const [attendanceStudents, setAttendanceStudents] = useState([]);

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
    const [scanURL, setScanURL] = useState(FaceAttendanceCameraBackground);
    const [reloadImage, setReloadImage] = useState(1);
    const resetImage = () => {
        setReloadImage(Math.random());
    }
    const [isActiveStartButton, setIsActiveStartButton] = useState(true);
    const [isActiveStopButton, setIsActiveStopButton] = useState(false);

    const startRecoginition = async () => {
        setScanURL(`${process.env.REACT_APP_API_URL}/face_rec`);
        setIsActiveStartButton(false);
        setIsActiveStopButton(true);
        MessagePopup.warning("Please wait a few seconds for preparing camera");
    }

    const stopVideoStream = async () => {
        const data = await ServerService.stopVideoStream();
        setScanURL(FaceAttendanceCameraBackground);
        resetImage();
        setIsActiveStopButton(false);
        MessagePopup.success("Take attendance successfully");
    }


    // search student
    const [searchStudentValue, setSearchStudentValue] = useState('');
    const [searchedStudents, setSearchedStudents] = useState(attendanceStudents);
    useEffect(() => {
        if (attendanceStudents?.length > 0) {
            setSearchedStudents(attendanceStudents);
        }
    }, [attendanceStudents]);
    const handleOnChangeSearchStudentValue = (e) => {
        setSearchStudentValue(e.target.value);
        const searchedStudentId = e.target.value.toLowerCase();
        let tempSearchedStudents = [];
        attendanceStudents?.map((student) => {
            const studentId = student?.student.toLowerCase();
            if (studentId.includes(searchedStudentId)) {
                tempSearchedStudents.push(student);
            }
        });
        setSearchedStudents(tempSearchedStudents);
    }


    // Json Streaming
    useEffect(() => {
        if (isActiveStartButton === false) {
            const jsonStream = async () => {
                const response = await fetch('http://localhost:7000/json_stream');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        break;
                    }
                    const decodedChunk = decoder.decode(value, { stream: true });
                    const decodedChunkObject = JSON.parse(decodedChunk.replace(/'/g, '"'));
                    setAttendanceStudents(prevValue => [...prevValue, decodedChunkObject]);
                }
            }
            jsonStream();
        }
    }, [isActiveStartButton]);


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

                    <div style={{ maxHeight: '360px', overflow: 'auto' }}>
                        {searchedStudents && searchedStudents?.map((studentAttendance) => {
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
                    {searchedStudents.length > 0 ?
                        <div style={{ marginTop: '15px' }}>
                            <Button
                                style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginLeft: '20px' }}
                                type='primary'
                                onClick={() => navigateToAttendanceClasses()}
                            >
                                BACK TO ATTENDANCE CLASSES
                            </Button>
                        </div>
                        :
                        <div style={{ marginTop: '15px', color: '#8c8c8c' }}>
                            There have been no students taking roll call yet.
                        </div>
                    }

                </Col>
            </Row>
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