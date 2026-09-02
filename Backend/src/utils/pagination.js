const config = require('../config/app.config');

const getPagination = (page, size) => {
  const limit = size > config.pagination.maxLimit ? config.pagination.maxLimit : size;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
    limit,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
