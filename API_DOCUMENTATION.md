# Hisably ERP - API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/refresh-token` | Refresh access token | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/verify-email` | Verify email address | No |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user profile | Yes |
| PATCH | `/users/profile` | Update current user profile | Yes |
| POST | `/users/change-password` | Change user password | Yes |
| GET | `/users` | Get all users (admin) | Yes |
| GET | `/users/:id` | Get user by ID (admin) | Yes |
| PATCH | `/users/:id` | Update user (admin) | Yes |
| DELETE | `/users/:id` | Delete user (admin) | Yes |

### Organizations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/organizations` | Create organization | Yes |
| GET | `/organizations` | Get all organizations | Yes |
| GET | `/organizations/:id` | Get organization by ID | Yes |
| PATCH | `/organizations/:id` | Update organization | Yes |
| DELETE | `/organizations/:id` | Soft delete organization | Yes |

### Branches
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/branches` | Create branch | Yes |
| GET | `/branches` | Get all branches | Yes |
| GET | `/branches/:id` | Get branch by ID | Yes |
| PATCH | `/branches/:id` | Update branch | Yes |
| DELETE | `/branches/:id` | Soft delete branch | Yes |

### Roles
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/roles` | Create role | Yes |
| GET | `/roles` | Get all roles | Yes |
| GET | `/roles/:id` | Get role by ID | Yes |
| PATCH | `/roles/:id` | Update role | Yes |
| DELETE | `/roles/:id` | Soft delete role | Yes |

### Permissions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/permissions` | Get all permissions | Yes |
| GET | `/permissions/:id` | Get permission by ID | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/categories` | Create category | Yes |
| GET | `/categories` | Get all categories | Yes |
| GET | `/categories/:id` | Get category by ID | Yes |
| PATCH | `/categories/:id` | Update category | Yes |
| DELETE | `/categories/:id` | Soft delete category | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/products` | Create product | Yes |
| GET | `/products` | Get all products | Yes |
| GET | `/products/:id` | Get product by ID | Yes |
| PATCH | `/products/:id` | Update product | Yes |
| DELETE | `/products/:id` | Soft delete product | Yes |

### Warehouses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/warehouses` | Create warehouse | Yes |
| GET | `/warehouses` | Get all warehouses | Yes |
| GET | `/warehouses/:id` | Get warehouse by ID | Yes |
| PATCH | `/warehouses/:id` | Update warehouse | Yes |
| DELETE | `/warehouses/:id` | Soft delete warehouse | Yes |

### Inventory (Stock)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/inventory` | Create inventory record | Yes |
| GET | `/inventory` | Get all inventory records | Yes |
| GET | `/inventory/:id` | Get inventory by ID | Yes |
| PATCH | `/inventory/:id` | Update inventory | Yes |
| DELETE | `/inventory/:id` | Delete inventory | Yes |

### Customers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/customers` | Create customer | Yes |
| GET | `/customers` | Get all customers | Yes |
| GET | `/customers/:id` | Get customer by ID | Yes |
| PATCH | `/customers/:id` | Update customer | Yes |
| DELETE | `/customers/:id` | Soft delete customer | Yes |

### Suppliers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/suppliers` | Create supplier | Yes |
| GET | `/suppliers` | Get all suppliers | Yes |
| GET | `/suppliers/:id` | Get supplier by ID | Yes |
| PATCH | `/suppliers/:id` | Update supplier | Yes |
| DELETE | `/suppliers/:id` | Soft delete supplier | Yes |

### Purchases
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/purchases` | Create purchase | Yes |
| GET | `/purchases` | Get all purchases | Yes |
| GET | `/purchases/:id` | Get purchase by ID | Yes |
| PATCH | `/purchases/:id` | Update purchase | Yes |
| DELETE | `/purchases/:id` | Soft delete purchase | Yes |

### Sales
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/sales` | Create sale | Yes |
| GET | `/sales` | Get all sales | Yes |
| GET | `/sales/:id` | Get sale by ID | Yes |
| PATCH | `/sales/:id` | Update sale | Yes |
| DELETE | `/sales/:id` | Soft delete sale | Yes |

