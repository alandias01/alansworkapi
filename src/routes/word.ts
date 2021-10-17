import { Router, RequestHandler } from 'express';
import wordMongooseModel from '../mongoose/model/word';
import listMongooseModel from '../mongoose/model/list';
import userMongooseModel from '../mongoose/model/userList';
import { verify } from '../middleware/verify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signingKey = process.env.SIGNING_KEY || 'secret';

const router = Router();

const userdb: { email: string; password: string }[] = [];
userdb.push({
  email: 'a@a.com',
  password: '$2a$10$1Z7l8WhEvSdZnIag9Z30..JXuNk9Ws5OC.fUar3BvOA3AXDVDWOhO',
});

const createToken = (email: string) => jwt.sign({ email }, signingKey, { expiresIn: '2h' });

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send('email and password are required');
    }

    const emailSanitized = (email as string).toLowerCase();
    const userFound = userdb.find((u) => u.email === emailSanitized);
    if (userFound && (await bcrypt.compare(password, userFound.password))) {
      const token = createToken(emailSanitized);
      res.status(200).json({ token });
    }
    res.status(400).send('Invalid Credentials');
  } catch (error) {
    next(error);
  }
};

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
  const { email } = <{ email: string }>req.user;
  const query = { ...req.query, email };
  userMongooseModel
    .find(query)
    .sort({ word: 1 })
    .exec()
    .then((result) => res.status(200).json(result))
    .catch(next);
};

const getUserListsDistinct: RequestHandler = (req, res, next) => {
  if (!req.query.distinctfield) {
    next(new Error('No distinct field provided.  Add a query parameter. Ex. (?distinctfield=email)'));
  }

  const { distinctfield, ...filter } = req.query;
  const { email } = <{ email: string }>req.user;
  const query = { ...filter, email };

  userMongooseModel.distinct(distinctfield as string, query, (dErr: any, dRes: any[]) => {
    if (dErr) {
      next(dErr);
    } else {
      res.status(200).json(dRes);
    }
  });
};

const getUserListCount: RequestHandler = (req, res, next) => {
  const { email } = <{ email: string }>req.user;
  userMongooseModel
    .aggregate([
      {
        $match: { email },
      },
      {
        $group: {
          _id: '$list',
          count: { $sum: 1 },
        },
      },
    ])
    .exec()
    .then((result: any) => res.status(200).json(result))
    .catch(next);
};

router.post('/login', login);
router.get('/getwords', getWords);
router.get('/getwordsCount', getWordsCount);
router.get('/getlists', getLists);
router.get('/getuserlists', verify, getUserLists);
router.get('/getUserListsDistinct', verify, getUserListsDistinct);
router.get('/getUserListCount', verify, getUserListCount);

export default router;
