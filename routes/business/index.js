import express from 'express';

import Businesses from '../../controllers/business';
import Reviews from '../../controllers/review';
import Auth from '../../middleware/auth';

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
  .route('/:businessId/reviews')
  .post(Reviews.postReview)
  .get(Reviews.getBusinessReviews);
export default business;
