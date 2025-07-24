import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        // Ensure the database connection string is correct
        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

export default connectDB;
