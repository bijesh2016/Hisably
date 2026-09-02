const { httpStatus } = require('../config/constant');
const ApiError = require('../utils/ApiError');

const ADMIN_ROLES = ['ADMIN', 'Owner', 'Administrator', 'SUPER_ADMIN', 'Platform SuperAdmin'];
const MANAGER_ROLES = [
  ...ADMIN_ROLES,
  'MANAGER',
  'Sales Manager',
  'Inventory Manager',
  'Stock Manager',
  'Accountant',
];
const STAFF_ROLES = [
  ...MANAGER_ROLES,
  'STAFF',
  'Sales Associate',
  'Cashier',
];

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }

    const userRole = (req.user.role || '').toUpperCase();
    const isAuthorized = allowedRoles.some((role) => {
      if (Array.isArray(role)) {
        return role.some((r) => r.toUpperCase() === userRole);
      }
      return role.toUpperCase() === userRole;
    });

    if (!isAuthorized) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
    }

    next();
  };
};

const isAdmin = authorize(ADMIN_ROLES);
const isManager = authorize(MANAGER_ROLES);
const isStaff = authorize(STAFF_ROLES);

module.exports = {
  authorize,
  isAdmin,
  isManager,
  isStaff,
  ADMIN_ROLES,
  MANAGER_ROLES,
  STAFF_ROLES,
};
