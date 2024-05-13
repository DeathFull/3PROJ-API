import jwt from "jsonwebtoken";

export function loginMiddleware(res, req, next) {
  const token = window.localStorage.getItem("token");

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
