import { UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetUser } from '../redux/slices/userSlice';
import { Col, Dropdown, Row, Space } from 'antd';
import * as MessagePopup from '../components/MessagePopupComponent';
import styled from 'styled-components';


const HeaderComponent = () => {
   const user = useSelector((state) => state.user);

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const location = useLocation();

   const handleSignOut = () => {
      dispatch(resetUser());
      navigate('/');
      MessagePopup.success("Sign out successfully");
   }

   // navigate items
   const navAttendanceItems = [
      {
         key: '1',
         label: (
            <a target="_blank" rel="noopener noreferrer" onClick={() => navigateAttendanceClassesPage()}>
               Attendance Classes
            </a>
         ),
      },
      {
         key: '2',
         label: (
            <a target="_blank" rel="noopener noreferrer" onClick={() => navigateClassAttendanceManagementPage()}>
               Class Attendance Management
            </a>
         ),
      },
      {
         key: '3',
         label: (
            <a target="_blank" rel="noopener noreferrer" onClick={() => navigateStudentAttendanceManagementPage()}>
               Student Attendance Management
            </a>
         ),
      },
   ];
   const navMyClassesItems = [
      {
         key: '1',
         label: (
            <a target="_blank" rel="noopener noreferrer" onClick={() => navigateMyClassesPage()}>
               My Classes
            </a>
         ),
      },
   ];
   const navUsernameItems = [
      {
         key: '1',
         label: (
            <a target="_blank" rel="noopener noreferrer" onClick={() => handleSignOut()}>
               Log Out
            </a>
         ),
      },
   ];

   // navigate
   const navigateHomePage = () => {
      navigate('/');
   }
   const navigateSignInPage = () => {
      navigate('/signin');
   }
   const navigateAttendanceClassesPage = () => {
      navigate('/attendance-classes');
   }
   const navigateClassAttendanceManagementPage = () => {
      navigate('/class-attendance-management');
   }
   const navigateStudentAttendanceManagementPage = () => {
      navigate('/student-attendance-management');
   }
   const navigateMyClassesPage = () => {
      navigate('/my-classes');
   }
   const navigateStatisticPage = () => {
      navigate('/statistic');
   }


   return (
      <div style={{ margin: '30px 100px' }}>
         <Row justify="space-between" style={{ backgroundColor: '#a0a0e1', padding: '25px 80px', borderRadius: '15px', textAlign: 'center' }}>
            <Col span={6} style={{ color: '#fff', fontWeight: '700' }}>
               <div style={{ cursor: 'pointer', fontSize: '16px' }} onClick={() => navigateHomePage()}>FACE ATTENDANCE SYSTEM</div>
            </Col>
            {user?.fullname
               ?
               <CustomHeaderCol span={18} style={{ color: '#fff', fontWeight: '700', width: '600px' }}>
                  <Row justify='end'>
                     <Col span={3}>
                        <span
                           style={{ fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}
                           className={'home-page-header header-enable-hover' + `${(location.pathname === '/') ? ' checked' : ''}`}
                           onClick={() => navigateHomePage()}
                        >
                           Home Page
                        </span>
                     </Col>
                     <Col span={4}>
                        <Dropdown
                           menu={{
                              items: navAttendanceItems,
                           }}
                           arrow={{
                              pointAtCenter: true,
                           }}
                        >
                           <span
                              style={{ fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}
                              className={'attendance-page-header header-enable-hover'
                                 + `${(location.pathname === '/attendance-classes'
                                    || location.pathname === '/class-attendance-management'
                                    || location.pathname === '/student-attendance-management') ? ' checked' : ''}`}
                           >
                              Attendance
                           </span>
                        </Dropdown>
                     </Col>
                     <Col span={4}>
                        <Dropdown
                           menu={{
                              items: navMyClassesItems,
                           }}
                           arrow={{
                              pointAtCenter: true,
                           }}
                        >
                           <span
                              style={{ fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}
                              className={'my-classes-header header-enable-hover' + `${(location.pathname === '/my-classes') ? ' checked' : ''}`}
                           >
                              My Classes
                           </span>
                        </Dropdown>
                     </Col>
                     <Col span={3}>
                        <span
                           style={{ fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}
                           className={'my-classes-header header-enable-hover' + `${(location.pathname === '/statistic') ? ' checked' : ''}`}
                           onClick={navigateStatisticPage}
                        >
                           Statistic
                        </span>
                     </Col>
                     <Col span={6} offset={1}>
                        <Dropdown
                           menu={{
                              items: navUsernameItems,
                           }}
                           arrow={{
                              pointAtCenter: true,
                           }}
                        >
                           <Col style={{ fontSize: '16px', cursor: 'pointer', color: '#fff', fontWeight: '700' }}><UserOutlined /> {user?.fullname}</Col>
                        </Dropdown>
                     </Col>
                  </Row>
               </CustomHeaderCol>
               :
               <Col style={{ color: '#fff', fontWeight: '700' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => navigateSignInPage()}>Sign In</div>
               </Col>
            }
         </Row>
      </div>
   )
};

export default HeaderComponent;

const CustomHeaderCol = styled(Col)`
   .checked {
      color: #5c32cb;
      border-bottom: 2px solid;
   }

   .header-enable-hover:hover {
      color: #5c32cb !important;
      border-bottom: 2px solid;
   }
`
