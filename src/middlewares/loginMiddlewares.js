import jwt from "jsonwebtoken";

export function loginMiddlewares(res, req, next) {
  const token = req.cookies.authorization;

  if (!token) {
    return res.status(401).json('no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_LOG);


    next();
  } catch (error) {
    return res.status(401).json('Unauthorized');
  }
}