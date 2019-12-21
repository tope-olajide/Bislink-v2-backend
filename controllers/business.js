/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
import Sequelize from 'sequelize';
import BusinessSearch from './searchBusiness';
import {
  Business,
  User,
  Follower,
  Followee,
  Favourite,
  Notification,
  Gallery
} from '../database/models';
import {
  validateBusiness
} from '../middleware/validator';
import
{ validateUserRight }
  from '../middleware/userValidator';

const { Op } = Sequelize;
const uploadBusinessImage = async (userId, businessId, stringifiedImageUrl) => {
  const parsedImageArray = JSON.parse(stringifiedImageUrl);
  const createImageGallery = parsedImageArray.map((userImage) => ({
    userId,
    businessId,
    imageId: userImage.imageId,
    imageUrl: userImage.imageUrl
  }));
  try {
    const createdGallery = await Gallery.bulkCreate(createImageGallery);
    return ({
      success: true,
      message: 'Image uploaded successfully',
      createdGallery
    });
  } catch (error) {
    return ({
      success: false,
      message: 'An error occured',
      error
    });
  }
};
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
        userId
      });
      if (createdBusiness) {
        const businessId = createdBusiness.id;
        if (businessImageUrl) {
          const imageUpload = await uploadBusinessImage(userId, businessId, businessImageUrl);
          if (imageUpload.success) {
            const defaultBusinessImageUrl = imageUpload.createdGallery[0].imageUrl;
            await createdBusiness.update({
              defaultBusinessImageUrl
            });
            res.status(201).json({
              success: true,
              message: 'New Business created',
              createdBusiness,
              userId,
              createdGallery: imageUpload.createdGallery
            });
          }
          return res.status(500).json({
            success: false,
            message: 'Unable to save image url',
          });
        }
        return res.status(201).json({
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
      phoneNumber,
      website,
      category,
      businessDescription,
      stringifiedImageUrl,
      foundBusiness
    }) => {
      const modifiedBusiness = await foundBusiness.update({
        businessName,
        tagline,
        businessAddress,
        phoneNumber,
        website,
        category,
        businessDescription,
        stringifiedImageUrl
      });
      const favouriteUserIds = await Favourite
        .findAll({
          where: {
            businessId
          },
          attributes: ['userId']
        });
      if (!favouriteUserIds.length) {
        if (stringifiedImageUrl) {
          const imageUpload = await uploadBusinessImage(userId, businessId, stringifiedImageUrl);
          if (imageUpload.success) {
            res.status(200).json({
              success: true,
              message: 'Business record updated successfully',
              modifiedBusiness,
              userId: user.id,
              imageUpload
            });
          }
          return res.status(500).json({
            success: false,
            message: 'Unable to save image url',
          });
        }
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
      if (stringifiedImageUrl) {
        const imageUpload = await uploadBusinessImage(userId, businessId, stringifiedImageUrl);
        if (imageUpload.success) {
          res.status(200).json({
            success: true,
            message: 'Business record updated successfully',
            modifiedBusiness,
            notifyUsers,
            createdNotifications,
            userId: user.id,
            imageUpload
          });
        }
        return res.status(500).json({
          success: false,
          message: 'Unable to save image url',
        });
      }
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
      stringifiedImageUrl
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
          stringifiedImageUrl,
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
          stringifiedImageUrl,
          foundBusiness
        });
      }
    }
    return res.status(400).json(isUser);
  }

  static async deleteBusiness({
    params,
    user
  }, res) {
    const {
      businessId
    } = params;
    try {
      const isUser = await validateUserRight(businessId, user.id);
      if (isUser.success) {
        const { businessFound } = isUser;
        const removedBusiness = await businessFound.destroy();
        return res.status(200).json({
          success: true,
          message: 'Business Deleted!',
          removedBusiness
        });
      }
      return res.status(isUser.status).json(isUser);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting business',
        error
      });
    }
  }

  static async getUserBusiness({
    user,
  }, res) {
    const userId = user.id;
    try {
      const business = await Business
        .findAll({
          where: {
            userId
          },
          include: [{
            model: User,
            attributes: ['fullname', 'username', 'updatedAt']
          }]
        });
      if (business.length < 1) {
        return res.status(204).json({
          success: true,
          message: 'You currently do not have any business',
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Operation Successful',
        business
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Unable to get user business',
        error
      });
    }
  }

  static async getAllBusinesses(req, res) {
    const limit = Number(req.query.limit) || 9;
    const currentPage = Number(req.query.page) || 1;
    const offset = (currentPage - 1) * limit;
    try {
      const businesses = await Business
        .findAndCountAll({
          include: [{
            model: User,
            attributes: ['fullname']
          }, ],
          limit,
          offset
        });
      const totalPages = businesses.count;
      if (businesses.rows.length < 1) {
        return res.status(204).json({
          success: true,
          message: 'Nothing found!',
          businesses: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'business(es) found!',
        businesses: businesses.rows,
        totalPages
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching all businesses',
      });
    }
  }

  static async getBusinessDetails({ params, user }, res) {
    const userId = user.id;
    const {
      businessId
    } = params;
    if (isNaN(businessId)) {
      res.status(422).json({
        success: false,
        message: 'Invalid Business ID'
      });
    }
    try {
      const otherInfo = {};
      const businessFound = await Business
        .findOne({
          where: {
            id: businessId
          },
          include: [{
            model: User,
            attributes: ['id', 'username', 'location', 'imageUrl', 'about']
          }]
        });
      if (!businessFound) {
        res.status(404).json({
          success: true,
          message: 'Business does not exist!'
        });
      }
      const business = await businessFound.increment('viewCount');
      if (userId === business.User.id) {
        otherInfo.isBusinessOwner = true;
      } else {
        otherInfo.isBusinessOwner = false;
      }
      const businessCount = await Business.count({
        where: {
          userId: business.User.id
        }
      });
      otherInfo.businessCount = businessCount;
      const followersCount = await Follower.count({
        where: {
          userId: business.User.id
        }
      });
      otherInfo.followersCount = followersCount;
      const followeesCount = await Followee.count({
        where: {
          userId: business.User.id
        }
      });
      otherInfo.followeesCount = followeesCount;
      const favourites = await Favourite
        .findOne({
          where: {
            userId,
            businessId
          }
        });
      if (favourites) {
        otherInfo.isUserFavourite = true;
      } else {
        otherInfo.isUserFavourite = false;
      }
      const isFollowing = await Follower
        .findOne({
          where: {
            userId: business.User.id,
            followerId: userId
          }
        });
      if (isFollowing) {
        otherInfo.isFollowing = true;
      } else {
        otherInfo.isFollowing = false;
      }
      res.status(200).json({
        success: true,
        message: 'business found',
        business,
        otherInfo
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching business details',
        error
      });
    }
  }

  static async searchForBusinesses(req, res) {
    if (req.query.sort === 'popular') {
      BusinessSearch.sortByMostPopular(req, res);
    } else if (req.query.sort === 'recent') {
      BusinessSearch.sortByMostRecent(req, res);
    } else if (!req.query.name || req.query.name === ' ') {
      BusinessSearch.searchAllLocation(req, res);
    } else if (!req.query.location) {
      BusinessSearch.searchBusinessName(req, res);
    } else {
      BusinessSearch.searchBusinessInLocation(req, res);
    }
  }
}
