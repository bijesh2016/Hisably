# Hisably ERP System - UI Development Prompt

## Project Overview
Hisably is a comprehensive ERP (Enterprise Resource Planning) system for inventory and business management. The system handles organizations, branches, products, inventory, customers, suppliers, purchases, sales, and reporting.

## Technology Stack Recommendation
- **Frontend Framework**: React.js with TypeScript
- **UI Library**: shadcn/ui (Radix UI + TailwindCSS)
- **State Management**: Zustand or Redux Toolkit
- **Form Handling**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Charts**: Recharts or Chart.js
- **Icons**: Lucide React
- **Date Handling**: date-fns

## UI Screens Structure (Total: 25+ Screens)

### 1. Authentication Screens (3 screens)
- **Login Screen** - Email/Password login
- **Register Screen** - User registration with organization details
- **Forgot Password Screen** - Password reset flow

### 2. Dashboard (1 screen)
- **Main Dashboard** - Overview cards, charts, recent activities, quick actions

### 3. Organization Management (3 screens)
- **Organization List** - Table with all organizations
- **Organization Details** - View/Edit organization info
- **Organization Settings** - Configure organization preferences

### 4. Branch Management (3 screens)
- **Branch List** - Table with branches per organization
- **Branch Details** - View/Edit branch info
- **Branch Settings** - Configure branch-specific settings

### 5. User & Role Management (5 screens)
- **User List** - Table with users
- **User Details** - View/Edit user profile
- **Role List** - Table with roles
- **Role Details** - View/Edit role and assign permissions
- **Permission Matrix** - Grid view of role permissions

### 6. Product Management (6 screens)
- **Product List** - Table with products, filters, search
- **Product Details** - View/Edit product with variants
- **Product Form** - Create/Edit product with multi-step form
- **Category Management** - Tree view of categories
- **Brand Management** - List and manage brands
- **Unit Management** - List and manage measurement units

### 7. Warehouse & Inventory (4 screens)
- **Warehouse List** - Table with warehouses
- **Warehouse Details** - View/Edit warehouse info
- **Inventory List** - Stock levels per warehouse
- **Stock Movements** - History of stock adjustments

### 8. Customer Management (3 screens)
- **Customer List** - Table with customers
- **Customer Details** - View/Edit customer with addresses
- **Customer Form** - Create/Edit customer

### 9. Supplier Management (3 screens)
- **Supplier List** - Table with suppliers
- **Supplier Details** - View/Edit supplier with contacts
- **Supplier Form** - Create/Edit supplier

### 10. Purchase Management (4 screens)
- **Purchase List** - Table with purchases, filters by status
- **Purchase Details** - View purchase with items
- **Purchase Form** - Create/Edit purchase with line items
- **Purchase Returns** - Manage purchase returns

### 11. Sales Management (4 screens)
- **Sale List** - Table with sales, filters by status
- **Sale Details** - View sale with items and payments
- **Sale Form** - Create/Edit sale with POS interface
- **Sale Returns** - Manage sale returns

### 12. Stock Transfer (2 screens)
- **Transfer List** - Table with stock transfers
- **Transfer Form** - Create stock transfer between warehouses

### 13. Reports & Analytics (5 screens)
- **Sales Report** - Sales analytics with charts
- **Purchase Report** - Purchase analytics
- **Inventory Report** - Stock valuation and levels
- **Profit/Loss Report** - Financial summary
- **Custom Report Builder** - Build custom reports

### 14. Settings (3 screens)
- **Profile Settings** - User profile management
- **Organization Settings** - Business configuration
- **System Settings** - App-wide settings

### 15. Notifications (1 screen)
- **Notification Center** - List and manage notifications

## Navigation Structure

```
Sidebar Navigation:
- Dashboard
- Organization
  - Organizations
  - Branches
- Inventory
  - Products
  - Categories
  - Brands
  - Units
  - Warehouses
  - Stock
  - Stock Transfers
- Sales
  - Sales
  - Sale Returns
- Purchases
  - Purchases
  - Purchase Returns
- CRM
  - Customers
  - Suppliers
- Reports
  - Sales Reports
  - Purchase Reports
  - Inventory Reports
  - Financial Reports
- Settings
  - Users & Roles
  - Permissions
  - Organization Settings
  - Profile
```

## Key UI Components Needed

### 1. Data Tables
- Sortable columns
- Pagination
- Row selection
- Bulk actions
- Filters
- Search
- Export to CSV/Excel

### 2. Forms
- Multi-step forms
- Dynamic form fields
- Validation
- Auto-save drafts
- File uploads

### 3. Dashboard Widgets
- Stat cards
- Line charts
- Bar charts
- Pie charts
- Recent activity list
- Quick action buttons

### 4. Common Components
- Modal/Dialog
- Drawer/Sidebar
- Tabs
- Accordion
- Date picker
- Select with search
- Autocomplete
- Toast notifications
- Loading skeletons
- Empty states

## Color Palette (Suggestion)
- **Primary**: #3B82F6 (Blue)
- **Secondary**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **Warning**: #F59E0B (Amber)
- **Background**: #F9FAFB (Light Gray)
- **Surface**: #FFFFFF (White)
- **Text Primary**: #111827 (Dark Gray)
- **Text Secondary**: #6B7280 (Medium Gray)

## Responsive Design
- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation bar or hamburger menu

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader support
- High contrast mode
- Focus indicators

## Performance Requirements
- Initial load < 2 seconds
- Route transitions < 500ms
- Table rendering with 1000+ rows < 1 second
- Form submission feedback < 300ms

## Internationalization
- Support for multiple languages (English, Nepali)
- Date/time formatting based on locale
- Number formatting (currency, decimals)
- RTL support for future expansion
