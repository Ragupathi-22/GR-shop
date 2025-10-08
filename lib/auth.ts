import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.WP_JWT_SECRET!); 
  } catch (err) {
    return null;
  }
};
