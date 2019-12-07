/* eslint-disable require-jsdoc */
import {
  Notification
} from '../database/models';
import {
  validateNotificationOwner
} from '../middleware/userValidation';

export default class Notifications {
  static async getAllNotifications({
    user
  }, res) {
    const userId = user.id;
    try {
      const allNotifications = await Notification
        .findAll({
          attributes: ['id', 'title', 'message', 'createdAt'],
          where: {
            userId
          },
          order: [
            ['createdAt', 'DESC']
          ]
        });
      const newNotificationsCount = await Notification.count({
        where: {
          userId,
          notificationState: 'unseen'
        }
      });
      const readNotificationsCount = await Notification.count({
        where: {
          userId,
          notificationState: 'seen'
        }
      });
      if (allNotifications.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No notifications found!',
          allNotifications: [],
          newNotificationsCount,
          readNotificationsCount
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Notification(s) found',
        allNotifications,
        newNotificationsCount,
        readNotificationsCount,
        userId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications'
      });
    }
  }

  static async viewNotification({ params, user }, res) {
    const { notificationId } = params;
    const userId = user.id;
    try {
      const verifyNotificationOwner = await validateNotificationOwner(notificationId, userId);
      if (verifyNotificationOwner.success) {
        const notificationFound = verifyNotificationOwner.notification;
        const notification = await notificationFound.updateAttributes({
          notificationState: 'seen'
        });
        const readNotificationsCount = await Notification.count({
          where: {
            userId,
            notificationState: 'seen'
          }
        });
        const unreadNotificationsCount = await Notification.count({
          where: {
            userId,
            notificationState: 'unseen'
          }
        });
        const allNotificationsCount = await Notification.count({
          where: {
            userId,
          }
        });
        return res.status(200).json({
          success: true,
          message: 'Notification(s) found',
          notification: notification.message,
          readNotificationsCount,
          allNotificationsCount,
          unreadNotificationsCount
        });
      }
      return res.status(verifyNotificationOwner.status).json(verifyNotificationOwner);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching notifications'
      });
    }
  }

  static async deleteNotification({ params, user }, res) {
    const {
      notificationId
    } = params;
    const userId = user.id;
    try {
      const verifyNotificationOwner = await validateNotificationOwner(notificationId, userId);
      if (verifyNotificationOwner.success) {
        await Notification
          .destroy({
            where: {
              id: notificationId
            }
          });
        return res.status(200).json({
          success: true,
          message: 'notification deleted successfully',
        });
      }
      return res.status(verifyNotificationOwner.status).json(verifyNotificationOwner);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting notifications'
      });
    }
  }

  static async getUnreadNotifications({ user }, res) {
    const userId = user.id;
    try {
      const unreadNotifications = Notification
        .findAll({
          attributes: ['id', 'title', 'message', 'createdAt'],
          where: {
            userId,
            notificationState: 'unseen'
          },
          order: [
            ['createdAt', 'DESC']
          ]
        });
      const readNotificationsCount = await Notification.count({
        where: {
          userId,
          notificationState: 'seen'
        }
      });
      const allNotificationsCount = await Notification.count({
        where: {
          userId,
        }
      });
      if (unreadNotifications.length) {
        res.status(200).json({
          success: true,
          message: 'New notification(s) found',
          unreadNotifications,
          allNotificationsCount,
          readNotificationsCount
        });
      }
      return res.status(204).json({
        success: false,
        message: 'You currently do not have any unread notification(s)',
        unreadNotifications: [],
        allNotificationsCount,
        readNotificationsCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching unread notifications'
      });
    }
  }

  static async getReadNotifications({ user }, res) {
    const userId = user.id;
    try {
      const readNotifications = Notification
        .findAll({
          attributes: ['id', 'title', 'message', 'createdAt'],
          where: {
            userId,
            notificationState: 'unseen'
          },
          order: [
            ['createdAt', 'DESC']
          ]
        });
      const unreadNotificationsCount = await Notification.count({
        where: {
          userId,
          notificationState: 'unseen'
        }
      });
      const allNotificationsCount = await Notification.count({
        where: {
          userId,
        }
      });
      if (readNotifications.length) {
        res.status(200).json({
          success: true,
          message: 'New notification(s) found',
          readNotifications,
          allNotificationsCount,
          unreadNotificationsCount
        });
      }
      return res.status(204).json({
        success: false,
        message: 'You currently do not have any unread notification(s)',
        readNotifications: [],
        allNotificationsCount,
        unreadNotificationsCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching read notifications'
      });
    }
  }

  static async markAllUnreadNotificationsAsRead({ user }, res) {
    const userId = user.id;
    try {
      const unSeenNotifications = await Notification
        .findAll({
          where: {
            userId,
            notificationState: 'unseen'
          }
        });
      const markAsRead = unSeenNotifications.map((eachNotification) => eachNotification.updateAttributes({
        notificationState: 'seen'
      }));
      const notification = Promise.all(markAsRead);
      return res.status(200).json({
        success: true,
        message: 'All unread notifications marked as read',
        notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching read notifications'
      });
    }
  }
}
