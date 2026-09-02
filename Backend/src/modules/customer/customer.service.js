const prisma = require('../../config/database');
const { smsService } = require('../../services');

const create = async (data) => await prisma.customer.create({ data });

const getAll = async (query) => {
  const { page = 1, limit = 20, organizationId, search } = query;
  const where = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { customerCode: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        sales: {
          where: { paymentStatus: { in: ['UNPAID', 'PARTIAL'] } },
          select: { id: true, saleNumber: true, totalAmount: true, dueAmount: true, saleDate: true },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ]);
  return { customers, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) =>
  await prisma.customer.findFirst({
    where: { id, deletedAt: null },
    include: {
      sales: {
        orderBy: { saleDate: 'desc' },
        take: 10,
      },
      organization: true,
    },
  });

const sendReminder = async (id, data = {}) => {
  const customer = await getById(id);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const unpaidSales = await prisma.sale.findMany({
    where: {
      customerId: id,
      paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
      deletedAt: null,
    },
  });

  const totalOutstanding = unpaidSales.reduce((sum, s) => sum + Number(s.dueAmount || s.totalAmount || 0), 0) || Number(data.amount || customer.creditLimit || 0);
  const customerPhone = data.phone || customer.phone;
  const orgName = customer.organization?.name || 'Hisably Store';

  const message = `Namaste ${customer.name} ji, your pending balance at ${orgName} is NPR ${totalOutstanding.toLocaleString()}. Kindly clear your balance via Fonepay QR or eSewa. For queries call ${customer.organization?.phone || 'our store'}. Dhanyabad!`;

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

  const cleanPhone = (customerPhone || '').replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('977') ? cleanPhone : `977${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return {
    success: true,
    message,
    phone: customerPhone,
    totalOutstanding,
    smsSent,
    smsError,
    whatsappUrl,
  };
};

const update = async (id, data) => await prisma.customer.update({ where: { id }, data });

const remove = async (id) => await prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });

module.exports = { create, getAll, getById, sendReminder, update, remove };
