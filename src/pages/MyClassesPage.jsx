import { Badge, Calendar, Card, Col, DatePicker, Form, Radio, Row, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FloatingLabelComponent from '../components/FloatingLabelComponent';
import * as ServerService from '../services/ServerService';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import TableComponent from '../components/TableComponent';
import { getDayNumberOfSpecificDayText } from '../utils';

const MyClassesPage = () => {
    const user = useSelector((state) => state.user);

    const [selectedClass, setSelectedClass] = useState({
        year: '2024',
        semester: 1,
        classId: ''
    });

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CLASS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // get classes by teacher id
    const getClassesByTeacherId = async () => {
        const res = await ServerService.getAllClassesByYearSemesterTeacherId(selectedClass?.year, selectedClass?.semester, user?.id);
        return res;
    }
    const queryClassesByTeacherId = useQuery({
        queryKey: ['classes-by-teacher-id'],
        queryFn: getClassesByTeacherId
    });
    const { isLoading: isLoadingClasses, data: classes } = queryClassesByTeacherId;

    const handleOnChangeClass = async (classId) => {
        setSelectedClass({
            ...selectedClass,
            classId: classId
        });
        const resAllStudents = await ServerService.getAllStudentsByClass(classId);
        setClassesList(resAllStudents);
        const resClassTime = await ServerService.getClassTimeByClassId(classId);
        console.log(resClassTime);
        setClassTimeList(resClassTime);
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< YEAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // set up disable year
    const disabledYear = (current) => {
        // disable years before this year
        return current && current > dayjs().startOf('year');
    }
    const onChangeClassYear = (date, dateString) => {
        setSelectedClass({
            ...selectedClass,
            year: dateString,
            classId: '',
        });
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SEMESTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // handle on change class semester
    const handleOnChangeSemester = (semester) => {
        setSelectedClass({
            ...selectedClass,
            semester: semester,
            classId: '',
        });
    }

    useEffect(() => {
        queryClassesByTeacherId.refetch();
        setClassTimeList([]);
        setClassesList([]);
    }, [selectedClass.year, selectedClass.semester]);


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CLASSES TABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const classesColumns = [
        {
            title: 'Student ID',
            dataIndex: 'id',
            className: 'student-id',
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: 'Fullname',
            dataIndex: 'fullname',
            className: 'student-fullname',
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            className: 'student-email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            className: 'student-phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            className: 'student-address',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            className: 'student-gender',
        },
    ];
    const [classesList, setClassesList] = useState([]);

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CLASSES CALENDAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [classTimeList, setClassTimeList] = useState([]);
    const [isShowCalendar, setIsShowCalendar] = useState(false);
    const onChangeShowCalendar = (e) => {
        setIsShowCalendar(e.target.value);
    };
    const getListData = (value) => {
        let listData;
        classTimeList.map((classTime) => {
            if (getDayNumberOfSpecificDayText(classTime.day) === value.$W) {
                listData = [
                    {
                        timein: classTime.timein,
                        timeout: classTime.timeout
                    }
                ]
            }
        });
        return listData;
    }

    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData?.map((item) => (
                    <span>
                        <Badge color='cyan' />From: {item.timein} <br />
                        <Badge color='magenta' />To: {item.timeout}
                    </span>
                ))}
            </ul>
        );
    };
    // const monthCellRender = (value) => {
    //     const num = getMonthData(value);
    //     return num ? (
    //         <div className="notes-month">
    //             <section>{num}</section>
    //             <span>Backlog number</span>
    //         </div>
    //     ) : null;
    // };
    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        // if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };



    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row justify="center">
                <Col span={24}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '30px' }}>
                        MY CLASSES MANAGEMENT
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <AddNewForm
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Row>
                            <Col span={6}>
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
                            </Col>

                            <Col span={6}>
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
                            </Col>
                            <Col span={10}>
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
                                            value={selectedClass?.classId?.length > 0 ? selectedClass?.classId : "Select Class"}
                                        >
                                            {classes?.map((classItem, index) => {
                                                return (
                                                    <Select.Option value={classItem?.id}>
                                                        Class: <b>{classItem?.id}</b> - Course: <b>{classItem?.courseid} - {classItem?.name}</b>
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </FloatingLabelComponent>
                                </Form.Item>
                            </Col>
                        </Row>
                    </AddNewForm>
                </Col>
            </Row>
            <Row justify="start" style={{ margin: '30px 0px 20px 0px' }}>
                <Col span={24} align="start" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Calendar</Col>
                <Col span={24} align="start">
                    <Radio.Group
                        onChange={onChangeShowCalendar}
                        value={isShowCalendar}
                    >
                        <Radio value={true}>Show Calendar</Radio>
                        <Radio value={false}>Hide Calendar</Radio>
                    </Radio.Group>
                </Col>
            </Row>
            {isShowCalendar &&
                <Row>
                    <CustomCalendar
                        cellRender={cellRender}
                        headerRender={({ value, type, onChange, onTypeChange }) => {
                            const start = 0;
                            const end = 12;
                            const monthOptions = [];
                            let current = value.clone();
                            const localeData = value.localeData();
                            const months = [];
                            for (let i = 0; i < 12; i++) {
                                current = current.month(i);
                                months.push(localeData.monthsShort(current));
                            }
                            const semesterMonths = {
                                1: [0, 1, 2, 3, 4],
                                2: [7, 8, 9, 10, 11]
                            }
                            // let year = value.year();
                            let month = value.month();
                            for (let i = start; i < end; i++) {
                                Object.keys(semesterMonths).forEach((semester, index) => {
                                    console.log(semester);
                                    if (selectedClass?.semester == parseInt(semester)) {
                                        if (selectedClass?.semester == 1 && !semesterMonths[1].includes(month)) {
                                            month = semesterMonths[1][0];
                                        } else if (selectedClass?.semester == 2 && !semesterMonths[2].includes(month)) {
                                            month = semesterMonths[2][0];
                                        }
                                        monthOptions.push(
                                            <Select.Option
                                                key={i}
                                                value={i}
                                                className="month-item"
                                                disabled={semesterMonths[semester].includes(i) ? false : true}
                                            >
                                                {months[i]}
                                            </Select.Option>,
                                        );
                                    }
                                });
                            }
                            return (
                                <Row justify="end">
                                    <Col>
                                        <MonThSelectButton
                                            size="small"
                                            popupMatchSelectWidth={false}
                                            value={month}
                                            onChange={(newMonth) => {
                                                const now = value.clone().month(newMonth);
                                                onChange(now);
                                            }}
                                        >
                                            {monthOptions}
                                        </MonThSelectButton>
                                    </Col>
                                </Row>
                            )
                        }}
                    />
                </Row>
            }
            <Row justify="start" style={{ margin: '30px 0px 20px 0px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>Students</div>
            </Row>
            <Row>
                <Col span={24}>
                    <TableComponent
                        columns={classesColumns}
                        data={classesList}
                    />
                </Col>
            </Row>
        </Card >
    )
};

export default MyClassesPage;

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

const CustomCalendar = styled(Calendar)`
    .ant-picker-calendar-date-content {
        height: 60px!important;
    }

    .ant-picker-panel, .ant-picker-calendar-header {
        width: 100%!important;
    }

    .events {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .events .ant-badge-status {
        width: 10%;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .ant-select.ant-select-outlined.ant-picker-calendar-year-select {
        display: none;
    }

    .ant-picker-date-panel .ant-picker-cell:not(.ant-picker-cell-in-view) .ant-picker-cell-inner {
        display: none;
    }
      
    .ant-picker-date-panel .ant-picker-cell:not(.ant-picker-cell-in-view) {
        pointer-events: none;
    }
`

const MonThSelectButton = styled(Select)`
    .ant-select-selector {
        width: 70px!important;
        height: 32px!important;
        border-radius: 7px!important;
    }

    .ant-select-arrow {
        padding-top: 10px!important;
    }
`
