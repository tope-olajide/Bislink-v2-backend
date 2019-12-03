
/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';
import bcryptjs from 'bcryptjs';
import { User, Notification } from '../database/models';
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
      const token = jwt.sign({
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
      'process.env.JWT_SECRET', {
        expiresIn: '24h',
      });
      const newNotification = await Notification
        .create({
          userId: createdUser.id,
          title: 'Welcome to Biz-link',
          message: `Hello ${createdUser.fullname}, I am very delighted to welcome you as a new member of my Web App. I hope you will enjoy the app. Have fun. 😉`,
        });
      return res.status(201).json({
        createdUser,
        success: true,
        message: 'You account has been created successfully',
        token,
        newNotification
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async signIn(req, res) {
    const { usernameOrEmail } = req.body;
    const { password } = req.body;
    try {
      const userFound = await User
        .findOne({
          attributes: ['id', 'fullname', 'username', 'email', 'password'],
          where: {
            [Op.or]: [{
              username: {
                [Op.iLike]: usernameOrEmail
              }
            }, {
              email: {
                [Op.iLike]: usernameOrEmail
              }
            }]
          }
        });
      if (!userFound) {
        return res.status(401).json({
          success: false,
          message: 'Invalid login Details!'
        });
      }
       if (bcryptjs.compareSync(password, userFound.password)) {
        const {
          id,
          username,
          email
        } = userFound;
        const token = jwt.sign({
          id,
          username,
          email,
        },
        'process.env.JWT_SECRET', {
          expiresIn: '24h',
        });
        return res.status(200).json({
          status: 'success',
          message: 'Login successfully',
          token,
        });
      } 
      res.status(401).json({
        success: false,
        message: 'Invalid login Details!'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occured',
        error
      });
    }
  }
}
