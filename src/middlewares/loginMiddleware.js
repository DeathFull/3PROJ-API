import jwt from "jsonwebtoken";

export function loginMiddleware(req, res, next) {
  if (req.headers.authorization === undefined)
    return res.status(401).json("no authorization header provided");

  const token = req.headers.authorization.split(" ")[1];

  if (token === null || !token) {
    return res.status(401).json("no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json("Unauthorized");
  }
}
