const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb connected: ${conn.connection.host}`)
    }catch(error)
    {
        console.log('Error connection to mongodb', error)
        process.exit(1) // 1 is failure
    }
}

module.exports = connectDB