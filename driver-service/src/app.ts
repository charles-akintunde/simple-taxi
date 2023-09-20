// app.ts

import express from 'express';
import driverRoutes from './routes/driverRoutes';


const app = express();

app.use(express.json());
app.use('/driver', driverRoutes);


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
