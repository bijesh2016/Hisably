const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const formatDateTime = (date) => {
  return new Date(date).toISOString();
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const diffDays = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(date2) - new Date(date1)) / oneDay);
};

const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

module.exports = {
  formatDate,
  formatDateTime,
  addDays,
  addMonths,
  diffDays,
  isToday,
};
