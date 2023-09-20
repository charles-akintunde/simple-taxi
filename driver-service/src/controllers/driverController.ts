// controllers/userController.ts

import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import client from '../database'

export const register = async (req: Request, res: Response) => {
    const hashedPassword = await hashPassword(req.body.password);
    const query = 'INSERT INTO drivers(email, password) VALUES($1, $2) RETURNING id, email';
    const values = [req.body.email, hashedPassword];

    try {
        const { rows } = await client.query(query, values);
        const driver = rows[0];
        const token = generateToken(driver.id);
        res.json({ token, driver });
    } catch (error: any) {
        res.status(500).send(`Error registering driver: ${error}`);
    }
};

export const login = async (req: Request, res: Response) => {
    const query = 'SELECT id, email, password FROM drivers WHERE email = $1';
    const values = [req.body.email];

    try {
        const { rows } = await client.query(query, values);
        const driver = rows[0];

        if (driver && await comparePassword(req.body.password, driver.password)) {
            const token = generateToken(driver.id);
            res.json({ token, driver });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};