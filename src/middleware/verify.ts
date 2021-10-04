import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

const signingKey = process.env.SIGNING_KEY || 'secret';

export const verify: RequestHandler = (req, res, next) => {
  // const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, signingKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const auth2 = () => {};
