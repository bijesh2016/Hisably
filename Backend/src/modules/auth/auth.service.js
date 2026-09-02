const prisma = require('../../config/database');
const { jwt, password, stringGenerator } = require('../../utils');
const { mailService } = require('../../services');

const register = async (data) => {
  const { email, password: userPassword, firstName, lastName, phone } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await password.hashPassword(userPassword);
  const emailVerificationToken = stringGenerator.generateRandomString(32);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      phone,
      emailVerificationToken,
      emailVerified: false,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
    },
  });

  // Send verification email (non-blocking / error caught)
  try {
    if (process.env.FRONTEND_URL) {
      await mailService.sendEmail({
        to: email,
        subject: 'Verify your email - Hisably',
        html: `<p>Click <a href="${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}">here</a> to verify your email.</p>`,
      });
    }
  } catch (err) {
    console.warn('Verification email not sent:', err.message);
  }

  return user;
};

const registerShop = async (data) => {
  const {
    shopName,
    panNumber,
    phone,
    email,
    firstName,
    lastName,
    password: userPassword,
    province,
    district,
    businessType = 'RETAIL_WHOLESALE',
  } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Email is already registered. Please sign in or use another email.');
  }

  const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const existingOrg = await prisma.organization.findUnique({ where: { slug } });
  const finalSlug = existingOrg ? `${slug}-${Math.floor(Math.random() * 900 + 100)}` : slug;

  const hashedPassword = await password.hashPassword(userPassword);

  // 1. Create Organization in PENDING state (isActive: false)
  const organization = await prisma.organization.create({
    data: {
      name: shopName,
      slug: finalSlug,
      panNumber,
      phone,
      email,
      province,
      district,
      businessType,
      isActive: false, // 🔒 Requires Super Admin approval
    },
  });

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName: lastName || '',
      phone,
      emailVerified: false,
      isActive: true,
    },
  });

  // 3. Link Membership
  const member = await prisma.organizationMember.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      isOwner: true,
    },
  });

  // 4. Create default branch and warehouse
  const branch = await prisma.branch.create({
    data: {
      organizationId: organization.id,
      name: 'Main Branch',
      code: 'BR-01',
      phone,
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

  return {
    success: true,
    status: 'PENDING_APPROVAL',
    message: 'Shop registration submitted successfully! Awaiting Super Admin verification.',
    organization,
    user: { id: user.id, email: user.email, firstName: user.firstName },
  };
};

const login = async (data) => {
  const { email, password: userPassword } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      memberships: {
        include: {
          organization: true,
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await password.comparePassword(userPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Check if organization is awaiting Super Admin approval
  const primaryMembership = user.memberships && user.memberships[0];
  if (primaryMembership && primaryMembership.organization) {
    if (primaryMembership.organization.isActive === false) {
      throw new Error('Your shop registration is currently pending Super Admin verification. You will be notified once activated.');
    }
  }

  // Determine user's primary role and organization if available
  const primaryRole = primaryMembership?.roles?.[0]?.role?.name || 'Owner';
  const organizationId = primaryMembership?.organizationId || null;

  const token = jwt.generateToken({
    id: user.id,
    email: user.email,
    role: primaryRole,
    organizationId,
  });
  const refreshToken = jwt.generateRefreshToken({ id: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      organizationId,
      role: primaryRole,
    },
    tokens: {
      accessToken: token,
      refreshToken,
    },
  };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      emailVerified: true,
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

  const primaryMembership = user.memberships && user.memberships[0];
  return {
    ...user,
    organizationId: primaryMembership?.organizationId || null,
    organization: primaryMembership?.organization || null,
    role: primaryMembership?.roles?.[0]?.role?.name || 'Owner',
  };
};

const logout = async (userId) => {
  // Stateless JWT logout (client clears local token)
  return { success: true };
};

const refreshToken = async (token) => {
  const decoded = jwt.verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = jwt.generateToken({ id: user.id, email: user.email });
  return { accessToken: newAccessToken };
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  const resetToken = stringGenerator.generateRandomString(32);
  const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpiry: resetExpiry,
    },
  });

  try {
    if (process.env.FRONTEND_URL) {
      await mailService.sendEmail({
        to: email,
        subject: 'Reset your password - Hisably',
        html: `<p>Click <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">here</a> to reset your password.</p>`,
      });
    }
  } catch (err) {
    console.warn('Password reset email not sent:', err.message);
  }

  return { message: 'If the email exists, a password reset link has been sent.' };
};

const resetPassword = async (data) => {
  const { token, newPassword } = data;

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const hashedPassword = await password.hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  return { message: 'Password reset successful' };
};

const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: token },
  });

  if (!user) {
    throw new Error('Invalid verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
    },
  });

  return { message: 'Email verified successfully' };
};

module.exports = {
  register,
  registerShop,
  login,
  getMe,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
