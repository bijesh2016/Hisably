const prisma = require('../config/database');

const createNotification = async (data) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        userId: data.userId,
        organizationId: data.organizationId,
        metadata: data.metadata || {},
      },
    });

    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
};

const getUserNotifications = async (userId, options = {}) => {
  const { page = 1, limit = 20, unreadOnly = false } = options;

  const where = {
    userId,
    ...(unreadOnly && { read: false }),
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return notification;
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

const markAllAsRead = async (userId) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
