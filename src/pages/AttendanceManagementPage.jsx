import { Button, Card, Col, DatePicker, Form, Row, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FloatingLabelComponent from '../components/FloatingLabelComponent';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import * as ServerService from '../services/ServerService';
import TableComponent from '../components/TableComponent';
import { getDayOfSpecificDate, getDayOfToday, getDayNumberOfSpecificDayText } from '../utils';

const AttendanceManagementPage = () => {
    const user = useSelector((state) => state.user);

    const [attendanceState, setAttendanceState] = useState({
        year: '2024',
        semester: 1,
        class: '',
        date: '',
    });

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< YEAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // set up disable year
    const disabledYear = (current) => {
        // disable years before this year
        return current && current > dayjs().startOf('year');
    }
    const onChangeClassYear = (date, dateString) => {
        setAttendanceState({
            ...attendanceState,
            year: dateString,
            date: ''
        });

    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SEMESTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [allClasses, setAllClasses] = useState([]);
    // handle on change class semester
    const handleOnChangeSemester = async (semester) => {
        setAttendanceState({
            ...attendanceState,
            semester: semester,
        });
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CLASSES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // get all classes by year, semester and teacher id
    const handleGAllClassesByYearSemesterTeacherId = async () => {
        const res = await ServerService.getAllClassesByYearSemesterTeacherId(attendanceState?.year, attendanceState?.semester, user?.id);
        setAllClasses(res);
        setAttendanceState({
            ...attendanceState,
            class: ''
        });
        return res;
    }
    useEffect(() => {
        handleGAllClassesByYearSemesterTeacherId();
    }, [attendanceState?.semester])

    // handle on change class
    const [availabledDays, setAvailabledDays] = useState([]);     // availabled days are class days
    const handleOnChangeClass = async (classValue) => {
        setAttendanceState({
            ...attendanceState,
            class: classValue
        });
        // set availabled days to disable unavailabled days in date picker
        const res = await ServerService.getClassTimeByClassId(classValue);
        const availabledDaysArray = [];
        res?.map((classTime, index) => {
            const dayText = getDayNumberOfSpecificDayText(classTime?.day);
            availabledDaysArray.push(dayText);
        });
        setAvailabledDays(availabledDaysArray);
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const ableOnlyThisYear = (current) => {
        // disable years before this year
        return !availabledDays.includes(current.day()) || current.year() < attendanceState.year || current > dayjs().year(attendanceState.year);
    }
    const onChangeDate = (date, dateString) => {
        setAttendanceState({
            ...attendanceState,
            date: dateString
        });
    }


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const attendanceColumns = [
        {
            title: 'Student ID',
            dataIndex: 'studentid',
            className: 'student-id',
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            className: 'fullname',
        },
        {
            title: 'Time In',
            dataIndex: 'timein',
            className: 'time-in',
        },
        {
            title: 'Late In (m)',
            dataIndex: 'late',
            className: 'late',
            render(text, record) {
                return {
                    props: {
                        style: { color: parseInt(text) > 0 ? "red" : "black" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Time Out',
            dataIndex: 'timeout',
            className: 'time-out',
        },
        {
            title: 'Soon Out (m)',
            dataIndex: 'soon',
            className: 'soon',
            render(text, record) {
                return {
                    props: {
                        style: { color: parseInt(text) > 0 ? "red" : "black" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            className: 'status',
            render: (_, { status }) => {
                let color = status === "Present" ? 'green' : (status === "Absent" ? 'red' : 'gold');
                return (
                    <Tag color={color} key={status}>
                        <span style={{ fontWeight: '600' }}>{status.toUpperCase()}</span>
                    </Tag>
                );
            }
        },
    ];
    const [attendanceList, setAttendanceList] = useState([]);
    const [standardTime, setStandardTime] = useState({
        timein: '00:00:00',
        timeout: '00:00:00',
    });
    const getAttendanceInfo = async () => {
        // set attendance table
        const dayOfSpecificDate = getDayOfSpecificDate(attendanceState?.date);
        const res = await ServerService.getFullAttendance(attendanceState?.class, attendanceState?.date, dayOfSpecificDate);
        setAttendanceList(res);

        let attendanceArray = res;
        attendanceArray?.map((item, index) => {
            attendanceArray[index].status = "Present";
            if (item.timein === null && item.late == null) {
                attendanceArray[index].timein = '--';
                attendanceArray[index].late = '--';
                attendanceArray[index].status = "Half Leave";
            }
            if (item.timeout === null && item.soon == null) {
                attendanceArray[index].timeout = '--';
                attendanceArray[index].soon = '--';
                if (item.status === "Present") {
                    attendanceArray[index].status = "Half Leave";
                } else if (item.status === "Half Leave") {
                    attendanceArray[index].status = "Absent";
                }
            }
        });

        // set standard time in/out
        const resStandardInOut = await ServerService.getStandardInOutAttendance(attendanceState?.class, dayOfSpecificDate);
        setStandardTime({
            timein: resStandardInOut?.timein,
            timeout: resStandardInOut?.timeout,
        });
    }


    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row justify="center">
                <Col span={24}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '30px' }}>ATTENDANCE MANAGEMENT</div>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Row justify="center">
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>Select Class Attendance</div>
                    </Row>
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
                            style={{ marginBottom: '0px', padding: '0px 20px' }}
                            className='form-item-input'
                        >
                            <FloatingLabelComponent
                                label="Class Year"
                                value="year"
                                styleBefore={{ left: '17px', top: '31px' }}
                                styleAfter={{ left: '17px', top: '23px' }}
                            >
                                <DatePicker
                                    onChange={onChangeClassYear}
                                    picker="year"
                                    defaultValue={dayjs('2024', 'YYYY')}
                                    className='input-year-picker'
                                    style={{ width: '100%' }}
                                    allowClear={false}
                                    disabledDate={disabledYear}
                                />
                            </FloatingLabelComponent>
                        </Form.Item>

                        <Form.Item
                            label=""
                            validateStatus={"validating"}
                            help=""
                            style={{ marginBottom: '0px', padding: '0px 20px' }}
                            className='form-item-input'
                        >
                            <FloatingLabelComponent
                                label="Class Semester"
                                value="semester"
                                styleBefore={{ left: '19px', top: '31px' }}
                                styleAfter={{ left: '19px', top: '23px' }}
                            >
                                <Select
                                    className='input-select-semester'
                                    defaultValue="1"
                                    onChange={handleOnChangeSemester}
                                >
                                    <Select.Option value="1">1st Semester (January - May)</Select.Option>
                                    <Select.Option value="2">2nd Semester (August - December)</Select.Option>
                                </Select>
                            </FloatingLabelComponent>
                        </Form.Item>

                        <Form.Item
                            label=""
                            validateStatus={"validating"}
                            help=""
                            style={{ marginBottom: '0px' }}
                            className='form-item-input'
                        >
                            <FloatingLabelComponent
                                label="Class"
                                value="class"
                                styleBefore={{ left: '37px', top: '31px' }}
                                styleAfter={{ left: '37px', top: '23px' }}
                            >
                                <Select
                                    className='input-select-class'
                                    defaultValue="Select Class"
                                    onChange={handleOnChangeClass}
                                    value={attendanceState?.class?.length > 0 ? attendanceState?.class : "Select Class"}
                                >
                                    {allClasses?.map((classItem, index) => {
                                        return (
                                            <Select.Option value={classItem?.id}>
                                                Class: <b>{classItem?.id}</b> - Course: <b>{classItem?.courseid}</b>
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </FloatingLabelComponent>
                        </Form.Item>

                        <Form.Item
                            label=""
                            validateStatus={"validating"}
                            help=""
                            style={{ marginBottom: '0px', padding: '0px 20px' }}
                            className='form-item-input'
                        >
                            <FloatingLabelComponent
                                label="Date"
                                value="date"
                                styleBefore={{ left: '19px', top: '31px' }}
                                styleAfter={{ left: '19px', top: '23px' }}
                            >
                                <DatePicker
                                    onChange={onChangeDate}
                                    picker="date"
                                    className='input-date-picker'
                                    style={{ width: '100%' }}
                                    allowClear={false}
                                    disabledDate={ableOnlyThisYear}
                                    value={attendanceState?.date?.length > 0 && dayjs(attendanceState?.date, 'YYYY-MM-DD')}
                                />
                            </FloatingLabelComponent>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginTop: '20px' }}
                                type='primary'
                                onClick={() => getAttendanceInfo()}
                                disabled={
                                    attendanceState?.year?.length === 0
                                    || attendanceState?.semester?.length === 0
                                    || attendanceState?.class?.length === 0
                                    || attendanceState?.date?.length === 0
                                }
                            >
                                VIEW ATTENDANCE
                            </Button>
                        </Form.Item>
                    </AddNewForm>
                </Col>
                <TableCol span={15} offset={1}>
                    <Row justify="start">
                        <div style={{ fontSize: '18px', marginBottom: '18px', color: '#8b8b8b' }}>
                            Standard Time: {standardTime?.timein} - {standardTime?.timeout}
                        </div>
                    </Row>
                    <TableComponent
                        columns={attendanceColumns}
                        data={attendanceList}
                    />
                </TableCol>
            </Row>
        </Card>
    )
};

export default AttendanceManagementPage;

const AddNewForm = styled(Form)`
    .ant-card-body {
        padding: 0px;
    }

    &:where(.css-dev-only-do-not-override-17a39f8).ant-card .ant-card-body {
        padding: 0px;
        border-radius: 0 0 8px 8px;
    }

    .input-class-id, 
    .input-add-new,  
    .input-select-class, 
    .input-year-picker,
    .input-date-picker, 
    .input-select-students {
        height: 45px;
        border-radius: 25px;
        padding: 0px 18px;
        margin-top: 20px; 
    }

    .input-select-semester {
        height: 45px;
        border-radius: 25px;
        margin-top: 20px; 
    }

    .input-select-semester .ant-select-selector,
    .input-select-students .ant-select-selector,
    .input-select-class .ant-select-selector {
        border-radius: 25px;
    }

    .input-select-semester .ant-select-selector .ant-select-selection-item,
    .input-select-students .ant-select-selector .ant-select-selection-item,
    .input-select-class .ant-select-selector .ant-select-selection-item {
        text-align: start;
        padding: 7px 0px 0px 7px;
    }
    
    .input-select-semester .ant-select-arrow,
    .input-select-students .ant-select-arrow,
    .input-select-class .ant-select-arrow, {
        margin-right: 20px;
    }

    .input-select-students .ant-select-selection-item {
        margin: 15px 0px 0px 7px;
        padding: 0px!important;
    }
    
    .input-add-new .ant-input {
        padding-top: 7px;
    }

    .button-signin {
        height: 50px; 
        width: 100%; 
        border-radius: 25px; 
        margin-bottom: 20px; 
        margin-top: 20px;
    }

    .disabled-row {
        background-color: #dcdcdc;
        pointer-events: none;
    }
`

const TableCol = styled(Col)`
    .green-text {
        color: green;
    }
    .red-text {
        color: red;
    }
    .orange-text {
        color: orange;
    }
`
