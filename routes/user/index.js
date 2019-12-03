import express from 'express';
import User from '../../controllers/user'

const user = express.Router();
user.post('/signup', User.signup);
user.post('/signin', User.signIn);

export default user;