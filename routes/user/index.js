import express from 'express';
import User from '../../controllers/user'
import Auth from '../../middleware/auth';

const user = express.Router();
user.post('/signup', User.signup);
user.post('/signin', User.signIn);

user.use('*', Auth.verify);
user.put('/profile', User.modifyUser);
export default user;
