import HomePage from "../pages/HomePage";
import SignInPage from "../pages/SignInPage";
import MyClassesPage from "../pages/MyClassesPage";
import AttendanceClassesPage from "../pages/AttendanceClassesPage";
import RollCallPage from "../pages/RollCallPage";


export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFooter: true,
        isPrivate: false,
        exact: false,
    },
    {
        path: '/signin',
        page: SignInPage,
        isShowHeader: true,
        isShowFooter: true,
        isPrivate: false,
        exact: false,
    },
    {
        path: '/attendance-classes',
        page: AttendanceClassesPage,
        isShowHeader: true,
        isShowFooter: true,
        isPrivate: false,
        exact: false,
    },
    {
        path: '/roll-call/:classid/:attendancetype',
        page: RollCallPage,
        isShowHeader: true,
        isShowFooter: true,
        isPrivate: false,
        exact: false,
    },
    {
        path: '/myclasses',
        page: MyClassesPage,
        isShowHeader: true,
        isShowFooter: true,
        isPrivate: false,
        exact: false,
    },
]