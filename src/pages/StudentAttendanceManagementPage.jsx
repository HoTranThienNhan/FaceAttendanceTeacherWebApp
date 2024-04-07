import { Button, Card, Col, DatePicker, Empty, Form, Input, Row, Select, Space, Statistic, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import FloatingLabelComponent from '../components/FloatingLabelComponent';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import * as ServerService from '../services/ServerService';
import TableComponent from '../components/TableComponent';
import { getDayOfSpecificDate, getDayOfToday, getDayNumberOfSpecificDayText } from '../utils';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import CountUp from 'react-countup';
import { Bar, Column } from '@ant-design/plots';

const StudentAttendanceManagementPage = () => {
    const user = useSelector((state) => state.user);

    const [attendanceState, setAttendanceState] = useState({
        year: '2024',
        semester: 1,
        class: '',
        student: '',
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
            class: '',
            student: ''
        });

    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SEMESTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // handle on change class semester
    const handleOnChangeSemester = async (semester) => {
        setAttendanceState({
            ...attendanceState,
            semester: semester,
        });
    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CLASSES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [allClasses, setAllClasses] = useState([]);
    // get all classes by year, semester and teacher id
    const handleGAllClassesByYearSemesterTeacherId = async () => {
        const res = await ServerService.getAllClassesByYearSemesterTeacherId(attendanceState?.year, attendanceState?.semester, user?.id);
        setAllClasses(res);
        setAttendanceState({
            ...attendanceState,
            class: '',
            student: ''
        });
        return res;
    }
    useEffect(() => {
        handleGAllClassesByYearSemesterTeacherId();
    }, [attendanceState?.year, attendanceState?.semester])

    // handle on change class
    const [availabledDays, setAvailabledDays] = useState([]);     // availabled days are class days
    const handleOnChangeClass = async (classValue) => {
        setAttendanceState({
            ...attendanceState,
            class: classValue,
            student: ''
        });
        // set availabled days to disable unavailabled days in date picker
        const res = await ServerService.getClassTimeByClassId(classValue);
        const availabledDaysArray = [];
        res?.map((classTime, index) => {
            const dayText = getDayNumberOfSpecificDayText(classTime?.day);
            availabledDaysArray.push(dayText);
        });
        setAvailabledDays(availabledDaysArray);

        // get all students by class id
        handleGAllStudentsByClass(classValue);
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


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< STUDENTS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [allStudents, setAllStudents] = useState([]);
    // get all classes by year, semester and teacher id
    const handleGAllStudentsByClass = async (attendanceClass) => {
        const res = await ServerService.getAllStudentsByClass(attendanceClass);
        setAllStudents(res);
        return res;
    }
    const resetStudentAttendanceState = () => {
        setAllStudents([]);
        setAttendanceState({
            ...attendanceState,
            student: '',
            date: ''
        });
    }
    useEffect(() => {
        resetStudentAttendanceState();
    }, [attendanceState?.year, attendanceState?.semester, attendanceState?.class])
    const handleOnChangeStudent = (studentValue) => {
        setAttendanceState({
            ...attendanceState,
            student: studentValue
        });
    }


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // search
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearchTable = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleResetSearch = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleResetSearch(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { close(); }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const getColumnDateSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters
        }) => (
            <div style={{ padding: 8 }}>
                <Space>
                    <DatePicker
                        // format={"DD-MM-YY"}
                        value={selectedKeys[0]}
                        onChange={(e) => {
                            setSelectedKeys([e]);
                        }}
                        allowClear={false}
                    />
                </Space>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginLeft: '10px' }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleResetSearch(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) => {
            return (
                moment(record[dataIndex]).format("DD-MM-YYYY") === value.format("DD-MM-YYYY")
            );
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text.toString()
        //     ),
    });

    // columns
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
            sorter: (a, b) => a.fullname.localeCompare(b.fullname),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            className: 'date',
            ...getColumnDateSearchProps('date'),
        },
        {
            title: 'Standard Time In',
            dataIndex: 'stdtimein',
            className: 'std-time-in',
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
                        style: { color: parseInt(text) > 0 ? "red" : parseInt(text) === 0 ? "green" : "black" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Standard Time Out',
            dataIndex: 'stdtimeout',
            className: 'std-time-out',
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
                        style: { color: parseInt(text) > 0 ? "red" : parseInt(text) === 0 ? "green" : "black" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            className: 'status',
            // filters: [
            //     {
            //         text: 'Present',
            //         value: 'Present',
            //     },
            //     {
            //         text: 'Half Leave',
            //         value: 'Half Leave',
            //     },
            //     {
            //         text: 'Asent',
            //         value: 'Absent',
            //     },
            // ],
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
    // no data table
    let locale = {
        emptyText: (
            <Empty
                imageStyle={{ height: 70, marginTop: '20px' }}
                style={{ marginBottom: '20px' }}
                description={
                    <span style={{ color: '#b4b4b4' }}>
                        No student attendance data.
                    </span>
                }
            >
            </Empty>
        )
    };


    const [attendanceList, setAttendanceList] = useState([]);
    const [standardTime, setStandardTime] = useState({
        timein: '00:00:00',
        timeout: '00:00:00',
    });
    const getAttendanceInfo = async () => {
        // set attendance table
        const dayOfSpecificDate = getDayOfSpecificDate(attendanceState?.date);
        const res = await ServerService.getFullAttendanceByStudentId(attendanceState?.class, attendanceState?.student);
        setAttendanceList(res);

        let attendanceArray = res;
        let totalLateInCount = 0;
        let totalSoonOutCount = 0;
        let totalPresentCount = 0;
        let totalHalfLeaveCount = 0;
        let totalAbsentCount = 0;
        let totalLateInMinutes = 0;
        let totalSoonOutMinutes = 0;
        attendanceArray?.map((item, index) => {
            attendanceArray[index].status = "Present";
            if (item.timein === null && item.late == null) {
                attendanceArray[index].timein = '--';
                attendanceArray[index].late = '--';
                attendanceArray[index].status = "Half Leave";
            } else {
                totalLateInCount++;
                totalLateInMinutes += item.late;
            }
            if (item.timeout === null && item.soon == null) {
                attendanceArray[index].timeout = '--';
                attendanceArray[index].soon = '--';
                if (item.status === "Present") {
                    attendanceArray[index].status = "Half Leave";
                } else if (item.status === "Half Leave") {
                    attendanceArray[index].status = "Absent";
                }
            } else {
                totalSoonOutCount++;
                totalSoonOutMinutes += item.soon;
            }
            if (attendanceArray[index].status === "Present") {
                totalPresentCount++;
            } else if (attendanceArray[index].status === "Half Leave") {
                totalHalfLeaveCount++;
            } else {
                totalAbsentCount++;
            }
        });
        setTotalStats({
            ...totalStats,
            totalLateIn: totalLateInCount,
            totalSoonOut: totalSoonOutCount,
            totalPresent: totalPresentCount,
            totalHalfLeave: totalHalfLeaveCount,
            totalAbsent: totalAbsentCount,
            totalLateInMinutes: totalLateInMinutes,
            totalSoonOutMinutes: totalSoonOutMinutes
        })
    }

    // Card statistics animated counter
    const formatter = (value) => <CountUp end={value} separator="," />;

    // Statistics
    const [totalStats, setTotalStats] = useState({
        totalLateIn: 0,
        totalSoonOut: 0,
        totalPresent: 0,
        totalHalfLeave: 0,
        totalAbsent: 0,
        totalLateInMinutes: 0,
        totalSoonOutMinutes: 0
    });

    // Chart

    const config = {
        data: [
            { "status": "Present", "times": totalStats?.totalPresent },
            { "status": "Half Leave", "times": totalStats?.totalHalfLeave },
            { "status": "Absent", "times": totalStats?.totalAbsent },
        ],
        xField: 'times',
        yField: 'status',
        sort: {
            reverse: true,
        },
        label: {
            text: 'times',
        },
    };


    return (
        <Card style={{ margin: '30px 100px', borderRadius: '15px', padding: '0px 30px' }}>
            <Row justify="center">
                <Col span={24}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '30px' }}>
                        STUDENT ATTENDANCE MANAGEMENT
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Row justify="start">
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>Select Student</div>
                    </Row>
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
                            <Col span={6}>
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
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label=""
                                    validateStatus={"validating"}
                                    help=""
                                    style={{ marginBottom: '0px' }}
                                    className='form-item-input'
                                >
                                    <FloatingLabelComponent
                                        label="Student"
                                        value="student"
                                        styleBefore={{ left: '37px', top: '31px' }}
                                        styleAfter={{ left: '37px', top: '23px' }}
                                    >
                                        <Select
                                            className='input-select-class'
                                            defaultValue="Select Student"
                                            onChange={handleOnChangeStudent}
                                            value={attendanceState?.student?.length > 0 ? attendanceState?.student : "Select Student"}
                                        >
                                            {allStudents?.map((studentItem, index) => {
                                                return (
                                                    <Select.Option value={studentItem?.studentid}>
                                                        {studentItem?.studentid} - {studentItem?.fullname}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </FloatingLabelComponent>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button
                                style={{ borderRadius: '15px', backgroundColor: '#a0a0e1', marginTop: '20px' }}
                                type='primary'
                                onClick={() => getAttendanceInfo()}
                                disabled={
                                    attendanceState?.year?.length === 0
                                    || attendanceState?.semester?.length === 0
                                    || attendanceState?.class?.length === 0
                                    || attendanceState?.student?.length === 0
                                }
                            >
                                VIEW ATTENDANCE
                            </Button>
                        </Form.Item>
                    </AddNewForm>
                </Col>
                <Col span={24}>
                    <Row justify="start" style={{ margin: '20px 0px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>Student Attendance Table</div>
                    </Row>
                    <Row>
                        <TableCol span={24}>
                            <TableComponent
                                columns={attendanceColumns}
                                data={attendanceList}
                                locale={locale}
                            />
                        </TableCol>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row justify="start" style={{ margin: '20px 0px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>Overall</div>
                    </Row>
                    <Row>
                        <Col>
                            <Card
                                style={{
                                    borderRadius: '15px',
                                    border: '2px solid rgb(160, 160, 225)'
                                }}
                            >
                                <Statistic
                                    title="Total Late In Times"
                                    value={totalStats?.totalLateIn}
                                    suffix={<span>/ {attendanceList?.length ? attendanceList?.length : 0}</span>}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col offset={1}>
                            <Card
                                style={{
                                    borderRadius: '15px',
                                    border: '2px solid rgb(160, 160, 225)'
                                }}
                            >
                                <Statistic
                                    title="Total Soon Out Times"
                                    value={totalStats?.totalSoonOut}
                                    suffix={<span>/ {attendanceList?.length ? attendanceList?.length : 0}</span>}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col offset={1}>
                            <Card
                                style={{
                                    borderRadius: '15px',
                                    border: '2px solid rgb(160, 160, 225)'
                                }}
                            >
                                <Statistic
                                    title="Total Late In Minutes"
                                    value={totalStats?.totalLateInMinutes}
                                    suffix={<span> {totalStats?.totalLateInMinutes > 0 ? 'minutes' : 'minute'}</span>}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                        <Col offset={1}>
                            <Card
                                style={{
                                    borderRadius: '15px',
                                    border: '2px solid rgb(160, 160, 225)'
                                }}
                            >
                                <Statistic
                                    title="Total Soon Out Minutes"
                                    value={totalStats?.totalSoonOutMinutes}
                                    suffix={<span> {totalStats?.totalSoonOutMinutes > 0 ? 'minutes' : 'minute'}</span>}
                                    formatter={formatter}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '40px' }}>
                        <Col span={24}>
                            <Bar {...config} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
};

export default StudentAttendanceManagementPage;

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
