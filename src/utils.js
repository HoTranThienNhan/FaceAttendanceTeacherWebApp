export const containsNumber = (str) => {
    return /\d/.test(str);
}

export const containsOnlyNumber = (str) => {
    return str.match(/^[0-9]+$/) !== null;
}

export const getDayOfToday = () => {
    let day;
    switch (new Date().getDay()) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
    }
    return day;
}