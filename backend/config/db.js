const mongoose= require('mongoose')
const colors= require('colors')

const connectDB=async ()=>{
    try{
        const conn = await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`MongoDB connected:${conn.connection.host}`)
    }catch(error){
        console.log(`Error:${error.message}`.red.bold);
        process.exit();
    }
}

module.exports=connectDB