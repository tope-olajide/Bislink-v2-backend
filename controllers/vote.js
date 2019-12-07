/* eslint-disable require-jsdoc */
import Sequelize from 'sequelize';
import {
  Upvote,
  Downvote,
  Business,
  User, Notification
} from '../database/models';

const Op = [Sequelize];
export default class Vote {
  static async upvoteBusiness({ user, params }, res) {
    const userId = user.id;
    const {
      businessId
    } = params;
    try {
      const response = await Downvote
        .destroy({
          where: {
            userId,
            businessId
          }
        });
      if (response === 1) {
        const businessModel = await Business
          .findOne({
            where: {
              id: businessId
            }
          });
        await businessModel.decrement('downvotes');
      }

      // eslint-disable-next-line no-unused-vars
      const [createdVote, created] = await Upvote
        .findOrCreate({
          where: {
            userId,
            businessId
          }
        });
      if (created) {
        const businessModel = await Business
          .findOne({
            where: {
              id: businessId
            }
          });
        await businessModel.increment('upvotes');
        const business = await businessModel.reload();
        const {
          businessName,
          upvotes,
          downvotes
        } = business;
        const businessOwner = business.userId;
        await Notification
          .create({
            userId: businessOwner,
            title: 'Your business has been upvoted ',
            message: `One of your business named: ${businessName} has been upvoted by ${user.id}`,
          });
        return res.status(201).json({
          success: true,
          message: `Business with id: ${businessId} Upvoted!`,
          business: {
            upvotes,
            downvotes
          }
        });
      }

      return res.status(409).json({
        success: false,
        message: 'Business already Upvoted!'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occured',
        error
      });
    }
  }

  static async downvoteBusiness({ user, params }, res) {
    const userId = user.id;
    const {
      businessId
    } = params;
    try {
      const response = await Upvote
        .destroy({
          where: {
            userId,
            businessId
          }
        });
      if (response === 1) {
        const businessModel = await Business
          .findOne({
            where: {
              id: businessId
            }
          });
        await businessModel.decrement('upvotes');
      }
      // eslint-disable-next-line no-unused-vars
      const [createdVote, created] = await Downvote
        .findOrCreate({
          where: {
            userId,
            businessId
          }
        });
      if (created) {
        const businessModel = await Business
          .findOne({
            where: {
              id: businessId
            }
          });
        await businessModel.increment('downvotes');
        const business = await businessModel.reload();
        const {
          businessName,
          upvotes,
          downvotes
        } = business;
        const businessOwner = business.userId;
        await Notification
          .create({
            userId: businessOwner,
            title: 'Your business has been Downvoted',
            message: `One of your businesses named: ${businessName} has been Downvoted by ${user.id}`,
          });
        return res.status(201).json({
          success: true,
          message: `Business with id: ${businessId} Downvoted!`,
          business: {
            upvotes,
            downvotes
          }
        });
      }

      return res.status(409).json({
        success: false,
        message: 'Business already Downvoted!'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occured',
        error
      });
    }
  }

  static async getBusinessUpvotes({
    params
  }, res) {
    const {
      businessId
    } = params;
    try {
      const votes = await Upvote
        .findAll({
          attributes: ['businessId'],
          where: {
            businessId
          },
          include: [{
            model: User,
            attributes: ['fullname', 'id']
          }]
        });
      if (votes.length === 0) {
        return res.status(204).json({
          success: true,
          message: 'Nothing found!',
          votes: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'User upvotes found',
        votes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching upvotes',
        error
      });
    }
  }

  static async getBusinessDownvotes({
    params
  }, res) {
    const {
      businessId
    } = params;
    try {
      const votes = await Downvote
        .findAll({
          attributes: ['businessId'],
          where: {
            businessId
          },
          include: [{
            model: User,
            attributes: ['fullname', 'id']
          }]
        });
      if (votes.length === 0) {
        return res.status(204).json({
          success: true,
          message: 'Nothing found!',
          votes: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'User donwvotes found',
        votes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching upvotes',
        error
      });
    }
  }
}
