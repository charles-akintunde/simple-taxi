import db from '../database/database';
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/token';

export const registerDriver = async (call: any, callback: any) => {
    try {
      const { email, password } = call.request;
      const hashedPassword = await hashPassword(password);
      await db.query('INSERT INTO drivers (email, password) VALUES ($1, $2)', [email, hashedPassword]);
      const token = generateToken(email);
      callback(null, { success: true, message: 'Driver registered successfully', token });
    } catch (error: any) {
      callback({
        code: 500,
        message: error.message
      });
    }
  };

  export const getDriver = async (call: any, callback: any) => {
    try {
      const { email } = call.request;
      const result = await db.query('SELECT * FROM drivers WHERE email = $1', [email]);
      if (result.rowCount === 0) {
        throw new Error('Driver not found');
      }
      const driver = result.rows[0];
      const driverDetails = {
        id: driver.id,
        email: driver.email,
        latitude: driver.latitude,
        longitude: driver.longitude,
        created_at: driver.created_at
      };
      callback(null, { success: true, message: 'Driver details fetched', driverDetails });
    } catch (error: any) {
      callback({
        code: 500,
        message: error.message
      });
    }
  };

  export const updateLocation = async (call: any, callback: any) => {
    try {
      const { email, latitude, longitude } = call.request;
  
      // Check if the email exists in the database
      const result = await db.query('SELECT id FROM drivers WHERE email = $1', [email]);
      if (result.rowCount === 0) {
        callback({
          code: 404,
          message: 'Driver not found'
        });
        return;
      }
  
      // Update the location for the driver
      await db.query('UPDATE drivers SET latitude = $1, longitude = $2 WHERE email = $3', [latitude, longitude, email]);
      callback(null, { success: true, message: 'Location updated successfully' });
  
    } catch (error: any) {
      callback({
        code: 500,
        message: error.message
      });
    }
  };
  
  

export const loginDriver = async (call: any, callback: any) => {
    try {
      const { email, password } = call.request;
      const result = await db.query('SELECT id, password FROM drivers WHERE email = $1', [email]);
      if (result.rowCount === 0) {
        throw new Error('Driver not found');
      }
      const driver = result.rows[0];
      const isPasswordValid = await comparePassword(password, driver.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = generateToken(driver.id);
      callback(null, { success: true, token });
    } catch (error: any) {
      callback({
        code: 500,
        message: error.message
      });
    }
  };
  