import { UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../redux/slices/userSlice';
import { Col, Dropdown, Row, Space } from 'antd';
import * as MessagePopup from '../components/MessagePopupComponent';


const HeaderComponent = () => {
   const user = useSelector((state) => state.user);

   const navigate = useNavigate();
   const dispatch = useDispatch();

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
      navigate('/myclasses');
   }


   return (
      <div style={{ margin: '30px 100px' }}>
         <Row justify="space-between" style={{ backgroundColor: '#a0a0e1', padding: '25px 80px', borderRadius: '15px', textAlign: 'center' }}>
            <Col span={6} style={{ color: '#fff', fontWeight: '700' }}>
               <div style={{ cursor: 'pointer', fontSize: '16px' }} onClick={() => navigateHomePage()}>FACE ATTENDANCE SYSTEM</div>
            </Col>
            {user?.fullname
               ?
               <Col span={18} style={{ color: '#fff', fontWeight: '700', width: '600px' }}>
                  <Row justify='end'>
                     <Col span={4}>
                        <Dropdown
                           menu={{
                              items: navAttendanceItems,
                           }}
                           arrow={{
                              pointAtCenter: true,
                           }}
                        >
                           <span style={{ fontSize: '16px', cursor: 'pointer', color: '#fff', fontWeight: '700' }}>
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
                           <span style={{ fontSize: '16px', cursor: 'pointer', color: '#fff', fontWeight: '700' }}>
                              My Classes
                           </span>
                        </Dropdown>
                     </Col>
                     <Col span={6} offset={2}>
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
               </Col>
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
