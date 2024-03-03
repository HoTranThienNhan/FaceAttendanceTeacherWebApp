export const containsNumber = (str) => {
    return /\d/.test(str);
}

export const containsOnlyNumber = (str) => {
    return str.match(/^[0-9]+$/) !== null;
}