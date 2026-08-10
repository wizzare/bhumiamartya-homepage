// Julian Day Number calculation
/**
 * Calculate Julian Day Number
 * 
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day (1-31)
 * @returns {number} Julian Day Number
 */
export function julianDayNumber(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

/**
 * Calculate Julian Day Number from Date object
 * 
 * @param {Date} date - JS Date object
 * @returns {number} Julian Day Number
 */
export function dateToJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  
  const jd = julianDayNumber(year, month, day);
  const timeFraction = (hour - 12) / 24 + minute / 1440 + second / 86400;
  return jd + timeFraction;
}