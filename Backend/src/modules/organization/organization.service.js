const prisma = require('../../config/database');
const bcrypt = require('bcrypt');

const create = async (data) => {
  return await prisma.organization.create({ data });
};

const createShopBySuperAdmin = async (data) => {
  const {
    name,
    slug,
    panNumber,
    phone,
    email,
    province,
    district,
    ownerEmail,
    ownerName,
    ownerPhone,
    ownerPassword = 'Password@123',
    plan = 'PRO',
    roleName = 'Owner',
  } = data;

  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // 1. Create Organization (Immediate Active state)
  const organization = await prisma.organization.create({
    data: {
      name,
      slug: generatedSlug,
      panNumber,
      phone: phone || ownerPhone,
      email: email || ownerEmail,
      province,
      district,
      isActive: true,
    },
  });

  // 2. Create or find User
  const passwordHash = await bcrypt.hash(ownerPassword, 10);
  const nameParts = (ownerName || 'Shop Owner').split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || 'Admin';

  const user = await prisma.user.upsert({
    where: { email: ownerEmail || `owner@${generatedSlug}.np` },
    update: { isActive: true },
    create: {
      email: ownerEmail || `owner@${generatedSlug}.np`,
      phone: ownerPhone || phone || '+977 9800000000',
      passwordHash,
      firstName,
      lastName,
      emailVerified: true,
      isActive: true,
    },
  });

  // 3. Link Membership with Owner role
  const member = await prisma.organizationMember.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      isOwner: true,
    },
  });

  // 4. Create default branch & warehouse
  const branch = await prisma.branch.create({
    data: {
      organizationId: organization.id,
      name: 'Main Branch',
      code: 'BR-01',
      phone: phone || ownerPhone,
      address: district ? `${district}, Nepal` : 'Kathmandu, Nepal',
      province: province || 'Bagmati',
      district: district || 'Kathmandu',
    },
  });

  await prisma.warehouse.create({
    data: {
      organizationId: organization.id,
      branchId: branch.id,
      name: 'Central Warehouse',
      code: 'WH-01',
      address: district ? `${district}, Nepal` : 'Kathmandu, Nepal',
      isActive: true,
    },
  });

  return { organization, user, member, branch };
};

const approveOrganization = async (id, approvalData = {}) => {
  const { plan = 'PRO' } = approvalData;
  const organization = await prisma.organization.update({
    where: { id },
    data: {
      isActive: true,
    },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  });
  return organization;
};

const rejectOrganization = async (id, rejectionData = {}) => {
  const organization = await prisma.organization.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
  return organization;
};

const getAll = async (query) => {
  const { page = 1, limit = 50, status } = query;
  const where = { deletedAt: null };
  if (status === 'PENDING') where.isActive = false;
  else if (status === 'ACTIVE') where.isActive = true;

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      skip: (page - 1) * limit,
      take: parseInt(limit),
      where,
      include: {
        _count: {
          select: {
            branches: true,
            memberships: true,
            products: true,
            sales: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.organization.count({ where }),
  ]);
  return { organizations, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) } };
};

const getPlatformOverview = async () => {
  const [orgCount, pendingCount, userCount, productCount, salesAggregate, organizations] = await Promise.all([
    prisma.organization.count({ where: { deletedAt: null } }),
    prisma.organization.count({ where: { deletedAt: null, isActive: false } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.sale.aggregate({
      where: { deletedAt: null },
      _sum: { totalAmount: true },
      _count: { id: true },
    }),
    prisma.organization.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            branches: true,
            memberships: true,
            products: true,
            sales: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    totalOrganizations: orgCount,
    pendingApprovals: pendingCount,
    totalUsers: userCount,
    totalProducts: productCount,
    totalGmv: Number(salesAggregate._sum.totalAmount || 0),
    totalSalesOrders: salesAggregate._count.id || 0,
    organizations,
  };
};

const getById = async (id) => {
  return await prisma.organization.findFirst({
    where: { id, deletedAt: null },
    include: {
      branches: true,
      memberships: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
        },
      },
    },
  });
};

const update = async (id, data) => {
  return await prisma.organization.update({ where: { id }, data });
};

const remove = async (id) => {
  await prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
};

module.exports = {
  create,
  createShopBySuperAdmin,
  approveOrganization,
  rejectOrganization,
  getAll,
  getPlatformOverview,
  getById,
  update,
  remove,
};
