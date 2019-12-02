
/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';
import bcryptjs from 'bcryptjs';
import { User,Notification } from '../database/models';
import {
  validateUser,
} from '../middleware/validator';

const { Op } = Sequelize;
export default class Users {
  static async signup(req, res) {
    const {
      fullname,
      username,
      password,
      email
    } = req.body;
    const signUpError = validateUser({
      fullname,
      username,
      password,
      email
    });
    if (signUpError) {
      return res.status(400).json({
        success: false,
        message: signUpError
      });
    }
    try {
      const userFound = await User
        .findOne({
          attributes: ['email', 'username'],
          where: {
            [Op.or]: [{
              username: {
                [Op.iLike]: username
              }
            }, {
              email: {
                [Op.iLike]: email
              }
            }]
          }
        });
      if (userFound) {
        let field;
        if (userFound.username.toUpperCase() === username.toUpperCase()) {
          field = 'Username';
        } else {
          field = 'Email';
        }
        return res.status(401).json({
          success: false,
          message: `${field} already taken!`
        });
      }

      const passwordHash = bcryptjs.hashSync(password, 10);
      const createdUser = await User.create({
        fullname,
        username,
        email,
        password: passwordHash
      });
      // Create token for the user

      const token = jwt.sign({
        id:createdUser.id,
        email:createdUser.email,
        username:createdUser.username,
      },
      'process.env.JWT_SECRET', {
        expiresIn: '24h',
      });
      const newNotification = await Notification
            .create({
              userId: createdUser.id,
              title: 'Welcome to Biz-link',
              message: `Hello ${createdUser.fullname}, I am very delighted to welcome you as a new member of my Web App. I hope you will enjoy the app. Have fun. 😉`,
            })
      return res.status(201).json({
        createdUser,
        success: true,
        message: 'New user created/token generated!',
        token,
        newNotification
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
