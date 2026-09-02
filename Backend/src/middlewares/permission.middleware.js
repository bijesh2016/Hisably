const { httpStatus } = require('../config/constant');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/database');

const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
      }

      const roleName = (req.user.role || '').toUpperCase();
      // Admin / Owner has all permissions
      if (roleName === 'ADMIN' || roleName === 'ADMINISTRATOR' || roleName === 'OWNER') {
        return next();
      }

      // Check user permissions across their organization memberships
      const memberships = await prisma.organizationMember.findMany({
        where: {
          userId: req.user.id,
          status: 'ACTIVE',
        },
        include: {
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
      });

      const hasPermission = memberships.some((member) =>
        member.roles.some((memberRole) =>
          memberRole.role.permissions.some(
            (rp) =>
              rp.permission.key === permission ||
              rp.permission.name.toLowerCase() === permission.toLowerCase()
          )
        )
      );

      if (!hasPermission) {
        return next(new ApiError(httpStatus.FORBIDDEN, `Insufficient permissions: Requires ${permission}`));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requirePermission,
};
