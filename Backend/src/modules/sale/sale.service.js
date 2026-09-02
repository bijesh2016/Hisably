const prisma = require('../../config/database');
const { smsService } = require('../../services');

const create = async (data) => {
  const {
    organizationId,
    customerId: initialCustomerId,
    customerName,
    customer,
    branchId: initialBranchId,
    warehouseId: initialWarehouseId,
    warehouseName,
    items,
    payments,
    ...saleData
  } = data;

  if (!organizationId) {
    throw new Error('Organization ID is required to create a sale');
  }

  // 1. Resolve Customer
  let customerId = initialCustomerId;
  const targetCustomerName = customerName || (typeof customer === 'string' ? customer : customer?.name);
  if (!customerId && targetCustomerName && !targetCustomerName.toLowerCase().includes('walk-in')) {
    let existingCust = await prisma.customer.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        name: { equals: targetCustomerName, mode: 'insensitive' },
      },
    });

    if (!existingCust) {
      existingCust = await prisma.customer.create({
        data: {
          organizationId,
          name: targetCustomerName,
          customerCode: `CUS-${Math.floor(Math.random() * 9000 + 1000)}`,
        },
      });
    }
    customerId = existingCust.id;
  }

  // 2. Resolve Branch & Warehouse
  let branchId = initialBranchId;
  if (!branchId) {
    const defaultBranch = await prisma.branch.findFirst({ where: { organizationId, deletedAt: null } });
    if (defaultBranch) branchId = defaultBranch.id;
  }

  let warehouseId = initialWarehouseId;
  if (!warehouseId && warehouseName) {
    const matchedWh = await prisma.warehouse.findFirst({
      where: { organizationId, deletedAt: null, name: { equals: warehouseName, mode: 'insensitive' } },
    });
    if (matchedWh) warehouseId = matchedWh.id;
  }
  if (!warehouseId) {
    const defaultWh = await prisma.warehouse.findFirst({ where: { organizationId, deletedAt: null } });
    if (defaultWh) warehouseId = defaultWh.id;
  }

  return await prisma.$transaction(async (tx) => {
    // 3. Resolve Items & Auto-Create unlisted products if needed
    const processedItems = [];
    if (items && items.length) {
      for (const item of items) {
        let prodId = item.productId || item.id;
        const itemName = item.name || item.productName;

        if (!prodId || prodId.startsWith('#') || prodId.length < 10) {
          let foundProd = await tx.product.findFirst({
            where: { organizationId, deletedAt: null, name: { equals: itemName, mode: 'insensitive' } },
          });

          if (!foundProd && itemName) {
            let defaultUnit = await tx.unit.findFirst({ where: { organizationId, deletedAt: null } });
            if (!defaultUnit) {
              defaultUnit = await tx.unit.create({
                data: { organizationId, name: 'Pcs', abbreviation: 'pcs' },
              });
            }

            const unitP = Number(item.unitPrice || item.price || 0);
            foundProd = await tx.product.create({
              data: {
                organizationId,
                name: itemName,
                sku: `SKU-${Math.floor(Math.random() * 90000 + 10000)}`,
                unitId: defaultUnit.id,
                costPrice: unitP * 0.7,
                sellingPrice: unitP,
                trackInventory: true,
              },
            });
          }

          if (foundProd) prodId = foundProd.id;
        }

        if (prodId) {
          const qty = Number(item.quantity || item.qty || 1);
          const price = Number(item.unitPrice || item.price || 0);
          const taxR = Number(item.taxRate || 13);
          const taxAmt = Number(item.taxAmount || (qty * price * (taxR / 100)));
          const totalAmt = Number(item.totalAmount || qty * price);

          processedItems.push({
            productId: prodId,
            variantId: item.variantId || null,
            quantity: qty,
            unitPrice: price,
            discount: Number(item.discount || 0),
            taxRate: taxR,
            taxAmount: taxAmt,
            totalAmount: totalAmt,
          });

          // Auto-decrement inventory stock if warehouse available
          if (warehouseId) {
            const stock = await tx.stock.findUnique({
              where: {
                warehouseId_productId_variantId: {
                  warehouseId,
                  productId: prodId,
                  variantId: item.variantId || null,
                },
              },
            });

            if (stock) {
              await tx.stock.update({
                where: { id: stock.id },
                data: { quantity: { decrement: qty } },
              });
            }
          }
        }
      }
    }

    const sale = await tx.sale.create({
      data: {
        ...saleData,
        organizationId,
        customerId: customerId || null,
        branchId,
        warehouseId,
        saleNumber: saleData.saleNumber || `SAL-${Math.floor(Math.random() * 90000 + 10000)}`,
        saleDate: saleData.saleDate ? new Date(saleData.saleDate) : new Date(),
        subtotal: Number(saleData.subtotal || 0),
        discount: Number(saleData.discount || 0),
        taxAmount: Number(saleData.taxAmount || 0),
        totalAmount: Number(saleData.totalAmount || 0),
        paidAmount: Number(saleData.paidAmount || (saleData.paymentStatus === 'PAID' ? saleData.totalAmount : 0)),
        dueAmount: Number(saleData.dueAmount || (saleData.paymentStatus === 'PAID' ? 0 : saleData.totalAmount)),
        status: saleData.status || 'COMPLETED',
        paymentStatus: saleData.paymentStatus || 'PAID',
        notes: saleData.notes || null,
        items: processedItems.length ? { create: processedItems } : undefined,
        payments: payments?.length
          ? {
              create: payments.map((pay) => ({
                amount: Number(pay.amount || saleData.totalAmount || 0),
                method: pay.method || 'CASH',
                reference: pay.reference || null,
                notes: pay.notes || null,
                paymentDate: pay.paymentDate ? new Date(pay.paymentDate) : new Date(),
              })),
            }
          : undefined,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        branch: true,
      },
    });

    return sale;
  });
};

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, status, paymentStatus, customerId, branchId, startDate, endDate } = query;

  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(customerId && { customerId }),
    ...(branchId && { branchId }),
    ...(startDate || endDate
      ? {
          saleDate: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        branch: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { saleDate: 'desc' },
    }),
    prisma.sale.count({ where }),
  ]);

  return {
    sales,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  return await prisma.sale.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
      payments: true,
      branch: true,
      organization: true,
    },
  });
};

