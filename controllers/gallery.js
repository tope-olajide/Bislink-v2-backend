/* eslint-disable require-jsdoc */
import cloudinary from 'cloudinary';
import {
  Gallery, Business
} from '../database/models';

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
const bizImage = [{ imageId: 'wieaj23ue21', imageUrl: 'www.wwww' }, { imageId: 'jebsghcte23', imageUrl: 'hthhkdueusdw' }];
export default class Image {
  static async uploadImage({ user, body }, res) {
    /*     const {
      stringifiedImageUrl,
    } = body; */
    const stringifiedImageUrl = JSON.stringify(bizImage);
    const parsedImageArray = JSON.parse(stringifiedImageUrl);
    const imageGalleryWithUserId = parsedImageArray.map((userImage) => ({
      userId: user.id,
      imageId: userImage.imageId,
      imageUrl: userImage.imageUrl
    }));
    try {
      const createdGallery = await Gallery.bulkCreate(imageGalleryWithUserId);
      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        createdGallery
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occured',
        error
      });
    }
  }

  static async fetchBusinessPictures({
    params,
  }, res) {
    const {
      businessId
    } = params;
    try {
      const businessPictures = await Gallery
        .findAll({
          where: {
            businessId
          }
        });
      if (businessPictures) {
        res.status(200).json({
          success: true,
          message: 'Business Pictures Found',
          businessPictures
        });
      } else {
        res.status(204).json({
          success: true,
          message: 'No Business Picture Found',
          businessPictures: []
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'unable to fetch pictures',
        error
      });
    }
  }

  static async deleteBusinessImage({
    params,
    user
  }, res) {
    const {
      businessImageId
    } = params;
    try {
      const businessImage = await Gallery.findOne({
        where: {
          id: businessImageId
        }
      });
      if (businessImage.userId === user.id) {
        await businessImage.destroy();
        cloudinary.v2.uploader.destroy(businessImage.imageId, (error, result) => {
          console.log(result, error);
        });
        const businessPictures = await Gallery
          .findAll({
            where: {
              businessId: businessImage.businessId
            }
          });
        res.status(200).json({
          success: true,
          message: 'Business Pictures Found',
          businessPictures
        });
      }
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to delete this picture!'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'unable to fetch pictures',
        error
      });
    }
  }

  static async setDefaultBusinessImage({
    params,
    query,
    user
  }, res) {
    const {
      businessImageUrl
    } = query;
    const {
      businessId
    } = params;
    try {
      const business = await Business
        .findOne({
          where: {
            id: businessId
          }
        });
      const defaultBusinessImage = await business.update({
        defaultBusinessImageUrl: businessImageUrl
      });
      res.status(201).json({
        success: true,
        message: 'New Business created',
        defaultBusinessImage
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'unable to set default business picture',
        error
      });
    }
  }
}
