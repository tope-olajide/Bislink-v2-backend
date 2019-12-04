import express from 'express';
import User from '../../controllers/user';
import Businesses from '../../controllers/business';
import Auth from '../../middleware/auth';

const user = express.Router();
user.post('/signup', User.signup);
user.post('/signin', User.signIn);

user.use('*', Auth.verify);
user.put('/profile', User.modifyUser);
user.put('/change-password', User.changePassword);
user.get('/businesses', Businesses.getUserBusiness);
export default user;
