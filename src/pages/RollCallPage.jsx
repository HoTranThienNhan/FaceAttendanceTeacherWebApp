import { Button, Card, Col, Form, Image, Popconfirm, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import * as ServerService from '../services/ServerService';
import ImageNotFound from '../assets/images/404-image-not-found.png';
import FloatingLabelComponent from '../components/FloatingLabelComponent';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const RollCallPage = () => {
    const user = useSelector((state) => state.user);
    const { classid, attendancetype } = useParams();

    const [attendanceClass, setAttendanceClass] = useState('');
    const [attendanceStudents, setAttendanceStudents] = useState([{
        student: '',
        time: ''
    }]);

    // get all classes by teacher
    const getAllClassesByTeacher = async () => {
        const res = await ServerService.getAllClassesByTeacher(user?.id);
        return res;
    }
    const queryAllClassesByTeacher = useQuery({
        queryKey: ['classes'],
        queryFn: getAllClassesByTeacher
    });
    const { isLoading: isLoadingAllClassesByTeacher, data: allClassesByTeacher } = queryAllClassesByTeacher;

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

    const startRecoginition = async () => {
        // await ServerService.startRecognition();
        setScanURL(`${process.env.REACT_APP_API_URL}/face_rec`);
    }

    const stopVideoStream = async () => {
        const data = await ServerService.stopVideoStream();
        setAttendanceStudents(data);
        setScanURL(ImageNotFound);
        resetImage();
    }



    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row>
                <Col span={17}>
                    <AddNewForm
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
                            className='form-item-input'
                        >
                            <FloatingLabelComponent
                                label="Class"
                                value="Class"
                                styleBefore={{ left: '37px', top: '31px' }}
                                styleAfter={{ left: '37px', top: '23px' }}
                            >
                                <Select
                                    className='input-select-class'
                                    defaultValue="Select Class"
                                    onChange={handleOnChangeClassAttendance}
                                    value={attendanceClass?.length > 0 ? attendanceClass : "Select Class"}
                                >
                                    {allClassesByTeacher?.map((classItem, index) => {
                                        return (
                                            <Select.Option value={classItem?.id}>Class: <b>{classItem?.id}</b> - Course: <b>{classItem?.name}</b></Select.Option>
                                        );
                                    })}
                                </Select>
                            </FloatingLabelComponent>
                        </Form.Item>
                    </AddNewForm>

                    <Button
                        style={{ borderRadius: '15px', backgroundColor: '#a0a0e1' }}
                        type='primary'
                        onClick={() => startRecoginition()}
                        disabled={attendanceClass?.length === 0}
                    >
                        START RECOGNITION
                    </Button>
                    <Button
                        style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginLeft: '20px' }}
                        type='primary'
                        onClick={() => stopVideoStream()}
                        disabled={attendanceClass?.length === 0}
                    >
                        STOP
                    </Button>
                    {/* <LoadingComponent isLoading={isLoading}> */}
                    <Image
                        src={scanURL}
                        style={{ width: "856px", height: "485px", borderRadius: "20px", marginTop: '20px' }}
                        draggable="false"
                        preview={false}
                        key={reloadImage}
                    />
                    {/* </LoadingComponent> */}
                </Col>
                <Col span={6} offset={1} style={{ marginTop: '40px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '25px' }}>STUDENT INFORMATION</div>

                    {attendanceStudents && attendanceStudents?.map((studentAttendance) => {
                        return (
                            <Row justify="space-evenly" style={{ marginBottom: '15px' }}>
                                <Col style={{ fontSize: '18px' }}>{studentAttendance?.student}</Col>
                                <Col style={{ fontSize: '18px' }}>{studentAttendance?.time}</Col>
                            </Row>
                        );
                    })}
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