import express from 'express';
import User from '../../controllers/user';
import Businesses from '../../controllers/business';
import Favourite from '../../controllers/favourite';
import Follower from '../../controllers/follow';
import Auth from '../../middleware/auth';

const user = express.Router();
user.post('/signup', User.signup);
user.post('/signin', User.signIn);

user.use('*', Auth.verify);
user.put('/profile', User.modifyUser);
user.put('/change-password', User.changePassword);
user.get('/businesses', Businesses.getUserBusiness); 
 user
  .route('/favourite/:businessId')
  .post(Favourite.addToFavourite)
  .delete(Favourite.removeFromFavourites)
user.get('/followee', Follower.fetchAllFollowees);

user.get('/follower', Follower.fetchAllFollowers);

user.get('/favourites', Favourite.getFavBusinesses);
user
  .route('/follow/:userId')
  .post(Follower.followUser)
  .delete(Follower.unFollowUser);




export default user;
