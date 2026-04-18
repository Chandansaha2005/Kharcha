const IST_OFFSET_MINUTES = 330;
const IST_OFFSET_MS = IST_OFFSET_MINUTES * 60 * 1000;
const IST_TIMEZONE = "Asia/Kolkata";

const shiftToIST = (date) => new Date(date.getTime() + IST_OFFSET_MS);
const shiftFromIST = (date) => new Date(date.getTime() - IST_OFFSET_MS);

const toDate = (value = new Date()) => (value instanceof Date ? value : new Date(value));

const buildUtcDate = (year, monthIndex, day, hours = 0, minutes = 0, seconds = 0, ms = 0) =>
  new Date(Date.UTC(year, monthIndex, day, hours, minutes, seconds, ms));

const formatDateKey = (value = new Date()) => {
  const date = shiftToIST(toDate(value));
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayKeyInIST = () => formatDateKey(new Date());

const getDayBoundsFromKey = (dateKey) => {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }

  const start = shiftFromIST(buildUtcDate(year, month - 1, day, 0, 0, 0, 0));
  const end = shiftFromIST(buildUtcDate(year, month - 1, day, 23, 59, 59, 999));

  return { start, end };
};

const getDayBoundsInIST = (value = new Date()) => getDayBoundsFromKey(formatDateKey(value));

const getMonthBoundsInIST = (month, year) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);

  if (!numericMonth || !numericYear || numericMonth < 1 || numericMonth > 12) {
    throw new Error("Invalid month or year.");
  }

  const start = shiftFromIST(buildUtcDate(numericYear, numericMonth - 1, 1, 0, 0, 0, 0));
  const end = shiftFromIST(buildUtcDate(numericYear, numericMonth, 0, 23, 59, 59, 999));

  return { start, end };
};

const getCurrentMonthYearInIST = () => {
  const now = shiftToIST(new Date());
  return {
    month: now.getUTCMonth() + 1,
    year: now.getUTCFullYear(),
  };
};

const getWeekBoundsInIST = (value = new Date()) => {
  const date = shiftToIST(toDate(value));
  const dayOfWeek = date.getUTCDay();
  const mondayOffset = (dayOfWeek + 6) % 7;

  const startOfWeek = buildUtcDate(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - mondayOffset,
    0,
    0,
    0,
    0
  );
  const endOfWeek = buildUtcDate(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() - mondayOffset + 6,
    23,
    59,
    59,
    999
  );

  return {
    start: shiftFromIST(startOfWeek),
    end: shiftFromIST(endOfWeek),
  };
};

const getPreviousWeekBoundsInIST = (value = new Date()) => {
  const currentWeek = getWeekBoundsInIST(value);
  const lastWeekEnd = new Date(currentWeek.start.getTime() - 1);
  return getWeekBoundsInIST(lastWeekEnd);
};

const isSameISTDay = (left, right) => formatDateKey(left) === formatDateKey(right);

const formatISTDateLong = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeZone: IST_TIMEZONE,
  }).format(toDate(value));

module.exports = {
  IST_TIMEZONE,
  formatDateKey,
  formatISTDateLong,
  getCurrentMonthYearInIST,
  getDayBoundsFromKey,
  getDayBoundsInIST,
  getMonthBoundsInIST,
  getPreviousWeekBoundsInIST,
  getTodayKeyInIST,
  getWeekBoundsInIST,
  isSameISTDay,
};
