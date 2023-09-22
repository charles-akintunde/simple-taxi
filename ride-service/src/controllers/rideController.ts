import db from '../database/database';
import { getUserByEmail } from '../clients/user-service-client'
import { getDriverByEmail } from '../clients/driver-service-client'

export const bookRide = async (call: any, callback: any) => {
    try {
        const { userId, driverId, userEmail, driverEmail, startLatitude, startLongitude, endLatitude, endLongitude } = call.request;
        
        const user = await getUserByEmail(userId,userEmail);
        const driver = await getDriverByEmail(driverId,driverEmail);

        if (!user || !driver) {
            throw new Error('User or Driver not found');
        }

        await db.query('INSERT INTO rides (user_id, driver_id, start_latitude, start_longitude, end_latitude, end_longitude) VALUES ($1, $2, $3, $4, $5, $6)', [userId, driverId, startLatitude, startLongitude, endLatitude, endLongitude]);
        
        callback(null, { success: true, message: 'Ride booked successfully', status: 'PENDING' });
    } catch (error: any) {
        callback({
            code: 500,
            message: error.message
        });
    }
};

export const startRide = async (call: any, callback: any) => {
    try {
        const { userId, driverId, userEmail, driverEmail, rideId} = call.request;

        const user = await getUserByEmail(userId,userEmail);
        const driver = await getDriverByEmail(driverId,driverEmail);
        const ride =  await db.query('SELECT status FROM rides WHERE id = $1', [rideId]);

        if (!user || !driver) {
            throw new Error('User or Driver not found');
        }

        if (!ride) {
            throw new Error('Ride not found')
        }

        await db.query("UPDATE rides SET status = 'ONGOING' WHERE user_id = $1 AND driver_id = $2 and id = $3", [userId, driverId, rideId]);


        callback(null, { success: true, message: 'Ride started successfully', status: 'ONGOING' });
    } catch (error: any) {
        callback({
            code: 500,
            message: error.message
        });
    }
};

export const completeRide = async (call: any, callback: any) => {
    try {
        const { userId, driverId, userEmail, driverEmail, rideId } = call.request;

        const user = await getUserByEmail(userId,userEmail);
        const driver = await getDriverByEmail(driverId,driverEmail);
        const ride =  await db.query('SELECT status FROM rides WHERE id = $1', [rideId]);

        if (!user || !driver) {
            throw new Error('User or Driver not found');
        }

        if (!ride) {
            throw new Error('Ride not found')}

        await db.query("UPDATE rides SET status = 'COMPLETED' WHERE user_id = $1 AND driver_id = $2 AND id = $3", [userId, driverId,rideId]);

        callback(null, { success: true, message: 'Ride completed successfully', status: 'COMPLETED' });
    } catch (error: any) {
        callback({
            code: 500,
            message: error.message
        });
    }
};

export const getRideStatus = async (call: any, callback: any) => {
    try {
        const { userId, driverId, userEmail, driverEmail, rideId} = call.request;

        const user = await getUserByEmail(userId,userEmail);
        const driver = await getDriverByEmail(driverId,driverEmail);

        if (!user || !driver) {
            throw new Error('User or Driver not found');
        }

        const result = await db.query('SELECT status FROM rides WHERE user_id = $1 AND driver_id = $2 and id = $3', [userId, driverId, rideId]);

        if (result.rowCount === 0) {
            throw new Error('Ride not found');
        }

        const ride = result.rows[0];

        callback(null, { success: true, message: 'Ride status fetched', status: ride.status });
    } catch (error: any) {
        callback({
            code: 500,
            message: error.message
        });
    }
};
