import express from 'express';
import User from '../../controllers/user'

const user = express.Router();
user.post('/signup', User.signup);

export default user;