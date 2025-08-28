import e from "express";
import mongoose, { connect } from "mongoose";  

 const connectDB = async () => {    
    try {
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');  
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/BlogApp`)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(error.message || "Error connecting to MongoDB");
        process.exit(1);  
    }
} 
export default connectDB; 
