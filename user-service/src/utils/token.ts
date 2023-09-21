import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';  
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
};