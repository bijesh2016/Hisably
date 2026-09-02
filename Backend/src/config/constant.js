const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

const roles = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  CASHIER: 'CASHIER',
};

const permissions = {
  // Organization
  ORG_CREATE: 'org:create',
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',

  // User
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Branch
  BRANCH_CREATE: 'branch:create',
  BRANCH_READ: 'branch:read',
  BRANCH_UPDATE: 'branch:update',
  BRANCH_DELETE: 'branch:delete',

  // Product
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Inventory
  INVENTORY_CREATE: 'inventory:create',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_UPDATE: 'inventory:update',
  INVENTORY_DELETE: 'inventory:delete',

  // Sales
  SALE_CREATE: 'sale:create',
  SALE_READ: 'sale:read',
  SALE_UPDATE: 'sale:update',
  SALE_DELETE: 'sale:delete',

  // Purchase
  PURCHASE_CREATE: 'purchase:create',
  PURCHASE_READ: 'purchase:read',
  PURCHASE_UPDATE: 'purchase:update',
  PURCHASE_DELETE: 'purchase:delete',
};

module.exports = {
  httpStatus,
  roles,
  permissions,
};
