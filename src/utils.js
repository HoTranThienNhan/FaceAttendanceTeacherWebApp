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

export const getDayOfSpecificDate = (dateString) => {
    let day;
    const date = new Date(dateString).getDay();
    switch (date) {
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

export const getDayNumberOfSpecificDayText = (dayText) => {
    let dayNumber;
    switch (dayText) {
        case "Sunday":
            dayNumber = 0;
            break;
        case "Monday":
            dayNumber = 1;
            break;
        case "Tuesday":
            dayNumber = 2;
            break;
        case "Wednesday":
            dayNumber = 3;
            break;
        case "Thursday":
            dayNumber = 4;
            break;
        case "Friday":
            dayNumber = 5;
            break;
        case "Saturday":
            dayNumber = 6;
    }
    return dayNumber;
}

/**
 * getMinusHourBetween2TimeText() function
 *
 * @param firstTimeText  The first time text HH:MM:SS
 * 
 * @param secondTimeText  The second time text HH:MM:SS
 * 
 * @returns A value of (secondTimeText - firstTimeText)
 */
export const getMinusHourBetween2TimeText = (firstTimeText, secondTimeText) => {
    const firstHour = parseInt(firstTimeText.slice(0, 2));
    const secondHour = parseInt(secondTimeText.slice(0, 2));
    const minusHour = secondHour - firstHour;
    console.log(firstHour, secondHour);
    return minusHour;
}