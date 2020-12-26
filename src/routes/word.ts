import { Router, RequestHandler } from 'express';
import wordMongooseModel from '../mongoose/model/word';
import listMongooseModel from '../mongoose/model/list';
import userMongooseModel from '../mongoose/model/userList';
const router = Router();

const getWords: RequestHandler = async (req, res, next) => {
  const result = await wordMongooseModel.find().exec().catch(next);
  res.status(200).json(result);
};

const getLists: RequestHandler = async (req, res, next) => {
  const result = await listMongooseModel.find().exec().catch(next);
  res.status(200).json(result);
};

const getUserLists: RequestHandler = async (req, res, next) => {
  const result = await userMongooseModel.find().exec().catch(next);
  res.status(200).json(result);
};
router.get('/getwords', getWords);
router.get('/getlists', getLists);
router.get('/getuserlists', getUserLists);

export default router;
