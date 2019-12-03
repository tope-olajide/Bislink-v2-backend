import express from 'express';
import user from './user';
import businesses from './business';

const routes = express.Router();

routes.use('/user', user);
routes.use('/business', businesses);

export default routes;
