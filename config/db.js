import mongoose from 'mongoose';


export const mongoConnect = async () =>{
    try {
       await mongoose.connect(process.env.MONGO_URL);
       console.log(`MONGODB Connect Successful`.bgGreen);
    } catch (error) {
        console.log(error.message);
    }
}