### Reports
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reports/sales` | Get sales report | Yes |
| GET | `/reports/purchases` | Get purchases report | Yes |
| GET | `/reports/inventory` | Get inventory report | Yes |

### Notifications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | Yes |
| PATCH | `/notifications/:id/read` | Mark notification as read | Yes |
| PATCH | `/notifications/read-all` | Mark all notifications as read | Yes |

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## Query Parameters

### Common Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `organizationId` - Filter by organization
- `branchId` - Filter by branch
- `warehouseId` - Filter by warehouse
- `productId` - Filter by product

### Report Query Parameters
- `startDate` - Filter by start date (YYYY-MM-DD)
- `endDate` - Filter by end date (YYYY-MM-DD)
- `organizationId` - Filter by organization

## Soft Deletion
Most entities support soft deletion. When a record is deleted:
- The `deletedAt` field is set to the current timestamp
- The record is excluded from `getAll` and `getById` queries
- The record remains in the database for potential restoration

## Database Schema

### User
- `id` (UUID, Primary Key)
- `firstName` (String)
- `lastName` (String, Optional)
- `email` (String, Unique)
- `phone` (String, Unique, Optional)
- `passwordHash` (String)
- `isActive` (Boolean, Default: true)
- `emailVerified` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Organization
- `id` (UUID, Primary Key)
- `name` (String)
- `slug` (String, Unique)
- `businessType` (String, Optional)
- `phone` (String, Optional)
- `email` (String, Optional)
- `address` (String, Optional)
- `province` (String, Optional)
- `district` (String, Optional)
- `municipality` (String, Optional)
- `panNumber` (String, Optional)
- `vatNumber` (String, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Branch
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `name` (String)
- `code` (String)
- `phone` (String, Optional)
- `email` (String, Optional)
- `address` (String, Optional)
- `province` (String, Optional)
- `district` (String, Optional)
- `municipality` (String, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Role
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key, Optional)
- `name` (String)
- `description` (String, Optional)
- `isSystemRole` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Permission
- `id` (UUID, Primary Key)
- `key` (String, Unique)
- `name` (String)
- `description` (String, Optional)

### Category
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `name` (String)
- `description` (String, Optional)
- `parentId` (UUID, Foreign Key, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Brand
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `name` (String)
- `description` (String, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Unit
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `name` (String)
- `abbreviation` (String)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Product
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `categoryId` (UUID, Foreign Key, Optional)
- `brandId` (UUID, Foreign Key, Optional)
- `unitId` (UUID, Foreign Key)
- `name` (String)
- `sku` (String, Optional)
- `barcode` (String, Optional)
- `description` (String, Optional)
- `productType` (Enum: GOODS, SERVICE, COMPOSITE)
- `costPrice` (Decimal)
- `sellingPrice` (Decimal)
- `taxRate` (Decimal, Default: 0)
- `trackInventory` (Boolean, Default: true)
- `trackSerial` (Boolean, Default: false)
- `minStock` (Decimal, Optional)
- `maxStock` (Decimal, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### ProductVariant
- `id` (UUID, Primary Key)
- `productId` (UUID, Foreign Key)
- `name` (String)
- `sku` (String, Optional)
- `barcode` (String, Optional)
- `attributes` (JSON, Optional)
- `costPrice` (Decimal, Optional)
- `sellingPrice` (Decimal, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Warehouse
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `branchId` (UUID, Foreign Key)
- `name` (String)
- `code` (String)
- `address` (String, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Stock (Inventory)
- `id` (UUID, Primary Key)
- `warehouseId` (UUID, Foreign Key)
- `productId` (UUID, Foreign Key)
- `variantId` (UUID, Foreign Key, Optional)
- `quantity` (Decimal, Default: 0)
- `reservedQty` (Decimal, Default: 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Customer
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `name` (String)
- `customerCode` (String, Optional)
- `type` (Enum: INDIVIDUAL, BUSINESS)
- `phone` (String, Optional)
- `email` (String, Optional)
- `panNumber` (String, Optional)
- `creditLimit` (Decimal, Default: 0)
- `status` (Enum: ACTIVE, INACTIVE, BLOCKED)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Supplier
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `name` (String)
- `supplierCode` (String, Optional)
- `type` (Enum: INDIVIDUAL, BUSINESS)
- `phone` (String, Optional)
- `email` (String, Optional)
- `panNumber` (String, Optional)
- `vatNumber` (String, Optional)
- `creditLimit` (Decimal, Default: 0)
- `status` (Enum: ACTIVE, INACTIVE, BLOCKED)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Purchase
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `supplierId` (UUID, Foreign Key)
- `branchId` (UUID, Foreign Key)
- `warehouseId` (UUID, Foreign Key)
- `invoiceNumber` (String, Optional)
- `purchaseDate` (DateTime)
- `status` (Enum: DRAFT, RECEIVED, PARTIALLY_RECEIVED, CANCELLED)
- `paymentStatus` (Enum: UNPAID, PARTIAL, PAID)
- `subtotal` (Decimal, Default: 0)
- `discount` (Decimal, Default: 0)
- `taxAmount` (Decimal, Default: 0)
- `totalAmount` (Decimal, Default: 0)
- `paidAmount` (Decimal, Default: 0)
- `dueAmount` (Decimal, Default: 0)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

### Sale
- `id` (UUID, Primary Key)
- `organizationId` (UUID, Foreign Key)
- `customerId` (UUID, Foreign Key, Optional)
- `branchId` (UUID, Foreign Key)
- `warehouseId` (UUID, Foreign Key)
- `saleNumber` (String)
- `saleDate` (DateTime)
- `status` (Enum: DRAFT, COMPLETED, CANCELLED)
- `paymentStatus` (Enum: UNPAID, PARTIAL, PAID)
- `subtotal` (Decimal, Default: 0)
- `discount` (Decimal, Default: 0)
- `taxAmount` (Decimal, Default: 0)
- `totalAmount` (Decimal, Default: 0)
- `paidAmount` (Decimal, Default: 0)
- `dueAmount` (Decimal, Default: 0)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `deletedAt` (DateTime, Optional)

## Enums

### MemberStatus
- ACTIVE, INACTIVE, SUSPENDED

### ProductType
- GOODS, SERVICE, COMPOSITE

### StockMovementType
- PURCHASE, SALE, SALE_RETURN, PURCHASE_RETURN, ADJUSTMENT, TRANSFER_IN, TRANSFER_OUT, DAMAGE, OPENING_STOCK

### TransferStatus
- PENDING, IN_TRANSIT, COMPLETED, CANCELLED

### CustomerType
- INDIVIDUAL, BUSINESS

### SupplierType
- INDIVIDUAL, BUSINESS

### PartyStatus
- ACTIVE, INACTIVE, BLOCKED

### PurchaseStatus
- DRAFT, RECEIVED, PARTIALLY_RECEIVED, CANCELLED

### PaymentMethod
- CASH, BANK_TRANSFER, CONNECT_IPS, ESEWA, KHALTI, IME_PAY, QR, CARD, CREDIT, OTHER

### PaymentStatus
- UNPAID, PARTIAL, PAID

### SaleStatus
- DRAFT, COMPLETED, CANCELLED

## Swagger Documentation
Interactive API documentation available at:
```
http://localhost:3000/api-docs
```

## Error Codes
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Duplicate resource)
- `500` - Internal Server Error
