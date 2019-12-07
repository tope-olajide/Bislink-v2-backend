/* eslint-disable require-jsdoc */

import {
  Review,
  Business,
  Notification,
  User
} from '../database/models';
import {
  validateReview
} from '../middleware/validator';

export default class Reviews {
  static async postReview({
    user,
    params,
    body
  }, res) {
    const userId = user.id;
    const {
      businessId
    } = params;
    const { title } = body;
    const { content } = body;
    const validateReviewError = validateReview({
      title,
      content
    });
    if (validateReviewError) {
      return res.status(400).json({
        success: false,
        message: validateReviewError
      });
    }
    try {
      const createdReview = await Review
        .create({
          title,
          content,
          userId,
          businessId
        });
      const businessModel = await Business
        .findOne({
          where: {
            id: businessId
          }
        });
      const business = await businessModel.increment('reviewCount');
      /* Filters the sender out, the business owner should not recieve notification when he/she review his/her own business */
      if (userId !== business.userId) {
        Notification
          .create({
            userId: business.userId,
            title: `${user.username} has reviewed one of your businesses`,
            message: `${user.username} has added a review to one of your business titled: '${business.businessName}'`,
          });
      }
      const reviews = await Review
        .findOne({
          where: {
            id: createdReview.id
          },
          include: [{
            model: User,
            attributes: ['username', 'ImageUrl']
          }],
          order: [
            ['id', 'DESC']
          ]
        });
      return res.status(201).json({
        success: true,
        message: 'New review created',
        reviews,
        reviewer: createdReview.id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error Creating review',
        error
      });
    }
  }
}
