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
import
validateUserRight
  from '../middleware/userValidator';

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

  static async modifyBusiness({
    params,
    user,
    body
  }, res) {
    const userId = user.id;

    const updateBusiness = async ({
      businessId,
      businessName,
      tagline,
      businessAddress,
      phoneNumber1,
      website,
      category,
      businessDescription,
      businessImageUrl,
      foundBusiness
    }) => {
      const modifiedBusiness = await foundBusiness.update({
        businessName,
        tagline,
        businessAddress,
        phoneNumber1,
        website,
        category,
        businessDescription,
        businessImageUrl
      });
      const favouriteUserIds = await Favourite
        .findAll({
          where: {
            businessId
          },
          attributes: ['userId']
        });
      if (!favouriteUserIds.length) {
        res.status(200).json({
          success: true,
          message: 'Business record updated successfully',
          modifiedBusiness,
          userId: user.id,
        });
      }

      /* Filters the sender out, the user sending the notification should not be among the recievers. */
      const filteredFavouriteUserIds = favouriteUserIds.filter((eachUser) => eachUser.userId !== userId);
      const notifyUsers = filteredFavouriteUserIds.map((eachUser) => ({
        userId: eachUser.userId,
        title: 'One of your favourite businesses has been modified',
        message: `One of your favourite businesses named: ${modifiedBusiness.businessName} has been modified by its owner`
      }));
      const createdNotifications = await Notification.bulkCreate(notifyUsers);
      res.status(200).json({
        success: true,
        message: 'Business record updated successfully',
        modifiedBusiness,
        notifyUsers,
        createdNotifications,
        userId: user.id
      });
    };
    const {
      businessId
    } = params;
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
     const isUser = await validateUserRight(businessId, userId); 
    if (isUser.success) {
      const foundBusiness = isUser.businessFound;
      const validateBusinessError = validateBusiness({
        businessName,
        businessAddress,
        businessDescription,
        phoneNumber
      });
      if (validateBusinessError) {
        return res.status(400).json({
          success: false,
          message: validateBusinessError
        });
      }
      // if business name remain unchanged, no reason to search for duplicate. Just save.
      if (foundBusiness.businessName.toLowerCase() === businessName.toLowerCase()) {
        await updateBusiness({
          businessId,
          businessName,
          tagline,
          businessAddress,
          phoneNumber,
          website,
          category,
          businessDescription,
          businessImageUrl,
          foundBusiness
        });
      }
      // if the new business name is not the same as the old one, then check if the new name has been picked before saving.
      else {
        const isNamePicked = await isBusinessNamePicked(foundBusiness.userId, businessName);
        if (isNamePicked) {
          return res.status(409).json({
            success: false,
            message: 'Business name already picked!'
          });
        } await updateBusiness({
          businessId,
          businessName,
          tagline,
          businessAddress,
          phoneNumber,
          website,
          category,
          businessDescription,
          businessImageUrl,
          foundBusiness
        });
      }
    }
    return res.status(400).json(isUser);
  }
}
