/* eslint-disable require-jsdoc */
import Sequelize from 'sequelize';
import { Business, User } from '../database/models';

const { Op } = Sequelize;
export default class BusinessSearch {
  static async searchBusinessName({ query }, res) {
    const limit = Number(query.limit) || 9;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;
    const bizName = query.name.split(' ');
    const searchQuery = bizName.map((item) => ({
      businessName: { [Op.iLike]: `%${item}%` }
    }));
    const businesses = await Business
      .findAndCountAll({
        where: { [Op.or]: searchQuery },
        include: [
          { model: User, attributes: ['fullname'] }
        ],
        limit,
        offset
      });
    const totalPages = businesses.count;
    if (businesses.rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: 'Nothing found!',
        businesses: []
      });
    }
    return res.status(200).json({
      success: true,
      message: 'business(es) found!',
      businesses: businesses.rows,
      totalPages
    });
  }

  static async searchBusinessInLocation({ query }, res) {
    const limit = Number(query.limit) || 9;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;

    const bizName = query.name.split(' ');
    const bizLocation = query.location.split(' ');
    const businessNameQuery = bizName.map((item) => ({
      businessName: { [Op.iLike]: `%${item}%` }
    }));
    const businessLocationQuery = bizLocation.map((item) => ({
      businessAddress1: { [Op.iLike]: `%${item}%` }
    }));

    const businesses = await Business
      .findAndCountAll({
        where: { [Op.or]: businessNameQuery.concat(businessLocationQuery) },
        include: [
          { model: User, attributes: ['fullname'] }
        ],
        limit,
        offset
      });
    const totalPages = businesses.count;
    if (businesses.rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: 'Nothing found!',
        businesses: []
      });
    }
    return res.status(200).json({
      success: true,
      message: 'business(es) found!',
      businesses: businesses.rows,
      totalPages
    });
  }

  static async searchAllLocation({ query }, res) {
    const limit = Number(query.limit) || 9;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;
    const bizLocation = query.location.split(' ');
    const businessLocationQuery = bizLocation.map((item) => ({
      businessAddress1: { [Op.iLike]: `%${item}%` }
    }));
    const businesses = await Business
      .findAndCountAll({
        where: { [Op.or]: businessLocationQuery },
        include: [
          { model: User, attributes: ['fullname'] }
        ],
        limit,
        offset
      });
    const totalPages = businesses.count;
    if (businesses.rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: 'Nothing found!',
        businesses: []
      });
    }
    return res.status(200).json({
      success: true,
      message: 'business(es) found!',
      businesses: businesses.rows,
      totalPages
    });
  }

  static async sortByMostRecent({ query }, res) {
    const limit = Number(query.limit) || 9;
    const currentPage = Number(query.page) || 1;
    const offset = (currentPage - 1) * limit;
    const businesses = await Business
      .findAndCountAll({
        include: [{
          model: User,
          attributes: ['fullname']
        }],
        order: [
          ['updatedAt', 'DESC']
        ],
        limit,
        offset
      });
    const totalPages = businesses.count;
    if (businesses.rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: 'Nothing found!',
        businesses: []
      });
    }
    return res.status(200).json({
      success: true,
      message: 'business(es) found!',
      businesses: businesses.rows,
      totalPages
    });
  }

  static async sortByMostPopular(req, res) {
    const limit = Number(req.query.limit) || 9;
    const currentPage = Number(req.query.page) || 1;
    const offset = (currentPage - 1) * limit;
    const businesses = await Business
      .findAndCountAll({
        include: [{
          model: User,
          attributes: ['fullname']
        }],
        order: [
          ['viewCount', 'DESC']
        ],
        limit,
        offset
      });
    const totalPages = businesses.count;
    if (businesses.rows.length < 1) {
      return res.status(404).json({
        success: true,
        message: 'Nothing found!',
        businesses: []
      });
    }
    return res.status(200).json({
      success: true,
      message: 'business(es) found!',
      businesses: businesses.rows,
      totalPages
    });
  }
}
