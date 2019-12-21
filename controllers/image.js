/* eslint-disable require-jsdoc */
import {
  Gallery
} from '../database/models';

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
}
