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

export const setStudentAttendance = async (classid) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/set_student_attendance?classid=${classid}`);
    return res.data;
}



