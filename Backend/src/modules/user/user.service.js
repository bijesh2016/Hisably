const prisma = require('../../config/database');
const { password } = require('../../utils');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
      memberships: {
        include: {
          organization: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const { firstName, lastName, phone } = data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, phone },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
    },
  });

  return user;
};

const changePassword = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await password.comparePassword(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  const hashedPassword = await password.hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword },
  });

  return true;
};

const getUsers = async (query) => {
  const { page = 1, limit = 20, search, organizationId } = query;

  const where = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(organizationId && {
      memberships: {
        some: {
          organizationId,
        },
      },
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        isActive: true,
        createdAt: true,
        memberships: {
          include: {
            organization: true,
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
      isActive: true,
      createdAt: true,
      memberships: {
        include: {
          organization: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUser = async (userId, data) => {
  const updateData = { ...data };
  if (updateData.password) {
    updateData.passwordHash = await password.hashPassword(updateData.password);
    delete updateData.password;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
      isActive: true,
    },
  });

  return user;
};

const deleteUser = async (userId) => {
  await prisma.user.delete({ where: { id: userId } });
};

const createStaff = async (data, currentUser) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password: plainPassword = 'Password@123',
    roleName = 'Staff',
    roleId,
    organizationId: specifiedOrgId,
    branchId: specifiedBranchId,
  } = data;

  const organizationId = specifiedOrgId || currentUser?.organizationId;
  if (!organizationId) {
    throw new Error('Organization ID is required to create a staff member');
  }

  if (!email || !firstName) {
    throw new Error('First name and email are required');
  }

  // 1. Check if user already exists
  let user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const existingMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });
    if (existingMember) {
      throw new Error(`User with email ${email} is already a member of this organization`);
    }
  } else {
    const passwordHash = await password.hashPassword(plainPassword);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName: lastName || '',
        phone: phone || null,
        emailVerified: true,
        isActive: true,
      },
    });
  }

  // 2. Resolve Role
  let role = null;
  if (roleId) {
    role = await prisma.role.findFirst({ where: { id: roleId, deletedAt: null } });
  }
  if (!role && roleName) {
    role = await prisma.role.findFirst({
      where: {
        deletedAt: null,
        name: { equals: roleName, mode: 'insensitive' },
        OR: [{ organizationId }, { isSystemRole: true }, { organizationId: null }],
      },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          organizationId,
          name: roleName,
          description: `${roleName} workspace role`,
          isSystemRole: false,
        },
      });
    }
  }

  // 3. Create Organization Member
  const member = await prisma.organizationMember.create({
    data: {
      organizationId,
      userId: user.id,
    },
  });

  // 4. Assign Member Role
  if (role) {
    await prisma.memberRole.create({
      data: {
        memberId: member.id,
        roleId: role.id,
      },
    });
  }

  // 5. Assign Branch access if branchId is provided or default to primary branch
  let branchId = specifiedBranchId;
  if (!branchId) {
    const defaultBranch = await prisma.branch.findFirst({
      where: { organizationId, deletedAt: null },
    });
    if (defaultBranch) branchId = defaultBranch.id;
  }
  if (branchId) {
    await prisma.memberBranch.create({
      data: {
        memberId: member.id,
        branchId,
      },
    }).catch(() => {});
  }

  return await getUser(user.id);
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUser,
  createStaff,
  updateUser,
  deleteUser,
};
