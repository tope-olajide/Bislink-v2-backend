import express from 'express';

import Businesses from '../../controllers/business';
import Auth from '../../middleware/auth';

const business = express.Router();

business.use('*', Auth.verify);
business.route('/')
  .post(Businesses.createNewBusiness)
  .get(Businesses.getAllBusinesses);
business.route('/:businessId')
  .put(Businesses.modifyBusiness)
  .delete(Businesses.deleteBusiness)
  .get(Businesses.getBusinessDetails);
export default business;
