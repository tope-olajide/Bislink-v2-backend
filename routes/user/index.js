import express from 'express';
import User from '../../controllers/user';
import Businesses from '../../controllers/business';
import Favourite from '../../controllers/favourite';
import Follower from '../../controllers/follow';
import Auth from '../../middleware/auth';
import Notifications from '../../controllers/notification';

const user = express.Router();
user.post('/signup', User.signup);
user.post('/signin', User.signIn);

user.use('*', Auth.verify);
user.put('/profile', User.modifyUser);
user.get('/profile', User.getUser);
user.put('/change-password', User.changePassword);
user.get('/businesses', Businesses.getUserBusiness);
user
  .route('/favourite/:businessId')
  .post(Favourite.addToFavourite)
  .delete(Favourite.removeFromFavourites);
user.get('/followee', Follower.fetchAllFollowees);

user.get('/follower', Follower.fetchAllFollowers);

user.get('/favourites', Favourite.getFavBusinesses);
user
  .route('/follow/:userId')
  .post(Follower.followUser)
  .delete(Follower.unFollowUser);

user.get('/notifications/all', Notifications.getAllNotifications);
user.get('/notifications/seen', Notifications.getReadNotifications);
user.get('/notifications/:notificationId', Notifications.viewNotification);
user.delete('/notifications/:notificationId', Notifications.deleteNotification);
user.get('/notifications', Notifications.getUnreadNotifications);
user.put('/notifications', Notifications.markAllUnreadNotificationsAsRead);
user.get('/notifications/new-notifications-count', Notifications.getUnreadNotificationCount);


export default user;
