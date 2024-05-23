const mongoose = require('mongoose')

const dbConnect = async()=> {
    try {
        const connector = process.env.CONNECTION_STRING
        const connecter = await mongoose.connect(connector)
        if (connecter) {
            console.log('Database connected successfully');
        } else {
            console.log('Could not connect to database');
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbConnect