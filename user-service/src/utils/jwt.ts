// utils/jwt.ts

import jwt from 'jsonwebtoken';

const SECRET_KEY = 'SecretKey';  // Store this in an environment variable for security.

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};
