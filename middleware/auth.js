import jasonwebtoken from 'jsonwebtoken';

require('dotenv').config();
/**
 * @description - Class Definition for the Authentication
 * using Jason Web Token
 *
 * @export
 *
 * @class Auth
 */
export default class Auth {
  /**
   * @description - Verify JWT token
   *
   * @param {object} req - HTTP Request
   *
   * @param {object} res - HTTP Response
   *
   * @param {function} next - HTTP Next() function
   *
   * @returns {object} this - Class instance
   *
   * @memberof Auth
   */
  static verify(req, res, next) {
    const token = req.body.token
      || req.query.token
      || req.headers.authorization;

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      jasonwebtoken.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Invalid token, please sign in again.'
          });
        }
        if (decoded.exp < new Date().getTime() / 1000) {
          return res.status(401).json({
            success: false,
            message: 'Your session has expired, please sign in again'
          });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided.'
      });
    }
  }
}
