import db from '../database/database';
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/token';

export const registerUser = async (call: any, callback: any) => {
  try {
    const { email, password } = call.request;
    const hashedPassword = await hashPassword(password);
    await db.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    
    // Generate a token for the user after successful registration
    const token = generateToken(email); 
    callback(null, { success: true, message: 'User registered successfully', token });
  } catch (error: any) {
    callback({
      code: 500,
      message: error.message
    });
  }
};

export const loginUser = async (call: any, callback: any) => {
  try {
    const { email, password } = call.request;
    const result = await db.query('SELECT id, password FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    const user = result.rows[0];
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const token = generateToken(user.id);
    const userDetails = {id: user.id, email: user.email}
    callback(null, { success: true, token, userDetails });
  } catch (error: any) {
    callback({
      code: 500,
      message: error.message
    });
  }
};

export const getUser = async (call: any, callback: any) => {
  try {
    const { email } = call.request;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    const user = result.rows[0];
    const userDetails = {id: user.id, email: user.email}
    callback(null, { success: true, message: 'User details fetched', userDetails  });
  } catch (error: any) {
    callback({
      code: 500,
      message: error.message
    });
  }
};
