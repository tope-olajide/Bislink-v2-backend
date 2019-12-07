/* eslint-disable require-jsdoc */
import Sequelize from 'sequelize';
import {
  Follower, Business, User, Notification
} from '../database/models';

const Op = [Sequelize];
export default class Followers {
  static async followUser({ user, params }, res) {
    const followerId = user.id;
    const followerUsername = user.username;
    const { userId } = params;

    try {
      if (userId === followerId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot follow yourself!'
        });
      }
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

  static async unFollowUser({ params, user }, res) {
    const followerId = user.id;
    /* const followerUsername = user.username; */
    const { userId } = params;
    if (userId == followerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot unfollow yourself!'
      });
    }
    try {
      const status = await Follower
        .destroy({ where: { followerId, userId } });
      if (status === 1) {
        /*       await Notification
      .create({
        userId,
        title: `${followerUsername} unfollowed you`,
        message: `${followerUsername} has unfollowed you`,
      }) */
        return res.status(200).json({
          success: true,
          message: `you have unfollowed ${userId}`,
          isFollowing: false
        });
      }
      return res.status(409).json({
        success: false,
        message: `you are not following ${userId}`,
        isFollowing: false
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error unfollowing user',
        error
      });
    }
  }

  static async fetchAllFollowers({ user }, res) {
    const userId = user.id;
    try {
      const followers = await Follower
        .findAll({
          where: { userId },
          attributes: ['userId']
        });
      if (followers.length < 1) {
        return res.status(204).json({
          success: true,
          message: 'Nothing found!',
          followers: []
        });
      }
      const ids = followers.map((follower) => follower.userId);

      const userFollowers = await User.findAll({
        attributes: ['fullname'],
        where: { id: ids }

      });
      return res.status(200).json({
        success: true,
        message: 'Followers found',
        userFollowers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Followers'
      });
    }
  }

  static async fetchAllFollowees({ user }, res) {
    const userId = user.id;
    try {
      const followees = await Follower
        .findAll({
          where: { followerId: userId },
          attributes: ['userId']
        });
      if (followees.length < 1) {
        return res.status(204).json({
          success: true,
          message: 'Nothing found!',
          followers: []
        });
      }
      const ids = followees.map((follower) => follower.userId);

      const userFollowees = await User.findAll({
        attributes: ['fullname'],
        where: { id: ids }

      });
      return res.status(200).json({
        success: true,
        message: 'Followees found',
        userFollowees
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Followees'
      });
    }
  }
}
