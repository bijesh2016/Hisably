const prisma = require('../src/config/database');
const bcrypt = require('bcrypt');

async function main() {
  console.log('🌱 Starting Hisably database seeding...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'sharma-clothing' },
    update: {},
    create: {
      name: 'Sharma Clothing & Retail Ltd.',
      slug: 'sharma-clothing',
      businessType: 'RETAIL_WHOLESALE',
      panNumber: '609812345',
      vatNumber: 'VAT-8848',
      phone: '+977 1-4412345',
      email: 'info@sharmaclothing.np',
      province: 'Bagmati Province',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City - 01',
      address: 'Durbar Marg, Kathmandu, Nepal',
    },
  });
  console.log('✅ Organization created:', org.name);

  // 2. Create Branches
  const branchKtm = await prisma.branch.upsert({
    where: { id: 'br-ktm-01' },
    update: {},
    create: {
      id: 'br-ktm-01',
      organizationId: org.id,
      name: 'Main Kathmandu Branch',
      code: 'KTM-01',
      phone: '+977 1-4412345',
      address: 'Durbar Marg, Kathmandu',
      province: 'Bagmati',
      district: 'Kathmandu',
    },
  });

  const branchLlp = await prisma.branch.upsert({
    where: { id: 'br-llp-02' },
    update: {},
    create: {
      id: 'br-llp-02',
      organizationId: org.id,
      name: 'Lalitpur Retail Branch',
      code: 'LLP-02',
      phone: '+977 1-5523456',
      address: 'Pulchowk, Lalitpur',
      province: 'Bagmati',
      district: 'Lalitpur',
    },
  });
  console.log('✅ Branches created: KTM-01, LLP-02');

  // 3. Create Warehouses
  const whKtm = await prisma.warehouse.upsert({
    where: { id: 'wh-001' },
    update: {},
    create: {
      id: 'wh-001',
      organizationId: org.id,
      branchId: branchKtm.id,
      name: 'Kathmandu Central Warehouse',
      code: 'WH-001',
      address: 'Ward 4, Baluwatar, Kathmandu',
      isActive: true,
    },
  });

  const whLlp = await prisma.warehouse.upsert({
    where: { id: 'wh-002' },
    update: {},
    create: {
      id: 'wh-002',
      organizationId: org.id,
      branchId: branchLlp.id,
      name: 'Lalitpur Storage Facility',
      code: 'WH-002',
      address: 'Pulchowk, Lalitpur',
      isActive: true,
    },
  });
  console.log('✅ Warehouses created: WH-001, WH-002');

  // 4. Create Roles
  const roles = ['Owner', 'Administrator', 'Sales Manager', 'Inventory Manager', 'Accountant', 'Sales Associate'];
  for (const rName of roles) {
    await prisma.role.upsert({
      where: { name: rName },
      update: {},
      create: {
        name: rName,
        description: `${rName} workspace role with standard permissions`,
        isSystemRole: true,
      },
    });
  }
  console.log('✅ Roles created');

  // 5. Create Users
  const passwordHash = await bcrypt.hash('Password@123', 10);
  const superAdminPasswordHash = await bcrypt.hash('SuperAdmin@123', 10);

  // 👑 SEEDED SUPER ADMIN (Platform Controller - No public signup)
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@hisably.com' },
    update: { passwordHash: superAdminPasswordHash },
    create: {
      email: 'superadmin@hisably.com',
      phone: '+977 9800000001',
      passwordHash: superAdminPasswordHash,
      firstName: 'Platform',
      lastName: 'SuperAdmin',
      emailVerified: true,
      isActive: true,
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@hisably.com' },
    update: { passwordHash },
    create: {
      email: 'owner@hisably.com',
      phone: '+977 9801234567',
      passwordHash,
      firstName: 'Aarav',
      lastName: 'Adhikari',
      emailVerified: true,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'cashier@hisably.com' },
    update: { passwordHash },
    create: {
      email: 'cashier@hisably.com',
      phone: '+977 9841234567',
      passwordHash,
      firstName: 'Sita',
      lastName: 'Shrestha',
      emailVerified: true,
      isActive: true,
    },
  });

  // Assign Owner to Organization
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: ownerUser.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      userId: ownerUser.id,
      organizationId: org.id,
      isOwner: true,
    },
  });
  console.log('✅ Users seeded: owner@hisably.com / cashier@hisably.com (Password@123)');

  // 6. Categories, Brands, Units
  const catApparel = await prisma.category.upsert({
    where: { id: 'cat-01' },
    update: {},
    create: { id: 'cat-01', organizationId: org.id, name: 'Apparel & Outerwear' },
  });

  const catFootwear = await prisma.category.upsert({
    where: { id: 'cat-02' },
    update: {},
    create: { id: 'cat-02', organizationId: org.id, name: 'Hiking & Footwear' },
  });

  const catGear = await prisma.category.upsert({
    where: { id: 'cat-03' },
    update: {},
    create: { id: 'cat-03', organizationId: org.id, name: 'Trekking & Climbing Gear' },
  });

  const brandHimalayan = await prisma.brand.upsert({
    where: { id: 'brd-01' },
    update: {},
    create: { id: 'brd-01', organizationId: org.id, name: 'Himalayan Gear Nepal' },
  });

  const unitPcs = await prisma.unit.upsert({
    where: { id: 'unt-01' },
    update: {},
    create: { id: 'unt-01', organizationId: org.id, name: 'Pcs', abbreviation: 'pcs' },
  });

  const unitPair = await prisma.unit.upsert({
    where: { id: 'unt-02' },
    update: {},
    create: { id: 'unt-02', organizationId: org.id, name: 'Pair', abbreviation: 'pr' },
  });
  console.log('✅ Categories, Brands & Units seeded');

  // 7. Products & Inventory Stocks
  const productsData = [
    { id: 'prd-01', name: 'Alpine Trail Pro Jacket (M)', sku: 'ATJ-042', barcode: '8901001001', categoryId: catApparel.id, costPrice: 5500, sellingPrice: 8500, minStock: 10, stockQty: 48, unitId: unitPcs.id },
    { id: 'prd-02', name: 'Himalayan Hiking Boots', sku: 'HHB-018', barcode: '8901001002', categoryId: catFootwear.id, costPrice: 12500, sellingPrice: 18900, minStock: 15, stockQty: 84, unitId: unitPair.id },
    { id: 'prd-03', name: 'Summit Daypack 24L', sku: 'SDP-221', barcode: '8901001003', categoryId: catGear.id, costPrice: 4200, sellingPrice: 6450, minStock: 8, stockQty: 24, unitId: unitPcs.id },
    { id: 'prd-04', name: 'Merino Thermal Base Layer', sku: 'MBL-108', barcode: '8901001004', categoryId: catApparel.id, costPrice: 2100, sellingPrice: 3200, minStock: 12, stockQty: 32, unitId: unitPcs.id },
    { id: 'prd-05', name: 'Waterproof Dry Bag 10L', sku: 'WPB-010', barcode: '8901001005', categoryId: catGear.id, costPrice: 1100, sellingPrice: 1800, minStock: 5, stockQty: 15, unitId: unitPcs.id },
    { id: 'prd-06', name: 'Carbon Trekking Poles (Pair)', sku: 'TPL-300', barcode: '8901001006', categoryId: catGear.id, costPrice: 2800, sellingPrice: 4200, minStock: 6, stockQty: 12, unitId: unitPair.id },
  ];

  for (const p of productsData) {
    const prod = await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        organizationId: org.id,
        categoryId: p.categoryId,
        brandId: brandHimalayan.id,
        unitId: p.unitId,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        taxRate: 13,
        trackInventory: true,
        minStock: p.minStock,
        maxStock: 150,
        isActive: true,
      },
    });

    // Seed Stock
    await prisma.stock.upsert({
      where: {
        warehouseId_productId_variantId: {
          warehouseId: whKtm.id,
          productId: prod.id,
          variantId: null,
        },
      },
      update: { quantity: p.stockQty },
      create: {
        organizationId: org.id,
        warehouseId: whKtm.id,
        productId: prod.id,
        quantity: p.stockQty,
      },
    });
  }
  console.log('✅ Products & Inventory Stock records seeded');

  // 8. Customers & Suppliers
  await prisma.customer.upsert({
    where: { id: 'cus-01' },
    update: {},
    create: {
      id: 'cus-01',
      organizationId: org.id,
      name: 'Himalayan Outfitters Ltd.',
      customerCode: 'CUS-001',
      type: 'BUSINESS',
      phone: '+977 9801234567',
      email: 'orders@himalayan.np',
      panNumber: '609812345',
      creditLimit: 250000,
      notes: 'Durbar Marg, Kathmandu',
    },
  });

  await prisma.customer.upsert({
    where: { id: 'cus-02' },
    update: {},
    create: {
      id: 'cus-02',
      organizationId: org.id,
      name: 'KTM Coffee House',
      customerCode: 'CUS-002',
      type: 'BUSINESS',
      phone: '+977 9851098765',
      email: 'finance@ktmcoffee.np',
      panNumber: '301928412',
      creditLimit: 100000,
      notes: 'Jhamsikhel, Lalitpur',
    },
  });

  await prisma.supplier.upsert({
    where: { id: 'sup-01' },
    update: {},
    create: {
      id: 'sup-01',
      organizationId: org.id,
      name: 'Kathmandu Textiles & Fabrics Ltd.',
      supplierCode: 'SUP-001',
      type: 'BUSINESS',
      phone: '+977 1-4229988',
      email: 'vendor@textiles.np',
      panNumber: '302498112',
      vatNumber: 'VAT-9921',
      creditLimit: 500000,
      notes: 'Main fabric supplier · Contact: Ramesh Shrestha',
    },
  });
  console.log('✅ Customers & Suppliers seeded');

  // 9. Expenses
  await prisma.expense.createMany({
    data: [
      {
        organizationId: org.id,
        branchId: branchKtm.id,
        title: 'Electricity NEA Bill Baluwatar',
        amount: 18400,
        paymentMethod: 'CONNECT_IPS',
        status: 'APPROVED',
        receiptUrl: 'NEA-BILL-88910',
        expenseDate: new Date(),
        notes: 'Monthly electric utility bill for central warehouse',
      },
      {
        organizationId: org.id,
        branchId: branchKtm.id,
        title: 'Durbar Marg Store Rent',
        amount: 45000,
        paymentMethod: 'BANK_TRANSFER',
        status: 'APPROVED',
        receiptUrl: 'RENT-AUG-2026',
        expenseDate: new Date(),
        notes: 'Monthly retail showroom lease',
      },
      {
        organizationId: org.id,
        branchId: branchLlp.id,
        title: 'Express Logistics Courier Service',
        amount: 8200,
        paymentMethod: 'ESEWA',
        status: 'APPROVED',
        receiptUrl: 'EXP-LOG-302',
        expenseDate: new Date(),
        notes: 'Inter-branch stock dispatch & customer parcel delivery',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Expenses seeded');

  // 10. Notifications
  await prisma.notification.createMany({
    data: [
      {
        organizationId: org.id,
        userId: ownerUser.id,
        title: 'Low Stock Alert',
        message: 'Summit Daypack 24L is low on stock (8 units remaining).',
        type: 'WARNING',
        read: false,
      },
      {
        organizationId: org.id,
        userId: ownerUser.id,
        title: 'Stock Transfer Received',
        message: 'TRF-108 was successfully received at Lalitpur Retail Branch.',
        type: 'SUCCESS',
        read: false,
      },
      {
        organizationId: org.id,
        userId: ownerUser.id,
        title: 'Invoice Due Notice',
        message: 'INV-2026-1048 for Himalayan Outfitters is due for payment.',
        type: 'INFO',
        read: false,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Notifications seeded');

  console.log('🎉 Hisably database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
