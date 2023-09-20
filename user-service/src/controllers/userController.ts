import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import client from '../database';


export const register = async (req: Request, res: Response) => {
    const hashedPassword = await hashPassword(req.body.password);
    const query = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email';
    const values = [req.body.email, hashedPassword];

    try {
        const { rows } = await client.query(query, values);
        const user = rows[0];
        const token = generateToken(user.id);
        res.json({ token, user });
    } catch (error) {
        res.status(500).send(`Error registering user ${error}`);
    }
};

export const login = async (req: Request, res: Response) => {
    const query = 'SELECT id, email, password FROM users WHERE email = $1';
    const values = [req.body.email];

    try {
        const { rows } = await client.query(query, values);
        const user = rows[0];

        if (user && await comparePassword(req.body.password, user.password)) {
            const token = generateToken(user.id);
            res.json({ token, user });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error: any) {
        res.status(500).send(`Error logging in ${error}`);
    }
};