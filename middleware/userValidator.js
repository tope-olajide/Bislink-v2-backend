import { Business, Notification } from '../database/models';

export const validateUserRight = async (businessId, userId) => {
  try {
    const businessFound = await Business.findOne({
      where: {
        id: businessId
      },
    });
    if (!businessFound) {
      return {
        success: false,
        status: 404,
        message: 'Business does not exist!'
      };
    }
    if (Number(businessFound.userId) !== Number(userId)) {
      return {
        success: false,
        status: 401,
        message: 'You cannot modify a business not created by You!'
      };
    }
    return {
      success: true,
      businessFound
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: 'Error verifying business owner'
    };
  }
};
export const validateNotificationOwner = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: notificationId
      },
    });
    if (Number(notification.userId) !== Number(userId)) {
      return {
        status: 401,
        success: false,
        message: 'You cannot view or delete a notification that is not yours'
      };
    }
    return {
      success: true,
      notification
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: 'Error verifying notification owner'
    };
  }
};
