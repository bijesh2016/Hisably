const { notificationService } = require('../../services');

const getUserNotifications = async (userId, query) => {
  return await notificationService.getUserNotifications(userId, query);
};

const markAsRead = async (notificationId, userId) => {
  return await notificationService.markAsRead(notificationId, userId);
};

const markAllAsRead = async (userId) => {
  return await notificationService.markAllAsRead(userId);
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
