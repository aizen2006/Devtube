import 'dotenv/config';
import connectDB from "./db/index.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running at port:${process.env.PORT}`)
    })
    app.on("error",(err)=>{
        console.log(err);
        process.exit(1);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!!", err);
})


/*
import express from "express";
const app = express();

;(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log(error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }catch(error){
        console.log("MongoDB connection failed");
        console.error(error);
        throw error;
    }
})()
*/
