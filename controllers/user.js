
/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';
import bcryptjs from 'bcryptjs';
import { User, Notification,  Business,
  Favourite,
  Follower  } from '../database/models';
import {
  validateUser, validateModifiedUser
} from '../middleware/validator';

require('dotenv').config();


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
      process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
      const newNotification = await Notification
        .create({
          userId: createdUser.id,
          title: 'Welcome to Biz-link',
          message: `Hello ${createdUser.fullname}, I am very happy to welcome you as the newest member of my Web App. I hope you will enjoy the app. Have fun. 😉`,
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
        process.env.JWT_SECRET, {
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

  static async modifyUser({ body, user }, res) {
    const userId = user.id;
    const { username } = user;
    const {
      fullname,
      email,
      phoneNumber,
      location,
      about,
      imageUrl,
    } = body;
    const userDetailsError = validateModifiedUser({
      fullname,
      email
    });
    if (userDetailsError) {
      return res.status(400).json({
        success: false,
        message: userDetailsError
      });
    } try {
      const confirmedUser = await User.findOne({
        where: {
          id: userId
        },
      });
      if (!confirmedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      const foundUser = await User.findOne({
        where: {
          email
        },
      });
      if (foundUser) {
        if (foundUser.id !== userId) {
          return res.status(409).json({
            success: false,
            message: 'Email address already taken'
          });
        }
      }

      const updatedUser = await foundUser.update({
        fullname,
        email,
        phoneNumber,
        location,
        about,
        imageUrl: imageUrl || foundUser.imageUrl,
      });
      const {
        id
      } = updatedUser;
      const token = jwt.sign({
        id,
        username,
        email: updatedUser.email,
      },
      process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(200).json({
        success: true,
        message: 'User record updated',
        updatedUser,
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error Updating user's profile",
        error
      });
    }
  }

  static async changePassword({
    body,
    user
  }, res) {
    const { id } = user;
    const {
      oldPassword,
      newPassword
    } = body;

    if (newPassword.trim().length === 0 || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 5 characters!'
      });
    }

    const password = bcryptjs.hashSync(newPassword, 10);
    const userFound = await User
      .findOne({
        attributes: ['id', 'password'],
        where: {
          id
        }
      });
    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist!'
      });
    }
    if (!bcryptjs.compareSync(oldPassword, userFound.password)) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Password'
      });
    }
    const newPwd = await userFound.update({
      password
    });
    return res.status(200).json({
      success: true,
      message: 'Password Changed Successfully',
      newPwd
    });
  }

  static async getUser({
    user
  }, res) {
    const userId = user.id;
    const userFound = await User.findOne({
      attributes: ['id', 'fullname', 'about', 'location', 'phoneNumber', 'username', 'email', 'imageUrl'],
      where: {
        id: userId
      }
    });
    if (!userFound) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      });
    }
    const {
      id,
      fullname,
      about,
      location,
      username,
      email,
      imageUrl,
      phoneNumber
    } = userFound;
    const userInfo = {
      userId: id,
      fullname,
      about,
      location,
      username,
      email,
      imageUrl,
      phoneNumber
    };
    try {
      const businesses = await Business.findAndCountAll({
        where: {
          userId
        } 
});
      userInfo.myBusinesses = businesses.rows;
      userInfo.myBusinessCount = businesses.count;
      const favourites = await Favourite.findAll({
        where: {
          userId
        },
      });
      const favouriteBusinessIds = favourites.map((favourite) => favourite.businessId);
      const favouriteBusinesses = await Business.findAll({
        where: { id: favouriteBusinessIds },
      });
      userInfo.myFavourites = favouriteBusinesses;
      const followers = await Follower.findAndCountAll({
        where: {
          followerId: userId
        },
      });
      userInfo.myFollowers = followers.rows;
      userInfo.myFollowersCount = followers.count;
      const followees = await Follower.findAndCountAll({
        where: {
          userId
        }
      });
      userInfo.myFollowees = followees.rows;
      userInfo.myFolloweesCount = followees.count;
      return res.status(200).json({
        success: true,
        message: 'User found!',
        user: userInfo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user's profile"
      });
    }
  }
}
