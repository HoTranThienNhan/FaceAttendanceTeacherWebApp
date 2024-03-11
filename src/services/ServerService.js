import axios from "axios";

export const signIn = async (username, password) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/signin_teacher?username=${username}&password=${password}`);
    return res.data;
}

export const startRecognition = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/face_rec`);
    return res.data;
}

export const stopVideoStream = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/stop_video_stream`);
    return res.data;
}

export const getAllClassesByTeacher = async (teacherid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_all_classes_by_teacher?teacherid=${teacherid}`);
    return res.data;
}

export const getClassByTeacherAndClassId = async (teacherid, classid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_class_by_teacher_and_class_id?teacherid=${teacherid}&classid=${classid}`);
    return res.data;
}

export const getAllClassesByYearSemesterTeacherId = async (year, semester, teacherid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_all_classes_by_year_semester_teacher?year=${year}&semester=${semester}&teacherid=${teacherid}`);
    return res.data;
}

export const setAttendance = async (classid, attendancetype, teacherid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/set_attendance?classid=${classid}&attendancetype=${attendancetype}&teacherid=${teacherid}`);
    return res.data;
}

export const getAllStudentsByClass = async (classid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_all_students_by_class?classid=${classid}`);
    return res.data;
}

export const getInAttendance = async (classid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_in_attendance?classid=${classid}`);
    return res.data;
}

export const getOutAttendance = async (classid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_out_attendance?classid=${classid}`);
    return res.data;
}

export const getStandardInOutAttendance = async (classid, day) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_standard_in_out_attendance?classid=${classid}&day=${day}`);
    return res.data;
}

export const getFullAttendance = async (classid, date, day) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_full_attendance?classid=${classid}&date=${date}&day=${day}`);
    return res.data;
}

export const getClassTimeByClassId = async (classid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/get_class_time_by_class_id?classid=${classid}`);
    return res.data;
}

