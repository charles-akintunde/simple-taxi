// utils/jwt.ts

import jwt from 'jsonwebtoken';

const SECRET_KEY = 'yourSecretKey';  

export const generateToken = (driverId: string): string => {
    return jwt.sign({ id: driverId }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};
