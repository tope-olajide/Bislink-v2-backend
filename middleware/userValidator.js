import { Business, } from '../database/models';

const validateUserRight = async (businessId, userId) => {
  try {
    const businessFound = await Business.findOne({
      where: {
        id: businessId
      },
    });
    if (!businessFound) {
      return {
        success: false,
        status: 404,
        message: 'Business does not exist!'
      };
    }
    if (Number(businessFound.userId) !== Number(userId)) {
      return {
        success: false,
        status: 401,
        message: 'You cannot modify a business not created by You!'
      };
    }
    return {
      success: true,
      businessFound
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: 'Error verifying business owner'
    };
  }
};
export default validateUserRight;
