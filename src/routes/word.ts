import { Router, RequestHandler } from 'express';
import wordMongooseModel from '../mongoose/model/word';
import listMongooseModel from '../mongoose/model/list';
import userMongooseModel from '../mongoose/model/userList';
const router = Router();

const getWords: RequestHandler = async (req, res, next) => {
  const result = await wordMongooseModel.find().exec().catch(next);
  res.status(200).json(result);
};

const getWordsCount: RequestHandler = (req, res, next) => {
  wordMongooseModel.countDocuments((err: any, count: number) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json(count);
    }
  });
};

const getLists: RequestHandler = async (req, res, next) => {
  const result = await listMongooseModel.find().exec().catch(next);
  res.status(200).json(result);
};

const getUserLists: RequestHandler = async (req, res, next) => {
  const result = await userMongooseModel.find(req.query).exec().catch(next);
  res.status(200).json(result);
};

const getUserListsDistinct: RequestHandler = (req, res, next) => {
  if (!req.query.distinctfield) {
    next(
      new Error(
        'No distinct field provided.  Add a query parameter. Ex. (?distinctfield=email)',
      ),
    );
  }

  const { distinctfield, ...filter } = req.query;

  userMongooseModel.distinct(
    req.query.distinctfield as string,
    filter,
    (dErr: any, dRes: any[]) => {
      if (dErr) {
        next(dErr);
      } else {
        res.status(200).json(dRes);
      }
    },
  );
};

router.get('/getwords', getWords);
router.get('/getwordsCount', getWordsCount);
router.get('/getlists', getLists);
router.get('/getuserlists', getUserLists);
router.get('/getUserListsDistinct', getUserListsDistinct);

export default router;