const getInvoice = async (id) => {
  const sale = await getById(id);
  if (!sale) {
    throw new Error('Sale invoice not found');
  }

  // Calculate detailed tax & compliance breakdown
  const subtotal = Number(sale.subtotal || sale.totalAmount || 0);
  const discount = Number(sale.discount || 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const vatAmount = Number(sale.taxAmount || Math.round(taxableAmount * 0.13));
  const totalAmount = Number(sale.totalAmount || taxableAmount + vatAmount);
  const paidAmount = Number(sale.paidAmount || 0);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  const organization = sale.organization || {
    name: 'Hisably Store Ltd.',
    panNumber: '609812345',
    phone: '+977 1-4412345',
    address: 'Durbar Marg, Kathmandu, Nepal',
  };

  const qrData = `fonepay://pay?recipient=${organization.panNumber || '609812345'}&amount=${dueAmount || totalAmount}&ref=${sale.saleNumber}`;

  return {
    invoiceNumber: sale.saleNumber,
    date: sale.saleDate || sale.createdAt,
    organization: {
      name: organization.name,
      panNumber: organization.panNumber,
      vatNumber: organization.vatNumber,
      phone: organization.phone,
      email: organization.email,
      address: organization.address || 'Kathmandu, Nepal',
      province: organization.province || 'Bagmati',
    },
    branch: sale.branch ? { name: sale.branch.name, phone: sale.branch.phone, address: sale.branch.address } : null,
    customer: sale.customer
      ? {
          name: sale.customer.name,
          phone: sale.customer.phone,
          panNumber: sale.customer.panNumber,
          address: sale.customer.notes,
        }
      : { name: 'Walk-in Retail Customer', phone: null, panNumber: null },
    items: (sale.items || []).map((item) => ({
      name: item.product?.name || 'Item',
      sku: item.product?.sku || '',
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.unitPrice || 0),
      taxRate: Number(item.taxRate || 13),
      totalAmount: Number(item.totalAmount || 0),
    })),
    summary: {
      subtotal,
      discount,
      taxableAmount,
      taxRate: 13,
      vatAmount,
      totalAmount,
      paidAmount,
      dueAmount,
      paymentStatus: sale.paymentStatus,
      status: sale.status,
    },
    payments: sale.payments || [],
    qrData,
  };
};

const sendReminder = async (id, data = {}) => {
  const sale = await getById(id);
  if (!sale) {
    throw new Error('Sale invoice not found');
  }

  const customer = sale.customer;
  const customerPhone = data.phone || customer?.phone;
  const customerName = customer?.name || 'Valued Customer';
  const dueAmount = Number(sale.dueAmount || sale.totalAmount || 0);
  const orgName = sale.organization?.name || 'Hisably Store';

  const message = `Namaste ${customerName} ji, your pending balance of NPR ${dueAmount.toLocaleString()} for Invoice ${sale.saleNumber} at ${orgName} is due. Kindly clear via Fonepay QR / eSewa. Thank you!`;

  let smsSent = false;
  let smsError = null;

  if (customerPhone) {
    try {
      await smsService.sendSMS(customerPhone, message);
      smsSent = true;
    } catch (err) {
      smsError = err.message;
      console.warn('SMS dispatch simulated:', err.message);
    }
  }

  // Generate WhatsApp click-to-chat link
  const cleanPhone = (customerPhone || '').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return {
    success: true,
    message,
    phone: customerPhone,
    smsSent,
    smsError,
    whatsappUrl,
    dueAmount,
  };
};

const update = async (id, data) => await prisma.sale.update({ where: { id }, data });

const remove = async (id) => await prisma.sale.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, getInvoice, sendReminder, update, remove };
