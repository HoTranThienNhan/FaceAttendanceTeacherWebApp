import { Button, Card, Col, Empty, Image, Row, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import TableComponent from '../components/TableComponent';
import * as ServerService from '../services/ServerService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getDayOfToday, getMinusHourBetween2TimeText } from '../utils';
import { useNavigate } from 'react-router-dom';
import OverdueStamp from '../assets/images/overdue-stamp.png';

const AttendanceClassesPage = () => {

    const user = useSelector((state) => state.user);
    const [classDetails, setClassDetails] = useState({
        classid: '',
        courseid: '',
        coursename: '',
        standardTimein: '',
        standardTimeout: '',
        isRollCallIn: false,
        isRollCallOut: false,
        students: [],
    });
    const [today, setToday] = useState(getDayOfToday() + ' - ' + new Date().toLocaleDateString() + '');

    // get all classes by teacher
    const getAllClassesByTeacher = async () => {
        const res = await ServerService.getAllClassesByTeacher(user?.id);
        return res;
    }
    const queryAllClassesByTeacher = useQuery({
        queryKey: ['classes-by-teacher'],
        queryFn: getAllClassesByTeacher
    });
    const { isLoading: isLoadingAllClassesByTeacher, data: allClassesByTeacher } = queryAllClassesByTeacher;

    // get all students by class and set abled/disabled in-out attendance button 
    const getAllStudentsByClass = async (classid) => {
        const res_all_students = await ServerService.getAllStudentsByClass(classid);
        // set students stateyth
        let studentList = [];
        res_all_students?.forEach(student => {
            studentList.push(student.studentid)
        });
        setClassDetails(prevState => {
            return {
                ...prevState,
                students: studentList
            }
        });
        // set abled/disabled in-out attendance button 
        // if standard time out of the class is greater than time now()

        // set abled/disabled in-out attendance button  
        const res_in_attendance = await ServerService.getInAttendance(classid);
        // if in attendance has not taken yet
        if (res_in_attendance?.length > 0) {
            setClassDetails(prevState => {
                return {
                    ...prevState,
                    isRollCallIn: true,
                }
            });
        } else {
            setClassDetails(prevState => {
                return {
                    ...prevState,
                    isRollCallIn: false,
                }
            });
        }
        const res_out_attendance = await ServerService.getOutAttendance(classid);
        // if out attendance has not taken yet
        if (res_out_attendance?.length > 0) {
            setClassDetails(prevState => {
                return {
                    ...prevState,
                    isRollCallOut: true,
                }
            });
        } else {
            setClassDetails(prevState => {
                return {
                    ...prevState,
                    isRollCallOut: false,
                }
            });
        }
        return res_all_students;
    }

    // attendance classes columns
    const attendanceClassesColumns = [
        {
            title: 'Class ID',
            dataIndex: 'id',
            className: 'class-id',
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: 'Course ID',
            dataIndex: 'courseid',
            className: 'course-id',
            sorter: (a, b) => a.courseid.localeCompare(b.courseid),
        },
        {
            title: 'Course Name',
            dataIndex: 'name',
            className: 'course-name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Time In',
            dataIndex: 'timein',
            className: 'time-in',
        },
        {
            title: 'Time Out',
            dataIndex: 'timeout',
            className: 'time-out',
        },
    ];

    // no data table
    let locale = {
        emptyText: (
            <Empty
                imageStyle={{ height: 70, marginTop: '20px' }}
                style={{ marginBottom: '20px' }}
                description={
                    <span style={{ color: '#b4b4b4' }}>
                        No available classes today.
                    </span>
                }
            >
            </Empty>
        )
    };

    const navigate = useNavigate();
    const rollCallIn = (classid, attendancetype) => {
        navigate(`/roll-call/${classid}/${attendancetype}`);
    }
    const rollCallOut = (classid, attendancetype) => {
        navigate(`/roll-call/${classid}/${attendancetype}`);
    }



    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row justify="center">
                <Col span={24}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '30px' }}>ATTENDANCE CLASSES</div>
                </Col>
            </Row>
            <Col>
                <Row>
                    <Col span={13} align="start">
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '600' }}>All Available Classes Today ({today})</span>
                        </div>
                        <TableComponent
                            columns={attendanceClassesColumns}
                            data={allClassesByTeacher}
                            locale={locale}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        // set class details 
                                        setClassDetails(prevState => {
                                            return {
                                                ...prevState,
                                                classid: record?.id,
                                                courseid: record?.courseid,
                                                coursename: record?.name,
                                                standardTimein: record?.timein,
                                                standardTimeout: record?.timeout,
                                            }
                                        })
                                        getAllStudentsByClass(record?.id);
                                    }
                                }
                            }}
                        />
                    </Col>
                    <Col offset={1} span={10} align="start">
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '18px', fontWeight: '600' }}>Class Details</span>
                        </div>
                        <Card style={{ borderRadius: '15px', border: '2px solid #a0a0e1' }}>
                            <Row style={{ marginBottom: '10px' }} justify="space-between">
                                <Col>
                                    <span style={{ fontSize: '20px', fontWeight: '600' }}>
                                        Class ID: {classDetails?.classid?.length > 0 ? classDetails?.classid : ''}
                                    </span>
                                </Col>
                                <Col>
                                    <span style={{ fontSize: '16px' }}>
                                        {classDetails?.standardTimein?.length > 0 ? classDetails?.standardTimein : '00:00:00'} - {classDetails?.standardTimeout?.length > 0 ? classDetails?.standardTimeout : '00:00:00'}
                                    </span>
                                </Col>
                            </Row>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '16px' }}>
                                    {classDetails?.courseid?.length > 0 ? classDetails?.courseid : 'Course ID'} - {classDetails?.coursename?.length > 0 ? classDetails?.coursename : 'Course Name'}
                                </span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ fontSize: '16px' }}>Student Quantity: {classDetails?.students?.length > 0 ? classDetails?.students?.length : 0}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                {classDetails?.students?.length > 0
                                    ? classDetails?.students?.map((studentid, index) => {
                                        return (
                                            <Tag bordered={false} color="purple" style={{ fontSize: '14px', marginBottom: '10px' }}>
                                                {studentid}
                                            </Tag>
                                        )
                                    })
                                    : <Tag bordered={false} color="purple" style={{ fontSize: '14px', marginBottom: '10px' }}>
                                        Student ID
                                    </Tag>
                                }
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Tooltip
                                    title={
                                        getMinusHourBetween2TimeText(classDetails?.standardTimein, new Date(new Date().getTime()).toLocaleTimeString()) > 0 &&
                                        <span>You can only take in-attendance within an hour from standard time-in.</span>
                                    }
                                >
                                    <Button
                                        style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginRight: '15px' }}
                                        type='primary'
                                        onClick={() => rollCallIn(classDetails?.classid, 'in')}
                                        disabled={
                                            classDetails?.classid?.length === 0
                                            || classDetails?.isRollCallIn === true
                                            // if time now is greater than standard time in by 1 hour then not allow to roll call - in anymore
                                            || getMinusHourBetween2TimeText(classDetails?.standardTimein, new Date(new Date().getTime()).toLocaleTimeString()) > 0
                                        }
                                    >
                                        ROLL CALL - IN
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        getMinusHourBetween2TimeText(classDetails?.standardTimeout, new Date(new Date().getTime()).toLocaleTimeString()) > 0 &&
                                        <span>You can only take out-attendance within an hour from standard time-out.</span>
                                    }
                                >
                                    <Button
                                        style={{ borderRadius: '15px', backgroundColor: '#a0a0e1' }}
                                        type='primary'
                                        onClick={() => rollCallOut(classDetails?.classid, 'out')}
                                        disabled={
                                            classDetails?.classid?.length === 0
                                            || classDetails?.isRollCallOut === true
                                            // if time now is greater than standard time out by 1 hour then not allow to roll call - out anymore
                                            || getMinusHourBetween2TimeText(classDetails?.standardTimeout, new Date(new Date().getTime()).toLocaleTimeString()) > 0
                                        }
                                    >
                                        ROLL CALL - OUT
                                    </Button>
                                </Tooltip>
                            </div>
                            {
                                getMinusHourBetween2TimeText(classDetails?.standardTimein, new Date(new Date().getTime()).toLocaleTimeString()) > 0 &&
                                getMinusHourBetween2TimeText(classDetails?.standardTimeout, new Date(new Date().getTime()).toLocaleTimeString()) > 0 &&
                                <div style={{ position: "absolute", right: "25px", bottom: '10px' }}>
                                    <Tooltip title={<span>This class cannot take attendance <br /> due to overtime.</span>}>
                                        <Image
                                            src={OverdueStamp}
                                            style={{
                                                width: "110px",
                                                height: "85px",
                                                borderRadius: "20px",
                                            }}
                                            draggable="false"
                                            preview={false}
                                        />
                                    </Tooltip>
                                </div>
                            }
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Card>
    )
};

export default AttendanceClassesPage;
