/* eslint-disable require-jsdoc */
import {
  Follower, Business, User, Notification
} from '../database/models';

export default class Followers {
  static async followUser({ user, params }, res) {
    const followerId = user.id;
    const followerUsername = user.username;
    const { userId } = params;
    try {
      const [addedFollower, created] = await Follower
        .findOrCreate({ where: { followerId, userId } });
      if (created) {
        const createdNotificatons = await Notification
          .create({
            userId,
            title: `${followerUsername} follows you`,
            message: `${followerUsername} is now following you`,
          });
        return res.status(201).json({
          success: true,
          message: `you are now following ${userId}`,
          addedFollower,
          isFollowing: true,
          notification: createdNotificatons
        });
      }
      return res.status(409).json({
        success: false,
        message: `You are already following ${userId}!`
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error following user',
        error
      });
    }
  }
}
