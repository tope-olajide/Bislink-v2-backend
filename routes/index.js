import express from 'express';
import user from './user';

const routes = express.Router();

routes.use('/user', user);

export default routes;
