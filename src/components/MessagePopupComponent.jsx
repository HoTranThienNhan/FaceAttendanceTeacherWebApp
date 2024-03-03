import { message } from "antd";

const success = (msg = 'Success', duration = 3) => {
    message.success(msg, duration);
};

const error = (msg = 'Error', duration = 3) => {
    message.error(msg, duration);
};

const warning = (msg = 'Warning', duration = 3) => {
    message.warning(msg, duration);
};

export { success, error, warning }