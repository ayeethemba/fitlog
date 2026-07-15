// Lightweight, dependency-free validation helpers.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmptyString = (value) =>
    typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (email) =>
    isNonEmptyString(email) && EMAIL_REGEX.test(email.trim()) && email.length <= 254;

const isValidPassword = (password) =>
    typeof password === 'string' && password.length >= 8 && password.length <= 72; // bcrypt truncates past 72 bytes

const isValidDateString = (date) =>
    isNonEmptyString(date) && DATE_REGEX.test(date) && !Number.isNaN(Date.parse(date));

const isPositiveInt = (value, max = 1000) => {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 && n <= max;
};

const isNonNegativeNumber = (value, max = 5000) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 && n <= max;
};

module.exports = {
    isNonEmptyString,
    isValidEmail,
    isValidPassword,
    isValidDateString,
    isPositiveInt,
    isNonNegativeNumber,
};
