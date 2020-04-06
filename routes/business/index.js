import express from 'express';

import Businesses from '../../controllers/business';
import Reviews from '../../controllers/review';
import Vote from '../../controllers/vote';
import Auth from '../../middleware/auth';
import Gallery from '../../controllers/gallery'


const business = express.Router();

business.use('*', Auth.verify);
business.route('/')
  .post(Businesses.createNewBusiness)
  .get(Businesses.getAllBusinesses);

business.route('/search')
  .get(Businesses.searchForBusinesses);
business.route('/:businessId')
  .put(Businesses.modifyBusiness)
  .delete(Businesses.deleteBusiness)
  .get(Businesses.getBusinessDetails);

  business
  .route('/:businessId/upvotes')
  .post(Vote.upvoteBusiness)
  .get(Vote.getBusinessUpvotes);

  business
  .route('/:businessId/downvotes')
  .post(Vote.downvoteBusiness)
  .get(Vote.getBusinessDownvotes);

business
  .route('/:businessId/reviews')
  .post(Reviews.postReview)
  .get(Reviews.getBusinessReviews);
  business.post('/gallery', Gallery.uploadImage);
  business.get('/:businessId/gallery', Gallery.fetchBusinessPictures);
  business.delete('/:businessImageId/gallery', Gallery.deleteBusinessImage);
  business.put('/:businessId/gallery', Gallery.setDefaultBusinessImage);
export default business;
