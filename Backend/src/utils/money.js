const formatCurrency = (amount, currency = 'NPR') => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatNumber = (amount) => {
  return new Intl.NumberFormat('en-NP').format(amount);
};

const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

const calculateDiscount = (amount, discountPercent) => {
  return (amount * discountPercent) / 100;
};

const calculateTax = (amount, taxPercent) => {
  return (amount * taxPercent) / 100;
};

module.exports = {
  formatCurrency,
  formatNumber,
  roundToTwo,
  calculateDiscount,
  calculateTax,
};
