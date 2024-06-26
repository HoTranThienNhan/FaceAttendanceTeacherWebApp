import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Statistic, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingLabelComponent from '../components/FloatingLabelComponent';
import styled from 'styled-components';
import dayjs from 'dayjs';
import * as ServerService from '../services/ServerService';
import { useSelector } from 'react-redux';
import TableComponent from '../components/TableComponent';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { Pie } from '@ant-design/plots';
import _ from "lodash";
import { useDownloadExcel } from 'react-export-table-to-excel';
import { CSVLink } from "react-csv";

const StatisticPage = () => {
    const user = useSelector((state) => state.user);

    const [attendanceState, setAttendanceState] = useState({
        year: '2024',
        semester: 1,
        class: '',
    });
    const [allClasses, setAllClasses] = useState([]);

    // table data
    const [attendanceList, setAttendanceList] = useState([]);
    const [attendanceListForFiltering, setAttendanceListForFiltering] = useState([]);

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
            class: ''
        });

    }

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SEMESTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // handle on change class semester
    const handleOnChangeSemester = async (semester) => {
        setAttendanceState({
            ...attendanceState,
            semester: semester,
            class: ''
        });
    }

    const handleOnChangeClass = async (classValue) => {
        setAttendanceState({
            ...attendanceState,
            class: classValue
        });

        const resTotalNumberLateSoonStats = await ServerService.getTotalNumberLateSoonStats(classValue);
        let lateCount;
        let soonCount;
        if (resTotalNumberLateSoonStats === '') {
            lateCount = 0;
            soonCount = 0;
        } else {
            lateCount = resTotalNumberLateSoonStats?.latecount === null ? 0 : parseInt(resTotalNumberLateSoonStats?.latecount);
            soonCount = resTotalNumberLateSoonStats?.sooncount === null ? 0 : parseInt(resTotalNumberLateSoonStats?.sooncount);
        }

        const resFullAttendanceByClassId = await ServerService.getFullAttendanceByClassId(classValue);
        setAttendanceList(resFullAttendanceByClassId);
        setAttendanceListForFiltering(resFullAttendanceByClassId);

        let attendanceArray = resFullAttendanceByClassId;
        let totalPresentCount = 0;
        let totalHalfLeaveCount = 0;
        let totalAbsentCount = 0;
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
            if (attendanceArray[index].status === "Present") {
                totalPresentCount++;
            } else if (attendanceArray[index].status === "Half Leave") {
                totalHalfLeaveCount++;
            } else {
                totalAbsentCount++;
            }
        });
        setTotalStats({
            totalLateIn: lateCount,
            totalSoonOut: soonCount,
            totalPresent: totalPresentCount,
            totalHalfLeave: totalHalfLeaveCount,
            totalAbsent: totalAbsentCount
        });
        setSelectiveOption('all');
    }

    // get all classes by year, semester and teacher id
    const handleGAllClassesByYearSemesterTeacherId = async () => {
        const res = await ServerService.getAllClassesByYearSemesterTeacherId(attendanceState?.year, attendanceState?.semester, user?.id);
        setAllClasses(res);
        setAttendanceState({
            ...attendanceState,
            class: ''
        });
        setTotalStats({
            totalLateIn: 0,
            totalSoonOut: 0,
            totalPresent: 0,
            totalHalfLeave: 0,
            totalAbsent: 0
        });
        setAttendanceList([]);
        setSelectiveOption('all');
        return res;
    }
    useEffect(() => {
        handleGAllClassesByYearSemesterTeacherId();
    }, [attendanceState?.year, attendanceState?.semester])

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< STATS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // Statistics
    const [totalStats, setTotalStats] = useState({
        totalLateIn: 0,
        totalSoonOut: 0,
        totalPresent: 0,
        totalHalfLeave: 0,
        totalAbsent: 0
    });

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TABLE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
            sorter: (a, b) => a.studentid.localeCompare(b.studentid),
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



    // selective table
    _.mixin({
        multiplemax: function (list, field) {
            var max = _.max(list, function (item) {
                return item[field];
            });
            return _.filter(list, function (item) {
                return item[field] === max[field];
            });
        }
    });
    const [selectiveOption, setSelectiveOption] = useState("all");
    const [maxSumLate, setMaxSumLate] = useState(0);
    const [maxSumSoon, setMaxSumSoon] = useState(0);
    const [maxCountLate, setMaxCountLate] = useState(0);
    const [maxCountSoon, setMaxCountSoon] = useState(0);
    const [maxCountAbsent, setMaxCountAbsent] = useState(0);
    const onChangeSelectiveOption = async (e) => {
        setSelectiveOption(e.target.value);
        if (e.target.value === "all") {
            handleOnChangeClass(attendanceState?.class);
        }
        if (attendanceListForFiltering?.length > 0) {
            if (e.target.value === "most-total-late-in") {
                let sumLateSoonAttendanceList = [];
                attendanceListForFiltering?.map((item, index) => {
                    if (sumLateSoonAttendanceList.find(x => x.studentid === item?.studentid) === undefined) {
                        sumLateSoonAttendanceList.push({
                            studentid: item?.studentid,
                            sumlate: item?.late !== '--' ? item?.late : 0,
                            sumsoon: item?.soon !== '--' ? item?.soon : 0
                        });
                    } else {
                        if (item?.late !== '--') {
                            sumLateSoonAttendanceList.find(x => x.studentid === item?.studentid).sumlate += item?.late;
                        }
                        if (item?.soon !== '--') {
                            sumLateSoonAttendanceList.find(x => x.studentid === item?.studentid).sumsoon += item?.soon;
                        }
                    }
                });

                setMaxSumLate(sumLateSoonAttendanceList.reduce((a, b) => a.sumlate > b.sumlate ? a : b).sumlate);
                if (sumLateSoonAttendanceList.reduce((a, b) => a.sumlate > b.sumlate ? a : b).sumlate !== 0) {
                    const maxSumLateList = sumLateSoonAttendanceList.filter((function (obj) {
                        return obj.sumlate === sumLateSoonAttendanceList.reduce((a, b) => a.sumlate > b.sumlate ? a : b).sumlate;
                    }));
                    setAttendanceList(attendanceListForFiltering.filter(item => maxSumLateList.find(x => x.studentid === item?.studentid)).filter(x => x.late > 0 && x.late !== '--'));
                } else {
                    setAttendanceList([]);
                }

            } else if (e.target.value === "most-total-soon-out") {
                let sumLateSoonAttendanceList = [];
                attendanceListForFiltering?.map((item, index) => {
                    if (sumLateSoonAttendanceList.find(x => x.studentid === item?.studentid) === undefined) {
                        sumLateSoonAttendanceList.push({
                            studentid: item?.studentid,
                            sumlate: item?.late !== '--' ? item?.late : 0,
                            sumsoon: item?.soon !== '--' ? item?.soon : 0
                        });
                    } else {
                        if (item?.late !== '--') {
                            sumLateSoonAttendanceList.find(x => x.studentid === item?.studentid).sumlate += item?.late;
                        }
                        if (item?.soon !== '--') {
                            sumLateSoonAttendanceList.find(x => x.studentid === item?.studentid).sumsoon += item?.soon;
                        }
                    }
                });

                setMaxSumSoon(sumLateSoonAttendanceList.reduce((a, b) => a.sumsoon > b.sumsoon ? a : b).sumsoon);
                if (sumLateSoonAttendanceList.reduce((a, b) => a.sumsoon > b.sumsoon ? a : b).sumsoon !== 0) {
                    const maxSumSoonList = sumLateSoonAttendanceList.filter((function (obj) {
                        return obj.sumsoon === sumLateSoonAttendanceList.reduce((a, b) => a.sumsoon > b.sumsoon ? a : b).sumsoon;
                    }));
                    setAttendanceList(attendanceListForFiltering.filter(item => maxSumSoonList.find(x => x.studentid === item?.studentid)).filter(x => x.soon > 0 && x.soon !== '--'));
                } else {
                    setAttendanceList([]);
                }

            } else if (e.target.value === "most-count-late-in") {
                let countLateSoonAttendanceList = [];
                let countLate;
                let countSoon;
                attendanceListForFiltering?.map((item, index) => {
                    if (countLateSoonAttendanceList.find(x => x.studentid === item?.studentid) === undefined) {
                        countLate = 0;
                        countSoon = 0;
                        if (item?.late !== '--' && item?.late > 0) {
                            countLate += 1;
                        }
                        if (item?.soon !== '--' && item?.soon > 0) {
                            countSoon += 1;
                        }
                        countLateSoonAttendanceList.push({
                            studentid: item?.studentid,
                            countlate: item?.late !== '--' && item?.late > 0 ? countLate : 0,
                            countsoon: item?.soon !== '--' && item?.soon > 0 ? countSoon : 0,
                        });
                    } else {
                        if (item?.late !== '--' && item?.late > 0) {
                            countLate += 1;
                            countLateSoonAttendanceList.find(x => x.studentid === item?.studentid).countlate = countLate;
                        }
                        if (item?.soon !== '--' && item?.soon > 0) {
                            countSoon += 1;
                            countLateSoonAttendanceList.find(x => x.studentid === item?.studentid).countsoon = countSoon;
                        }
                    }
                });

                setMaxCountLate(countLateSoonAttendanceList.reduce((a, b) => a.countlate > b.countlate ? a : b).countlate);
                if (countLateSoonAttendanceList.reduce((a, b) => a.countlate > b.countlate ? a : b).countlate !== 0) {
                    const maxCountLateList = countLateSoonAttendanceList.filter((function (obj) {
                        return obj.countlate === countLateSoonAttendanceList.reduce((a, b) => a.countlate > b.countlate ? a : b).countlate;
                    }));
                    setAttendanceList(attendanceListForFiltering.filter(item => maxCountLateList.find(x => x.studentid === item?.studentid)).filter(x => x.late > 0 && x.late !== '--'));
                } else {
                    setAttendanceList([]);
                }

            } else if (e.target.value === "most-count-soon-out") {
                let countLateSoonAttendanceList = [];
                let countLate;
                let countSoon;
                attendanceListForFiltering?.map((item, index) => {
                    if (countLateSoonAttendanceList.find(x => x.studentid === item?.studentid) === undefined) {
                        countLate = 0;
                        countSoon = 0;
                        countLateSoonAttendanceList.push({
                            studentid: item?.studentid,
                            countlate: item?.late !== '--' && item?.late > 0 ? 1 : 0,
                            countsoon: item?.soon !== '--' && item?.soon > 0 ? 1 : 0,
                        });
                    } else {
                        if (item?.late !== '--' && item?.late > 0) {
                            countLate += 1;
                            countLateSoonAttendanceList.find(x => x.studentid === item?.studentid).countlate = countLate;
                        }
                        if (item?.soon !== '--' && item?.soon > 0) {
                            countSoon += 1;
                            countLateSoonAttendanceList.find(x => x.studentid === item?.studentid).countsoon = countSoon;
                        }
                    }
                });

                setMaxCountSoon(countLateSoonAttendanceList.reduce((a, b) => a.countsoon > b.countsoon ? a : b).countsoon);
                if (countLateSoonAttendanceList.reduce((a, b) => a.countsoon > b.countsoon ? a : b).countsoon !== 0) {
                    const maxCountSoonList = countLateSoonAttendanceList.filter((function (obj) {
                        return obj.countsoon === countLateSoonAttendanceList.reduce((a, b) => a.countsoon > b.countsoon ? a : b).countsoon;
                    }));
                    setAttendanceList(attendanceListForFiltering.filter(item => maxCountSoonList.find(x => x.studentid === item?.studentid)).filter(x => x.soon > 0 && x.soon !== '--'));
                } else {
                    setAttendanceList([]);
                } 
            } else if (e.target.value === "most-count-absent") {
                let countAbsentAttendanceList = [];
                let countAbsent;
                attendanceListForFiltering?.map((item, index) => {
                    if (countAbsentAttendanceList.find(x => x.studentid === item?.studentid) === undefined) {
                        countAbsent = 0;
                        countAbsentAttendanceList.push({
                            studentid: item?.studentid,
                            countAbsent: item?.late === '--' && item?.soon === '--' ? 1 : 0,
                        });
                    } else {
                        if (item?.late === '--' && item?.soon === '--') {
                            countAbsent += 1;
                            countAbsentAttendanceList.find(x => x.studentid === item?.studentid).countAbsent = countAbsent;
                        }
                    }
                });

                setMaxCountAbsent(countAbsentAttendanceList.reduce((a, b) => a.countAbsent > b.countAbsent ? a : b).countAbsent);
                if (countAbsentAttendanceList.reduce((a, b) => a.countAbsent > b.countAbsent ? a : b).countAbsent !== 0) {
                    const maxCountAbsentList = countAbsentAttendanceList.filter((function (obj) {
                        return obj.countAbsent === countAbsentAttendanceList.reduce((a, b) => a.countAbsent > b.countAbsent ? a : b).countAbsent;
                    }));
                    setAttendanceList(attendanceListForFiltering.filter(item => maxCountAbsentList.find(x => x.studentid === item?.studentid)).filter(x => x.late === '--' && x.soon === '--'));
                } else {
                    setAttendanceList([]);
                } 
            }
        }
    };


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CHART >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const [isShowChart, setIsShowChart] = useState(false);
    const onChangeShowChart = (e) => {
        setIsShowChart(e.target.value);
    };
    // Pie chart
    const pieChartConfig = {
        data: [
            { type: 'Present', value: totalStats?.totalPresent ? totalStats?.totalPresent : 0 },
            { type: 'Half Leave', value: totalStats?.totalHalfLeave ? totalStats?.totalHalfLeave : 0 },
            { type: 'Absent', value: totalStats?.totalAbsent ? totalStats?.totalAbsent : 0 },
        ],
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'type',
            style: {
                fontWeight: 'bold',
            },
            position: 'inside',
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };

    // navigate
    const navigate = useNavigate();
    const navigateToHomePage = () => {
        navigate('/');
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
                                title: 'Statistic',
                            },
                        ]}
                    />
                </Col>
            </Row>
            <Row justify="center">
                <Col span={24}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d4d7f', marginBottom: '10px' }}>
                        STATISTIC
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Row justify="start">
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>Select Class</div>
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
                        </Row>
                    </AddNewForm>
                </Col>
                <Col span={24}>
                    <Row justify="start" style={{ margin: '30px 0px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>Summary Statistic</div>
                    </Row>
                    <Row style={{ margin: '30px 0px 10px 0px' }}>
                        <Col>
                            <Card
                                style={{
                                    borderRadius: '15px',
                                    border: '2px solid rgb(160, 160, 225)'
                                }}
                            >
                                <Statistic
                                    title="Total Amount Late In"
                                    value={totalStats?.totalLateIn}
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
                                    title="Total Amount Soon Out"
                                    value={totalStats?.totalSoonOut}
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
                                    title="Total Amount Present"
                                    value={totalStats?.totalPresent}
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
                                    title="Total Amount Half Leave"
                                    value={totalStats?.totalHalfLeave}
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
                                    title="Total Amount Absent"
                                    value={totalStats?.totalAbsent}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row justify="start" style={{ marginTop: '20px' }}>
                        <Col span={24} align="start" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Chart</Col>
                        <Col span={24} align="start">
                            <Radio.Group
                                onChange={onChangeShowChart}
                                value={isShowChart}
                            >
                                <Radio value={true}>Show Chart</Radio>
                                <Radio value={false}>Hide Chart</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    {isShowChart &&
                        <Row justify="center">
                            <Col span={7} align="center" style={{ marginRight: '100px' }}>
                                <div style={{ fontWeight: '600', marginBottom: '15px' }}>Participation Rate Chart</div>
                                <Pie
                                    {...pieChartConfig}
                                    style={{ width: '450px', height: '280px' }}
                                />
                            </Col>
                        </Row>
                    }
                </Col>
                <Col span={24}>
                    <Row justify="start" style={{ margin: '30px 0px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600' }}>All Students Attendance Table</div>
                    </Row>
                    <Row justify="start" style={{ margin: '20px 0px' }}>
                        <Col span={20} align="start">
                            <Radio.Group
                                onChange={onChangeSelectiveOption}
                                value={selectiveOption}
                            >
                                <Radio value="all">All Records</Radio>
                                {attendanceState?.class?.length > 0 &&
                                    <>
                                        <Radio value="most-total-late-in">Most Total Late Minutes</Radio>
                                        <Radio value="most-total-soon-out">Most Total Soon Minutes</Radio>
                                        <Radio value="most-count-late-in">Most Late Count</Radio>
                                        <Radio value="most-count-soon-out">Most Soon Count</Radio>
                                        <Radio value="most-count-absent">Most Absent Count</Radio>
                                    </>
                                }
                            </Radio.Group>
                        </Col>
                        <Col span={4}>
                            {attendanceState?.class?.length > 0 &&
                                <ButtonCustom>
                                    <CSVLink
                                        data={attendanceList}
                                        filename={`${selectiveOption}-` + 'attendance' + `${attendanceState?.class?.length > 0 ? "-" + attendanceState?.class : ""}`}
                                    >
                                        Export CSV
                                    </CSVLink>
                                </ButtonCustom>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <TableCol span={24}>
                            <TableComponent
                                columns={attendanceColumns}
                                data={attendanceList}
                            />
                        </TableCol>
                    </Row>
                    <Row>
                        <div style={{ fontSize: '18px' }}>
                            <span style={{ fontWeight: '600' }}>
                                {attendanceState?.class?.length > 0 && selectiveOption === 'most-total-late-in' ? `Total Late: ${maxSumLate} minute${maxSumLate > 1 ? "s" : ""}` : ''}
                                {attendanceState?.class?.length > 0 && selectiveOption === 'most-total-soon-out' ? `Total Out: ${maxSumSoon} minute${maxSumSoon > 1 ? "s" : ""}` : ''}
                                {attendanceState?.class?.length > 0 && selectiveOption === 'most-count-late-in' ? `Count Late: ${maxCountLate} time${maxCountLate > 1 ? "s" : ""}` : ''}
                                {attendanceState?.class?.length > 0 && selectiveOption === 'most-count-soon-out' ? `Count Out: ${maxCountSoon} time${maxCountSoon > 1 ? "s" : ""}` : ''}
                                {attendanceState?.class?.length > 0 && selectiveOption === 'most-count-absent' ? `Count Absent: ${maxCountAbsent} time${maxCountAbsent > 1 ? "s" : ""}` : ''}
                            </span>
                        </div>
                    </Row>
                </Col>
            </Row>
        </Card>
    )
};

export default StatisticPage;

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

const ButtonCustom = styled(Button)`
    border-radius: 15px;
    border: 2px solid #a0a0e1;
    margin-left: 20px;
    color: #5252c8;
    padding: 0px 20px;
`


