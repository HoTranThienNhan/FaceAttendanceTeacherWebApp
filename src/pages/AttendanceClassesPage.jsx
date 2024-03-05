import { Button, Card, Col, Row, Tag } from 'antd';
import React, { useState } from 'react';
import TableComponent from '../components/TableComponent';
import * as ServerService from '../services/ServerService';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getDayOfToday } from '../utils';
import { useNavigate } from 'react-router-dom';

const AttendanceClassesPage = () => {

    const user = useSelector((state) => state.user);
    const [classDetails, setClassDetails] = useState({
        classid: '',
        courseid: '',
        coursename: '',
        timein: '',
        timeout: '',
        students: [],
    });
    const [today, setToday] = useState(getDayOfToday() + ' - ' + new Date().toLocaleDateString() + '');

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

    // get all students by class
    const getAllStudentsByClass = async (classid) => {
        const res = await ServerService.getAllStudentsByClass(classid);
        // set students state
        let studentList = [];
        res?.forEach(student => {
            studentList.push(student.studentid)
        });
        setClassDetails(prevState => {
            return {
                ...prevState,
                students: studentList
            }
        });
        return res;
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
                                                timein: record?.timein,
                                                timeout: record?.timeout,
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
                                        {classDetails?.timein?.length > 0 ? classDetails?.timein : '00:00:00'} - {classDetails?.timeout?.length > 0 ? classDetails?.timeout : '00:00:00'}
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
                                <Button
                                    style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginRight: '15px' }}
                                    type='primary'
                                    onClick={() => rollCallIn(classDetails?.classid, 'in')}
                                    disabled={classDetails?.classid?.length === 0}
                                >
                                    ROLL CALL - IN
                                </Button>
                                <Button
                                    style={{ borderRadius: '15px', backgroundColor: '#a0a0e1' }}
                                    type='primary'
                                    onClick={() => rollCallOut(classDetails?.classid, 'out')}
                                    disabled={classDetails?.classid?.length === 0}
                                >
                                    ROLL CALL - OUT
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Card>
    )
};

export default AttendanceClassesPage;
