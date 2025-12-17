import express from 'express';
import { getRating } from '../controllers/ratingController.js';

const ratingRouter = express.Router();

ratingRouter.get('/', getRating);

export default ratingRouter;