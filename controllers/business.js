/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
import Sequelize from 'sequelize';
import {
  Business,
  User,
  Follower,
  Favourite,
  Notification
} from '../database/models';
import {
  validateBusiness
} from '../middleware/validator';

const { Op } = Sequelize;
const isBusinessNamePicked = async (userId, businessName) => {
  const business = await Business
    .findOne({
      where: {
        userId,
        businessName: {
          [Op.iLike]: businessName
        }
      }
    });
  if (business) {
    return true;
  }
  return false;
};

export default class Businesses {
  static async createNewBusiness({
    user,
    body
  }, res) {
    const userId = user.id;
    const {
      businessName,
      tagline,
      businessAddress,
      phoneNumber,
      website,
      category,
      businessDescription,
      businessImageUrl
    } = body;
    try {
      const isBussinessPicked = await isBusinessNamePicked(userId, businessName);
      if (isBussinessPicked) {
        return res.status(409).json({
          success: false,
          message: 'This business exist already'
        });
      }
      const validateBusinessError = validateBusiness({
        businessName,
        businessAddress,
        businessDescription,
        phoneNumber,
      });
      if (validateBusinessError) {
        return res.status(400).json({
          success: false,
          message: validateBusinessError
        });
      }
      const createdBusiness = await Business.create({
        businessName,
        tagline,
        businessAddress,
        phoneNumber,
        website,
        category,
        businessDescription,
        userId,
        businessImageUrl
      });
      if (createdBusiness) {
        res.status(201).json({
          success: true,
          message: 'New Business created',
          createdBusiness,
          userId
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error creating business',
        error
      });
    }
  }
}
