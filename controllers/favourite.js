/* eslint-disable require-jsdoc */
import Sequelize from 'sequelize';
import {
  Favourite, Business, User, Notification
} from '../database/models';

const { Op } = Sequelize;
export default class Favourites {
  static async addToFavourite({ user, params }, res) {
    const userId = user.id;
    const { businessId } = params;
    if (isNaN(businessId)) {
      res.status(401).json({
        success: false,
        message: 'Invalid Business ID'
      });
    }
    try {
      const [addedBusiness, created] = await Favourite
        .findOrCreate({ where: { userId, businessId } });
      if (created) {
        const business = await Business
          .findOne({
            where: { id: businessId }
          });
        await Notification
          .create({
            userId: business.userId,
            title: `${user.username} has added your business to his/her favourite`,
            message: `${user.username} has added your business named: ${business.businessName} to his/her favourite business collection`,
          });
        return res.status(201).json({
          success: true,
          message: `Business with id: ${businessId} added to favourites!`,
          addedBusiness,
          isFavourite: true
        });
      }
      return res.status(409).json({
        success: false,
        message: `Business with id: ${businessId} Already added!`
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error Adding Business to Favourites',
        error
      });
    }
  }

  static async removeFromFavourites({ params, user }, res) {
    const { businessId } = params;
    if (isNaN(businessId)) {
      res.status(401).json({
        success: false,
        message: 'Invalid Business ID'
      });
    }
    const userId = user.id;
    try {
      await Favourite
        .destroy({
          where: {
            [Op.and]: [
              { userId },
              { businessId }
            ]
          },
        });
      res.status(200).json({
        success: true,
        message: `Business with ID: ${businessId} Removed from Favourites`,
        isFavourite: false
      });
    } catch (error) {
      res.status(200).json({
        success: true,
        message: `Business with ID: ${businessId} Removed from Favourites`,
        isFavourite: false
      });
    }
  }
}
