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
  }
}
